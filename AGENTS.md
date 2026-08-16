# HappyRO Agent Instructions

This repository orchestrates the LAN-only HappyRO stack.

## Git

- Every HappyRO-authored commit must use `type(scope): subject`.
- The scope is mandatory, lowercase, and hyphen-separated when needed.
- Allowed types are `feat`, `fix`, `config`, `docs`, `refactor`, `test`, `build`, `ci`, `chore`, `perf`, `style`, and `revert`.
- Write the subject in imperative English, without a trailing period, and keep the complete first line at 72 characters or fewer.
- Examples: `config(client): use official kRO language settings` and `docs(localization): define catalog review rules`.
- Use `type(scope)!: subject` for a breaking change and explain the migration in the commit body.
- Keep one logical change per commit. Do not mix client, server, documentation, generated output, or unrelated cleanup.
- Upstream merge commits and commits already authored by upstream are exempt; new HappyRO commits are not.
- Use `main` for HappyRO development. Push only to `origin`; never push to an `upstream` remote.
- Do not commit or push unless the user explicitly asks.

## Repository Boundaries

- Do not use public GRF or WebSocket services at runtime.
- Keep `PACKETVER=20211103`, Renewal mode, and client/server packet settings aligned.
- Treat the verified kRO 2021-11-05 files under `inputs/official/` and `inputs/runtime/kro-20211105/` as immutable source material.
- Do not import third-party translated clients, bulk translation tables, private-server executables, or private-server configuration as localization sources.
- Localization must use official kRO resource paths, IDs, and structures as its baseline. HappyRO-owned translations must be reviewed item by item and preserve explicit provenance.
- Keep generated files under `work/` or `artifacts/`.
- Keep client assets, secrets, database data, generated locale packs, screenshots, and test output out of Git unless their licensing and repository role are explicit.
- `repos/happyro-client` and `repos/happyro-server` are independent Git repositories.
- `vendor/robrowserlegacy-remote-client-js` is pinned third-party code; keep its HappyRO compatibility patch in this repository instead of creating an owned fork.

## Verification

- Run `make doctor` and the relevant focused test before reporting completion.
- Client configuration changes require `make test-client`; gateway or resource changes require `make test-gateway`; server changes require `make build-server` and focused runtime verification when services are available.
- Never report a locale as complete from file counts alone. Validate identifiers, placeholders, encoding, fallback behavior, and browser-visible output.
