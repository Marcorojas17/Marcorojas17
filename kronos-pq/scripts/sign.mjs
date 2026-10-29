import { ml_dsa87 } from '@noble/post-quantum/ml-dsa';
import fs from 'fs';

const message = process.argv[2] || "ARKHÉ ZERO — Kronos Protocol";
const msgBytes = new TextEncoder().encode(message);

let secretKey, publicKey;
if (fs.existsSync('./keys.json')) {
  const k = JSON.parse(fs.readFileSync('./keys.json','utf8'));
  secretKey = new Uint8Array(Buffer.from(k.secretKey, 'hex'));
  publicKey = new Uint8Array(Buffer.from(k.publicKey, 'hex'));
} else {
  const kp = ml_dsa87.keygen();
  secretKey = kp.secretKey;
  publicKey = kp.publicKey;
  fs.writeFileSync('./keys.json', JSON.stringify({
    publicKey: Buffer.from(publicKey).toString('hex'),
    secretKey: Buffer.from(secretKey).toString('hex')
  }, null, 2));
  console.log("🔑 keys.json creado");
}

const sig = ml_dsa87.sign(secretKey, msgBytes);
fs.writeFileSync('./signature.json', JSON.stringify({
  message,
  publicKey: Buffer.from(publicKey).toString('hex'),
  signature: Buffer.from(sig).toString('hex')
}, null, 2));

console.log(`Firmado: ${message}`);
console.log(`Sig: ${sig.length} bytes`);
