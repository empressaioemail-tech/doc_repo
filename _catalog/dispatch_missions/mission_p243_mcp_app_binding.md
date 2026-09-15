## Mission — P-243: make the MCP app render, and stop flooding the model that has to talk about it

### The operator's words

"the mcp app doesnt render and the answers are garbage"

Those are not two problems. They are one root cause with two faces, and the second one will not go
away by writing a better prompt.

### What the integration seat measured on the live connector, so you do not re-derive it

**The app exists and serves.** `ui://smartsite/app-p562.html`, mimeType `text/html;profile=mcp-app`,
is listed in the server's resource catalog. Its sibling `ui://smartsite/probe-p559.txt` returns
`probe-ok`, which proves resource serving works end to end. **The app is not broken and it is not
missing.**

**Nothing binds it.** `get_smart_site` returns plain text content blocks with **no reference to the
app resource anywhere in the payload**. The client is never told a panel exists, so no panel opens.
This is a mechanism that exists, is correct, and has no trigger.

**The vocabulary is resource-addressable and inlined anyway.** `docs://smartsite/vocabulary-p91v3.json`
is a listed, fetchable resource. The server ships the entire thing, roughly 5 KB and 30-plus token
definitions, **on every single tool call**. It was measured riding along with a four-line
`artifact_id_malformed` refusal, and with every `get_smart_site` stub and node read.

**There is no response shaping.** A node read returns 30-plus fact rails of raw JSON. With no panel
to render it and a glossary stapled to it, the model invents a different structure every time.

### Done looks like

**The panel renders on the operator's own client.**

**Read that predicate twice, because the obvious wrong version of it already passes.** The resource
resolves today and the operator still sees nothing. A close that proves `ui://smartsite/app-p562.html`
resolves, or that the resource is listed, or that the server returns 200, **proves the wrong thing**
and this row will still be open. The claim is the render.

### Scope all three in one lane

Do not split these. Binding the app without trimming the payload gives a rendered panel over a
flooded context. Trimming without binding gives cleaner prose and still no app. Shaping without
either gives a tidier essay.

1. **Bind the app resource to the tool results** that should open a panel. Decide deliberately which
   tools those are and say why in your close; `get_smart_site` is the obvious one, the export and
   search tools may not be.
2. **Stop inlining the vocabulary.** It is already a resource. Reference it, or send it once, or
   send the subset a given response actually uses. **Do not simply delete it** without checking what
   consumes it: if something downstream depends on it being inline, say so and propose the path.
3. **Shape the response.** The design of record for this surface already exists: Smart Site sign-in,
   state 3, the Claude view - a short plain-language answer plus a compact cited-value table, values
   in mono, each with its citation. Build toward that, not toward a new invention.

### Falsifiers, pre-register your answers before you run anything

1. **The render must be confirmed on a client that renders MCP apps, and you must say which one.**
   If you cannot observe a render yourself, say so in those words and hand the operator an exact
   check to run. **Do not report the row closed on a resolution test.**
2. **Measure the payload before and after**, in bytes and in rails, for the same parcel. A binding
   fix that leaves the response the same size has not addressed the second cause.
3. **Confirm the vocabulary is still reachable** by whatever consumes it after you stop inlining it.
   Removing a glossary that something depends on trades a verbose answer for a wrong one.
4. **Regenerate the same read the operator ran** — `48021:34137`, 908 PINE — and show the shaped
   output. If it still reads as an essay, the third cause is not fixed regardless of the first two.
5. If you conclude the app cannot be bound from this server without a client-side change, that is a
   finding and the row closes on it, with the specific reason named. **An honest blocker beats a
   resolution test dressed as a pass.**

### Known traps

- **Two real content defects are visible on this exact surface and are NOT yours to fix here.**
  Owner name, mailing address and exemption flags come back on a tool whose description says twice
  it never carries owner data (**P-220**, confirmed on two parcels in two counties). And the
  pipeline fact says "no pipeline within 500 ft" while the overlay in the same response says
  `unknown` with vintage `UNKNOWN` (**P-217**, instance nine). **Do not fix them and do not hide
  them behind a prettier panel.** If your shaping would render either one, render it honestly and
  report it.
- Citations are degraded on all five brief sections for the operator's parcel. Shaping must not
  invent a citation where `citationsDegraded` is true.
- **This repo does NOT auto-deploy.** Push runs build-and-push only; the workflow is NAMED "Cloud
  Run Deploy" and reports success while the deploy jobs show skipped. Merged is not shipped.
- `smartsite-mcp` currently serves `smartsite-mcp-00122-coh`, deployed 2026-09-15. Read Cloud Run
  traffic BY FIELD, never a positional `--format=value`, and never trust `latestReadyRevisionName`.

### Do not

- Do not close this row on a resource-resolution test.
- Do not fix P-220 or P-217 here.
- Do not change what data the tools return, beyond what shaping and the vocabulary require.
- Do not deploy or merge. Open the PR green and hand it back.
- Do not spawn sub-agents that themselves spawn sub-agents. You own your fan.

### Close

State plainly whether you observed the panel render, on which client, and what you did to see it.
Give the before-and-after payload size and rail count for one parcel. Show the shaped output for
`48021:34137`. Name which tools you bound and why the others were left. Declare `leave_behind`
explicitly. State your snapshot (repo, branch, commit).
