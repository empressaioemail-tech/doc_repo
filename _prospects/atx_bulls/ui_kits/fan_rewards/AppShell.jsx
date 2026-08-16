const { TabBar, IconSquare, Logo, Toast, Button, Input, Tag } = window.ATXBullsDesignSystem_a4b13b;

function SignIn({ onEnter }) {
  return (
    <div style={{ position: "relative", flex: 1, display: "flex", flexDirection: "column", justifyContent: "flex-end", padding: 22, background: "var(--ink)", overflow: "hidden" }}>
      <div className="atx-grid-overlay" style={{ position: "absolute", inset: 0, WebkitMaskImage: "linear-gradient(180deg,#000,transparent 70%)" }} />
      <div style={{ position: "absolute", inset: 0, background: "var(--photo-glow)" }} />
      <div style={{ position: "absolute", top: 26, left: 22 }}><Logo variant="mark" height={54} base="../../" /></div>
      <div style={{ position: "relative" }}>
        <Tag tone="orange" style={{ marginBottom: 16 }}>Fan rewards · 2027</Tag>
        <h1 style={{ fontSize: 58 }}>Horns up,<br /><em>Austin.</em></h1>
        <p style={{ margin: "16px 0 26px", maxWidth: "26ch", fontFamily: "var(--font-ui)", fontWeight: 700, fontSize: 16, lineHeight: 1.3, letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--lede)" }}>
          Earn points every game. Trade them for seats, gear and sideline access.
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <Input label="Email address" placeholder="YOU@EMAIL.COM" />
          <Button full size="lg" onClick={onEnter}>Get in the arena</Button>
        </div>
      </div>
    </div>
  );
}

function AppShell() {
  const d = window.ATX_DATA;
  const [signedIn, setSignedIn] = React.useState(false);
  const [tab, setTab] = React.useState("home");
  const [points, setPoints] = React.useState(d.fan.points);
  const [checkedIn, setCheckedIn] = React.useState(false);
  const [toast, setToast] = React.useState(null);
  const fire = (t) => { setToast(t); setTimeout(() => setToast(null), 3000); };
  const fan = { ...d.fan, points, toNext: Math.max(0, 2000 - points) };

  return (
    <div style={{ position: "relative", width: 390, height: 844, display: "flex", flexDirection: "column", background: "var(--ink)", border: "1px solid var(--line)", overflow: "hidden" }}>
      {!signedIn ? <SignIn onEnter={() => setSignedIn(true)} /> : (
        <>
          <header style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 18px", background: "var(--nav-solid)", backdropFilter: "blur(var(--nav-blur))", borderBottom: "1px solid var(--line)" }}>
            <Logo variant="mark" height={40} base="../../" />
            <div style={{ display: "flex", gap: 10 }}>
              <IconSquare icon="bell" label="Alerts" variant="bone" size={38} />
              <IconSquare icon="qr-code" label="Wallet" variant="bone" size={38} />
            </div>
          </header>
          <main style={{ flex: 1, overflowY: "auto", paddingTop: 18 }}>
            {tab === "home" && <HomeScreen fan={fan} challenges={d.challenges} onGoRewards={() => setTab("rewards")} onGoGameDay={() => setTab("gameday")} />}
            {tab === "rewards" && <RewardsScreen rewards={d.rewards} points={points} onRedeem={(r) => { setPoints((p) => p - r.cost); fire({ icon: "check", title: "Redeemed", detail: r.title + " · -" + r.cost.toLocaleString("en-US") + " pts" }); }} />}
            {tab === "gameday" && <GameDayScreen checkedIn={checkedIn} onCheckIn={() => { setCheckedIn(true); setPoints((p) => p + 250); fire({ icon: "check", title: "+250 points", detail: "Checked in at Gate C" }); }} />}
            {tab === "rank" && <RankScreen board={d.board} />}
            {tab === "me" && <ProfileScreen fan={fan} />}
          </main>
          {toast && <div style={{ position: "absolute", left: 18, right: 18, bottom: 88, zIndex: 30 }}><Toast {...toast} /></div>}
          <TabBar
            active={tab}
            onChange={setTab}
            items={[
              { id: "home", label: "Home", icon: "house" },
              { id: "rewards", label: "Rewards", icon: "gift", count: 3 },
              { id: "gameday", label: "Game day", icon: "ticket" },
              { id: "rank", label: "Rank", icon: "trophy" },
              { id: "me", label: "Me", icon: "user" }
            ]}
          />
        </>
      )}
    </div>
  );
}
Object.assign(window, { AppShell, SignIn });
