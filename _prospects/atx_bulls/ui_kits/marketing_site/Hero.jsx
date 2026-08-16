const { Logo, Button, VerticalLockup, ProofRow } = window.ATXBullsDesignSystem_a4b13b;

function Hero({ onCta }) {
  return (
    <section style={{ position: "relative", minHeight: 940, display: "flex", alignItems: "center", overflow: "hidden", marginTop: "calc(var(--nav-h) * -1)" }}>
      <video
        autoPlay muted loop playsInline
        poster="https://atxbulls.com/hero-main-event.png"
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", filter: "var(--photo-filter)" }}
      >
        <source src="https://atxbulls.com/atx-bulls-hero.mp4" type="video/mp4" />
      </video>
      <div style={{ position: "absolute", inset: 0, background: "var(--photo-shade)" }} />
      <div style={{ position: "absolute", inset: 0, background: "var(--photo-fade-bottom)" }} />

      <div className="atx-shell" style={{ position: "relative", zIndex: 2, paddingTop: "var(--nav-h)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, fontFamily: "var(--font-ui)", fontWeight: 800, fontSize: 12, letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--orange)" }}>
          <span style={{ width: 34, height: 3, background: "currentColor" }} />Arena football contender
        </div>
        <h1 style={{ marginTop: 24, fontSize: "var(--display-hero)", maxWidth: "11ch" }}>
          Austin's <em>new main</em> event.
        </h1>
        <p style={{ margin: "26px 0 0", maxWidth: "34ch", fontFamily: "var(--font-ui)", fontWeight: 700, fontSize: "var(--lede-hero-size)", lineHeight: 1.35, letterSpacing: "0.015em", textTransform: "uppercase", color: "var(--lede-hero)" }}>
          Lights out. Horns up.<br />The most electric new show in Texas.
        </p>
        <div style={{ marginTop: 34 }}><Button size="lg" glow onClick={onCta}>Get in the arena</Button></div>
        <ProofRow items={["2027 season", "Arena football", "Austin, Texas"]} style={{ marginTop: 46, maxWidth: 560 }} />
      </div>

      <div style={{ position: "absolute", right: 34, top: "50%", transform: "translateY(-50%)", zIndex: 2 }}>
        <VerticalLockup>Loved here · Feared everywhere</VerticalLockup>
      </div>
      <div style={{ position: "absolute", right: 90, bottom: 54, zIndex: 2, textAlign: "center" }}>
        <div style={{ fontFamily: "var(--font-ui)", fontWeight: 800, fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--muted)", marginBottom: 10 }}>Official league member</div>
        <Logo variant="af1" height={64} />
      </div>
    </section>
  );
}
Object.assign(window, { Hero });
