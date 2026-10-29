import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { ListToolsRequestSchema, CallToolRequestSchema } from "@modelcontextprotocol/sdk/types.js";
import { ml_dsa87 } from '@noble/post-quantum/ml-dsa';
import { bytesToHex } from '@noble/hashes/utils';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import crypto from 'crypto';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const keyFile = path.resolve(__dirname, '../keys.json');

let publicKey, secretKey;

// Si el archivo de llaves no existe (ej. en Render), lo generamos
if (fs.existsSync(keyFile)) {
  const data = JSON.parse(fs.readFileSync(keyFile, 'utf8'));
  publicKey = Buffer.from(data.publicKey, 'hex');
  secretKey = Buffer.from(data.secretKey, 'hex');
} else {
  console.log("🔑 Generando nueva identidad post-cuántica para Render...");
  const seed = crypto.getRandomValues(new Uint8Array(32));
  const keypair = ml_dsa87.keygen(seed);
  publicKey = Buffer.from(keypair.publicKey);
  secretKey = Buffer.from(keypair.secretKey);
  fs.writeFileSync(keyFile, JSON.stringify({ publicKey: bytesToHex(publicKey), secretKey: bytesToHex(secretKey) }), 'utf8');
}

const server = new Server(
  { name: "sycro-pq-signature", version: "0.1.0" },
  { capabilities: { tools: {} } }
);

server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: [{
    name: "sycro_sign_document",
    description: "Signs a structured payload using ML-DSA-87.",
    inputSchema: {
      type: "object",
      properties: { payload: { type: "string" } },
      required: ["payload"]
    }
  }]
}));

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  if (request.params.name === "sycro_sign_document") {
    const payload = request.params.arguments.payload;
    const signature = ml_dsa87.sign(secretKey, new TextEncoder().encode(payload));
    
    return {
      content: [{
        type: "text",
        text: JSON.stringify({
          publicKey: bytesToHex(publicKey),
          signature: bytesToHex(signature),
          length: signature.length
        })
      }]
    };
  }
  throw new Error("Tool not found");
});

const transport = new StdioServerTransport();
await server.connect(transport);
