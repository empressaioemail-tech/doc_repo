# p77-travis-join

OPEN: P-80 join fix carded `_inbox/2026-08-25_p80_travis_join_WDLL.md`. Implementation is property/LDT. 280238 cannot bind on prop_id without CAMA or geo_id invent (REST empty + store miss). Honest-miss half CLOSED P-77.

DEAD-END: starting Travis CAMA to bind 280238. CAMA keys CAD account. Live TCAD REST PROP_ID=280238 returned features=[] while 280239 returned one feature.

GROUND-TRUTH 2026-08-25 (integration pack): TCAD REST named-id `_inbox/2026-08-25_p80_280238_tcad_rest_named_id.json`. 280238 empty. 280239 PROP_ID=280239 geo_id=0278360439 situs 17005 SIMSBROOK DR. Not a file-based instrument yet (WDLL item 5 partial).

LESSON: `psql -c` does not interpolate `:'var'`. First live fail 2026-08-25T02:07:22Z stayed UNMEASURED. SQL now uses digit-only literals after the scan guard.

GROUND-TRUTH 2026-08-25T02:08:37Z: `--live` MEASURED N=11 at 2026/cad-export. hit 10, miss 1, vintage-gap 0, unmeasured 0. Miss `48453:280238` leading_zero_orphan=false. Hit class 280239/280210/280211 all HIT. Neighbor 280230 HIT. Join is `(county_fips, normalizeCadPropId(prop_id))`. geo_id refused. County-wide 48453 scan refused.
