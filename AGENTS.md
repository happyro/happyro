# HappyRO Web Agent Instructions

This repository orchestrates the LAN-only HappyRO Web stack.

- Do not commit or push unless the user explicitly asks.
- Do not use public GRF or WebSocket services at runtime.
- Keep `PACKETVER=20211103`, Renewal mode, and client/server packet settings aligned.
- Treat files under `inputs/official/` as immutable source material.
- Keep generated files under `work/` or `artifacts/`.
- `repos/happyro-web-client` and `repos/happyro-web-server` are independent Git repositories.
- `vendor/robrowserlegacy-remote-client-js` is pinned third-party code; keep its HappyRO compatibility patch in this repository instead of creating an owned fork.
- Run `make doctor` and the relevant focused test before reporting completion.
