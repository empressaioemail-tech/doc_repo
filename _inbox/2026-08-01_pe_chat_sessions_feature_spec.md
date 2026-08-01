---
id: 2026-08-01_pe_chat_sessions_feature_spec
title: PE chat — property-anchored session management + attach + copy (option A) feature spec
date: 2026-08-01
status: spec (operator-approved option A; dispatch)
owner: nick
related: [2026-07-29_pe_ai_chat_atom_citations_spec, 2026-08-01_PE_ui_polish_qa_batch, 42_stub_thesis_national_twin_substrate]
purpose: Upgrade PE's AI chat to work "like a regular chatbot" — new chats, revisit old chats, attach, copy/paste — WITHOUT abandoning the property-anchored, cited-atom model that is the moat. Operator chose option A (anchored sessions) over B (free-form general assistant).
---

# PE chat — property-anchored sessions (option A)

Operator wants the chat to feel like a normal chatbot: start NEW chats, revisit OLD chats, ATTACH things, COPY/PASTE. Ruling: option A — keep it PROPERTY-ANCHORED and CITED (each chat tied to a smart site; answers cite only real atoms on that property; anti-fabrication holds), but add regular-chatbot ergonomics on top. NOT option B (free-form general assistant — breaks the cited-anchored moat, risks fabrication).

## WHAT EXISTS TODAY (build on, don't rebuild)
- `ChatTool.tsx` — the chat component; `chat-citations.ts`, `chat-research.ts`, `chat-dossier.ts` helpers.
- Chat already SAVES to a property ("Save property & attach chat", the "CHAT RESEARCH · Saved thread · N turns" in My-properties). Persistence path: `chat-research.ts` + `propertyDossier.ts`.
- Single thread per property, saveable. NO session management, NO new/switch threads, NO copy, NO file attach.
- Citation layer exists (chat-citations.ts, [n]->chips); the backend slug-canonicalize fix (ldt #368) makes citations actually render.

## THE FEATURE (4 capabilities on the anchored model)
1. NEW CHAT — start a fresh thread on the current property (clears the transcript, begins a new session). The property anchor stays; only the conversation is new.
2. REVISIT OLD CHATS — a property can have MULTIPLE named/dated threads; list them, open one, continue it. Extend the existing single-thread save to a THREAD LIST per property (each thread = its turns + timestamp + optional name/auto-title). The My-properties "CHAT RESEARCH" section becomes a thread picker.
3. COPY/PASTE — copy any message (user or AI) to clipboard (a copy affordance per message bubble); paste into the input works natively. Standard chatbot ergonomics.
4. ATTACH — attach a file (survey PDF, title doc, plat, an image) AS CITED PROPERTY CONTEXT for that thread. The attachment becomes context the AI can reason about FOR THIS PROPERTY (e.g. "per the attached survey, the rear setback line is..."). The attachment is anchored to the property/thread. (Scope: start with PDF + image; the AI uses it as context; it does NOT pool into the shared layer — tenant-private, per sovereignty. If full attachment-reasoning is heavy, phase it: v1 = attach + store + show in thread + pass as context to the model; deeper document-atomization is a later pickup.)

## ANCHORING + HONESTY (non-negotiable — the moat)
- Every thread is tied to a property (smart site). No free-floating chat.
- Answers cite only real atoms on THAT property (+ any attached document as a cited source). Anti-fabrication holds; PRO presentationMode does NOT strip citations.
- Attachments are TENANT-PRIVATE — they are the user's context for their property, never pooled into the shared public layer (sovereignty rule).

## SCOPE / PHASING
- V1 (this dispatch): new-chat + thread-list/revisit + copy-per-message + attach-file-as-context (PDF/image, stored per thread, passed to the model as context, shown in the thread). Anchored + cited throughout.
- LATER (pickup, not now): deep document atomization (turning an attached survey into queryable atoms), cross-property chat, voice, etc.
- Mobile: this must work on the mobile pass (still HELD) — build desktop-first but don't hard-block mobile.

## DISCIPLINE
Isolated worktree off origin/main (this repo has many active worktrees — do NOT edit the shared clone tree; collision hazard). Stage explicit paths. Build+tsc+tests green; PR base main + CI green on head SHA. Deploys planner-owned. Attach may need a small backend/storage path (where the file lives) + the model-context wiring — if it touches cortex-api/engine, that's a coordinated cross-repo change; report it. Standing decisions travel in dispatches.

## DELIVER
The 4 capabilities on the anchored chat, PR(s) base main, CI green, with a note on the attach storage/context path. Operator re-QA. Do NOT deploy/merge (planner-owned).
