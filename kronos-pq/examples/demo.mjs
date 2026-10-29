import { ml_dsa87 } from '@noble/post-quantum/ml-dsa';

console.log(`
[■] SYSTEM BOOT: ARKHÉ ZERO
[■■] KRONOS PROTOCOL — ML-DSA-87
[■■■] TOLUCA-GLOBAL | 51% Human / 49% AI
`);

const { publicKey, secretKey } = ml_dsa87.keygen();
console.log(`Public key: ${publicKey.length} bytes — 2592 esperado`);
console.log(`Private key: ${secretKey.length} bytes — 4896 esperado`);

const message = "Vexalyx Protocol — Toluca Global";
const msgBytes = new TextEncoder().encode(message);

const signature = ml_dsa87.sign(secretKey, msgBytes);
console.log(`Signature: ${signature.length} bytes — 4627 esperado`);

const valid = ml_dsa87.verify(publicKey, msgBytes, signature);
console.log(`Valid: ${valid} ✅`);

const tampered = new TextEncoder().encode(message + "X");
const valid2 = ml_dsa87.verify(publicKey, tampered, signature);
console.log(`Tampered check: ${!valid2} ✅`);
