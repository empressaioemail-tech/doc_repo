const { TicketStub, Panel, Button, Tag, Icon, ProgressBar } = window.ATXBullsDesignSystem_a4b13b;

function GameDayScreen({ checkedIn, onCheckIn }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 18, padding: "0 18px 28px" }}>
      <h1 style={{ fontSize: 46 }}>Game day</h1>
      <TicketStub matchup="Bulls vs. Rattlers" date="Mar 20" time="7:00 PM" venue="Austin, Texas" section="112" row="F" seat="7" />

      <Panel variant={checkedIn ? "panel" : "orange"} chamfer={!checkedIn} padding={20}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, fontFamily: "var(--font-ui)", fontWeight: 800, fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase", color: checkedIn ? "var(--muted)" : "var(--ink)" }}>
          <span style={{ width: 24, height: 3, background: "currentColor" }} />{checkedIn ? "Checked in · 6:12 PM" : "Doors open 5:30 PM"}
        </div>
        <h3 style={{ marginTop: 10, fontSize: 34, color: checkedIn ? "var(--bone)" : "var(--ink)" }}>{checkedIn ? "You're in." : "Check in at the gate"}</h3>
        <p style={{ margin: "10px 0 18px", fontFamily: "var(--font-ui)", fontWeight: 700, fontSize: 13, letterSpacing: "0.1em", lineHeight: 1.35, textTransform: "uppercase", color: checkedIn ? "var(--lede)" : "var(--ink)" }}>
          {checkedIn ? "250 points added. Streak extended to four games." : "Scan at any entrance to bank 250 points and keep your streak alive."}
        </p>
        {checkedIn ? <Tag tone="orange">+250 points</Tag> : <Button variant="ink" full size="lg" onClick={onCheckIn}>Check in</Button>}
      </Panel>

      <Panel padding={0}>
        {[["clock", "Doors open", "5:30 PM"], ["map-pin", "Entrance", "Gate C · Level 1"], ["car", "Parking", "Garage 2, prepaid"], ["shirt", "Dress code", "Blackout"]].map(([ic, k, v], i, a) => (
          <div key={k} style={{ display: "flex", alignItems: "center", gap: 14, padding: "15px 18px", borderBottom: i === a.length - 1 ? "none" : "1px solid var(--line)" }}>
            <Icon name={ic} size={17} style={{ color: "var(--orange)" }} />
            <span style={{ flex: 1, fontFamily: "var(--font-ui)", fontWeight: 800, fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--muted)" }}>{k}</span>
            <span style={{ fontFamily: "var(--font-ui)", fontWeight: 900, fontSize: 15, letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--bone)" }}>{v}</span>
          </div>
        ))}
      </Panel>

      <Panel padding={20}>
        <ProgressBar value={2} max={3} label="Attend three straight" caption="2 / 3" />
        <p style={{ margin: "12px 0 0", fontFamily: "var(--font-ui)", fontWeight: 700, fontSize: 11, letterSpacing: "0.17em", textTransform: "uppercase", color: "var(--muted)" }}>One more home game and 1,000 points land.</p>
      </Panel>
    </div>
  );
}
Object.assign(window, { GameDayScreen });
