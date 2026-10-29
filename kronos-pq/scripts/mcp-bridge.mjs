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

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 4000;

// SEGURIDAD: Validar que el secreto exista en producción
const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-do-not-use-in-prod-32-chars-min';
if (JWT_SECRET.length < 32) {
  console.error("❌ FATAL: JWT_SECRET debe tener al menos 32 caracteres.");
  process.exit(1);
}

app.use(cors({ origin: ['http://localhost:4000', 'http://127.0.0.1:4000'] }));
app.use(express.json());
app.use(rateLimit({ windowMs: 1 * 60 * 1000, max: 20 }));
app.use(express.static(path.resolve(__dirname, '../../apps/web/dist')));

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

// POST /api/auth con validación de credenciales
app.post('/api/auth', (req, res) => {
  const { username, password } = req.body;
  
  // En producción, valida contra tu DB (bcrypt). Aquí usamos ENV para el MVP.
  const validUser = process.env.ADMIN_USER || 'valdovinos';
  const validPass = process.env.ADMIN_PASS || 'sycro-admin-2026';

  if (username !== validUser || password !== validPass) {
    return res.status(401).json({ error: "Credenciales inválidas" });
  }

  const token = jwt.sign({ sub: username, role: 'admin' }, JWT_SECRET, { algorithm: 'HS256', expiresIn: '1h' });
  res.json({ token });
});

const requireAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) return res.status(401).json({ error: "No token provided" });
  
  const token = authHeader.split(' ')[1];
  try {
    req.user = jwt.verify(token, JWT_SECRET);
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
    res.json({
      success: true, documentHash, timestamp,
      publicKey: parsedData.publicKey.substring(0, 16) + "...",
      signature: parsedData.signature, signatureLength: parsedData.length
    });
  }).catch(err => res.status(500).json({ error: err.message }));
});

app.listen(PORT, () => console.log(`🛡️ SYCRO Secure Bridge en http://localhost:${PORT}`));
