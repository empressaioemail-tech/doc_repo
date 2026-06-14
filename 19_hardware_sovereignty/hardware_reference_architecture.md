---
id: hardware_reference_architecture
title: On-prem and edge AI hardware — reference architecture and pitch cheat sheet
status: active
last_updated: 2026-06-14
applies_to: portfolio
owner: planner
related: [hardware_sovereignty_overview, client_brief_local_and_cloud]
---

# On-prem and edge AI hardware reference architecture

Internal cheat sheet. Read this before any hardware conversation. It distills the June 2026 state of desk-side and on-prem AI hardware, anchors on the AMD piece that prompted the research, gives the tiered menu we point customers at, and cleans up the claims that got made loosely in the Mox room.

## The anchor: AMD's "agent computer" play

The piece worth knowing is the AMD Ryzen AI Halo Developer Platform, launched with the Ryzen AI Max PRO 400 series. The framing matters as much as the silicon: AMD is selling these explicitly as "Agent Computers," meaning local boxes powerful enough to plan actions, parse complex prompts, and run agentic workflows with little human intervention. That is almost word for word our own pitch, now carrying a chip vendor's marketing budget. When a customer asks whether agent-native local AI is real or fog, a major vendor naming a product category after the architecture is a useful external proof point.

Two tiers exist. The shipping one (pre-orders June 2026, stocked at Micro Center) is built on the Ryzen AI Max+ 395 ("Strix Halo"): 16 Zen 5 cores, Radeon 8060S integrated GPU, roughly 50 TOPS NPU, 128GB unified LPDDR5x-8000, 2TB SSD, 10GbE, Wi-Fi 7, Windows 11 Pro. It runs models up to roughly 200B parameters locally and holds a 70B model entirely in memory. Around 2,000 dollars. The Q3 2026 refresh is the Ryzen AI Max PRO 400 series, top SKU Ryzen AI Max+ PRO 495: 16 cores and 32 threads, 5.2GHz boost, 55 TOPS NPU, and up to 192GB unified memory with 160GB allocatable to VRAM, configurable 45 to 120W. AMD's claim is that it is the first x86 client processor that can run a 300B-parameter model entirely on the local machine.

## The tiered menu (what we point customers at)

| Tier | Platform | Unified mem | Local model ceiling | Price (Jun 2026) | Best at |
|---|---|---|---|---|---|
| Desk-side, cheapest | GMKtec EVO-X2 (Ryzen AI Max+ 395, mini-PC) | 64-128GB | 70B in memory | 1,499-2,199 | Lowest-cost box per office |
| Desk-side, validated | AMD Ryzen AI Halo Developer Platform | 128GB | ~200B | ~2,000 | Vendor-validated agent computer |
| Desk-side, modular | Framework Desktop 128GB | 128GB | ~200B | ~1,999 | Repairable, modular |
| Desk-side, next gen | AMD Ryzen AI Max+ PRO 495 (Q3) | 192GB (160 VRAM) | ~300B | TBD | Largest local headroom on x86 |
| Desk-side, NVIDIA stack | NVIDIA DGX Spark (GB10) | 128GB | ~200B | 3,999-4,699 | Raw throughput, CUDA tooling |
| Desk-side, Apple | Mac Studio M4 Max / M3 Ultra | 128GB / 192GB | 70B+ at full precision (192GB) | 1,999 / 3,999 | MLX efficiency, memory bandwidth |
| Workstation / rack | NVIDIA RTX Pro 6000 Blackwell (GPU) | 96GB GDDR7 | 70B quantized | ~8,000-13,250 | Heavy workstation, the "rack" tier |

The head-to-head that matters: independent benchmarks have the roughly 2,200-dollar AMD Strix Halo mini-PC matching or beating the 4,000-dollar NVIDIA DGX Spark on price-performance and real-time latency, while NVIDIA keeps the edge on pure throughput for very large models. The honest, strong line for a pitch is that you can hold a 70B model in a box the size of a hardback book on someone's desk for around two thousand dollars.

## Corrections to the claims made in the room

Three things to clean up before the next hardware conversation, because an IT lead will probe them.

The "Apple released a MacBook you can run local models on" line is the weakest version of the argument. Apple is real for local AI via MLX, but Apple is currently cutting Mac Studio memory tiers (the 512GB and 256GB M3 Ultra options have been disappearing), which squeezes exactly the local-AI builder crowd. Leading with Apple invites a "but they're pulling back" rebuttal. Lead with AMD Strix Halo and the DGX Spark. The story is x86 unified-memory boxes and Grace Blackwell, not MacBooks.

The "couple of server racks in here running an LLM" image is now over-built. The truthful and more impressive version is a single roughly 2,000-dollar desk-side appliance per office, or a small cluster of them, not a rack. Racks (RTX Pro 6000 class, 8,000 to 13,000 dollars per GPU) are the heavy-workstation tier, not the entry point.

The boundary that must not be blurred: local hardware runs good models, not frontier models. A local 70B to 300B model is excellent for high-volume, private, latency-sensitive execution. It is not Opus-grade deep reasoning. The clean way to say this is the org-chart framing we already use: cheap local executor agents run on the box, the expensive planner and deep-reasoning calls burst to a frontier cloud model on demand. That maps onto how we actually operate (planner model versus execution model in our own fleet) and makes the cost story bulletproof instead of overstated.

One more distinction to keep clean: storage versus compute. The data layer (where the spine lives, including any IPFS nodes) and the inference layer (the box running the local model) are two separate hardware decisions. They can sit on the same box or not. Keep them distinct in any spec sheet so the rest of it stays trustworthy.

## Sources and confidence

Pricing is volatile and carries lower confidence than specs; the RTX Pro 6000 roughly doubled in price inside a year. Re-verify any number before it goes in front of a customer. Captured June 2026 from:

- AMD: Ryzen AI Halo Developer Platform and Max PRO 400 series — amd.com/en/blogs/2026/amd-powers-next-generation-agent-computers-with-new-ryzen-ai-hal.html
- StorageReview: AMD Ryzen AI Halo / Max PRO 400 coverage
- Micro Center: Ryzen AI Halo Developer Platform listing
- igor'sLAB: Strix Halo mini-PC vs DGX Spark price-performance
- Notebookcheck: DGX Spark vs Strix Halo 2,199-dollar mini-PC
- NVIDIA: DGX Spark product page
- Tom's Hardware: GMKtec EVO-X2 review
- Creative Strategies: Mac Studio M3 Ultra AI workstation review
- Startup Fortune: Apple Mac Studio memory cuts squeezing local AI builders
- VideoCardz: RTX Pro 6000 Blackwell 96GB at 13,250 dollars
- Spheron: LLM inference on-premise versus cloud 2026 cost analysis
