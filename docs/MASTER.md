# SYCRO VALDOVINOS — Documento Maestro v0.1.0-alpha

> Estado real del proyecto al 2026-10-29. No es "production ready".
> Es un prototipo funcional, documentado y reproducible.

## 1. Qué hace SYCRO

Verifica la integridad de documentos digitales y la posesión de la clave firmante
mediante criptografía post-cuántica (ML-DSA-87, NIST FIPS 204) y expone esa
capacidad a agentes autónomos mediante el Model Context Protocol (MCP).

## 2. Componentes implementados (verificables)

| Componente | Ruta | Estado |
|---|---|---|
| MCP Server | `kronos-pq/scripts/mcp-server.mjs` | ✅ Funcional |
| API Bridge (Express) | `kronos-pq/scripts/mcp-bridge.mjs` | ✅ Funcional |
| API REST (Fastify) | `apps/api/` | ✅ Funcional |
| Web UI (Vite) | `apps/web/` | ✅ Deployada en Vercel |
| Test criptográfico | `kronos-pq/tests/nist/ml-dsa87-smoke.mjs` | ✅ PASS |
| CI/CD | `.github/workflows/ci.yml` | ✅ Configurado |

## 3. Componentes NO implementados (honestidad)

| Componente | Por qué no está |
|---|---|
| OAuth 2.0 | Requiere servidor de autorización (Keycloak/Auth0). |
| RFC 3161 (TSA) | Requiere proveedor de sellado autorizado. |
| FIPS 140-2 / CMVP | Requiere hardware HSM certificado ($1,500+/mes). |
| NOM-151 (certificación) | Requiere ser PSC acreditado por SE. |
| PostgreSQL / Redis | Actualmente sin persistencia real; todo en memoria. |
| Docker Compose prod | No viable en Termux/Android. |

## 4. Stack técnico real

- **Runtime:** Node.js v26.12.1 en Termux (Android ARM64).
- **Criptografía:** `@noble/post-quantum@0.4.0` (MIT, audited).
- **HTTP:** Fastify (API) + Express (bridge).
- **Frontend:** Vite + Vanilla JS (Glassmorphism).
- **Deploy:** Vercel (frontend) + Render (backend).
- **CI:** GitHub Actions con Docker smoke test.

## 5. Roadmap realista (sin fantasías)

**Fase 2 (semanas 1-4):** Validar adopción vía Agensi, entrevistas, feedback.
**Fase 3 (mes 2-3):** Si hay tracción, agregar PostgreSQL + Redis.
**Fase 4 (mes 4-6):** Evaluar TSA comercial (FreeTSA) y OAuth (Auth0 free tier).
**Fase 5 (mes 6+):** Si hay clientes pagando, evaluar HSM y certificaciones.

## 6. Contacto

Marco Antonio Rojas Valdovinos.
Repositorio: https://github.com/Marcorojas17/Marcorojas17
