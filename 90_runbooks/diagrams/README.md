---
id: diagrams_index
title: Portfolio diagrams — Mermaid source + rendered PNG
status: active
last_updated: 2026-06-01
applies_to: portfolio
related: [00c_portfolio_master_map, _research/2026-06-01_shared_engines_vision_and_current_state, 76_empressa_wedge_90d_operating_plan]
---

# Portfolio diagrams

> **Read the narrative first:** [`EXECUTIVE_SUMMARY.md`](EXECUTIVE_SUMMARY.md) walks the whole portfolio in prose with these diagrams embedded.

Each diagram has a Mermaid source file (`.mmd` / `.mermaid`) and a rendered PNG (dark background, 2x scale). Edit the source, then re-render (see below).

| Diagram | Source | Image | Lives in |
|---|---|---|---|
| Master system topology (verified) | `master_system_topology.mmd` | `master_system_topology.png` | [`00c`](../../00c_portfolio_master_map.md) §2 |
| Dev process / fleet loop | `dev_process_fleet_loop.mmd` | `dev_process_fleet_loop.png` | [`00c`](../../00c_portfolio_master_map.md) §4 |
| Entity and brand structure | `entity_brand_structure.mmd` | `entity_brand_structure.png` | [`00c`](../../00c_portfolio_master_map.md) §6 |
| Commercial tiers + wedge | `commercial_tier_wedge.mmd` | `commercial_tier_wedge.png` | [`00c`](../../00c_portfolio_master_map.md) §7 |
| Roadmap milestone ladder | `roadmap_milestone_ladder.mmd` | `roadmap_milestone_ladder.png` | [`00c`](../../00c_portfolio_master_map.md) §8 |
| Shared engines — vision | `shared_engines_vision.mmd` | `shared_engines_vision.png` | [`shared engines research`](../../_research/2026-06-01_shared_engines_vision_and_current_state.md) |
| Shared engines — current state | `shared_engines_current_state.mmd` | `shared_engines_current_state.png` | [`shared engines research`](../../_research/2026-06-01_shared_engines_vision_and_current_state.md) |
| GTM loop | `gtm_loop.mermaid` | `gtm_loop.png` | [`76`](../../76_empressa_wedge_90d_operating_plan.md) |
| Self-healing / maintenance loop | `self_healing_loop.mermaid` | `self_healing_loop.png` | [`76a`](../../76a_operator_autonomous_loops.md) |

## Re-rendering

Renderer is `@mermaid-js/mermaid-cli` (mmdc), pointed at the local Chrome. From this folder:

```bash
export NODE_OPTIONS="--use-system-ca"          # corporate TLS interception; use system cert store
export PUPPETEER_EXECUTABLE_PATH="/c/Program Files/Google/Chrome/Application/chrome.exe"
for f in *.mmd *.mermaid; do
  npx -y @mermaid-js/mermaid-cli@11 -i "$f" -o "${f%.*}.png" -p /p/tmp/puppeteer.json -b "#0d1117" -s 2
done
```

`/p/tmp/puppeteer.json` sets the Chrome path plus `--no-sandbox`. `-b "#0d1117"` is the dark background (diagrams use `theme: dark`); `-s 2` is 2x scale for legibility.
