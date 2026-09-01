import {
  Callout,
  Card,
  CardBody,
  CardHeader,
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
  "2026-08-28T18:55-05 · SALVAGED. Worker closing with P-94 chat. Remainder: _inbox/2026-08-28_property_seat_canvas_salvage.md";

export default function PropertySeatBoard() {
  return (
    <Stack gap={20}>
      <Stack gap={6}>
        <H1>Property seat — consolidated board</H1>
        <Text tone="secondary" size="small">
          {SNAPSHOT}
        </Text>
      </Stack>

      <Callout tone="warning" title="This canvas is salvaged. The worker is closing.">
        Remainder lives in doc_repo at
        _inbox/2026-08-28_property_seat_canvas_salvage.md. Byte copies under
        _inbox/canvas_salvage/. A fresh agent reads the salvage, not this
        worker.
      </Callout>

      <Callout tone="warning" title="This checkout is not a property worktree">
        Hook and seat register: integration on P:/doc_repo main. Property
        product writes go to isolated trees from origin/main. Do not write
        P:/seat-worktrees/property/* dirty checkouts, P:/hauska-map, substrate
        MCP #74, the ICC-meter tree, or the Stripe agent checkout.
      </Callout>

      <Grid columns={4} gap={12}>
        <Stat value="P-89" label="Refresh live. Download leftover." tone="warning" />
        <Stat value="21 / 5" label="Hex / buttons after chrome convert" />
        <Stat value="P-94" label="Row added. Tree uncommitted." tone="warning" />
        <Stat value="W8" label="Queued. After live X-ray PDFs." />
      </Grid>

      <H2>Last 24 hours of canvases</H2>
      <Text tone="secondary" size="small">
        Six canvases were written or touched since 2026-08-27 17:19 local.
        Only the QA chrome board and the P-89 deploy claim travel onto this
        seat. The other four stay linked so they are not silently dropped.
      </Text>
      <Table
        headers={["Canvas", "Written", "Applies here", "Disposition"]}
        rows={[
          [
            "smartsite-design-system-gap",
            "2026-08-28 17:12",
            "Yes. Predecessor QA board.",
            "Superseded by this file. Closed waves stay closed. Leftovers become the four cards.",
          ],
          [
            "smartsite-ai-connector-finish",
            "2026-08-28 11:33",
            "P-89 deploy claim only.",
            "Claim held 2026-08-28T22:26Z. Serving 00084-mof / p89-1ae9f28 / digest 58f5fb3a @100%. No redeploy.",
          ],
          [
            "smartsite-mcp-app",
            "2026-08-28 17:19",
            "Ruling B only.",
            "P-87 / P-91 / P-92 stay off this board. O1 envelope refuse (atom_path_pending / not-derived) binds P-90 when that card starts.",
          ],
          [
            "p85-records-request",
            "2026-08-27 20:13",
            "No.",
            "P-85 is another lane. Do not start. Team membership is not Records.",
          ],
          [
            "factory-and-texas-complete",
            "2026-08-28 01:09",
            "No.",
            "OPS-19 / Factory. Other planner. Do not start F- rows from here.",
          ],
          [
            "county-manifest",
            "2026-08-28 01:08",
            "No.",
            "Factory manifest. Other planner.",
          ],
        ]}
        framed
        striped
        columnAlign={["left", "left", "left", "left"]}
      />

      <H2>What this seat owns now</H2>
      <Table
        headers={["Card", "Gate", "Repo", "Status", "Agent"]}
        rows={[
          [
            "1 · P-89 customer-done",
            "Serving already 00084-mof. No redeploy.",
            "hauska-mcp-server serving only",
            "Refresh 422 MET live. Item 3 download NOT MET. Close _inbox/2026-08-28_p89_serving_close.json.",
            "Done. Do not start P-90.",
          ],
          [
            "3 · P-93 chrome debt",
            "Parallel with card 1. Not W8.",
            "P:/tmp/hauska-map-p93-chrome-debt main 496f21b",
            "87→21 hex, 60→5 buttons. #294 squash 5fa74c15. Live dpl_7nbUVXLMi7sbGa5p5u4iG5zg5t8S aliased smartsite.cloud. Bundle index-BZZjHM_5.js.",
            "Live. Grade is hard-refresh.",
          ],
          [
            "Team server half · P-94",
            "A-048 added the row. PR + 0089 + cortex deploy in the owning chat.",
            "P:/tmp/legacy-design-tools-team-roster feat/pe-team-roster 89e539f6",
            "GET/POST/DELETE/PATCH match the client. 19/19 violates. Live Team still omits seatsPurchased until Stripe writes the column. Accept-invite not built.",
            "Owning chat. Do not start a second writer.",
          ],
          [
            "2 · P-90 engine PDF",
            "After card 1 live refuse. WDLL + Nick go + compiled dispatch.",
            "hauska-engine only",
            "WDLL drafted. Not approved. Not started.",
            "Do not fan",
          ],
          [
            "4 · W8 Site Constraints",
            "After card 2 customer-done on live X-ray PDFs.",
            "hauska-map and/or engine",
            "QA item 41. Do not absorb into chrome.",
            "Do not fan",
          ],
        ]}
        framed
        striped
      />

      <TodoListCard
        defaultExpanded
        todos={[
          {
            id: "p89",
            content:
              "Card 1 graded: 00084-mof serving. Refresh 422 live. Download leftover (27479 streamed; 34137 missing still GET /download). Do not start P-90.",
            status: "completed",
          },
          {
            id: "chrome",
            content:
              "Card 3 live: #294 5fa74c15 dpl_7nbUVXLMi7sbGa5p5u4iG5zg5t8S bundle index-BZZjHM_5.js on smartsite.cloud. 21/5 leftovers named.",
            status: "completed",
          },
          {
            id: "team",
            content:
              "P-94 is in OPS-16 (A-048). Tree still uncommitted. Owning chat: PR, apply 0089, deploy cortex. Invite waits on Stripe writing seats_purchased. Accept-invite leftover.",
            status: "in_progress",
          },
          {
            id: "p90",
            content:
              "Card 2: WDLL drafted. Wait for P-89 live refuse + Nick approval + compiled P-90 dispatch.",
            status: "pending",
          },
          {
            id: "w8",
            content:
              "Card 4: W8 Site Constraints. Do not start until live X-ray PDFs are honest.",
            status: "pending",
          },
        ]}
      />

      <Grid columns={2} gap={12}>
        <Card>
          <CardHeader trailing={<Pill tone="warning">Not customer-done</Pill>}>
            Card 1 — P-89 serving graded
          </CardHeader>
          <CardBody>
            <Stack gap={8}>
              <Text>
                Serving is hauska-mcp-server-00084-mof at 100 percent, tag
                p89-1ae9f28, digest sha256:58f5fb3a… Request log lines name
                that revision. The 01:17Z claim held. No redeploy.
              </Text>
              <Text>
                Refresh refuses are live 422 pipeline_output_absent: no
                verdict (ad16a103), placeholder (7a1af82f), brief null
                (c8ff00b3). No %PDF. No engine /refresh on those lines.
              </Text>
              <Text>
                Download is the leftover. 48021:27479 streamed a 606503-byte
                %PDF-1.7 dated 2026-08-26T22:40Z and issued engine GET
                /download 200 (6c636888). 48021:34137 has no artifact and
                still issued GET /download then 404 (65e78f9c).
                isStoredDossierArtifactHollow(undefined) returns false, so a
                missing pdf-dossier row is treated as not hollow.
              </Text>
              <Text tone="secondary" size="small">
                Planner split: 34137 is a P-89 hole (absent artifact still
                hits the engine). 27479 content (NO ADDRESS / UNAVAILABLE)
                is P-90 unless the stored metadata is actually
                verdictIncluded false or briefFactCount 0, which the logs
                did not carry. Do not compile P-90 from a narrated pass.
              </Text>
            </Stack>
          </CardBody>
        </Card>

        <Card>
          <CardHeader trailing={<Pill tone="success">Live</Pill>}>
            Card 3 — chrome debt on smartsite.cloud
          </CardHeader>
          <CardBody>
            <Stack gap={8}>
              <Text>
                Isolated clone P:/tmp/hauska-map-p93-chrome-debt at 496f21b
                (descendant of 0e4dc5c). 35 files, minus 76 lines net.
                pe-chrome-kit-gate.mjs and src/checkout/ are untouched.
                Baseline regenerated 37 to 8 files.
              </Text>
              <Text>
                Named leftovers: MapLibre cyan, FEMA/hydro, Google and
                Microsoft brand hexes, InspectCard #a78bfa, kit Button
                primitive, four ss-bubble rail circles. Honest. Not a
                silent baseline wipe.
              </Text>
              <Text tone="secondary" size="small">
                Shipped. #294 squash 5fa74c15. Prod
                dpl_7nbUVXLMi7sbGa5p5u4iG5zg5t8S aliased smartsite.cloud.
                Live GET Age 0 Last-Modified 2026-08-28T22:45:17Z bundle
                index-BZZjHM_5.js. Hard-refresh paints Find, rail, gold
                mark.
              </Text>
            </Stack>
          </CardBody>
        </Card>
      </Grid>

      <Card>
          <CardHeader trailing={<Pill tone="warning">P-94 · uncommitted</Pill>}>
          Team server half — row added
        </CardHeader>
        <CardBody>
          <Stack gap={10}>
            <Text>
              Settings Team tab shipped against an endpoint that does not
              exist. Client parses this shape. Build to it. Seat
              enforcement is the server, not the client. An invitation
              holds a seat when sent. Last joined owner cannot be removed
              or demoted. Two roles only: owner and member.
            </Text>
            <Table
              headers={["Verb", "Path", "Body / note"]}
              rows={[
                [
                  "GET",
                  "/api/property-explorer/v1/team/members",
                  "members[], seatsPurchased number or absent, viewerEmail, viewerRole. Never 0 for unknown.",
                ],
                [
                  "POST",
                  ".../team/invitations",
                  "{ email, role }. Refuse over capacity with a named error. No silent cap.",
                ],
                ["DELETE", ".../team/invitations/:id", "Release the held seat."],
                [
                  "DELETE",
                  ".../team/members/:email",
                  "Refuse if the row is the last joined owner.",
                ],
                [
                  "PATCH",
                  ".../team/members/:email",
                  "{ role }. Same last-owner refuse. Drop unknown roles; do not send them.",
                ],
              ]}
              framed
            />
            <Text tone="secondary" size="small">
              Tree P:/tmp/legacy-design-tools-team-roster. 19/19 violates
              against the table. seatsPurchased omitted unless tier is
              team and the column is a number. Stripe webhook still does
              not write that column. Accept-invite is not built: an
              invited email who signs in becomes owner of a new account.
              OPS-16 A-048 added P-94. Paste the go prompt into the
              owning Team-roster chat. Do not open a second writer on
              this tree.
            </Text>
          </Stack>
        </CardBody>
      </Card>

      <H2>Waiting on a gate</H2>
      <Table
        headers={["Card", "Depends on", "WDLL", "What must be true first"]}
        rows={[
          [
            "P-90 engine PDF",
            "Card 1 live refuse",
            "_inbox/2026-08-28_p90_engine_pdf_WDLL.md (draft)",
            "Nick approves the WDLL. Then compile node scripts/dispatch.mjs --plan OPS-16 --lane <ID> --plan-row P-90. Isolated hauska-engine from origin/main. Ruling B: X-ray refuses buildable envelope the same way get_smart_site does.",
          ],
          [
            "W8 Site Constraints",
            "P-90 customer-done on live X-ray PDFs",
            "Not written",
            "QA 41: Site Constraints in X-ray; structure-only beds/baths; mailing suppressed; no raw CAD names. Valuation absent.",
          ],
        ]}
      />

      <H2>Already MET. Do not reopen.</H2>
      <Table
        headers={["Wave / row", "Evidence"]}
        rows={[
          ["W0 chrome", "Right rail single-tenant. Left stack only."],
          ["W1 Find", "Nick 23:46Z leftovers walked."],
          [
            "W2 PE viewer",
            "pdf.js on hauska-map #266 b32d988. Native embed retired.",
          ],
          ["W3 My properties", "First Flood saves. Chat collapse. Pass keeps."],
          ["W4.P0 PE click refuse", "Costume until P-89 serving refuse."],
          ["W5 Compare", "Notes + pair survive."],
          ["W6 first paint", "Monthly. Seats in Team column. Stripe leftovers handed off."],
          ["W7 signed-out offer", "#241. Sign-in first. No Coming soon."],
          [
            "W9 kit gate",
            "P-93 #291 0e4dc5c. Prod dpl_J6Liza2UFgYYpzDXZAwSgmtrXBwN.",
          ],
          [
            "P-89 code",
            "hauska-mcp-server #77 1ae9f287feb2660730e338841aa79e59df0ad772. 26/26 violate tests. Later hand-carry found no delta.",
          ],
        ]}
      />

      <H2>Hard out of scope</H2>
      <Table
        headers={["Item", "Owner / why"]}
        rows={[
          ["Stripe leftovers + live-key swap", "Other agent, in flight. Do not start a second lane."],
          ["Hauska MCP code / second P-89 PR", "Merged. Serving + refuse only."],
          ["P-87 / P-91 / P-92 MCP App", "Other canvas. Other lane."],
          ["Factory / OPS-19 / F- rows", "Other planner."],
          ["P-85 Records", "Other lane. Item 21 Claude directory parked."],
          ["P-32 assembler", "Do not start."],
          ["Valuation", "Blocked. Leave it off every surface."],
          ["Feasibility or Comparison generate", "Reports, not live. Do not pitch."],
          ["src/checkout / Stripe tree", "Named island. Other agent dirty."],
        ]}
      />

      <Callout tone="info" title="SKU lock">
        Live generate: X-ray and Flood. Feasibility is a report, not live
        generate. Comparison is a report and a tool. Brief and Records are
        tools. Site plan and terrain are exports. Do not invent SKUs.
      </Callout>

      <Divider />

      <CollapsibleSection
        title="Closed-wave detail (kept so this file stands alone)"
        defaultOpen={false}
        count={10}
      >
        <Stack gap={10}>
          <Text tone="secondary" size="small">
            Copied from the QA gap canvas so a reader of this board only
            does not lose the closed acceptance. Not a new card.
          </Text>
          <Table
            headers={["ID", "Acceptance", "Grade"]}
            rows={[
              ["W0.1–W0.7", "Rail, Compare, brief accordion, left bubbles, note colors.", "MET"],
              ["W1.1–W1.8", "Find disambiguate, land, history, 1308 Pecan.", "MET"],
              ["W2.1–W2.3 W2.5 W2.6", "Share land, free-read, anon-survive, pdf.js, Shared with me.", "MET"],
              ["W2.4", "Live-view printed on PDF bytes.", "P-90"],
              ["W3.1–W3.6", "Notes, auto-save, share personas, chats, pass.", "MET"],
              ["W4.P0 PE", "Click path refuses hollow X-ray.", "MET as costume until MCP serving refuse"],
              ["W5.1–W5.2", "Compare notes; click B survives.", "MET"],
              ["W7 signed-out", "Sign-in first. No Coming soon.", "MET"],
              ["W9.1–W9.3", "Kit freeze + ratchet.", "MET. Debt is card 3."],
              ["W6 leftovers", "12-seat, wallets, unlock, live keys.", "Other agent"],
            ]}
          />
        </Stack>
      </CollapsibleSection>

      <Row gap={8} wrap>
        <Pill tone="neutral">Seat: integration on main · acting as property closer</Pill>
        <Pill tone="neutral">Plan: OPS-16 A-044 P-89/P-90 · A-047 P-93 · A-048 P-94</Pill>
        <Pill tone="warning">P-94 PR + 0089 + cortex still owed</Pill>
        <Pill tone="neutral">Predecessor: smartsite-design-system-gap</Pill>
      </Row>
    </Stack>
  );
}
