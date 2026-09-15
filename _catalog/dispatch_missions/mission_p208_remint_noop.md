## Mission — P-208: the depth-warm re-mint runs, reports success, and writes nothing

You are a lane of OPS-24. You do not spawn sub-agents. The integration seat supervises you,
reviews CP1 and CP2, and runs the verification itself.

Exit-bounded verification: every command you run must terminate on its own; wrap anything that
could hang in `timeout`; never leave a watch, a tail or a dev server running.

**THE REAL INVOCATION IS NOT AUTHORISED AND YOU MAY NOT RUN IT.** Nothing in this mission
permits `--promote` or any write. Your deliverable is a diagnosis and a fix proposal.

### The finding, measured by execution not by reading

The deployed job `hauska-engine-depth-warm-remint` (us-east4, image
`atoms-writer@sha256:7561dafa`) was executed on its dry leg as
`hauska-engine-depth-warm-remint-7gjxg`, exit 0, 2026-09-14. It returned:

```
"parcelNodeId": "48021:34049",
"wouldWrite": [],
"setbackRule": null,
"buildableEnvelope": null,
"note": "NOTHING WOULD BE WRITTEN: 48021:34049 declined (parcel-node-retired)
         -> no atom would be written"
```

So running it with `--promote` produces a green, successful, zero-write execution. It runs, it
passes, and it cannot succeed. That is the vacuous-write-path class, and it means the job
cannot deliver the F24 conflict disclosure it exists for.

### The contradiction you must resolve FIRST, because it decides the fix

`48021:34049` is the surface probe's own Bastrop anchor and **it serves a complete card
today**: `facets http 200 readPath record bakedAt 2026-08-05T22:50:17.122Z zoning SF-1
envelope ok setbacks 30/10/30/20 city incorporated`. The panel serves it while the re-mint
calls it `parcel-node-retired`.

Both cannot be right about the same node. Two mechanisms, and you must eliminate one with
evidence rather than pick the convenient one:

1. **The re-mint reads a different node identity than the serve path.** If so the decline is
   spurious, the node is fine, and the fix is in the re-mint's identity resolution.
2. **The node genuinely is retired and a stale snapshot is still being served.** If so the
   decline is correct, the re-mint is right, and the defect is that a retired node serves a
   full card with 30/10/30/20 setbacks to customers — which is a materially worse finding than
   the one you were dispatched for, and you escalate immediately rather than continuing.

State which, with the read that settles it. If it is the second, stop and report.

### Settled, do not re-derive

- **The CONTRACT_VERSION 1.30.0 versus 1.36.0 risk has no mechanism.** `writePropertyAtom`
  (`packages/storage/src/pg-storage.ts`) performs two assertions, entity id and write boundary,
  then serialises the instance verbatim and upserts. There is no schema validation and
  `CONTRACT_VERSION` appears nowhere in the engine repo, so there is no version gate to fail
  open through. This was read at source. Do not re-investigate it.
- **Deploy state is verified and is not your problem.** The job exists, is digest-pinned,
  both secret refs resolve, and an execution connects. Measured.
- **The cortex-api traffic shift is HELD and is not in your scope.** `_catalog/leases/` holds
  only `README.md`, so the P-170 traffic-lease gate would refuse a shift anyway.

### Done looks like

The contradiction is resolved with a named mechanism and a rejected alternative, and either a
fix proposal for the re-mint that would make a `--promote` run capable of writing, or an
escalation saying the node is genuinely retired and the serve path is the defect.

A job that cannot write must not be left able to report success. Whatever the cause, propose
how a zero-write `--promote` run comes to FAIL rather than pass.

### Falsifiers, pre-register before you run anything

- If you find the re-mint's decline is correct AND the serve path is also correct, you have
  two subsystems disagreeing about what a node is, and that is the finding.
- If you conclude the identity resolution differs, name the two identities and where each is
  read. "They differ" without both reads is not a diagnosis.
- If your proposed fix would make `--promote` write for this parcel but you cannot say what
  makes a genuinely retired node still refuse, you have removed a guard rather than fixed one.

### Do not

Run `--promote` or any write. Change the serve path. Touch `smartcity-os` or
`smartcity-dashboards`. Deploy anything.

### Close

`_inbox/<date>_p208-remint-noop_close.json`, `planRows` `["P-208"]`, with the contradiction's
resolution, the rejected mechanism and why, the reads that settle it, and the fix proposal.
`probe.notApplicable` is acceptable for a diagnosis lane; say so and why. `leave_behind` is
required, and `none` is a valid and cheap answer.
