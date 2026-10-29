import express from 'express';
import cors from 'cors';
import { spawn } from 'child_process';
import readline from 'readline';

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('../apps/web/dist'));

app.post('/api/sign', (req, res) => {
  const { message } = req.body;
  if (!message) return res.status(400).json({ error: "Message required" });

  const mcpProcess = spawn('node', ['scripts/mcp-server.mjs']);
  let errorData = "";

  mcpProcess.stderr.on('data', (data) => { errorData += data.toString(); });

  // Escuchar las respuestas línea por línea
  const rl = readline.createInterface({ input: mcpProcess.stdout, terminal: false });

  let initialized = false;
  let sentCall = false;

  rl.on('line', (line) => {
    try {
      const parsed = JSON.parse(line);
      
      // 1. El servidor responde al Initialize
      if (parsed.id === 0 && !initialized) {
        initialized = true;
        // 2. Enviar notificación de inicializado
        mcpProcess.stdin.write(JSON.stringify({ jsonrpc: "2.0", method: "notifications/initialized" }) + "\n");
        
        // 3. Enviar la petición de firma
        setTimeout(() => {
          mcpProcess.stdin.write(JSON.stringify({ 
            jsonrpc: "2.0", id: 1, method: "tools/call", 
            params: { name: "sycro_sign_document", arguments: { message } } 
          }) + "\n");
          sentCall = true;
        }, 100);
      } 
      // 4. El servidor responde con la firma
      else if (parsed.id === 1 && sentCall) {
        mcpProcess.kill();
        if (parsed.result && parsed.result.content) {
          res.json({ success: true, result: parsed.result.content[0].text });
        } else {
          res.status(500).json({ error: "MCP failed", details: JSON.stringify(parsed) });
        }
      }
    } catch (e) {
      // Ignorar líneas que no sean JSON puro
    }
  });

  // Iniciar el handshake
  mcpProcess.stdin.write(JSON.stringify({ 
    jsonrpc: "2.0", id: 0, method: "initialize", 
    params: { protocolVersion: "2024-11-05", capabilities: {}, clientInfo: { name: "sycro-web", version: "1.0.0" } } 
  }) + "\n");

  // Límite de tiempo por si algo falla (5 segundos)
  setTimeout(() => {
    if (!res.headersSent) {
      mcpProcess.kill();
      res.status(500).json({ error: "MCP Timeout", details: errorData });
    }
  }, 5000);
});

app.listen(4000, () => {
  console.log('🌐 Bridge MCP corriendo en http://localhost:4000');
});
