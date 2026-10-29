import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { ml_dsa87 } from '@noble/post-quantum/ml-dsa';
import { bytesToHex } from '@noble/hashes/utils';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Resolver ruta absoluta sin importar desde dónde se ejecute
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const keyFile = path.resolve(__dirname, '../keys.json');

let publicKey, secretKey;

if (fs.existsSync(keyFile)) {
  const data = JSON.parse(fs.readFileSync(keyFile, 'utf8'));
  publicKey = Buffer.from(data.publicKey, 'hex');
  secretKey = Buffer.from(data.secretKey, 'hex');
} else {
  console.error(`❌ Error: No se encontró keys.json en ${keyFile}. Ejecuta ai-attest.mjs primero.`);
  process.exit(1);
}

const server = new Server({
  name: "sycro-pq-signature",
  version: "0.1.0"
}, {
  capabilities: { tools: {} }
});

server.setRequestHandler("tools/list", async () => ({
  tools: [{
    name: "sycro_sign_document",
    description: "Signs a document hash using Post-Quantum ML-DSA-87 via SYCRO VALDOVINOS.",
    inputSchema: {
      type: "object",
      properties: { message: { type: "string", description: "The message to sign" } },
      required: ["message"]
    }
  }]
}));

server.setRequestHandler("tools/call", async (request) => {
  if (request.params.name === "sycro_sign_document") {
    const msg = request.params.arguments.message;
    const signature = ml_dsa87.sign(secretKey, new TextEncoder().encode(msg));
    
    return {
      content: [{
        type: "text",
        text: `✅ SYCRO Signature Valid.\nPub: ${bytesToHex(publicKey).substring(0,16)}...\nSig: ${bytesToHex(signature).substring(0,16)}...\nLength: ${signature.length} bytes`
      }]
    };
  }
  throw new Error("Tool not found");
});

const transport = new StdioServerTransport();
await server.connect(transport);
