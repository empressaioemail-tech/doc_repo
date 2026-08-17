---
date: 2026-08-17
agent: planner
repo: portfolio
session_type: planning
memory_graded: none
rolled_up: false
---

# Session addendum: GTM rulings after checkout E2E

## What was done

Operator confirmed Stripe checkout mechanically works; polish remains. Vercel Hobby stays. Pipedrive is the Smart Site CRM with `smartsite` plus user-tier tags. Self-serve pricing is a popup like the landing signup, not a full page. 15-minute L26 scoreboard loop killed (PID 85672). No product deploy: no PE/cortex code in this session. Stand record `_inbox/2026-08-17_l26_backfill_and_gtm_stand.md`. Decision `_decisions/2026-08-17_smartsite_gtm_pipedrive_popup_hobby.md`.

## What was learned

G-63 Pipedrive-as-city-feed refusal and Pipedrive-as-subscriber-CRM are different. Operator wants the second. Webhook must be the writer of the tier tag.

## What's still open

Pipedrive webhook, pricing popup, Stripe amount rebuild, unlock $15 product, checkout polish from the operator pass. Roads/CAMA backfill redesign. Dirty hauska-map must not be the deploy vehicle.

## Suggested canonical doc updates

G4 in `90_operations/QA_polish_register.md` flips from "no CRM of record" to Pipedrive + tags.
