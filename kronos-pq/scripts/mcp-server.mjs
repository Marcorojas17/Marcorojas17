import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { ListToolsRequestSchema, CallToolRequestSchema } from "@modelcontextprotocol/sdk/types.js";
import { ml_dsa87 } from '@noble/post-quantum/ml-dsa';
import { bytesToHex } from '@noble/hashes/utils';
import crypto from 'crypto';

// Cargar llaves desde variables de entorno (más seguro para la nube)
let publicKey, secretKey;
const envPublicKey = process.env.PQ_PUBLIC_KEY;
const envSecretKey = process.env.PQ_SECRET_KEY;

if (envPublicKey && envSecretKey) {
  publicKey = Buffer.from(envPublicKey, 'hex');
  secretKey = Buffer.from(envSecretKey, 'hex');
} else {
  console.log("🔑 Generando llaves en memoria (no persistentes)...");
  const seed = crypto.getRandomValues(new Uint8Array(32));
  const keypair = ml_dsa87.keygen(seed);
  publicKey = Buffer.from(keypair.publicKey);
  secretKey = Buffer.from(keypair.secretKey);
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
