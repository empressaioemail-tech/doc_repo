import {
  Callout,
  Card,
  CardBody,
  CardHeader,
  Code,
  CollapsibleSection,
  Divider,
  Grid,
  H1,
  H2,
  Pill,
  Row,
  Stack,
  Stat,
  Table,
  Text,
  TodoListCard,
} from "cursor/canvas";

const SNAPSHOT =
  "2026-08-28T17:12-05 · QA PE chrome closed. W9 live. P-89 merged, not deployed. Stripe in flight. P-90 / W8 wait.";

export default function SmartSiteDesignSystemGap() {
  return (
    <Stack gap={20}>
      <Stack gap={6}>
        <H1>Smart Site: design system + inbound QA program</H1>
        <Text tone="secondary" size="small">
          {SNAPSHOT}
        </Text>
      </Stack>

      <Callout tone="info" title="Agent distribution card (parallel program)">
        P-87 Connect is live; item 20 stranger probe closed. Item 21 (Claude
        directory filing) is parked until this QA program finishes in-wave
        leftovers. Connector finish canvas:
        smartsite-ai-connector-finish.canvas.tsx. Customize→Connectors is
        merged.
      </Callout>

      <Callout tone="info" title="Where this program is">
        PE inbound QA is closed on the map. W0 through W7 chrome and W9
        kit are live. W2.4 / W4 P1 still need engine PDF bytes (P-90).
        P-89 refuse is on hauska-mcp-server main (#77, 1ae9f28) and is not
        serving yet. Stripe leftovers are in flight on another agent.
        W8 stays queued.
      </Callout>

      <Grid columns={4} gap={12}>
        <Stat value="W0–W7 + W9" label="PE waves live (Nick graded)" />
        <Stat value="P-89" label="Merged #77. Not deployed." />
        <Stat value="P-90" label="Next compile after MCP refuse is live" />
        <Stat value="W8" label="Queued. Do not start." />
      </Grid>

      <H2>What is left</H2>
      <Table
        headers={["Bucket", "Item", "Status", "Who"]}
        rows={[
          [
            "Closed",
            "Reports View + library",
            "MET (Nick 00:41-05). pdf.js viewer paints. Chrome embed retired.",
            "Done",
          ],
          [
            "Closed",
            "P-93 W9 kit",
            "MET. Tree-walk ratchet + Dock. Merged 0e4dc5c. Live dpl_J6Liza2UFgYYpzDXZAwSgmtrXBwN. 87 hex / 60 buttons stay baselined debt, not a silent next card.",
            "Done",
          ],
          [
            "Handed off",
            "W6 Stripe leftovers + live flip",
            "12-seat $349, $15 unlock, wallets, then live-key swap. In flight on another agent. Do not start a second Stripe lane.",
            "Other agent. In flight.",
          ],
          [
            "Code-done",
            "P-89 Hauska MCP",
            "MET at the MCP boundary. #77 1ae9f28. 26/26 violate tests. Serving revision unprobed. Customer-done is a live refuse on the deployed server.",
            "Planner deploy, then live probe",
          ],
          [
            "Queued",
            "P-90 engine PDF",
            "emitPdfDossier verdict, one site-plan sheet, no UNAVAILABLE chips, live-view printed on Flood/X-ray bytes. Engine GET /download still streams a stored hollow. Starts after P-89 refuse is live on the serving MCP.",
            "Ask for the engine dispatch after MCP deploy",
          ],
          [
            "Ruled",
            "Report SKUs",
            "Feasibility = report. Comparison = report and tool. Brief = tool. Records = tool. Live generate today is still X-ray and Flood.",
            "Filed 2026-08-27",
          ],
          [
            "Parked",
            "Item 21 + long-term list",
            "Claude directory, Gmail-from-export, Files upload, Ida, nationwide fly-to, valuation. Stay parked.",
            "After this program",
          ],
        ]}
        framed
        striped
      />

      <Callout tone="info" title="SKU ruling — locked 2026-08-27">
        Reports: X-ray, Flood and Drainage, Feasibility, Comparison.
        Comparison is also a tool (the live Compare dock). Brief is a
        tool. Records is a tool. Site plan and terrain stay exports. A SKU
        is a named thing a customer can generate or buy, not a Stripe
        price id. Feasibility and Comparison generate are not live. Do not
        pitch them as live. Do not invent a fifth report. P-32 stays
        parked.
      </Callout>

      <H2>Wave board</H2>
      <Text tone="secondary" size="small">
        Closed: W0, W1, W2 PE, W3, W5, W7 signed-out, W4 P0, W9. Stripe
        is another agent. P-89 merged, not serving. Do not start W8.
        P-90 waits on a live MCP refuse.
      </Text>
      <Table
        headers={["Wave", "Owns", "Depends", "Status"]}
        rows={[
          [
            "W0 Chrome restore",
            "Right rail single-tenant + left stack only. Brief docks right, accordion. Compare expand. Note colors.",
            "None. First.",
            "MET. Rail right, Compare two-column, note colors + hover.",
          ],
          [
            "W1 Find",
            "Disambiguate, one-click land, history zoom, city/county labels, 1308 Pecan / 48021:27479.",
            "W0 merged (brief docks right).",
            "MET (Nick 23:46Z). Leftover strings walked.",
          ],
          [
            "W2 Share regression",
            "Land on property with notes. Then free-read, anon-survive, live-view link, in-app PDF, Shared with me tab.",
            "W0 live on the map.",
            "2.1 / 2.2 / 2.3 / 2.5 / 2.6 met (Nick). 2.4 live-view on PDF bytes is P-90.",
          ],
          [
            "W3 My properties",
            "Notes include/exclude, auto-save on first report, on-property share, chat collapse, status stays.",
            "W2 land-on-property.",
            "MET (Nick): first Flood saves, chats expand/collapse, pass keeps the property. Detail + persona already met.",
          ],
          [
            "W4 X-ray + report honesty",
            "P0 hollow fail-closed, then P1 verdict, P2 provenance, P3 units, flood drawing, address on X-ray.",
            "P0 reports before P1 starts. Print island can fan after W0.",
            "P0 live-graded. P-89 refuse on MCP main (#77), not deployed. P-90 waits.",
          ],
          [
            "W5 Compare",
            "Notes in compare. Click B opens that property. Pair survives.",
            "W0 (expand is a W0 item).",
            "MET signed-in: notes on B (test note), two-column pair survives.",
          ],
          [
            "W6 Hoffman checkout",
            "12-seat math, 2 months free, back-to-cart, ICC line, unlock error, card scroll, wallets.",
            "W7 copy rules. Operator replay if Stripe is opaque.",
            "First paint Monthly, seats in Team column, no 2 months free chip, $349 math, back-to-cart met. Leftovers + live flip handed to another agent 2026-08-28. Do not start from this canvas.",
          ],
          [
            "W7 Offer + reports panel",
            "P4 panel, P5 ladder, P6 CTAs. Flag extra SKUs. Do not invent reports.",
            "Register 01/02/04/05. Conflicts stop the agent.",
            "MERGED #241. Signed-out reports is sign-in first. No Coming soon on the body.",
          ],
          [
            "W8 Ingest placement",
            "Site Constraints section in X-ray. Structure beds/baths. Suppress mailing. No raw CAD names.",
            "W4 P1. Valuation is blocked.",
            "QUEUED. Blocked on W4 P1 / P-90. Do not start.",
          ],
          [
            "W9 Kit write-path",
            "Freeze law. Six primitives. ESLint hex + raw-button gate. Convert touched surfaces only.",
            "W0 live. Do not import SmartCity kit.",
            "MET. Merged 0e4dc5c. Live dpl_J6Liza2UFgYYpzDXZAwSgmtrXBwN.",
          ],
        ]}
      />

      <TodoListCard
        defaultExpanded
        todos={[
          { id: "w0", content: "W0 Chrome — met (Nick).", status: "completed" },
          { id: "w1", content: "W1 Find leftovers — met (Nick 23:46Z).", status: "completed" },
          { id: "w2", content: "W2 PE met (Nick). 2.4 live-view bytes is P-90.", status: "completed" },
          { id: "w3", content: "W3 met (Nick): auto-save, chats, pass. Detail + persona already met.", status: "completed" },
          { id: "w4", content: "W4 P0 live. P-89 merged not deployed. P-90 queued.", status: "in_progress" },
          { id: "w5", content: "W5 Compare — notes + pair survive (Nick).", status: "completed" },
          { id: "w6", content: "W6 first paint met. Stripe leftovers HANDED OFF.", status: "pending" },
          { id: "w7", content: "W7 Offer CTAs met signed-out. Signed-in catalog leftover.", status: "completed" },
          { id: "w8", content: "W8 Ingest field placement (blocked on P1; no valuation). Do not start.", status: "pending" },
          { id: "w9", content: "W9 kit write-path MET. Merged 0e4dc5c and live.", status: "completed" },
        ]}
      />

      <Card>
        <CardHeader trailing={<Pill tone="info">Next on this board</Pill>}>
          One move unblocks P-90
        </CardHeader>
        <CardBody style={{ padding: 0 }}>
          <Table
            headers={["Order", "Lane", "Work", "Grade type"]}
            rows={[
              ["1", "P-89 deploy", "Planner-owned. Serve #77, then live-probe a hollow refresh refuse.", "Ask to deploy"],
              ["2", "P-90 engine", "Compile after that live refuse. emitPdfDossier honesty + live-view on bytes.", "Ask"],
              ["—", "W8", "Site Constraints on the P-90 packet. Do not start.", "Queued"],
              ["—", "W6 Stripe", "In flight on another agent. Do not start a second lane.", "Other agent"],
              ["—", "Kit debt", "87 hex / 60 buttons. P-93 follow-on, not W8.", "Parked"],
              ["—", "Item 21", "Claude directory filing", "PARKED"],
            ]}
            framed
            striped
          />
        </CardBody>
      </Card>

      <H2>Conflicts. Stop and flag. Do not ship around them.</H2>
      <Table
        headers={["Clash", "Source A", "Source B", "Agent rule"]}
        rows={[
          [
            "Report menu length",
            "01_positioning (2026-08-27): X-ray, Flood, Feasibility, Comparison. Site plan/terrain are exports.",
            "Live panel + Val Otter: Feasibility, Records, Comparison, Brief, Reports bubble.",
            "LOCKED 2026-08-27. Feasibility and Comparison are reports. Brief and Records are tools. Do not invent a fifth. Generate paths not opened.",
          ],
          [
            "Provenance vs strip",
            "P2: X-ray provenance is Layer | Source | Vintage | Confidence. Trust device.",
            "Q&A #2 item 9: strip sources/confidence from customer reports.",
            "X-ray and Flood keep the rebuilt four-column table. Other dumps (inspect mashup, chat paste) strip the raw table.",
          ],
          [
            "Drawn envelope",
            "P5: Free states approximate envelope as a number. Do not draw it. Drawing is the X-ray.",
            "Find wave: zoom, gold subject, show setbacks, open brief.",
            "Find may show setback facts. Free map does not paint the buildable polygon.",
          ],
          [
            "Valuation",
            "P7: land/improvement/market/assessed/exemptions blocked.",
            "04_faq: this is not a valuation tool.",
            "Do not implement. Leave the block off every surface.",
          ],
          [
            "RRC home",
            "Otter: wells + pipelines on the layers panel (planner backlog).",
            "P7: Site Constraints SECTION inside the X-ray. No third report SKU.",
            "W8 puts them in the X-ray. Layers-panel toggle stays parked.",
          ],
          [
            "Demo parcel",
            "03_demo_and_qa gold parcel 48021:34137 (908 Pine).",
            "P3 current exports 48021:34161 (905 Pecan). Q&A #2 used 48021:27479 (1308 Pecan).",
            "Refresh 03 when W4 grades. Do not silently retarget the gold demo.",
          ],
        ]}
      />

      <Callout tone="warning" title="Open blockers (do not build past)">
        1. Appraisal / valuation block. 2. SKU ruled; Feasibility and
        Comparison generate still not live (do not pitch). 3. Fourth-chat
        wall still unwalked. 4. Do not start W8 until P-89 refuse then P-90
        land. W9 is P-93 and may run now.
      </Callout>

      <H2>W0 Chrome restore (the last pass was wrong)</H2>
      <Text>
        #234 stacked right-rail docks on the left. Val: you conflated two
        things. Right rail (brief, chat, reports, properties, share, use-in-AI,
        compare) stays one-open, docks on the right. Only the four left map
        utilities stack, each in its own container. Brief docks right. Chris
        and Claude Design are later, not this wave.
      </Text>
      <Table
        headers={["ID", "Acceptance", "Check"]}
        rows={[
          [
            "W0.1",
            "Right rail is single-tenant. Open chat closes brief. Docks sit on the right.",
            "Live: open brief, then chat. Only chat. No left mashup.",
          ],
          [
            "W0.2",
            "Compare expand-wider works again.",
            "Live: Compare, expand, read both columns.",
          ],
          [
            "W0.3",
            "Brief bubble stays. Brief dock is on the right. Inspect facts live inside brief, not as a left overlay.",
            "Live 905 Pecan or 1308 Pecan: brief on the right, left bubbles still usable.",
          ],
          [
            "W0.4",
            "Brief is accordion. High-level first (address, zone, flood, lot). Special district, who serves, zoning are collapsed. Mobile is click-to-expand.",
            "Live + narrow viewport.",
          ],
          [
            "W0.5",
            "Left bubbles only: notifications, original createMapLegend, draw, layers. 34px. Draw and layers are separate panels.",
            "Live: open all four. No overlap. No invented second legend.",
          ],
          [
            "W0.6",
            "Dynamic height. One left panel open uses the column (no needless scroll). More open share height and can collapse-all.",
            "Live: layers-only vs all-four.",
          ],
          [
            "W0.7",
            "Map-pin notes: up to 10 colors, hover on the map shows the note text.",
            "Live: three notes on one lot, three colors, three hovers.",
          ],
        ]}
      />

      <H2>W1 Find</H2>
      <Table
        headers={["ID", "Acceptance", "Check"]}
        rows={[
          [
            "W1.1",
            "Suggest disambiguates like Google. 905 Pecan offers Street vs Drive and city. Never assumes one hit.",
            "Type 905 Pecan and 17000 Simsbrook. Multiple rows.",
          ],
          [
            "W1.2",
            "One click lands, gold subject, zoom to fill, setback facts, brief on the right. No second click.",
            "Pick from dropdown once.",
          ],
          [
            "W1.3",
            "History pick behaves as a fresh Find and shows the address, not the APN.",
            "Re-pick Hummingbird / prior row.",
          ],
          [
            "W1.4",
            "Bastrop Texas without a comma is a place. Dropdown labels city vs county.",
            "Enter Bastrop Texas. Rows say City / County.",
          ],
          [
            "W1.5",
            "Suggest is about one second. 10–15 seconds is a fail.",
            "Stopwatch on cold typeahead.",
          ],
          [
            "W1.6",
            "Lock the parcel, not the subdivision. Geocode-miss does not hover a neighborhood then 404.",
            "Pflugerville / Round Rock tagged data if ingest is the miss.",
          ],
          [
            "W1.7",
            "Units appear in suggest (1620 Bryant / 1904). Do not dock a PUD street over the whole PUD.",
            "1620 Bryant. Santera / Georgetown condo-contract PUDs stay per-lot.",
          ],
          [
            "W1.8",
            "1308 Pecan St Bastrop 48021:27479 is findable. Live miss was Guadalupe 48187:29690 or zero hits.",
            "1308 Pecan, 1308 Pecan st, 1308 Pecan Bastrop, 48021:27479.",
          ],
        ]}
      />

      <H2>W2 Share + W3 My properties + W5 Compare</H2>
      <Table
        headers={["ID", "Acceptance", "Check"]}
        rows={[
          ["W2.1", "Share lands the recipient on the property with notes. Shared analysis dock stays (not Brief).", "MET Nick 22:54Z on /share?g=…"],
          ["W2.2", "Free recipient reads shared reports and cannot generate until upgrade.", "Free account on a share URL."],
          ["W2.3", "Anonymous saves survive sign-in / upgrade.", "Save as anon, sign in, still there."],
          ["W2.4", "Every PDF carries a live-view link at the top.", "Open a generated Flood or X-ray PDF."],
          ["W2.5", "In-app PDF viewer (especially mobile) instead of download-only.", "Fix live e2b432e. Confirm 927 Main Flood sheet paints."],
          ["W2.6", "Reports bubble has My reports | Shared with me. Not a new surface.", "Right-rail reports tool."],
          ["W3.1", "Property notes persist. Export/share can include or exclude notes.", "Write, leave, return. Share picker."],
          ["W3.2", "First report on an unsaved parcel auto-saves the property and files the report there and in Reports.", "MET Nick 23:13Z. 927 Main Flood saved the property."],
          ["W3.3", "Share on the property: title / agent / builder / architect / other, default message, overwrite, Copy link. Dark persona menu. No Gmail send.", "MET Nick 22:54Z"],
          ["W3.4", "Replace Export X-ray PDF as the only row action with add/exclude reports. Keep save current drawings.", "Property row."],
          ["W3.5", "Saved chats: markdown cleaned (bold, no em dashes), collapsed by date, one open.", "MET Nick 23:13Z. Expands and contracts in the property area."],
          ["W3.6", "Status researching / offer / pass stays. Pass does not auto-delete. Stars: gray pass, gold researching.", "MET Nick 23:13Z. Pass does not delete."],
          ["W5.1", "Compare shows existing notes and allows adding a note.", "A vs B with a note on A."],
          ["W5.2", "Click B opens that property in My properties; compare collapses; pair is still there on return.", "A vs B, click B, reopen Compare."],
        ]}
      />

      <H2>W4 Report honesty + offer P0–P3</H2>
      <Callout tone="warning" title="P0 is the highest report change">
        Three-way blank: world-fact absent is named on the page; user content
        absent is omitted silently; pipeline output absent (verdict, brief
        facts) hard-fails the export. Never generate a hollow X-ray. An
        honest miss earns trust. A pipeline error wearing that costume
        destroys the real misses. Report P0 live before P1 starts.
      </Callout>
      <Table
        headers={["ID", "Acceptance", "Check"]}
        rows={[
          [
            "W4.P0",
            "Hollow X-ray is blocked. Verdict/brief-facts missing = in-app error, no PDF. Owner notes / AI summary omitted if empty. World misses named.",
            "Force a missing-verdict parcel. Confirm no PDF bytes. Force missing notes: no UNAVAILABLE row.",
          ],
          [
            "W4.P1",
            "X-ray cover is a flood-study-shaped verdict: ≤3 headline metrics, 3–5 sentence briefing, dated. Own content is the bulk. Site plan is one appended sheet.",
            "Export 48021:34161 after P0 is green.",
          ],
          [
            "W4.P2",
            "Provenance is Layer | Source | Vintage | Confidence. Slugs become dates. No asserted. No txgio-parcel, bastrop-per-parcel, zoning-fact atom, pysheds.",
            "Read the table on the live PDF.",
          ],
          [
            "W4.P3a",
            "Contour interval agrees (legend vs provenance). Elevation feet primary. Drop orthometric. One packet ID. Local date, not Zulu. No black UNAVAILABLE chips on aerials.",
            "Site plan + X-ray bound together.",
          ],
          [
            "W4.P3b",
            "Flood zone X vs flood-study non-determination gets one reconciling line.",
            "Same packet, both sheets.",
          ],
          [
            "W4.Q4",
            "Flood PDF drawing carries the flow lines and ponding the on-map study showed. Re-run does not wander or drop ponding.",
            "1308 Pecan / 905 Pecan flood run vs PDF drawing.",
          ],
          [
            "W4.Q6",
            "X-ray titles the address, not PARCEL … NO ADDRESS.",
            "PDF cover + footer.",
          ],
          [
            "W4.Q11",
            "Studio reports are reachable for a Studio account. Hoffman lock is a grade, not a guess.",
            "Signed-in Studio session.",
          ],
          [
            "W4.REC",
            "Records unreachable is an auth defect (coordinate P-85). CAD probe and courthouse request stay separate verbs.",
            "Do not merge them. Do not open a parallel records lane.",
          ],
          [
            "W4.ZON",
            "Zoning brief does not dump the user on an unexpected site.",
            "Q&A #2 item 7 replay.",
          ],
        ]}
      />

      <H2>Stripe live path (handed off 2026-08-28)</H2>
      <Callout tone="warning" title="Other agent owns this. Do not start from this canvas.">
        Nick handed Stripe to another agent 2026-08-28. This seat does not
        walk A1-A4 or flip live keys. Sandbox catalog is already built
        (monthly 49 / 129 / 299+25, annual 490 / 1290 / 2990, unlock 15).
        Cortex has the eight test price IDs. A live key does not exist.
        Decision 2026-08-24 still binds: leftovers first, then key swap.
      </Callout>
      <Table
        headers={["Phase", "What", "Who", "Pass looks like"]}
        rows={[
          [
            "A1",
            "Monthly Team, 12 seats, Start Team",
            "Other agent + Nick signed-in + test card 4242",
            "Popup shows $349 (299 + 2×25). Pay completes. Entitlement is Team. Back-to-cart still there.",
          ],
          [
            "A2",
            "Unlock this property, 30 days",
            "Other agent + Nick on a locked parcel",
            "$15 Payment Element. No payment error. Webhook writes 30-day unlock. Parcel opens.",
          ],
          [
            "A3",
            "Wallets on the same Element",
            "Other agent + Nick + Stripe test wallets",
            "Cash App shows a QR or an honest decline. Apple Pay / Link same rule. Never a silent white error.",
          ],
          [
            "A4",
            "Monthly vs annual session",
            "Other agent + Nick after A1",
            "Plans Monthly + Start Studio charges 129/mo, not 1290/yr. Annual Team at 12 seats is honest refuse or cap-at-10 copy, never 2990 for 12.",
          ],
          [
            "B1",
            "Stripe live account",
            "Nick only",
            "Business profile, bank / payouts, live products named Smart Site Solo / Studio / Team, zero Hauska strings, wallets enabled.",
          ],
          [
            "B2",
            "Key + price-ID swap",
            "Other agent after B1. Not this canvas.",
            "sk_live / pk_live / live webhook secret + eight live price IDs on serving cortex. PE publishable key matches. Revision read by field name.",
          ],
          [
            "B3",
            "First real money",
            "Nick + other agent",
            "One live $15 unlock or Solo, webhook grants, then refund if it was a probe. Collateral 02 flips off sandbox-only.",
          ],
        ]}
        framed
        striped
      />
      <Callout tone="info" title="Already true, do not rebuild">
        Checkout is the pricing popup (elements), not checkout.stripe.com.
        Interval is required on the PE body. Annual Team extra seats cannot
        mix in one Stripe session. P-85 Records is inside Studio, no new
        price. Team invite / dunning / Customer Portal stay a later card.
        Hosted-kill and the 404 install-scoped fallback are leave-behinds,
        not this card unless they fire on A1.
      </Callout>

      <H2>W6 Hoffman + W7 offer panel (P4–P6)</H2>
      <Callout tone="info" title="Plans first paint is Monthly (amendment 1)">
        W7 signed-out: Reports is sign-in first. No Coming soon and no
        10/12 meter on the body. Records and Brief stay Tools. Team
        seats live in the Team column. 12-seat checkout, wallets, and
        unlock error are on the other agent. Do not start them here.
      </Callout>
      <Table
        headers={["ID", "Acceptance", "Check"]}
        rows={[
          ["W6.1", "Team 12 seats: copy and checkout match 02 ($299 to 10, then $25/seat). Not $45 leftover math.", "Pricing popup + checkout."],
          ["W6.2", "Plans lands Monthly. Annual amounts stay $490 / $1,290 / $2,990. 10 × monthly lives on the Team column. No header 2 months free chip.", "First paint Monthly (2026-08-27)."],
          ["W6.3", "Back-to-cart / change-seats exists on checkout.", "Team checkout."],
          ["W6.4", "ICC I-Code ingest-hold line is gone from the purchase surface.", "Scan copy."],
          ["W6.5", "One-parcel unlock payment error is gone.", "Unlock this property, 30 days."],
          ["W6.6", "Add-card box scrolls to the bottom. Cash App / wallets show QR or an honest decline.", "Checkout card + wallets."],
          ["W7.1", "Coming soon rows removed from the purchase surface. 10 ready of 12 meter gone. Address + freshness line instead.", "Reports panel."],
          ["W7.2", "Six export rows collapse to Site plan (PDF, DXF, IFC) and Terrain (DXF, IFC, GLB).", "Reports panel."],
          ["W7.3", "Two states only: a verb (Open / Download / Export) or a lock chip with tier and price (Studio, $129/mo).", "Every row."],
          ["W7.4", "Packages renamed to reports and exports. DOCUMENT dropdown duplicate removed. Jargon line removed.", "Copy scan."],
          ["W7.5", "Free: approximate envelope number + cited setback rule. Envelope not drawn. Drawn envelope is the X-ray.", "Anon inspect."],
          ["W7.6", "Studio copy is a different verb (the packet you hand to someone else), not a longer Solo list.", "Pricing popup."],
          ["W7.7", "Solo comparison surfaces at the second property unlock this week, not the first. Fact, not nag.", "Second unlock."],
          ["W7.8", "One unlock flow for every gated field. Honest-miss chips never upsell. CTA names: Start Solo / Studio / Team. Unlock this property, 30 days. Share landing is inspect-adjacent.", "Click every lock."],
          ["W7.9", "Fourth chat names the loss, then one unlock. No 3 of 3 chats used.", "Fourth chat on a free parcel."],
          ["W7.10", "De-emphasise top-level Pricing as the primary conversion path.", "Lander / nav."],
        ]}
      />

      <H2>W8 Ingest placement (P7) and W9 kit</H2>
      <Table
        headers={["ID", "Acceptance", "Check"]}
        rows={[
          ["W8.1", "RRC wells, pipelines, rail, utility easements, soils, drainage, road node are a Site Constraints section inside the X-ray. No third report SKU.", "X-ray after P1."],
          ["W8.2", "Beds / baths / rooms only in Structure, only when a structure exists, never on the free headline, never next to appraisal.", "Free card + X-ray."],
          ["W8.3", "Mailing addresses suppressed in share views and exports.", "Share link + PDF."],
          ["W8.4", "No raw CAD field names on any customer surface.", "Copy grep."],
          ["W9.1", "pe-tokens.css is the only kit. Aug 3 DESIGN_SYSTEM_BRIEF and docs/smart-site-brand stamped HISTORICAL.", "File header."],
          ["W9.2", "Components: Button (exists), Card, Dock, Input, StatusChip, Modal. Touched surfaces import them.", "src/components count."],
          ["W9.3", "ESLint: no raw hex in chrome tsx except named islands (map overlay, print gold, Stripe). New raw button in chrome fails CI.", "Violate the rule, watch CI fail."],
        ]}
      />

      <Divider />

      <H2>Parked long-term (on the canvas, not in a wave)</H2>
      <Text tone="secondary" size="small">
        Specified as later. Visible so they do not vanish. No agent builds
        these in this program.
      </Text>
      <Table
        headers={["Item", "Why parked", "Home later"]}
        rows={[
          ["Claude connector directory filing (P-88 item 21)", "Item 20 probe passed. Operator: finish QA waves + connector polish first.", "smartsite-mcp/directory/ drafts only"],
          ["Gmail-from-export", "Val: future edition.", "Share / affiliate"],
          ["Smart Files upload / note attachments", "Val: down the road.", "Smart Files"],
          ["Ida affiliate /ida and send-to-title", "Not baked. Affiliate rail when it is on.", "GTM"],
          ["Nationwide state / county / city fly-to and Texas-on-load highlight", "New ingest path. Central Texas launch can wait.", "Find / ingest"],
          ["A-la-carte water report SKU", "Ruled no. Five purchase options already. Studio+ only.", "Do not reopen"],
          ["ETJ on/off on the layers panel", "Planner backlog, not this UI card.", "Layers"],
          ["RRC wells + pipelines as layer toggles", "W8 puts them in the X-ray. Map toggles later.", "Layers"],
          ["Full CAD detail audit + ingest plan", "Planner session. Quantity, not this chrome card.", "Factory"],
          ["Abandoned-easement chat re-probe", "P-85 follow-on. Records + chat, not a new SKU.", "P-85"],
          ["Claude Design flyout / example questions under Use in AI", "Chris later. Not remediation.", "Use in AI"],
          ["Chris visual pass on bubbles", "Functional first.", "Chrome polish"],
          ["AI chat voice / quality", "Context already a plus. Leave 11.", "Chat"],
          ["Status change from Compare", "Val: maybe too much.", "Compare"],
          ["Highlight-all-saved / prev-next saved parcels / OSM extra layers if expensive", "Stars are enough. Extra layers only if cheap (then a tiny later card).", "Map"],
        ]}
      />

      <Divider />

      <CollapsibleSection title="Original design-system diagnosis (still true)" defaultOpen={false} count={3}>
        <Stack gap={16}>
          <Callout tone="warning" title="The mechanism">
            Color values were retargeted. The write path was not. Every
            surface still owns a local ACCENT / MUTED / AMBER / TEXT /
            CARD_BG block and paints with inline style. New work copies that
            block. A token file plus one Button cannot win against 450
            inline style sites.
          </Callout>
          <Grid columns={4} gap={12}>
            <Stat value="1" label="Component in src/components" />
            <Stat value="6" label="Files that import Button" />
            <Stat value="53" label="Native button sites" />
            <Stat value="~450" label="style sites in src" />
          </Grid>
          <Table
            headers={["Surface", "Tokens", "Button", "Kit", "What you still see"]}
            rows={[
              ["Inspect card", "yes", "yes", "partial", "Reference. Still 40 inline styles. Invented --semantic-not-applicable."],
              ["Map corner badge", "yes", "n/a", "yes", "Gold as mark. Cleanest chrome."],
              ["Find bar", "yes", "yes", "partial", "Find uses Button. Dropdown rows are ad-hoc."],
              ["Pricing modal", "mixed", "yes", "no", "Own CARD_BG / TEXT. Radius 16 vs card 8."],
              ["Workbench shell", "yes", "no", "no", "Native bubble buttons. Active paints ACCENT by hand."],
              ["AI chat", "yes", "no", "no", "17 native buttons. AtomChip unused."],
              ["Share / properties / compare", "yes", "no", "no", "Native ACCENT CTAs."],
              ["X-ray print HTML", "no", "n/a", "no", "Named island. Gold print accent. Do not restyle in W0."],
              ["Stripe checkout", "no", "n/a", "no", "Named island. Night / Inter."],
              ["Map overlays", "island", "n/a", "n/a", "Search-highlight cyan is intentional."],
            ]}
          />
          <Callout tone="neutral" title="What not to do">
            Do not import the SmartCity kit. Do not reload Oxygen. Do not
            make gold a button again. Do not restyle the map taxonomy. Do
            not ask Claude Design to invent a second token file.
          </Callout>
        </Stack>
      </CollapsibleSection>

      <Row gap={8} wrap>
        <Pill tone="neutral">Sources: Otter 2026-08-27 · Q&A #2 PDF · report/offer P0–P7</Pill>
        <Pill tone="neutral">Register: 01 positioning · 02 pricing · 03 demo · 04 faq · 05 glossary</Pill>
        <Pill tone="warning">QA hold until in-wave items are live</Pill>
      </Row>
    </Stack>
  );
}
