<h1 align="center">
  <br>
  <b>SYCRO VALDOVINOS</b>
  <br>
  <sub>Post-Quantum Trust Layer & AI Agent Infrastructure</sub>
</h1>

<p align="center">
  <img src="https://img.shields.io/badge/Estado-Alpha_v0.1.0-ffcc00?style=for-the-badge&labelColor=050816" />
  <img src="https://img.shields.io/badge/Criptograf%C3%ADa-ML--DSA--87-22d3ee?style=for-the-badge&labelColor=050816" />
  <img src="https://img.shields.io/badge/Agentes-MCP-a855f7?style=for-the-badge&labelColor=050816" />
  <img src="https://img.shields.io/badge/Licencia-Propietaria-ef4444?style=for-the-badge&labelColor=050816" />
</p>

---

## 🚀 ¿Qué es SYCRO?

SYCRO es una infraestructura de confianza diseñada para validar la integridad y autoría de documentos digitales. Utiliza criptografía post-cuántica (ML-DSA-87) y expone sus capacidades a agentes autónomos mediante el Model Context Protocol (MCP). Diseñado para ser compatible con los flujos de conservación de mensajes de datos de la NOM-151.

## 🧬 Arquitectura y Flujo

El flujo principal garantiza que un documento no sea alterado, pasando por análisis semántico y firmas cuánticas.

```mermaid
flowchart LR
  A[Documento] --> B[SHA-256 Hash]
  B --> C[Análisis IA - MCP]
  C --> D[Firma ML-DSA-87]
  D --> E[Verificación Independiente]
  
  classDef core fill:#050816,stroke:#22d3ee,stroke-width:2px,color:#fff;
  classDef agent fill:#050816,stroke:#a855f7,stroke-width:2px,color:#fff;
  class A,B,E core;
  class C,D agent;

⚙️ Instalación y Uso (Local)

```bash
# 1. Clonar el repositorio
git clone https://github.com/Marcorojas17/Marcorojas17.git
cd Marcorojas17

# 2. Instalar dependencias (API, Web y MCP)
cd apps/api && npm install && cd ../..
cd apps/web && npm install && cd ../..
cd kronos-pq && npm install && cd ..

# 3. Configurar variables de entorno
cp kronos-pq/.env.example kronos-pq/.env
# Edita .env con tus propias credenciales seguras

# 4. Iniciar el Bridge MCP y la Web
cd kronos-pq && node scripts/mcp-bridge.mjs
# Visita http://localhost:4000
```

🔒 Seguridad y Certificaciones

· ML-DSA-87: Implementación compatible con NIST FIPS 204. No cuenta con certificación formal de NIST.
· NOM-151: Diseñado para integrarse con flujos NOM-151, pero no sustituye a un Prestador de Servicios de Certificación (PSC) acreditado.
· Auditoría: Cero vulnerabilidades reportadas en dependencias (API, Web y MCP).

🗺️ Roadmap (v0.1.0-alpha)

☑ Criptografía Post-Cuántica (ML-DSA-87)
☑ Servidor MCP con identidad persistente
☑ Autenticación JWT y Rate Limiting
☑ Pipeline CI/CD con Docker Smoke Test
☐ Integración con TSA (RFC 3161)
☐ Firma PAdES-B-T
☐ KMS / AWS S3 Object Lock

📄 Licencia y Autoría

· Código: Propietario (Todos los derechos reservados).
· Autor: Marco Antonio Rojas Valdovinos.
