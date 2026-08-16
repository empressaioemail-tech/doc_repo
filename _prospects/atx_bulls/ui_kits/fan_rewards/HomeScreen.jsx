const { PointsMeter, ChallengeRow, Panel, Tag, Button, TextLink, Icon, Ticker, RewardCard } = window.ATXBullsDesignSystem_a4b13b;

function HomeScreen({ fan, challenges, onGoRewards, onGoGameDay }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 18, padding: "0 0 28px" }}>
      <div style={{ padding: "0 18px" }}>
        <PointsMeter points={fan.points} tier={fan.tier} nextTier={fan.nextTier} toNext={fan.toNext} />
      </div>

      <div style={{ padding: "0 18px" }}>
        <Panel variant="orange" chamfer padding={18} interactive onClick={onGoGameDay}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 14 }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 10, fontFamily: "var(--font-ui)", fontWeight: 800, fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--ink)" }}>
                <span style={{ width: 24, height: 3, background: "currentColor" }} />Next game · 12 days
              </div>
              <h3 style={{ marginTop: 8, fontSize: 32, color: "var(--ink)" }}>Bulls vs. Rattlers</h3>
              <div style={{ marginTop: 6, fontFamily: "var(--font-ui)", fontWeight: 800, fontSize: 10, letterSpacing: "0.17em", textTransform: "uppercase", color: "var(--ink)" }}>Mar 20 · Doors 5:30 PM · Kickoff 7:00 PM</div>
            </div>
            <Icon name="arrow-up-right" size={22} style={{ color: "var(--ink)" }} />
          </div>
        </Panel>
      </div>

      <div style={{ padding: "0 18px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
        <h2 style={{ fontSize: 30 }}>Earn this week</h2>
        <Tag tone="orange">{fan.streak} game streak</Tag>
      </div>
      <div style={{ padding: "0 18px", display: "flex", flexDirection: "column", gap: 12 }}>
        {challenges.map((c) => <ChallengeRow key={c.title} {...c} />)}
      </div>

      <Ticker items={["HORNS UP", "HARD HITS", "HEART OF TEXAS"]} speed={18} />

      <div style={{ padding: "0 18px", display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 12 }}>
        <h2 style={{ fontSize: 30 }}>Spend your points</h2>
        <TextLink onClick={onGoRewards} gap={14} style={{ fontSize: 11 }}>All rewards</TextLink>
      </div>
      <div style={{ padding: "0 18px" }}>
        <RewardCard category="Experience" title="Sideline warmup pass" cost={4000} flag="Limited" onRedeem={onGoRewards} />
      </div>
    </div>
  );
}
Object.assign(window, { HomeScreen });
