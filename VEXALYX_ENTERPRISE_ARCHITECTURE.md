# VEXALYX — Enterprise Architecture Blueprint

> Consolidated technical report documenting the monorepo architecture, supply chain, licensing, and production delivery pipeline. 
> *Validated against the real repository before claiming compliance.*

## 1. Root Structure & Responsibilities
The root acts as the coordination source. Each app keeps its local config, and shared packages have strict boundaries.

- **apps/**: `web` (Next.js), `api` (Fastify/Express)
- **packages/**: `dsp` (TypeScript contract), `utils`, `config`
- **core-dsp/**: Python signal engine
- **compliance/**: Licenses, SBOM, policies, and reports
- **.github/workflows/**: CI/CD, security, and deployment
- **infra/**: IaC, manifests, and environments (staging/production)

## 2. Layer Responsibilities
| Layer | Responsibility | Verifiable Output |
|---|---|---|
| Root | Versions, scripts, workspaces, policies | `pnpm install --frozen-lockfile`; `tsc -b` |
| Web | UI, SSR/client, accessibility | Web artifact; E2E tests; healthcheck |
| API | Auth, validation, domain, data access | Versioned API; OpenAPI; contract tests |
| DSP | Signal processing and analysis | Quality report; numerical tests |
| Compliance | SBOM, licenses, secrets, vulnerabilities | SPDX/CycloneDX; Trivy report; CI seal |
| Infrastructure | Networks, DBs, observability, deployment | Versioned manifests; tested rollback |

## 3. Production Pipeline
`commit → pull request → full CI → immutable image → staging → approval → production → monitoring → rollback`

- **Local Validation**: lint, format, type-check, tests, secret scanning.
- **Pull Request**: GitHub Actions (parallelized lint, types, tests, build, licenses, security, Docker).
- **Staging**: Image identified by digest, controlled migrations, smoke tests.
- **Production**: Gradual rollout, healthchecks, centralized logs, rollback tested.

## 4. Licensing & Compliance
- **Project Code**: Proprietary SYCRO (requires LICENSE file).
- **Dependencies**: MIT/BSD/ISC (retain notices), Apache-2.0 (retain NOTICE, review patents).
- **SBOM**: Produce SPDX and CycloneDX per build, stored with the image digest.
- **Secret Management**: Never use real values in `.env.example`. Revoke and rotate immediately if exposed.

## 5. Minimum Production Controls
- **Secrets**: Secret manager; no real values in code/logs.
- **Images**: Pinned base by digest; non-root execution; no unaccepted critical vulnerabilities.
- **Data**: Encrypted backups, tested restoration, reversible migrations.
- **Access**: MFA, least privilege, protected branches, mandatory reviews.
- **Observability**: Logs without credentials, metrics, traces, alerts.

## 6. Exit Criteria (Ready for Production)
SYCRO is ready when the real repo passes CI, the image is identified by digest, keys are out of code, dependencies have an inventory, licenses are reviewed, backups are restored, and a tested rollback exists.

---
*VEXALYX PLATINUM | Marco Antonio Rojas Valdovinos*
