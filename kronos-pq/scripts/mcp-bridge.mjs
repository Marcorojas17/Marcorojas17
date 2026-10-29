import express from 'express';
import cors from 'cors';
import { spawn } from 'child_process';

const app = express();
app.use(cors());
app.use(express.json());

// Servir la web estática
app.use(express.static('../apps/web/dist'));

app.post('/api/sign', (req, res) => {
  const { message } = req.body;
  if (!message) return res.status(400).json({ error: "Message required" });

  // Levantar el proceso MCP
  const mcpProcess = spawn('node', ['scripts/mcp-server.mjs']);
  
  let outputData = "";
  let errorData = "";

  mcpProcess.stdout.on('data', (data) => { outputData += data.toString(); });
  mcpProcess.stderr.on('data', (data) => { errorData += data.toString(); });

  // Enviar petición JSON-RPC al MCP
  const request = {
    jsonrpc: "2.0",
    id: 1,
    method: "tools/call",
    params: {
      name: "sycro_sign_document",
      arguments: { message }
    }
  };

  mcpProcess.stdin.write(JSON.stringify(request) + "\n");

  // Esperar un momento a que responda
  setTimeout(() => {
    mcpProcess.kill();
    if (outputData) {
      try {
        const parsed = JSON.parse(outputData);
        res.json({ success: true, result: parsed.result.content[0].text });
      } catch (e) {
        res.json({ success: true, result: outputData });
      }
    } else {
      res.status(500).json({ error: "MCP failed", details: errorData });
    }
  }, 500);
});

app.listen(4000, () => {
  console.log('🌐 Bridge corriendo en http://localhost:4000');
});
