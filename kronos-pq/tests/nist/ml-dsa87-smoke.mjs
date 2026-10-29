import { ml_dsa87 } from '@noble/post-quantum/ml-dsa';
import { createHash } from 'crypto';

const t0 = Date.now();
const { publicKey, secretKey } = ml_dsa87.keygen();
const message = new TextEncoder().encode('SYCRO test vector');

const signature = ml_dsa87.sign(secretKey, message);
const valid = ml_dsa87.verify(publicKey, message, signature);

const altered = new TextEncoder().encode('SYCRO altered vector');
const invalid = ml_dsa87.verify(publicKey, altered, signature);

const result = {
  timestamp: new Date().toISOString(),
  node: process.version,
  package: '@noble/post-quantum@0.4.0',
  vector: 'smoke-test-sycro-01',
  publicKey: publicKey.length,
  privateKey: secretKey.length,
  signature: signature.length,
  signatureHash: createHash('sha256').update(signature).digest('hex').slice(0, 16),
  valid,
  alteredMessageRejected: !invalid,
  durationMs: Date.now() - t0,
};

console.log(JSON.stringify(result, null, 2));

const passed =
  result.publicKey === 2592 &&
  result.privateKey === 4896 &&
  result.signature === 4627 &&
  result.valid === true &&
  result.alteredMessageRejected === true;

console.log(passed ? '✅ PASS — ML-DSA-87 API smoke test (NOT official NIST validation)' : '❌ FAIL');
process.exit(passed ? 0 : 1);
