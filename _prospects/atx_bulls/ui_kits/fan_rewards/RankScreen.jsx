const { Tabs, LeaderboardRow, Panel, Tag } = window.ATXBullsDesignSystem_a4b13b;

function RankScreen({ board }) {
  const [tab, setTab] = React.useState("Season");
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 18, padding: "0 18px 28px" }}>
      <h1 style={{ fontSize: 46 }}>Standings</h1>
      <Tabs items={["Season", "Game day", "Friends"]} active={tab} onChange={setTab} />
      <Panel padding={20}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, fontFamily: "var(--font-ui)", fontWeight: 800, fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--orange)" }}>
          <span style={{ width: 24, height: 3, background: "currentColor" }} />Your rank
        </div>
        <div style={{ display: "flex", alignItems: "flex-end", gap: 12, marginTop: 6 }}>
          <span style={{ fontFamily: "var(--font-display)", fontSize: 68, lineHeight: 0.86, letterSpacing: "-0.06em", color: "var(--orange)" }}>5</span>
          <span style={{ paddingBottom: 10, fontFamily: "var(--font-ui)", fontWeight: 800, fontSize: 11, letterSpacing: "0.17em", textTransform: "uppercase", color: "var(--muted)" }}>of 8,412 fans</span>
        </div>
        <Tag tone="orange" style={{ marginTop: 12 }}>Up 3 this week</Tag>
      </Panel>
      <Panel padding={0}>
        {board.map((r, i) => <LeaderboardRow key={r.rank} {...r} style={i === board.length - 1 ? { borderBottom: "none" } : null} />)}
      </Panel>
    </div>
  );
}
Object.assign(window, { RankScreen });
