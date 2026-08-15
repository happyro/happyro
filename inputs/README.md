# Client resources

Runtime resources must be fully hosted on this NAS. Public roBrowser GRF services are not allowed.

The selected source baseline is the official 2021-11-05 kRO installer. Keep original installers under `inputs/official/` and never modify them. Extracted and prepared files belong under the ignored `inputs/runtime/` tree, then are staged into the gateway's ignored `resources/` directory.

Required gateway set:

```text
resources/
├── DATA.INI
├── data.grf
├── rdata.grf
└── every additional GRF referenced by DATA.INI
```

Do not start the gateway until every `DATA.INI` entry exists locally and `npm run validate:all` passes. The gateway supports unencrypted GRF 0x200/0x300 files; encrypted inputs must be prepared as a derived copy while the original remains immutable.

