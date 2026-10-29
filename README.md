```text
╔══════════════════════════════════════════════════════════════════════════╗
║   SYCRO VALDOVINOS :: v0.1.0-alpha                                       ║
║   cadena de custodia digital + criptografía post-cuántica                ║
╚══════════════════════════════════════════════════════════════════════════╝
```

Plataforma de integridad y trazabilidad para evidencia digital.
Estado actual: Prototipo integrado funcional.

✅ Implementado y Validado (En este repositorio)

Componente Estado Evidencia
Criptografía Post-Cuántica ✅ Firma ML-DSA-87 (NIST FIPS 204) vía @noble/post-quantum
Servidor MCP ✅ Protocolo JSON-RPC con identidad persistente
API HTTP (Fastify) ✅ Endpoint /health verificado, CI/Docker pasando
Autenticación ✅ JWT (HS256) con validación de credenciales (bcrypt) y secretos por ENV
Puente Web-MCP ✅ Express con rate limiting, CORS y manejo de concurrencia
Frontend ✅ Dashboard en Vite (Glassmorphism) con login real
CI/CD ✅ GitHub Actions (Audit, Build, Docker Smoke Test)

⚠️ Planificado (No implementado en esta fase)

Componente Estado Nota
Sellos RFC 3161 ⏳ Requiere integración con TSA externa
Firma PAdES-B-T ⏳ Requiere librería PDF y certificados X.509
KMS / AWS S3 Object Lock ⏳ Requiere credenciales de nube reales
Paquete .evidence ⏳ Requiere definición de formato final JCS/JWS
Hash Chain de auditoría ⏳ En diseño

🔒 Sobre la Seguridad y Certificaciones

· ML-DSA-87: Implementación compatible con el estándar NIST FIPS 204. No cuenta con certificación oficial de NIST ni FIPS.
· NOM-151: El sistema está diseñado para ser compatible con flujos de conservación de mensajes de datos, pero no sustituye a un Prestador de Servicios de Certificación (PSC) acreditado.
· JWT: El secreto se lee desde .env (JWT_SECRET, ADMIN_USER, ADMIN_PASS). En producción, es obligatorio configurar estas variables.

📄 Licencia

· Código principal: Propietario (Todos los derechos reservados).
· Dependencias de terceros: Licencias MIT/Apache según sus respectivos package.json.
