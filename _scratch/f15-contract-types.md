# f15-contract-types

GROUND-TRUTH (2026-08-27T22:58-05:00): planner accepted close as CLOSED_PARTIAL, graded as filed, verified on npm and GitHub. Item 10 partial accepted. Lane closed.

OPEN (substrate, stand as this lane): publish.yml workflow_dispatch + set_latest; PR #22 disposition on seat/substrate.

OPEN (property, not this lane): F-10 pin 1.30.0 and delete shims; engine PR #365 unmerged. Planner finding: LDT still vendors @hauska/atom-contract 1.6.x; property owes the rename.

GROUND-TRUTH (2026-08-27T22:55Z): npm latest 1.30.0. Versions 1.23.0-1.30.0 all on the registry.

GROUND-TRUTH (2026-08-27T22:54Z): MCP pin PR #76 merged 9c0aedd CI 33124018796 SUCCESS. Engine pin PR #365 CI 33124026094 SUCCESS unmerged.

GROUND-TRUTH (2026-08-27T22:45Z): local 331/331. Typecheck green. access-policy.types.test.ts green. Root NodeId runtime export present on 1.23.0 build.

GROUND-TRUTH (2026-08-27T22:35Z): npm @empressaio/atom-contract latest 1.22.0 published 2026-08-12T21:41:59.220Z. Tarball dist/index.d.ts has zero Track 2 names (NodeId, ProvenanceClass, Derivation, AbsenceVerdict, SupersessionEdge, AliasAtom, SelectorPredicate, AccessPair). No ./identity export.

GROUND-TRUTH (2026-08-27T22:35Z): PR #22 open on seat/substrate 530a333. NodeId implemented, unpublished. Version claim 1.21.0 already used by well-fact unknown. Read, not continued.

GROUND-TRUTH (2026-08-27T22:35Z): Factory shim at hauska-factory-conform src/contract-shim matches nid_ + 32 hex. check.mjs fails on root named export only.

LESSON: 1.21.0 and 1.22.0 on npm are property-family unknown-enum minors, not Lane G identity. A PR title that names a version is not a publish record.

DEAD-END: do not write P:/seat-worktrees/substrate/hauska-atom-contract or rebase PR #22.

LESSON: LDT is not a ^1.x consumer of @empressaio/atom-contract; it vendors @hauska/atom-contract 1.6.0. Item 10 cannot invent a pin.

OPEN: shim vs law — contract ships Observation+Synthesis; requires responseRef on absent-verified; requires closedAt on SUPERSEDED_BY. F-10 updates the delete, not the type.
