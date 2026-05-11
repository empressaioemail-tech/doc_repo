---
id: cutover_env_var_bind_procedure
title: Cutover env var bind procedure
status: active
last_updated: 2026-05-11
applies_to: smartcity_os
related:
  - 91_postmortems/2026-05-11_cutover_env_var_silent_drops.md
  - 90_runbooks/smartcity_cloud_run_env_audit_2026-05-11.md
  - 90_runbooks/cloud_run_canary_deploy.md
---

# Cutover env var bind procedure

Procedure for binding multiple secrets to Cloud Run via Secret Manager, used when:
- A platform cutover left env vars unset (this runbook's origin: 2026-04 cutover from Replit to Cloud Run)
- New integrations need credential injection at scale
- Vendor rotations require batch re-binding

The procedure isolates secret values from agent contexts and the chat conversation — all values stay in a local file on Nick's box, transferred once to Cloud Shell, deleted after bind. No agent ever sees the values.

## Prerequisites

- A KEY=VALUE format file (one per line) with the values to bind. Example: `smartcity_secrets`.
- Access to Google Cloud Console with appropriate IAM (Secret Manager Admin + Cloud Run Admin minimum).
- Verified inventory of which vars are: (a) currently unbound (will create new secrets), (b) already in Secret Manager but not wired up (partial-migration debris — needs version-add + IAM grant), (c) currently bound and working (must be excluded from the bind file unless explicit overwrite is intended).

## Procedure

### 1. Prepare the secrets file

Format on local box:

````
# Comments allowed; blank lines allowed
KEY_NAME_1=value
KEY_NAME_2=value with spaces no quotes needed
````

Save outside any git working tree, or in a directory where it's explicitly `.gitignore`'d. Standard filename: `<service>_secrets`. Do NOT commit. Will be `shred`'d after bind.

### 2. Open Cloud Shell, upload file

In Google Cloud Console, activate Cloud Shell. Use the kebab menu (⋮) → Upload → select the file. Lands in `~/`. Confirm:

```bash
ls -la ~/<service>_secrets
wc -l ~/<service>_secrets
```

If filename has `.txt` from drag-drop upload, rename:

```bash
mv ~/<service>_secrets.txt ~/<service>_secrets
```

### 3. Save the bind script

Use the script in the appendix below or fetch the latest from this runbook. Save as `~/bind_<service>_secrets.sh` and `chmod +x`.

### 4. Set required env vars

```bash
export PROJECT_ID="<gcp-project-id>"
export REGION="<region>"
# SERVICE defaults to smartcity-api; override if different
```

### 5. Dry-run

```bash
~/bind_<service>_secrets.sh ~/<service>_secrets
```

Review the PLAN. Confirm:
- Parsed count matches expectation
- "Will CREATE" list matches expected new bindings
- "Already EXIST" list is either empty OR matches expected partial-migration debris (which requires manual remediation per step 6)
- Runtime SA identified correctly

If "Already EXIST" is unexpectedly non-empty, **stop and investigate** before proceeding. Likely partial-migration debris. Run the recon block in step 6 against the unexpected secrets.

### 6. (If needed) Remediate partial-migration debris

For each unexpectedly-existing secret, inspect:

```bash
gcloud secrets describe smartcity-<KEY> --format="value(createTime,replication.automatic)"
gcloud secrets versions list smartcity-<KEY> --format="table(name,state,createTime)"
gcloud secrets get-iam-policy smartcity-<KEY> --flatten="bindings[].members" --format="value(bindings.role,bindings.members)" | grep -E "compute|secretAccessor"
gcloud run services describe smartcity-api --region=$REGION --format=yaml | grep -B 1 -A 4 "<KEY>"
```

If: existing values are unknown provenance + no IAM + no Cloud Run reference → version-add fresh values + grant IAM:

```bash
while IFS= read -r line || [[ -n "$line" ]]; do
  line="${line//$'\r'/}"
  [[ -z "${line// }" ]] && continue
  [[ "$line" =~ ^[[:space:]]*# ]] && continue
  if [[ "$line" =~ ^(KEY1|KEY2)=(.*)$ ]]; then
    KEY="${BASH_REMATCH[1]}"; VALUE="${BASH_REMATCH[2]}"
    printf '%s' "$VALUE" | gcloud secrets versions add "smartcity-$KEY" \
      --project=$PROJECT_ID --data-file=-
    gcloud secrets add-iam-policy-binding "smartcity-$KEY" \
      --project=$PROJECT_ID \
      --member="serviceAccount:<runtime-sa>" \
      --role="roles/secretmanager.secretAccessor"
  fi
done < ~/<service>_secrets
```

The main script will then include these in the Cloud Run binding update via `:latest`.

### 7. Execute

```bash
~/bind_<service>_secrets.sh ~/<service>_secrets --execute
```

Expect 30-60 seconds. Output ends with new revision name and traffic table. New revision spawns automatically as part of `gcloud run services update --update-secrets`.

### 8. Verify

```bash
SERVICE_URL=$(gcloud run services describe smartcity-api --region=$REGION --format='value(status.url)')

# Cloud Run state
gcloud run services describe smartcity-api --region=$REGION --format="yaml(status.latestReadyRevisionName,status.traffic)"

# All bindings present on new revision
gcloud run revisions describe <NEW_REVISION_NAME> --region=$REGION \
  --format="value(spec.containers[0].env[].name)" | tr ';' '\n' | sort

# Integration logs (better than auth-protected health endpoints for verification)
gcloud logging read 'resource.type=cloud_run_revision AND resource.labels.revision_name="<NEW_REVISION_NAME>"' \
  --limit=200 --format="value(textPayload)" --project=$PROJECT_ID 2>/dev/null \
  | grep -iE "<integration_keywords>" | head -60
```

For each restored integration, look for explicit init / authentication / first-fetch success messages in logs. Logs-based verification is more reliable than anonymous-curl on `/health` endpoints, which may be auth-protected.

### 9. Cleanup

```bash
shred -u ~/<service>_secrets
ls -la ~/<service>_secrets 2>&1 | head -1   # should say "No such file or directory"
```

Cloud Shell home dirs persist across sessions; skipping `shred` leaves values accessible. Also delete the source file on the local box.

## Bind script

(Reproduced from session 2026-05-11. Customize PROJECT_ID, REGION, SERVICE, SECRET_PREFIX via env vars.)

```bash
#!/usr/bin/env bash
set -euo pipefail

INPUT_FILE="${1:?Usage: $0 <input_file> [--execute]}"
MODE="${2:-dry-run}"

PROJECT_ID="${PROJECT_ID:?Set PROJECT_ID env var}"
REGION="${REGION:?Set REGION env var}"
SERVICE="${SERVICE:-smartcity-api}"
SECRET_PREFIX="${SECRET_PREFIX:-smartcity-}"

# ... (full script body — see _sessions/2026-05-11_cutover_env_var_bind_shipped_claude_ai_planner.md
#      or copy from this runbook's source-of-truth git history)
```

## Lessons (origin: 2026-05-11 session)

- Audit docs that check code-references will MISS Secret Manager partial-migration debris. Always also enumerate existing secrets via `gcloud secrets list`.
- Auth-protected health endpoints (e.g., `/api/spireon/health` returns 401 anonymous) make curl-based verification incomplete. Cloud Run logs are the reliable signal: look for `authenticated`, `live`, `connected`, `fetched`, integration-specific log markers.
- Cloud Shell + UI upload preserves filename including extension. `smartcity_secrets.txt` after drag-drop is a common gotcha.
- Bash script dry-run/execute gating catches anomalies before they cause damage. Specifically caught MYGOV pre-existing secrets in this session and allowed remediation before main bind.

## Reconciliation notes (added 2026-05-11 session 3)

Cloud Run revision generation numbers (`smartcity-api-NNNNN-xxx`) can be reused across distinct revisions with different suffixes. When reconciling revision history across sessions / postmortems / handoffs, always join on `creationTimestamp` from `gcloud run revisions list --format='table(name,active,creationTimestamp)'`, never on suffix-as-unique-key.

Verified 2026-05-11: both `smartcity-api-00084-vhr` (created 2026-05-11T18:24Z) and `smartcity-api-00084-weg` (created 2026-05-10T02:22Z, the May-10 W1.C.4a auth-fix revision) coexist on the same service. Earlier handoffs that treated `00084` as a stable identifier for a single revision were misreading Cloud Run's revision-naming behavior.

Practical implication for env-var bind reconciliation: when correlating "which revision applied a given secret update" against session summaries or postmortems, fetch the timestamped revision list once at the start of the bind/audit and key all references off `creationTimestamp` (or, equivalently, the full `name` including suffix). Never abbreviate to the generation number alone.
