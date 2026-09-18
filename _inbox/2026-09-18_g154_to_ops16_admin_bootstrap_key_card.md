# Card request → OPS-16: the admin bootstrap key is in no inventory, and its local copy is dead

**From:** G-154 (`g154-dev-services-live`, a Lane-B row in `OPS-17`)
**To:** the OPS-16 planner
**Date:** 2026-09-18
**Proposed row:** **P-362** (P-361 is the highest on `origin/main` as of this filing; `A-220` is the latest ruling. Renumber if a card lands ahead of this one.)
**Class:** P-305 (a rotated key reaches one environment and not another, and nothing notices)

## Why this lane is filing it

G-154 needed to read a tenant-private pack (`bastrop_tx`) on the non-production app
`d12-main-uat` to prove four design corrections on live records. Nothing about that
task is about keys. But to do it the lane had to mint an admin-API key, and the two
minutes it spent on the credential turned out to be the more interesting finding:

> `P:\hauska-mcp-server\.env` carries a `HAUSKA_ADMIN_BOOTSTRAP_KEY`, and the
> deployed service refuses it with **HTTP 401 `Invalid admin bootstrap key`**.
>
> The value that works is the one in Secret Manager (`hauska-prod-497015`,
> secret `HAUSKA_ADMIN_BOOTSTRAP_KEY`).

The local file is the natural place a lane looks, and its presence reads as an
authorisation. It is not one. This is the P-305 shape exactly — *a key that is
present, plausible, and wrong, in an environment nothing checks* — and the lane
would not have found it at all if it had not needed to make a live call.

## What was measured, and how

| # | Measurement | Result |
|---|---|---|
| 1 | `POST /admin/keys` on `hauska-mcp-server-h7gvu7rgcq-uc.a.run.app` with the `hauska-mcp-server/.env` value | **HTTP 401 `Invalid admin bootstrap key`** |
| 2 | The same request, same body, with the Secret Manager value | **HTTP 201**, key minted |
| 3 | Local copies of `HAUSKA_ADMIN_BOOTSTRAP_KEY` — a **full recursive sweep of `P:\`** (`.env*`, depth 4, completed `exit 0` in 477 s), plus a narrower sweep over `hauska-mcp-server` and four worktree/vendor directories (`hauska-mcp-server-worktrees`, `hauska-mcp-worktrees`, `hauska-engine`, `hauska-factory`) | **exactly one copy**, found by both sweeps: `hauska-mcp-server/.env` (64 chars) |
| 4 | `rg -c "BOOTSTRAP"` over `_inbox/2026-09-17_p305-key-inventory.md`, `…_inventory.json` and `90_runbooks/key_rotation_all_environments.md` | **zero matches in all three** |
| 5 | `rg -c "BOOTSTRAP"` over `origin/main:90_operations/OPS-16_texas_market_plan_of_record.md` | **zero matches** |
| 6 | The runbook's Step 1 pair table | carries the **engine/retrieval key** and the **service key**; the admin bootstrap key **is not a row** |
| 7 | `gcloud config get-value project` on this workstation, then `gcloud secrets list --filter="name:HAUSKA_ADMIN_BOOTSTRAP_KEY"` **with and without** `--project` | default project is **`smartcity-os-prod`**; the secret exists **only** in **`hauska-prod-497015`**. Without `--project` the list call returns **an empty result at exit 0** — no error, no warning that names the project |

No key value was printed, hashed or committed by this lane; measurements 1 and 2 were
observed as status codes only. The bootstrap value was read from Secret Manager into a
shell environment variable for the calls and never written to a file.

## The finding, stated precisely

1. **This key is outside the P-305 instrument.** P-305's inventory enumerates consumers
   of the engine/retrieval key and the service key. `HAUSKA_ADMIN_BOOTSTRAP_KEY` is a
   third credential with its own consumers — the admin API on `hauska-mcp-server`, and
   every workstation that holds a `.env` — and it appears in none of it. Finding 4 and 5
   above are the evidence that it is missing, not merely under-described.
2. **A local copy is dead and nothing says so.** The one copy found does not
   authenticate. The runbook's Step 0 already names *local `.env` files* as a stated gap
   of the inventory ("any unreadable project … is a possible consumer" and the listed
   `statedGaps`). This is that gap with a concrete instance in it rather than a named risk.
3. **Provenance is undecidable from the artifact, which is the actual defect.** Whether
   the local value is a *stale copy of a previous production value* (a rotation that
   missed this environment) or a *deliberately local development value* cannot be told
   from the file, the repo or the runbook. The runbook calls this out for the Vercel
   variables — "whether those three hold the engine key's old value or a different value
   altogether cannot be told from the names" — and the same sentence is true of this file,
   except here nothing even names it as a question.
4. **The documented way to look this key up fails silently into the wrong project.**
   `gcloud` on this workstation defaults to project **`smartcity-os-prod`**. The secret
   lives in **`hauska-prod-497015`**. A lane that follows the runbook and runs the lookup
   without `--project` gets **an empty list at `exit 0`** — no error, no line naming the
   project it actually searched. Under this repo's own rule ("an empty result is NOT an
   absence", `AGENT_CONTRACT` section 5) that reading is a possible *consumer*, and here it
   is the expected outcome of the mistake. Measurement 7 is the evidence. The runbook
   already carries the structurally identical trap for the other toolchain — *"`hauska-map`
   links to whichever project `.vercel/project.json` names … `vercel env add` silently
   landed on the wrong project"* — so this is that trap's `gcloud` twin, unrecorded.

**Point 3 is why this is carded rather than fixed.** A lane can observe that the local
value is refused. It cannot know, from anything in the repo, whether re-pointing
`.env` at production's value is *restoring drift* or *leaking a production admin
credential onto a workstation* — and the two readings want opposite actions. That is a
decision with an owner, not a chore.

## Proposed row text (ready to paste)

> | P-362 | 2026-09-18 | ADDED (operator ruling _pending_) | **THE ADMIN BOOTSTRAP KEY IS IN NO INVENTORY, AND ITS ONE LOCAL COPY IS DEAD.** Found by G-154, which needed the admin API (`POST /admin/keys`) to mint a lane-scoped `bastrop_tx` key and assumed the value in `hauska-mcp-server/.env` was the credential. It is not: the deployed service answers **401 `Invalid admin bootstrap key`** to it, and answers 201 to the Secret Manager value (`hauska-prod-497015`, secret `HAUSKA_ADMIN_BOOTSTRAP_KEY`), measured 2026-09-18. P-305's inventory enumerates the engine/retrieval key and the service key; `rg -c BOOTSTRAP` returns **zero** across `_inbox/2026-09-17_p305-key-inventory.md`, its `.json` and `90_runbooks/key_rotation_all_environments.md`, and zero across `OPS-16` itself — so this credential has no row, no consumer listing and no pair, while the runbook's own Step 0 already names local `.env` files as a gap it does not close. A full recursive sweep of `P:\` (`.env*`, depth 4, `exit 0`) finds **exactly one** local copy, the dead one. Worse than the dead value: its **provenance is undecidable from the artifact**, since nothing distinguishes a stale copy of a rotated production value from a deliberate local development value, and those two readings want opposite fixes (re-point it, or find and destroy the production copy). And the **documented lookup fails silently into the wrong project**: `gcloud` defaults to `smartcity-os-prod`, the secret lives in `hauska-prod-497015`, and the same list call without `--project` returns **empty at exit 0** with nothing naming the project it searched — this repo's own "an empty result is NOT an absence" rule, and the `gcloud` twin of the `.vercel/project.json` trap the runbook already carries. **Done:** (a) the admin bootstrap key is named in the runbook's Step 1 pair table with its consumers, and the inventory predicate is extended to see it, or a written reason it is exempt; (b) the question of what `hauska-mcp-server/.env` *should* hold is decided and recorded, with the chosen value in place and a live `POST /admin/keys` call showing the local environment resolves a working credential — or showing the local environment is deliberately non-authoritative and says so where a lane will read it; (c) the lookup path names its project, or refuses rather than returning an empty list, so a wrong-project read cannot read as "no such secret"; (d) the closing check has a leg that fails on a refused admin bootstrap key rather than on a data answer, since the failure mode is a 401 that reads as "no data". **Depends:** none. | Y |

## What this card does NOT claim

- **It does not claim the production credential is compromised or rotated.** Production
  is internally consistent: the deployed service authenticates the Secret Manager value.
  What is stale is a *local copy*, and what is missing is a *place in the inventory*.
- **It does not claim the local value is a stale production value.** That is one of two
  readings and the card's whole point is that the repo cannot currently tell which.
- **It does not claim the sweep for local copies was exhaustive.** A full recursive sweep of
  `P:\` was run (`.env*` filenames, depth 4, `exit 0` after 477 s) and found exactly one
  copy, which is stronger than a spot-check — but it matched `.env*` **filenames** only, so a
  copy under some other name, deeper than depth 4, on another drive, on another workstation,
  or inside a container image or CI secret store was **not** read. By this repo's own rule an
  unread listing is a possible consumer.
- **It does not claim `gcloud`'s default project is wrong for anyone else.** It measured this
  one workstation's default (`smartcity-os-prod`) against the project the secret lives in
  (`hauska-prod-497015`). A lane that already passes `--project`, or whose shell defaults
  elsewhere, does not hit this.
- **It is not a grade on P-305, which is merged and which did what it set out to do.**
  It is a hole *adjacent* to P-305 that P-305's instruments structurally cannot see.

## One adjacent environment observation, recorded because a reader will hit it

`gcloud` on this workstation emits `InsecureRequestWarning: Unverified HTTPS request is being
made to host 'secretmanager.googleapis.com'` on Secret Manager calls — i.e. it is **not
verifying TLS** for that host. This is **not** this card's subject and not a claim that any
value leaked; it is recorded as an environment fact for whoever works P-362, and it is the
same family as the Node CA trap the runbook already documents
(`90_runbooks/cc_agent_node_tls_workaround.md`), arriving on the `gcloud` side.

## For the record: the credential this lane minted

The mint produced `key_id 2510a3ff-0d3c-47f4-8026-eadd6172b000`, scope
`jurisdiction_tenant=bastrop_tx`, `product=public`, `tier=team`. It was used only to read
the Development services lens on `d12-main-uat`, **it has been revoked** (status read back
as `revoked`; the same request that returned 200 with 73 business-licence records now
returns 401), and its raw value was never printed, committed or written into any artifact.
