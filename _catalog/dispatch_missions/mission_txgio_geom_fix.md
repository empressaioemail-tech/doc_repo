# Mission — TXGIO-GEOM-FIX: the ingest can never wipe geometry again

Root cause from the TXGIO-REACQ close (read it first): upsertTxgioParcels in
lib/cad-ingest/src/txgio/ingest.ts never writes geom — absent from the insert column
handling that matters and from the ON CONFLICT SET clause — so any apply over an
existing county silently nulls its live geometry (this is how Caldwell lost a whole
county). Fix properly: geom written at insert AND updated on conflict (or derived
inline per the close's options), with a violation test proving the old behavior —
an apply over rows with populated geom must leave geom byte-identical or freshly
correct, and the falsifier is the current code nulling it. Full suite green,
re-green on current base, merge. No store execution needed beyond the test
fixtures; the data is already healed. Close:
_inbox/2026-09-03_txgio-geom-fix_close.json.
