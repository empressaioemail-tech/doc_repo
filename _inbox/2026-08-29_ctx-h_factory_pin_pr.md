## Summary
- Pin `_LDT_SHA` to LDT merge `889b1556` (PR #548, CTX card H: owner-gated situs recovery for Hays and Williamson).
- Does not lift the prop_id seed. Rebuild `factory-bastrop-publish` from this file after merge (A-019).
- Do not bake the six until this image is live.

## Test plan
- [ ] Confirm `889b1556` is on LDT main and is the #548 merge
- [ ] After merge, `gcloud builds submit --config=cloudbuild.publish.yaml`
- [ ] Job IMAGE_DIGEST matches the new build before any county execute
