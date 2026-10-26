# Portable snapshot format

## Canonical data

Version 1 has exactly formatVersion (integer 1), results (array of 0–10 objects), and settings (all six keys). Each result has exactly id, score and timestamp. IDs are strings of 1–128 characters excluding ASCII controls; generated IDs are UUIDs, but compatible imported stable IDs need not be UUIDs. IDs must be unique. Scores are integers from 0 through 9007199254740991. Timestamps are real Gregorian UTC dates in canonical YYYY-MM-DDTHH:mm:ss.sssZ form, years 0001–9999, without leap seconds or offsets. Validate actual calendar/time ranges and round-trip canonical form; a regex alone is insufficient. Future dates are not independently prohibited. Restore normalizes ordering by the SCORE comparator without rewriting IDs, values or timestamps.

Settings must contain exactly ghost, hardDrop, next, hardDropLock, lock and hold with the types/enums in [CFG](../SPEC.md#cfg--settings-and-persistence). No missing/extra fields, nulls, coercion or duplicate JSON object keys are accepted. Reject more than ten results and duplicate IDs rather than silently truncate/deduplicate an imported file.

## JSON

Use UTF-8, optional UTF-8 BOM, MIME application/json, suggested filename tetris-save-<UTC-safe-time>.json. Validate [SAVE-FORMAT.schema.json](SAVE-FORMAT.schema.json) with format checking enabled plus semantic rules above. Reject invalid UTF-8, trailing content, duplicate object keys, non-finite numbers and unsupported format versions. Export uses canonical millisecond timestamps and native Boolean setting values. Files over 1 MiB are rejected before parsing. Full validation completes before any application or host write.

## SQLite

Use a standard SQLite 3 database, MIME application/vnd.sqlite3, suggested .sqlite filename. PRAGMA user_version is exactly 1 and owns format versioning. Permit only these application tables and SQLite-created automatic indexes; reject views, triggers, virtual tables and additional application tables. Inspect metadata before executing only fixed read queries; never execute SQL supplied by the file.

| Table | Columns and constraints | Required data |
| --- | --- | --- |
| high_scores | id TEXT PRIMARY KEY NOT NULL; score INTEGER NOT NULL CHECK(score >= 0 AND score <= 9007199254740991); timestamp TEXT NOT NULL | 0–10 complete valid results, unique IDs and canonical timestamps |
| settings | key TEXT PRIMARY KEY NOT NULL; value TEXT NOT NULL | Exactly one uniquely keyed row per six settings; values use canonical text |

Column names/types and primary-key/non-null declarations must match; CHECK constraints are included on export but are never trusted as a substitute for row validation. SQLite typeof(score) must be integer; floating-point or numeric text coercion is not accepted. Validate every stored string/row with the same canonical domain validator. Boolean setting values are exactly true/false text; enums use the exact CFG spellings. Reject absent/duplicate/extra settings keys, foreign metadata versions, malformed pages, encrypted databases and invalid headers. The two formats produce identical canonical snapshots.

Maximum database file size is 16 MiB. Each import/export worker operation has a 10-second deadline; dispose its temporary database and terminate only its owned worker on completion/error/timeout. A failed or unavailable worker/WASM resource reports a transfer error and leaves live state unchanged. Tests must use real generated SQLite bytes and malformed fixtures, not a JSON file with a .sqlite extension.

## Failure and transaction boundary

Decode, structural checks, JSON Schema checks, semantic validation and settings preparation all precede any results/settings/persistence mutation. Filename mismatch alone does not bypass content checks. Cancellation changes nothing. A normal persistence failure uses the captured pre-operation snapshot/rollback described by CFG and reports an error; completed Restore publishes one replacement snapshot. Save failure changes no live state. No automatic import, autosave or score persistence is introduced by this format.

