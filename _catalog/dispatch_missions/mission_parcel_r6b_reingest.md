# Mission — R6B: apply the cad-null-verified semantic across the six counties

Gated on PARCEL-R6-CADNULL. Vendor the engine at >= the R6 merge SHA into the factory
fill job (recompile, not an ARG bump — the vendored module is the constructor), rebuild
the image digest-pinned, and re-run `parcel-record-fill` CAD ingest for ALL SIX counties
on Cloud Run (parallel fine, run rows, --twice on a chunk for drift). Verify per county
against gap ledger section 9's sizing: absent-verified counts equal the landing-and-CAD
null class per rail (e.g. McLennan assessedValue 114,254; Travis livingAreaSqft 380,917;
Bastrop livingAreaSqft 62,256), Williamson improvement stays unaccounted (the negative
control — if it moved, STOP, the scoping leaked), value counts unchanged, zero cells
regressed. Paste verbatim before/after per rail x county. Never a laptop apply.
