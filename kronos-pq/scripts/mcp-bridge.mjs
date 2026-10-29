import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import { spawn } from 'child_process';
import readline from 'readline';
import crypto from 'crypto';
import path from 'path';
import { fileURLToPath } from 'url';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// VALIDACIÓN ESTRICTA: Fallar si faltan secretos

const { PORT = 4000 } = process.env;
const JWT_SECRET = (process.env.JWT_SECRET || '').trim();
const ADMIN_USER = (process.env.ADMIN_USER || '').trim();
const ADMIN_PASS = (process.env.ADMIN_PASS || '').trim();


if (!JWT_SECRET || JWT_SECRET.length < 32) {
  console.error("❌ FATAL: JWT_SECRET debe existir y tener al menos 32 caracteres.");
  process.exit(1);
}
if (!ADMIN_USER || !ADMIN_PASS) {
  console.error("❌ FATAL: ADMIN_USER y ADMIN_PASS son obligatorios.");
  process.exit(1);
}

// Hash de la contraseña en memoria al arrancar (en producción, viene de la DB)
const ADMIN_HASH = bcrypt.hashSync(ADMIN_PASS, 10);

const app = express();
app.use(cors({ origin: '*' }));
app.use(express.json());
app.use(rateLimit({ windowMs: 1 * 60 * 1000, max: 20 }));
app.use(express.static(path.resolve(__dirname, '../../apps/web/dist')));

// MCP
const mcpProcess = spawn('node', [path.resolve(__dirname, 'mcp-server.mjs')]);
const rl = readline.createInterface({ input: mcpProcess.stdout, terminal: false });
const pendingRequests = new Map();
let mcpInitialized = false;

rl.on('line', (line) => {
  try {
    const parsed = JSON.parse(line);
    if (parsed.id === 'init' && !mcpInitialized) {
      mcpInitialized = true;
      mcpProcess.stdin.write(JSON.stringify({ jsonrpc: "2.0", method: "notifications/initialized" }) + "\n");
    }
    if (parsed.id && pendingRequests.has(parsed.id)) {
      const { resolve, reject } = pendingRequests.get(parsed.id);
      if (parsed.error) reject(new Error(parsed.error.message || "MCP Error"));
      else resolve(parsed.result);
      pendingRequests.delete(parsed.id);
    }
  } catch (e) { }
});

mcpProcess.stdin.write(JSON.stringify({ 
  jsonrpc: "2.0", id: 'init', method: "initialize", 
  params: { protocolVersion: "2024-11-05", capabilities: {}, clientInfo: { name: "sycro-web" } } 
}) + "\n");

// AUTH con bcrypt
app.post('/api/auth', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ error: "Credenciales requeridas" });
  
  
  console.log('--- DEBUG AUTH ---');
  console.log('Recibido:', username, password);
  console.log('Esperado:', ADMIN_USER, ADMIN_PASS);
  console.log('Hash válido?', bcrypt.compareSync(password, ADMIN_HASH));

if (username !== ADMIN_USER || !bcrypt.compareSync(password, ADMIN_HASH)) {
    return res.status(401).json({ error: "Credenciales inválidas" });
  }

  const token = jwt.sign({ sub: username, role: 'admin' }, JWT_SECRET, { algorithm: 'HS256', expiresIn: '1h' });
  res.json({ token });
});

const requireAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) return res.status(401).json({ error: "No token provided" });
  try {
    req.user = jwt.verify(authHeader.split(' ')[1], JWT_SECRET);
    next();
  } catch (err) {
    res.status(403).json({ error: "Invalid or expired token" });
  }
};

app.post('/api/sign', requireAuth, (req, res) => {
  const { document } = req.body;
  if (!document) return res.status(400).json({ error: "Document required" });

  const documentHash = crypto.createHash('sha256').update(document).digest('hex');
  const nonce = crypto.randomBytes(16).toString('hex');
  const timestamp = new Date().toISOString();
  const payload = JSON.stringify({ documentHash, nonce, timestamp });
  const requestId = crypto.randomUUID();

  const promise = new Promise((resolve, reject) => {
    pendingRequests.set(requestId, { resolve, reject });
    mcpProcess.stdin.write(JSON.stringify({ 
      jsonrpc: "2.0", id: requestId, method: "tools/call", 
      params: { name: "sycro_sign_document", arguments: { payload } } 
    }) + "\n");
    setTimeout(() => {
      if (pendingRequests.has(requestId)) {
        pendingRequests.delete(requestId);
        reject(new Error("MCP Timeout"));
      }
    }, 5000);
  });

  promise.then(result => {
    const parsedData = JSON.parse(result.content[0].text);
    res.json({ success: true, documentHash, timestamp, publicKey: parsedData.publicKey.substring(0, 16) + "...", signature: parsedData.signature, signatureLength: parsedData.length });
  }).catch(err => res.status(500).json({ error: err.message }));
});


app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'SYCRO MCP Bridge', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => console.log(`🛡️ SYCRO Secure Bridge en http://localhost:${PORT}`));
