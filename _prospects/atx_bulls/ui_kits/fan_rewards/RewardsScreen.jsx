const { Tabs, RewardCard, Dialog, Button, Tag } = window.ATXBullsDesignSystem_a4b13b;

function RewardsScreen({ rewards, points, onRedeem }) {
  const [tab, setTab] = React.useState("All");
  const [pending, setPending] = React.useState(null);
  const list = tab === "All" ? rewards : rewards.filter((r) => r.group === tab);
  return (
    <div style={{ padding: "0 18px 28px" }}>
      <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 12 }}>
        <h1 style={{ fontSize: 46 }}>Rewards</h1>
        <span style={{ fontFamily: "var(--font-ui)", fontWeight: 900, fontSize: 16, letterSpacing: "0.08em", color: "var(--orange)" }}>{points.toLocaleString("en-US")} PTS</span>
      </div>
      <Tabs items={["All", "Tickets", "Merch", "Experiences"]} active={tab} onChange={setTab} style={{ margin: "18px 0 20px", overflowX: "auto" }} />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        {list.map((r) => <RewardCard key={r.title} {...r} onRedeem={() => setPending(r)} />)}
      </div>
      {pending && (
        <Dialog
          eyebrow="Confirm"
          title={"Redeem " + pending.title.toLowerCase() + "?"}
          width={330}
          onClose={() => setPending(null)}
          footer={<>
            <Button size="sm" onClick={() => { onRedeem(pending); setPending(null); }}>Redeem</Button>
            <Button size="sm" variant="ink" arrow={false} onClick={() => setPending(null)}>Not yet</Button>
          </>}
        >
          Costs {pending.cost.toLocaleString("en-US")} horn points.
          <div style={{ marginTop: 14 }}><Tag>Balance after · {(points - pending.cost).toLocaleString("en-US")}</Tag></div>
        </Dialog>
      )}
    </div>
  );
}
Object.assign(window, { RewardsScreen });
