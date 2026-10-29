import express from 'express';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import { spawn } from 'child_process';
import readline from 'readline';
import crypto from 'crypto';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 4000;
const ALLOWED_ORIGIN = process.env.ALLOWED_ORIGIN || 'http://localhost:4000';

app.use(cors({ origin: [ALLOWED_ORIGIN, 'http://127.0.0.1:4000'] }));
app.use(express.json());
app.use(rateLimit({ windowMs: 1 * 60 * 1000, max: 20 }));
app.use(express.static(path.resolve(__dirname, '../../apps/web/dist')));

// Proceso MCP Persistente
const mcpProcess = spawn('node', [path.resolve(__dirname, 'mcp-server.mjs')]);
const rl = readline.createInterface({ input: mcpProcess.stdout, terminal: false });
const pendingRequests = new Map();
let mcpInitialized = false;

// Manejo estricto del Handshake
rl.on('line', (line) => {
  try {
    const parsed = JSON.parse(line);
    // 1. Esperar respuesta del Initialize
    if (parsed.id === 'init' && !mcpInitialized) {
      mcpInitialized = true;
      mcpProcess.stdin.write(JSON.stringify({ jsonrpc: "2.0", method: "notifications/initialized" }) + "\n");
    }
    // 2. Manejar respuestas concurrentes basadas en ID
    if (parsed.id && pendingRequests.has(parsed.id)) {
      const resolve = pendingRequests.get(parsed.id);
      resolve(parsed.result);
      pendingRequests.delete(parsed.id);
    }
  } catch (e) { /* Ignorar logs no JSON */ }
});

// Iniciar Handshake
mcpProcess.stdin.write(JSON.stringify({ 
  jsonrpc: "2.0", id: 'init', method: "initialize", 
  params: { protocolVersion: "2024-11-05", capabilities: {}, clientInfo: { name: "sycro-web" } } 
}) + "\n");

// Generador de Tokens (Simula JWT)
const activeTokens = new Set();
app.get('/api/auth', (req, res) => {
  const token = crypto.randomBytes(16).toString('hex');
  activeTokens.add(token);
  setTimeout(() => activeTokens.delete(token), 3600000); // Expira en 1 hora
  res.json({ token });
});

// Middleware de Auth
const requireAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) return res.status(401).json({ error: "Unauthorized" });
  const token = authHeader.split(' ')[1];
  if (!activeTokens.has(token)) return res.status(403).json({ error: "Invalid or expired token" });
  next();
};

app.post('/api/sign', requireAuth, (req, res) => {
  const { document } = req.body;
  if (!document) return res.status(400).json({ error: "Document required" });

  const documentHash = crypto.createHash('sha256').update(document).digest('hex');
  const nonce = crypto.randomBytes(16).toString('hex');
  const timestamp = new Date().toISOString();
  const payload = JSON.stringify({ documentHash, nonce, timestamp });
  const requestId = crypto.randomUUID();

  // Registrar la promesa en la cola de concurrencia
  pendingRequests.set(requestId, (result) => {
    const parsedData = JSON.parse(result.content[0].text);
    res.json({
      success: true,
      documentHash,
      timestamp,
      publicKey: parsedData.publicKey.substring(0, 16) + "...",
      signature: parsedData.signature,
      signatureLength: parsedData.length
    });
  });

  mcpProcess.stdin.write(JSON.stringify({ 
    jsonrpc: "2.0", id: requestId, method: "tools/call", 
    params: { name: "sycro_sign_document", arguments: { payload } } 
  }) + "\n");
  
  setTimeout(() => {
    if (pendingRequests.has(requestId)) {
      pendingRequests.delete(requestId);
      res.status(500).json({ error: "MCP Timeout" });
    }
  }, 5000);
});

app.listen(PORT, () => console.log(`🛡️ SYCRO Secure Bridge en http://localhost:${PORT}`));
