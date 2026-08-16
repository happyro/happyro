# Client resources

Runtime resources must be fully hosted on this NAS. Public roBrowser GRF services are not allowed.

The selected source baseline is the official 2021-11-05 kRO installer. Keep original installers under `inputs/official/` and never modify them. Extracted and prepared files belong under the ignored `inputs/runtime/` tree. The gateway references them with local symbolic links so the large GRF is not duplicated.

Required gateway set:

```text
resources/
├── DATA.INI
└── data.grf
```

The selected installation contains no `rdata.grf`; its Web-specific `DATA.INI` must list only `data.grf`. Run `make configure-resources` to create the gateway links. The strict validator reports four known legacy filename warnings, but full extraction, sampled reads, deep doctor checks, and runtime asset requests pass. The gateway supports unencrypted GRF 0x200/0x300 files; encrypted inputs must be prepared as a derived copy while the original remains immutable.
