# HappyRO

HappyRO is the LAN-only roBrowserLegacy development stack. It is independent from `happyro-desktop` and does not use the Windows client, public GRF services, or public WebSocket proxies.

## Repository layout

```text
happyro/
├── configs/                         # HappyRO client configuration
├── deploy/mariadb/                  # Pinned LAN development database
├── deploy/rathena/                  # rAthena LAN runtime profile
├── deploy/remote-client/            # LAN gateway environment
├── inputs/                           # Immutable source and staged runtime assets
├── repos/happyro-client/         # HappyRO roBrowserLegacy fork
├── repos/happyro-server/         # HappyRO rAthena fork
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
make configure-resources
make test-client
make test-gateway
make build-server
make database-start
make server-start
make gateway-start
make gateway-verify
make test-account
```

`make configure-resources` links the validated runtime GRF, `DATA.INI`, BGM, and System files into the vendor gateway without duplicating the 3.4 GB client tree. `make test-gateway` then runs the gateway doctor against those resources. The gateway publishes the tested PWA build from `repos/happyro-client/dist/Web` at `/applications/pwa/`, proxies the rAthena HTTP API on the same origin, and runs as `happyro-gateway.service`.

The client loads the required `Config.happyro.js` synchronously before initialization and does not contact GitHub at runtime. The pinned RemoteClient-JS revision references an unpublished local ESRGAN package. HappyRO does not enable ESRGAN, so the vendor worktree carries reproducible patches for that dependency and the same-origin rAthena API proxy.

## Database and rAthena runtime

The Web stack owns a separate MariaDB 10.11.18 instance. It is pinned by image digest, stores data under ignored `work/runtime/mariadb-10.11/`, and binds only to `127.0.0.1:33062`. The schemas are `happyro` and `happyro_log`; passwords are generated locally and are never committed.

```bash
make database-start
make database-verify
make server-start
make server-verify
make status
```

rAthena login, char, and map listen on `10.24.1.1` ports `6900`, `6121`, and `5121`. Its HTTP API listens only on `127.0.0.1:8889`; port `8888` remains owned by the NAS `tinyproxy` service. The four rAthena processes run as transient systemd services and remain active after `make server-start` returns.

Stop the stack in dependency order:

```bash
make gateway-stop
make server-stop
make database-stop
```

The stop commands retain MariaDB data and generated secrets. The initial schema scripts run only when the database data directory is empty.

## Updating upstreams

All HappyRO-owned repositories use `main`. Forks keep `origin` for HappyRO and `upstream` for the original project.

```bash
make fetch-upstreams
make upstream-status

git -C repos/happyro-client merge --no-ff upstream/master
git -C repos/happyro-server merge --no-ff upstream/master
```

Run the relevant tests before pushing a merge. RemoteClient-JS stays at its locked vendor revision until its compatibility patch has been checked against a newer upstream commit.
