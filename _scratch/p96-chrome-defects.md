# p96-chrome-defects scratch

GROUND-TRUTH 2026-08-29T19:12Z: hauska-map PR #312 `feat/p96-chrome-defects` commit `7fdb21f` from `origin/main` `d94d605`. Isolated tree `P:/tmp/hauska-map-p96`. Gate live coverage on that tree: walked 168 billed files, measured 90 literals (hex 35 / triples 55 / hsl 0 / named 0). Old hex-in-tsx instrument would see 20/90 (22.2%). New instrument sees 90/90 of the four forms it names.

LESSON: a coverage percentage baked into the gate file is the same defect as the 7.1% snapshot. The control is reprinting the figure from a live walk every run.

LESSON: kit Modal is not Pricing / Checkout / SignUp. Those are custom scrims. Inheritance is the hook (`useDialogFocus`), not the shell. Item 3 live grade is still a keyboard walk after Vercel.

DEAD-END: vitest is node, no jsdom. Tab cycling cannot be graded by a unit that calls `handleDialogKey`. That math is a pin, not a grade.

GROUND-TRUTH 2026-08-29T19:18Z: #312 squash-merged `b9ecbb8`. Check-run conclusions test/Typecheck/No double-encoded source all `"success"`. Vercel `dpl_G9YtZh9RrgQzHaPGvGDA3FSmP2RW` aliased `https://smartsite.cloud`. Age 0 bundle `index-Bt59CzqH.js`. Live Escape: SignUp dismisses; Settings dismisses and restores Settings; Pricing dismisses and restores Settings. Tab wrap not observed. Georgetown search did not open an inspect card.

GROUND-TRUTH 2026-08-29T19:23Z: item 9 favicon. Live `/icons/icon-192.svg` fill `#2A2A2B`, no `#0b0e13`. #313 squash `b776f0b`. Vercel `dpl_5WNkdU3cRmhc6naRsTYv1fWsL7kd`. theme-color `#2A2A2B`. Href `?v=ss-void`.

DEAD-END 2026-08-29T19:56Z: SVG + `?v=ss-void` is not the browser's first request. Chrome asks `/favicon.ico`. That file did not exist, so `vercel.json` catch-all `/((?!api/).*)` → `/index.html` returned 200 `text/html`. The browser then keeps the last decoded icon for the origin. Query-string cache bust on the SVG cannot win that path.

GROUND-TRUTH 2026-08-29T20:00Z: #314 squash `b6b00d1`. Vercel `dpl_HZrVULNqpeepmR5ecsaexUenXMeh`. Live `/favicon.ico` is `image/x-icon` 879 bytes magic `00 00 01 00`, not HTML.

GROUND-TRUTH 2026-08-29T20:09Z: operator confirmed the favicon is serving.

OPEN: none on this card. This seat idle. Next call is accept-invite only after a Team grant. P-90 waits on MCP leftover item 3 plus greet. Do not invent seats. Do not take P-89 / P-91.

PLAN-ROW: P-96. WDLL `_inbox/2026-08-28_p96_chrome_defect_pile_WDLL.md`.
