const { NavBar, Ticker, JoinInvert, Footer, VipModal } = window.ATXBullsDesignSystem_a4b13b;

function Site() {
  const [solid, setSolid] = React.useState(false);
  const [vip, setVip] = React.useState(false);
  const ref = React.useRef(null);
  const openVip = () => setVip(true);
  return (
    <div ref={ref} onScroll={(e) => setSolid(e.currentTarget.scrollTop > 40)} style={{ height: "100vh", overflowY: "auto", background: "var(--ink)" }}>
      <NavBar links={["Tryouts", "Story", "Team", "Uniform", "Merch"]} solid={solid} base="../../" onCta={openVip} onLink={openVip} />
      <Hero onCta={openVip} />
      <Ticker />
      <BannerSection />
      <TryoutsSection onRegister={() => window.open("https://form.fillout.com/t/qVMoDaWhEmus", "_blank")} />
      <FamilySection onCta={openVip} />
      <StorySection onCta={openVip} />
      <UniformSection />
      <MerchSection onCta={openVip} />
      <JoinInvert sub="Be first to know when tickets drop! Enter email below." socials={["instagram", "twitter", "youtube"]} base="../../" onSubmit={() => setVip(false)} />
      <Footer socials={["instagram", "twitter", "youtube"]} />
      <VipModal open={vip} onClose={() => setVip(false)} onSubmit={() => setVip(false)} />
    </div>
  );
}
Object.assign(window, { Site });
