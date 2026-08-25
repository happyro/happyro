# Client localization overlays

These UTF-8 files fill loose client resources that are not present in the
official 2021-11-05 kRO GRF. The gateway serves them through
`DATA_OVERRIDE_PATH`; files in the verified official runtime remain unchanged.

`data/msgstringtable.txt` is based on OpenKore's cRO message table at commit
`51de1ddfc4449ae5217f6886de702f87ca934030`. It contains message IDs 0 through
4070 and has SHA-256
`b0fa22e17ec01688828157b215c58d452dae389d4601a52087c1e1324be794ce`.

`data/titletable.json` contains Simplified Chinese names for the fixed 2021
client title ID range 1000 through 1046.

`data/skilldesctable.txt` contains reviewed Simplified Chinese descriptions for
the novice skills available to a newly created character. The text was checked
against the 2021 client skill IDs and the Chinese RO handbook entries for
`NV_BASIC`, `NV_FIRSTAID`, and `NV_TRICKDEAD`. When the official Korean Lua
table contains a skill that is not yet covered here, the client shows an honest
Chinese mechanical summary instead of leaking Korean text.

<!-- Archived: data/itemlocalization.json was superseded by the translated
itemInfo_true.lub and is retained under archive/localization/client/data/. -->

## Runtime integration

The client keeps translated static names when official Lua tables are loaded:

- `DBManager.loadTitleTable` applies `titletable.json` after the official title
  table, so earned titles do not fall back to Korean.
- `DBManager.loadWorldMapInfo` combines official world-map geometry with the
  translated `WorldMap.js` and `MapTable.js` names. Dynamic map IDs that are not
  present in the old world-map layout use the translated map-info snapshot.
- Item display names remain localized, while item resource names are decoded
  with the configured client character set. This keeps Korean GRF filenames
  valid without exposing Korean item names in the UI.
<!-- DBManager.loadItemLocalization is archived; itemInfo_true.lub now contains
the complete player-visible item names and descriptions. -->

The resource gateway converts mojibake path segments independently. A request
may contain a legacy CP949 directory such as `À¯ÀúÀÎÅÍÆäÀÌ½º` and a valid
Unicode filename such as `나이프.bmp`; converting the whole path would corrupt
the filename and make equipment icons return HTTP 404.

Gateway startup validates the remaining localization overlays. Client changes
are covered by the Vitest suite.
