---
id: 2026-08-25_w5a_overnight_queue
title: W5-A overnight queue (same lease, next legal counties)
date: 2026-08-25
status: active
plan_row: P-47
---

# W5-A overnight

Operator asked to keep the write path busy. Same W5A lease. Same isolated engine `cfa18bc`. No leftover. No rematerialize. No second writer.

Now: Kaufman owner apply still writing (~85k/93k when the runner started). Detached overnight PID **41200** waits for `owner_apply.json`, then Kaufman land-use, then FIPS order:

1. 48029 Bexar
2. 48085 Collin
3. 48091 Comal
4. 48121 Denton
5. 48187 Guadalupe

Refused: Dallas 48113, Tarrant 48439, Travis 48453 HOLD, Hays 48209 HOLD, Williamson 48491, already-green Bastrop/Caldwell.

Heartbeat PID 21624 still alive. Log `P:/tmp/w5a_48257_20260825/overnight.log`. Watch `w5a-overnight`. W6 GET waits for morning. Do not rematerialize.
