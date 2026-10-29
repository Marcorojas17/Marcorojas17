<div align="center">

```text
╔══════════════════════════════════════════════════════════════════════════╗
║   SYCRO VALDOVINOS :: v0.1.0-alpha                                       ║
║   Post-Quantum Trust Layer & AI Agent Infrastructure                     ║
╚══════════════════════════════════════════════════════════════════════════╝
```

https://img.shields.io/badge/Estado-Alpha_v0.1.0-ffcc00?style=for-the-badge&labelColor=050816
https://img.shields.io/badge/Criptograf%C3%ADa-ML--DSA--87_via_@noble-22d3ee?style=for-the-badge&labelColor=050816
https://img.shields.io/badge/Agentes-MCP-a855f7?style=for-the-badge&labelColor=050816
https://img.shields.io/badge/Licencia-Propietaria-ef4444?style=for-the-badge&labelColor=050816

https://img.shields.io/badge/Demo_Web-En_Vivo-7EE787?style=for-the-badge
https://img.shields.io/badge/CI_Passing-brightgreen?style=for-the-badge&logo=github

Plataforma de integridad y trazabilidad para evidencia digital. Compatible con flujos NOM-151 y FIPS 204 (No certificado).

</div>

---

📖 Acerca de SYCRO

SYCRO es una infraestructura diseñada para verificar la integridad de documentos digitales y la posesión de la clave firmante mediante criptografía post-cuántica y agentes de IA.

Implementa firmas digitales mediante ML-DSA-87 a través de la librería auditada @noble/post-quantum y expone sus capacidades a agentes autónomos mediante un servidor MCP (Model Context Protocol).

🧩 Arquitectura de Módulos

Módulo Stack Descripción
Core Crypto Node.js Motor de firmas ML-DSA-87 real (@noble/post-quantum).
API REST Fastify Endpoints de autenticación y firma (apps/api).
MCP Bridge Express Puente HTTP entre la Web, la API y el servidor MCP local (kronos-pq).
Web UI Vite + Vanilla JS Dashboard de atestación (Glassmorphism).
MCP Server Node.js Servidor JSON-RPC para agentes autónomos.

🛡️ Estado del Proyecto

Funcionalidad Estado
Firma y verificación ML-DSA-87 ✅ Implementado y verificado (Smoke test)
Servidor MCP (JSON-RPC) ✅ Implementado
Auth JWT + Bcrypt en API ✅ Implementado
CI/CD (GitHub Actions + Docker) ✅ Implementado
Sellos TSA (RFC 3161) ⏳ Planificado
Anclaje IPFS / S3 Object Lock ⏳ Planificado

Última auditoría npm: 2026-10-29. API, Web y MCP reportan 0 vulnerabilidades HIGH.

🚀 Instalación y Uso Local

```bash
# 1. Clonar el repositorio
git clone https://github.com/Marcorojas17/Marcorojas17.git
cd Marcorojas17

# 2. Instalar dependencias (usando npm ci para reproducibilidad)
cd apps/api && npm ci && cd ../..
cd apps/web && npm ci && cd ../..
cd kronos-pq && npm ci && cd ..

# 3. Compilar el frontend (necesario antes de servir con el bridge)
cd apps/web && npm run build && cd ../..

# 4. Configurar variables de entorno
cp kronos-pq/.env.example kronos-pq/.env
# Edita .env con tus credenciales.
# NOTA: El servidor generará automáticamente un archivo keys.json
# con las llaves PQ si no existe. Nunca subas keys.json a Git.

# 5. Iniciar el Bridge (sirve la web compilada y la API)
cd kronos-pq && node scripts/mcp-bridge.mjs
# Visita http://localhost:4000
```

🌐 Despliegue

· Frontend: Desplegado en Vercel. Root Directory: apps/web.
· Backend: Desplegado en Render. Root Directory: kronos-pq. Requiere variables de entorno (JWT_SECRET, ADMIN_USER, ADMIN_PASS, PQ_PUBLIC_KEY, PQ_SECRET_KEY).

🔒 Seguridad, Legalidad y Limitaciones

· Alcance de la Firma: Una firma ML-DSA-87 demuestra la integridad del documento y la posesión de la clave privada asociada. No demuestra por sí sola la autoría legal o identidad civil del firmante.
· FIPS 204: Implementación compatible con ML-DSA-87/FIPS 204. No certificada por NIST o CMVP.
· NOM-151: El sistema es compatible con flujos NOM-151, pero no sustituye a un Prestador de Servicios de Certificación (PSC) acreditado.
· Limitaciones actuales: No incluye sellado de tiempo externo (RFC 3161) ni custodia de llaves en HSM físico.

📄 Licencia y Contacto

· Licencia: Propietaria. Todos los derechos reservados. Ver LICENSE.
· Seguridad: Reporta vulnerabilidades a security@sycrovaldovinos.dev (Placeholder actual).

---

<div align="center">
  <sub>Construido por Marco Antonio Valdovinos. v0.1.0-alpha.3</sub>
</div>
