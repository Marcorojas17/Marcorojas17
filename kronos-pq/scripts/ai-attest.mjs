import { ml_dsa87 } from '@noble/post-quantum/ml-dsa';
import { bytesToHex } from '@noble/hashes/utils';
import { sha256 } from '@noble/hashes/sha256';
import fs from 'fs';

console.log(`
[■] SYCRO VALDOVINOS — AI ATTESTATION ENGINE
[■■] Mode: Local, Zero-Trust, Human-in-the-Loop
`);

// 1. Fix: Análisis de riesgo (Español + Inglés)
function analyzeDocument(docText) {
  console.log("🤖 [AI Agent] Analizando documento...");
  const textLower = docText.toLowerCase();
  const entities = {
    contractType: textLower.includes("nda") ? "Non-Disclosure Agreement" : "General Contract",
    // Fix: Busca ambas palabras
    riskLevel: (textLower.includes("penalty") || textLower.includes("penalización") || textLower.includes("multa")) ? "HIGH" : "LOW",
    timestamp: new Date().toISOString()
  };
  console.log(`🤖 [AI Agent] Extracción: ${entities.contractType} | Riesgo: ${entities.riskLevel}`);
  return entities;
}

// 2. Fix: Persistencia de identidad
function getOrCreateKeys() {
  const keyFile = 'keys.json';
  if (fs.existsSync(keyFile)) {
    console.log("🔑 [SYCRO] Cargando identidad persistente desde keys.json");
    const data = JSON.parse(fs.readFileSync(keyFile, 'utf8'));
    return { publicKey: Buffer.from(data.publicKey, 'hex'), secretKey: Buffer.from(data.secretKey, 'hex') };
  } else {
    console.log("🔑 [SYCRO] Generando nueva identidad y guardando en keys.json");
    const { publicKey, secretKey } = ml_dsa87.keygen();
    fs.writeFileSync(keyFile, JSON.stringify({ publicKey: bytesToHex(publicKey), secretKey: bytesToHex(secretKey) }), 'utf8');
    return { publicKey, secretKey };
  }
}

function attestDocument(docText, aiAnalysis) {
  const { publicKey, secretKey } = getOrCreateKeys();
  
  const payload = JSON.stringify({ documentHash: bytesToHex(sha256(docText)), aiAnalysis });
  const msgBytes = new TextEncoder().encode(payload);
  const signature = ml_dsa87.sign(secretKey, msgBytes);
  
  console.log("\n✅ [SYCRO] Atestación Criptográfica Exitosa");
  console.log(`📄 Document Hash: ${bytesToHex(sha256(docText)).substring(0, 32)}...`);
  console.log(`🤖 AI Metadata Firmada: SI`);
  console.log(`🔒 Signature: ${signature.length} bytes (Compatible con ML-DSA-87 / FIPS 204)`);
  
  return { payload, signature: bytesToHex(signature), publicKey: bytesToHex(publicKey) };
}

const mockDoc = "ACUERDO DE CONFIDENCIALIDAD (NDA). Las partes acuerdan no revelar información. Penalización por incumplimiento: $50,000 USD.";
const aiData = analyzeDocument(mockDoc);
attestDocument(mockDoc, aiData);
