import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { ml_dsa87 } from '@noble/post-quantum/ml-dsa';
import { bytesToHex } from '@noble/hashes/utils';

const server = new Server({
  name: "sycro-pq-signature",
  version: "0.1.0"
}, {
  capabilities: { tools: {} }
});

// Registramos la herramienta para que el Agente (Claude/Cursor) la vea
server.setRequestHandler("tools/list", async () => ({
  tools: [{
    name: "sycro_sign_document",
    description: "Signs a document hash using Post-Quantum ML-DSA-87 via SYCRO VALDOVINOS.",
    inputSchema: {
      type: "object",
      properties: {
        message: { type: "string", description: "The message or hash to sign" }
      },
      required: ["message"]
    }
  }]
}));

// Ejecución de la herramienta
server.setRequestHandler("tools/call", async (request) => {
  if (request.params.name === "sycro_sign_document") {
    const msg = request.params.arguments.message;
    const { publicKey, secretKey } = ml_dsa87.keygen();
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
