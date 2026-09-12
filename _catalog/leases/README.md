# Deploy-traffic leases (AGENT_CONTRACT section 3; OPS-16 P-170)

One file per Cloud Run service, present only while one lane holds the right to shift that
service's traffic. Written by the dispatch planner in its own doc_repo worktree before the
lane shifts, deleted after the serving revision has been read by field name from the traffic
JSON and the lane's probe has run against it. Two lanes never hold the same service because
one file holds one lane.

```
_catalog/leases/<service>.json
{
  "service":   "hauska-engine-api",
  "lane":      "p167-vocab",
  "revision":  "hauska-engine-api-00206-abc",
  "takenAt":   "2026-09-12T02:50:00Z",
  "expiresAt": "2026-09-12T04:00:00Z"
}
```

The hook `.claude/hooks/traffic-lease-gate.mjs` refuses `gcloud run services update-traffic`
and `gcloud run deploy` without `--no-traffic` when no live lease for the named service exists
in the worktree the session is rooted in. A deploy workflow dispatch is warned, not blocked,
because the service it shifts is not readable from the command. Sessions not rooted in a
doc_repo worktree do not load the hook; that bypass is named in the contract, and the planner
sequences shifts explicitly for it.

Lease files are working state, not canon: they are not committed. `.gitignore` keeps
`_catalog/leases/*.json` out of the index; this README is the only tracked file here.
