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
const PORT = 4000;

// 1. Seguridad: CORS Restringido (Ajusta en prod al dominio real)
app.use(cors({ origin: ['http://localhost:4000', 'http://127.0.0.1:4000'] }));
app.use(express.json());

// 2. Seguridad: Rate Limiting (Máximo 10 peticiones por minuto por IP)
const limiter = rateLimit({ windowMs: 1 * 60 * 1000, max: 10 });
app.use('/api/', limiter);

// 3. Servir la web resolviendo ruta absoluta
app.use(express.static(path.resolve(__dirname, '../../apps/web/dist')));

// 4. Proceso MCP Persistente (Se inicia 1 vez, no en cada request)
const mcpProcess = spawn('node', [path.resolve(__dirname, 'mcp-server.mjs')]);
const rl = readline.createInterface({ input: mcpProcess.stdout, terminal: false });
let pendingRequest = null;

rl.on('line', (line) => {
  try {
    const parsed = JSON.parse(line);
    if (parsed.id === 1 && pendingRequest) {
      pendingRequest(parsed.result.content[0].text);
      pendingRequest = null;
    }
  } catch (e) { /* Ignorar logs */ }
});

// Handshake inicial con MCP
mcpProcess.stdin.write(JSON.stringify({ jsonrpc: "2.0", id: 0, method: "initialize", params: { protocolVersion: "2024-11-05", capabilities: {}, clientInfo: { name: "sycro-web" } } }) + "\n");
mcpProcess.stdin.write(JSON.stringify({ jsonrpc: "2.0", method: "notifications/initialized" }) + "\n");

// 5. Ruta Protegida con Auth (Bearer Token)
app.post('/api/sign', (req, res) => {
  // Autenticación simple (En prod usar JWT/OAuth)
  const authHeader = req.headers.authorization;
  if (!authHeader || authHeader !== 'Bearer SYCRO_SECRET_TOKEN') {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const { document } = req.body;
  if (!document) return res.status(400).json({ error: "Document required" });

  // 6. Flujo Criptográfico Formal: Hash + Metadata
  const documentHash = crypto.createHash('sha256').update(document).digest('hex');
  const nonce = crypto.randomBytes(16).toString('hex');
  const timestamp = new Date().toISOString();
  const payload = JSON.stringify({ documentHash, nonce, timestamp });

  // Enviar al proceso MCP persistente
  pendingRequest = (result) => {
    const parsedData = JSON.parse(result);
    res.json({
      success: true,
      documentHash,
      timestamp,
      publicKey: parsedData.publicKey.substring(0, 16) + "...",
      signature: parsedData.signature,
      signatureLength: parsedData.length
    });
  };

  mcpProcess.stdin.write(JSON.stringify({ 
    jsonrpc: "2.0", id: 1, method: "tools/call", 
    params: { name: "sycro_sign_document", arguments: { payload } } 
  }) + "\n");
});

app.listen(PORT, () => {
  console.log(`🛡️ SYCRO Secure Bridge en http://localhost:${PORT}`);
});
