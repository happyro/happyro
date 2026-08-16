# HappyRO Web

HappyRO Web is the LAN-only roBrowserLegacy development stack. It is independent from `happyro-desktop` and does not use the Windows client, public GRF services, or public WebSocket proxies.

## Repository layout

```text
happyro-web/
├── configs/                         # HappyRO client configuration
├── deploy/remote-client/            # LAN gateway environment
├── inputs/                           # Immutable source and staged runtime assets
├── repos/happyro-web-client/         # HappyRO roBrowserLegacy fork
├── repos/happyro-web-server/         # HappyRO rAthena fork
├── vendor/robrowserlegacy-remote-client-js/
├── versions/                         # Locked upstream base revisions
├── scripts/                          # Repeatable checks/builds
└── work/                              # Generated output
```

The gateway's unified mode serves the PWA, GRF-backed asset API, and WebSocket-to-rAthena proxy on port `3338`. The browser entry point will be:

```text
http://10.24.1.1:3338/applications/pwa/index.html
```

## First commands

```bash
make status
make doctor
make upstream-status
make configure-client
make test-client
make test-gateway
make build-server
```

`make test-gateway` currently installs dependencies without running the resource-bound prepare hook, then tests static configuration. Starting the gateway requires a complete, validated `DATA.INI` plus all listed GRFs in the vendor gateway's ignored `resources/` directory.

The client loads the required `Config.happyro.js` synchronously before initialization; optional `Config.local.js` overrides remain available for developer-specific settings. The pinned RemoteClient-JS revision references an unpublished local ESRGAN package. HappyRO does not enable ESRGAN, so `patches/remote-client-js/0001-disable-unavailable-esrgan-dependency.patch` removes only that install-time dependency from the vendor worktree.

## Updating upstreams

All HappyRO-owned repositories use `main`. Forks keep `origin` for HappyRO and `upstream` for the original project.

```bash
make fetch-upstreams
make upstream-status

git -C repos/happyro-web-client merge --no-ff upstream/master
git -C repos/happyro-web-server merge --no-ff upstream/master
```

Run the relevant tests before pushing a merge. RemoteClient-JS stays at its locked vendor revision until its compatibility patch has been checked against a newer upstream commit.
