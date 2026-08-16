const { TierBadge, Panel, Switch, Button, ProgressBar, Icon } = window.ATXBullsDesignSystem_a4b13b;

function ProfileScreen({ fan }) {
  const [reminders, setReminders] = React.useState(true);
  const [drops, setDrops] = React.useState(true);
  const [board, setBoard] = React.useState(false);
  const ladder = [["rookie", 0], ["starter", 1000], ["captain", 2000], ["legend", 5000]];
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 18, padding: "0 18px 28px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        <span style={{ width: 58, height: 58, border: "2px solid var(--line)", display: "inline-flex", alignItems: "center", justifyContent: "center", color: "var(--muted)" }}>
          <Icon name="user" size={24} />
        </span>
        <div>
          <h1 style={{ fontSize: 34 }}>{fan.name}</h1>
          <TierBadge tier={fan.tier} size="sm" style={{ marginTop: 6 }} />
        </div>
      </div>

      <Panel padding={20}>
        <ProgressBar value={fan.points} max={fan.points + fan.toNext} label={"Next tier · " + fan.nextTier} caption={fan.points.toLocaleString("en-US") + " / " + (fan.points + fan.toNext).toLocaleString("en-US")} />
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 22 }}>
          {ladder.map(([t, at]) => (
            <div key={t} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, opacity: fan.points >= at ? 1 : 0.4 }}>
              <TierBadge tier={t} showLabel={false} />
              <span style={{ fontFamily: "var(--font-ui)", fontWeight: 900, fontSize: 11, letterSpacing: "0.1em", color: "var(--muted)" }}>{at.toLocaleString("en-US")}</span>
            </div>
          ))}
        </div>
      </Panel>

      <Panel padding={20}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10, fontFamily: "var(--font-ui)", fontWeight: 800, fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--orange)" }}>
          <span style={{ width: 24, height: 3, background: "currentColor" }} />Notifications
        </div>
        <Switch checked={reminders} onChange={setReminders} label="Game day reminders" />
        <Switch checked={drops} onChange={setDrops} label="Merch and ticket drops" />
        <Switch checked={board} onChange={setBoard} label="Show me on leaderboards" />
      </Panel>

      <Panel padding={0}>
        {[["wallet", "Payment methods"], ["ticket", "Ticket history"], ["shield", "Account and privacy"], ["circle-help", "Help"]].map(([ic, label], i, a) => (
          <div key={label} style={{ display: "flex", alignItems: "center", gap: 14, padding: "15px 18px", borderBottom: i === a.length - 1 ? "none" : "1px solid var(--line)", cursor: "pointer" }}>
            <Icon name={ic} size={17} style={{ color: "var(--muted)" }} />
            <span style={{ flex: 1, fontFamily: "var(--font-ui)", fontWeight: 800, fontSize: 13, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--bone)" }}>{label}</span>
            <Icon name="chevron-right" size={15} style={{ color: "var(--muted)" }} />
          </div>
        ))}
      </Panel>

      <Button variant="ink" arrow={false} full>Sign out</Button>
    </div>
  );
}
Object.assign(window, { ProfileScreen });
