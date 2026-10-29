import { ml_dsa87 } from '@noble/post-quantum/ml-dsa';
import fs from 'fs';

const data = JSON.parse(fs.readFileSync('./signature.json','utf8'));
const message = process.argv[2] || data.message;
const msgBytes = new TextEncoder().encode(message);
const sig = new Uint8Array(Buffer.from(data.signature, 'hex'));
const pub = new Uint8Array(Buffer.from(data.publicKey, 'hex'));

const ok = ml_dsa87.verify(pub, msgBytes, sig);
console.log(ok ? "✅ VALID — NIST FIPS 204" : "❌ INVALID");
