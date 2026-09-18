## Mission: G-135, mint the verification-scoped `bastrop_tx` key that every Bastrop proof is waiting on

**This dispatch is for the SUBSTRATE seat.** Minting happens in `hauska-mcp-server`, which the substrate
seat owns, through that repo's own admin API. You write no product code. You launch no sub-agents
(FAN-DEPTH 0).

Read, in order: the G-135 row in `90_operations/OPS-17_govtech_stack_plan_of_record.md` and amendment
A-148; `_inbox/2026-09-15_g135_substrate_mint_request.md` (the request, filed three days ago and never
actioned); the `hauska-tenant-key-bastrop_tx-*` entries in `_catalog/credential_access_index.json`.

### Why this is the most valuable dispatch in the program right now

The operator ruled that SmartCity designs are proven on `bastrop_tx`, Bastrop's real tenant-private pack
(`_decisions/2026-09-18_bastrop_is_the_proving_pack.md`). On any deployed app, a tenant-private pack
answers 401 to an anonymous read. So every lane that must prove on Bastrop needs a credential, and none
exists that a lane may use. The only active `bastrop_tx` key is labelled "Nick, bastrop_tx staff pilot"
and belongs to the operator's own account, and G-135 ruled it must not be handed out.

Four things wait on this one key today: G-154's live proof (one command away), D-13's end-to-end
leg, the G-159 finance grant, and every lens build in the queue.

### The work

1. **Read the pilot row first.** Take its `tier` from the `api_keys` row, as the request asks. Do not guess
   it. Select only the columns you need, and never select or print a hash or a raw value.
2. **Mint one key**, per the request's body: `jurisdiction_tenant=bastrop_tx`, `platform_internal=false`,
   `product=public`, `owner_name` `govtech-lane-verification (bastrop_tx)`, and an `owner_email` distinct
   from the operator's own. Use `POST /admin/keys` with `X-Hauska-Admin-Key`. The raw value is returned
   exactly once.
3. **Put the raw value in exactly one place: GCP Secret Manager in `hauska-prod-497015`**, as secret
   `hauska-tenant-key-bastrop-tx-lane-verification`. That is the project that holds the store the key is
   validated against, so the secret moves with `hauska-mcp-server` when OPS-25 D-7 migrates it. The
   request named the dashboards' GCP project instead. That project is being exited, and the dashboards
   now run on DigitalOcean, so do not use it. Write the value from inside a script that pipes the mint
   response straight into `gcloud secrets versions add --data-file=-`. It is never echoed, logged,
   committed or written to a file.
4. **Prove it by violation, both directions, on the non-production app** `d12-main-uat`
   (`https://d12-main-uat-gqnjx.ondigitalocean.app`). Read the key back from Secret Manager inside the
   probe script.
   - `/auth/whoami` returns `jurisdiction_tenant=bastrop_tx` and the new `key_id`.
   - `GET /api/city-domains?cityKey=bastrop_tx` with the key in `x-hauska-key` answers 200 with
     Bastrop's pack identity.
   - The same request with no key is 401. The same key against a different tenant-private pack is
     refused; if no other tenant-private pack exists, say so, and that direction is UNMEASURED.
   - A revoked or garbage key is refused. Use a garbage value. Do not revoke the new key to test it.
5. **Record it, names only**: update the `hauska-tenant-key-bastrop_tx-lane-verification` entry in
   `_catalog/credential_access_index.json` to `status: active` with the `key_id`, the owner fields
   actually used, the Secret Manager project and secret name, the one command a lane uses to read it
   into its environment, and how to revoke it. Never a value.

### Do not

Do not touch the pilot key's row. Do not write the raw value to `P:\tmp`, to any repo, to a close, or to
a chat. A lane recently asked the operator to paste a key into a plaintext file; that is the path this
mint replaces. Do not deploy anything.

### Close

CP1 (the pilot row's tier read, before minting), CP2 (minted, stored, proven), and the close. The close
records the `key_id`, the whoami result, each probe cell with its status code, the Secret Manager path,
and your snapshot.

Declare your `leave_behind`. "None" is valid and cheap; the declaration is required regardless.

State your snapshot in your first output: repository, branch, commit.
