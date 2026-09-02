# Mission — B-READER: the serve layer's parcel-record reader and rail allowlist

Decision `_decisions/2026-09-02_step7_consumer_c_then_b.md`. The serve layer (cortex
compose in LDT) gains ONE parcel-record reader plus a rail-scoped allowlist: a rail
serves from the record only where the allowlist says so, and the allowlist is FED by
the gate scheduler's verdicts (PARCEL-B-GATE-SCHED builds that; design the allowlist
contract together — the verdict store and its shape are shared between your two cards;
coordinate via your closes, not shared checkouts).

1. Reader: per-parcel cell + companion reads (never county materialization), Secret
   Manager credentials, structurally read-only.
2. Allowlist: per (county, rail) with three states — record (serve from
   parcel_record), legacy (keep the old path), refused (the gate said no; serve
   legacy and surface nothing from the record). Default legacy everywhere until a
   verdict flips it. The allowlist must FAIL CLOSED: unreadable or missing verdict =
   legacy, never record.
3. Rendering honors the five cell states in the surface's honest-absence vocabulary;
   pipeline words never reach the wire.
4. No rail actually cuts over on this card — B-SLATE1 does that with retirement items.
   This card ships the mechanism with the allowlist entirely on legacy, verified by a
   staging probe showing byte-identical serve output before and after deploy.

Close: _inbox/2026-09-02_parcel-b-reader_close.json.
