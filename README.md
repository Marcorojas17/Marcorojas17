<div align="center">

<img src="assets/hero-sycro.jpg" width="100%" alt="SYCRO VALDOVINOS — Post-Quantum Trust Layer" />


```bash
```

<pre align="center">
██╗ ██╗██████╗ ██████╗ ███╗ ██╗ ██████╗ ███████╗
██║ ██╔╝██╔══██╗██╔═══██╗████╗ ██║██╔═══██╗██╔════╝
█████╔╝ ██████╔╝██║ ██║██╔██╗ ██║██║ ██║███████╗
██╔═██╗ ██╔══██╗██║ ██║██║╚██╗██║██║ ██║╚════██║
██║ ██╗██║ ██║╚██████╔╝██║ ╚████║╚██████╔╝███████║
╚═╝ ╚═╝╚═╝ ╚═╝ ╚═════╝ ╚═╝ ╚═══╝ ╚═════╝ ╚══════╝

TOLUCA-GLOBAL | SYCRO PROTOCOL | POST-QUANTUM
</pre>

<a href="https://git.io/typing-svg">
<img src="https://readme-typing-svg.demolab.com?font=JetBrains+Mono&weight=600&size=22&pause=1000&color=22D3EE&center=true&vCenter=true&width=700&lines=Senior+Software+Engineer;Architect+of+Kronos+Protocol;Post-Quantum+%2B+AI+Agents+%2B+Crypto;51%25+Human+%2F+49%25+AI" alt="Typing" />
<br/><img src="sycro-badge.svg" width="280" /> <img src="sycro-badge-dark.svg" width="420" />
<br/><img src="sycro-badge.svg" width="280" /> <img src="sycro-badge-dark.svg" width="420" />
<br/><img src="sycro-badge.svg" width="280" /> <img src="sycro-badge-dark.svg" width="420" />
</a>

<br/>

<a href="https://github.com/Marcorojas17">
<img src="https://img.shields.io/badge/PROTOCOL-SYCRO-22d3ee?style=for-the-badge&labelColor=050816" />
<img src="https://img.shields.io/badge/POST_QUANTUM-ML--DSA--87-a855f7?style=for-the-badge&labelColor=050816" />
<img src="https://img.shields.io/badge/CONSENSUS-VALDOVINOS-22d3ee?style=for-the-badge&labelColor=050816" />
</a>





<img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" />
<img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" />
<img src="https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white" />
<img src="https://img.shields.io/badge/Rust-000000?style=for-the-badge&logo=rust&logoColor=white" />
<img src="https://img.shields.io/badge/C%23-239120?style=for-the-badge&logo=c-sharp&logoColor=white" />
<img src="https://img.shields.io/badge/Solidity-363636?style=for-the-badge&logo=solidity&logoColor=white" />

<br/>

Senior Engineer building post-quantum infrastructure for AI agents.

Offline-first. Zero-trust. Compatible con ML-DSA-87 (FIPS 204). NOM-151 compliant.

</div>

🧬 System Architecture — SYCRO

Human signs. Agent co-creates. Ledger attests.

```mermaid
graph TD
    H[👤 Human Creator — Marco Rojas] -->|Signs with ML-DSA-87<br/>Compatible con ML-DSA-87 (FIPS 204)| A[🤖 Agent IA — ARKHÉ ZERO]
    A -->|Co-creates Content<br/>Code + Docs + Proofs| L{🧾 Post-Quantum Ledger}
    L -->|NOM-151 SCFI<br/>Conservación 10 años| I[(📦 IPFS / Filecoin)]
    L -->|51/49 Governance<br/>Valdovinos Consensus| S[📜 Smart Contracts — Kintsugi]
    L -->|Attestation<br/>pq-signature| V[✅ Verify: 2ms]
    
    classDef core fill:#050816,stroke:#22d3ee,stroke-width:2.5px,color:#e2e8f0;
    classDef ledger fill:#050816,stroke:#a855f7,stroke-width:2.5px,color:#e2e8f0;
    classDef store fill:#0a0f1f,stroke:#22d3ee,stroke-width:1.5px,color:#94a3b8;
    
    class H,A core;
    class L ledger;
    class I,S,V store;
```

Flow: Human (ML-DSA-87 Private Key 4896B) → Agent → Signature (4627B) → Public Key (2592B) → Verify → IPFS + Ledger

🎯 Agent Skills — Agensi Marketplace

Skill Spec Status Link
pq-signature ML-DSA-87 (Dilithium5) · Compatible con ML-DSA-87 (FIPS 204) · Compatible con · Sign ~4ms / Verify ~2ms · Zero network calls · @noble/post-quantum Live View on Agensi

🔒 No key storage. No network. In-memory only. 2592B pub / 4896B priv / 4627B sig.

Install:

```bash
npx agensi add pq-signature
# o
agensi skills install pq-signature
```

Usage:

```javascript
import { generateKeypair, signMessage, verifyMessage } from 'pq-signature'
const { publicKey, privateKey } = await generateKeypair()
const sig = await signMessage("Vexalyx Protocol — Toluca Global", privateKey)
const ok = await verifyMessage("Vexalyx Protocol — Toluca Global", sig, publicKey) // true
```

🛠️ Stack — Toluca-Global Protocol

· Languages: TypeScript, Python, Rust, C#, Solidity
· Crypto: ML-DSA-87, ML-KEM-1024 (Kyber), SHA3, Ed25519
· AI Agents: MCP, Agensi, Claude Code, Cursor, OpenAI Agents SDK
· Infra: Node.js 22+, Docker, IPFS, Filecoin, EVM Chains
· Compliance: NOM-151-SCFI-2016, e.firma, FIPS 204
· Principles: Kintsugi (golden cracks) + Arkhé (origin)

📊 Pulse

<div align="center">

<img src="assets/hero-sycro.jpg" width="100%" alt="SYCRO VALDOVINOS — Post-Quantum Trust Layer" />

<img src="https://github-readme-stats.vercel.app/api?username=Marcorojas17&show_icons=true&theme=radical&hide_border=true&bg_color=050816&title_color=22d3ee&icon_color=a855f7&text_color=94a3b8&border_radius=12" width="48%" />
<img src="https://github-readme-stats.vercel.app/api/top-langs/?username=Marcorojas17&layout=compact&theme=radical&hide_border=true&bg_color=050816&title_color=22d3ee&text_color=94a3b8&border_radius=12" width="48%" />
<br/><br/>
<img src="https://github-readme-activity-graph.vercel.app/graph?username=Marcorojas17&bg_color=050816&color=22d3ee&line=a855f7&point=ffffff&area=true&hide_border=true" />
</div>

<!-- WAKATIME START -->

<!--START_SECTION:waka-->

<!--END_SECTION:waka-->

<!-- WAKATIME END -->

<div align="center">

<img src="assets/hero-sycro.jpg" width="100%" alt="SYCRO VALDOVINOS — Post-Quantum Trust Layer" />


SYCRO PROTOCOL — v0.1.0-alpha

"No reparamos las grietas. Las llenamos de oro." — Kintsugi

Toluca, MX → Global | 51% Human / 49% AI

Agensi • GitHub • X

</div>

> **SYCRO ATTESTATION — ML-DSA-87 (FIPS 204 Compatible con)**
> - Date: 2026-10-28
> - Message: `Vexalyx Protocol — Toluca Global — 2026-10-28`
> - Pub: 2592B | Sig: 4627B | Valid: ✅ Compatible con ML-DSA-87 (FIPS 204)
> - Verify: `cd sycro-pq && node scripts/verify.mjs`


---
## ⚠️ Legal Disclaimer
This software provides an implementation compatible with ML-DSA-87 (FIPS 204). It is **not** officially certified by NIST. Cryptographic implementations should undergo independent security audits before production use.
