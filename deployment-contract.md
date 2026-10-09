# Application deployment contract

## Ownership and files

Application repositories own source, tests, Dockerfiles, health endpoints and migration logic. This repository owns reviewed production `apps/<app>/compose.yaml`. Do not copy shared PostgreSQL into an application stack. Stage 7 creates TL;DR's real definition after source inspection.

On the VPS, `/opt/vps-infra` is an administrator-owned reviewed checkout. `/etc/vps-infra` contains root-owned configuration and secrets (directories 0700, secret files 0600 unless a specific container UID needs read access). `/var/lib/vps-infra` contains state and deployment records. None is writable by the CI deployment user. Docker socket access is administrative access.

Each application has a stable Compose project `app-<app>`, an explicit `--env-file` release record and administrator-owned runtime `env_file` outside Git. Compose must not implicitly consume an ambient `.env`. Pin production images as `<approved-ghcr-repository>@sha256:<64 lowercase hex characters>`. Release records contain image references only, never credentials.

## Runtime requirements

- Reproducible linux/amd64 builds in GitHub Actions; minimal runtime, non-root user, no privileged mode or Docker socket.
- Drop capabilities and enable no-new-privileges; read-only root filesystem with explicit tmpfs/writable paths where supported.
- Restart policy, meaningful Docker healthcheck, finite stop grace period, memory/CPU/PID budgets and bounded Docker logs.
- No published ports. Join only the application's proxy and necessary data networks. Use service DNS names, not fixed addresses.
- Separate liveness from readiness. Readiness must verify required dependencies without exposing secrets. Shared services in other projects cannot be ordered with cross-project `depends_on`; retry connections with bounded backoff.
- Expose a non-sensitive external readiness URL whose exact successful body is configured in the deployment policy. Verify both component health and the routed application response.
- Graceful SIGTERM handling; no startup migrations. Document jobs, worker concurrency, sessions and persistent files.
- Structured stdout/stderr logs excluding credentials, cookies, access tokens and sensitive query parameters.

## Database and migrations

Use one database and runtime login per application, with a separate owner/migrator login. Runtime has only required schema/table/sequence privileges. Never use the PostgreSQL superuser. Bound connection pools so all applications fit within the server connection budget.

Migrations require a separately approved operation, a current recovery point and a compatibility/rollback assessment. The deployment command does not execute migrations. Apply compatible changes before an image release; any incompatible change requires its own maintenance procedure. Image rollback does not reverse schema or external side effects.

## Release contract

The restricted command accepts an application and an ordered list of digests matching its administrator-owned policy. It pulls all images before replacement, serialises releases, waits for Compose health, verifies the external readiness response, and atomically records success. Previous and pending records survive failures. A failed deployment exits nonzero; it does not silently claim success after recovery. Rollback is an explicit command using the previous recorded release, under the same lock.

The initial deployment mechanism supports any fixed number of image variables/services defined by an administrator. Routine releases cannot change networks, volumes, mounts, service commands, environment files or image repositories. No dynamic user-supplied paths or shell evaluation are allowed.

Application workflows deploy from protected main only after tests/builds pass, use one concurrency group per application with `cancel-in-progress: false`, and never expose production credentials to PR jobs. Infrastructure and migrations stay manually controlled. See [CI/CD](ci-cd.md).

## TL;DR-specific pending work

Separate frontend and backend images, path routing, readiness, preserved Render behavior and the protected-main digest workflow are implemented and locally validated. The PostgreSQL 18.6 archive restores successfully to disposable PostgreSQL 18.6; its schema matches the repository's Prisma migration history. The shared VPS must be standardized on PostgreSQL 18 before staging provisioning. Sanitize the restored staging copy and review its content before public access. Infrastructure still needs to install fixed Compose/deploy policy, provision roles and database, register backups/monitoring, configure Caddy and restricted SSH access. See [the application-side handoff](docs/vps-staging.md).
