const { PhotoSection, SectionHeading, Button, TextLink, Stamp, ProofRow, EventSplit } = window.ATXBullsDesignSystem_a4b13b;

function BannerSection() {
  return (
    <section style={{ position: "relative", height: 420, borderTop: "1px solid var(--line)", overflow: "hidden" }}>
      <img src="https://atxbulls.com/austin-tough-banner.png" alt="ATX Bulls player overlooking the Austin skyline with the words Arena Football, Austin Tough"
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", filter: "var(--photo-filter)" }} />
      <div style={{ position: "absolute", inset: 0, background: "var(--photo-fade-bottom)" }} />
    </section>
  );
}

function TryoutsSection({ onRegister }) {
  return (
    <PhotoSection image="https://atxbulls.com/origin-story-2027.png" alt="ATX Bulls players in official uniforms being filmed beneath the team crest in Austin"
      overlay={<Stamp lines={["ARE", "YOU", "READY?"]} style={{ position: "absolute", right: 110, top: 160 }} />}>
      <SectionHeading eyebrow="First official ATX Bulls tryout" lead="The wait" emphasis="is over." lede="Your opportunity. Your future. Our team." />
      <p style={{ margin: "26px 0 0", maxWidth: "52ch", fontFamily: "var(--font-body)", fontSize: 16, lineHeight: "24px", color: "var(--bone)" }}>
        Get evaluated. Be seen. Compete at the highest level—and earn the right to help make Austin football history.
      </p>
      <EventSplit style={{ margin: "40px 0", maxWidth: 620 }} items={[{ label: "Date", value: "August 30" }, { label: "Location", value: "Austin, Texas" }]} />
      <Button size="lg" glow onClick={onRegister}>Register for tryouts</Button>
      <ProofRow items={["Get evaluated", "Compete", "Make history"]} style={{ marginTop: 44, maxWidth: 520 }} />
    </PhotoSection>
  );
}

function FamilySection({ onCta }) {
  return (
    <PhotoSection image="https://atxbulls.com/family-arena-2027.png" alt="ATX Bulls family cheering together inside a packed arena">
      <SectionHeading eyebrow="Opening night. March 20, 2027" lead="Austin." emphasis="Pick your side." lede="Make memories you'll never forget." />
      <div style={{ marginTop: 34 }}><Button onClick={onCta}>Save your seats</Button></div>
      <div style={{ marginTop: 44, fontFamily: "var(--font-ui)", fontWeight: 900, fontSize: 14, letterSpacing: "0.17em", textTransform: "uppercase", color: "var(--bone)" }}>
        Family night starts here
        <div style={{ marginTop: 8, fontWeight: 800, fontSize: 10, letterSpacing: "0.17em", color: "var(--muted)" }}>Doors open 5:30 PM · Kickoff 7:00 PM</div>
      </div>
    </PhotoSection>
  );
}

function StorySection({ onCta }) {
  return (
    <PhotoSection image="https://atxbulls.com/story-section-2027.png" alt="Two ATX Bulls players standing before the team crest in Austin">
      <SectionHeading eyebrow="Our origin story" lead="Built on" emphasis="Texas pride." />
      <p style={{ margin: "26px 0 0", maxWidth: "48ch", fontFamily: "var(--font-body)", fontSize: 16, lineHeight: "24px", color: "var(--bone)" }}>
        Born in Austin. Forged for the arena. This is the story of a city, a team, and a new tradition built to hit different.
      </p>
      <div style={{ marginTop: 30 }}><TextLink onClick={onCta}>Meet your team</TextLink></div>
    </PhotoSection>
  );
}

function UniformSection() {
  return (
    <PhotoSection image="https://atxbulls.com/uniform-reveal.png" alt="New ATX Bulls uniform shown from the front, back, and side with official helmet"
      overlay={<Stamp lines={["OFFICIAL", "2027", "UNIFORM"]} style={{ position: "absolute", right: 110, bottom: 140 }} />}>
      <SectionHeading eyebrow="New ATX Bulls uniforms · 2027" lead="Texas orange." emphasis="Never looked better." />
      <p style={{ margin: "26px 0 0", maxWidth: "46ch", fontFamily: "var(--font-body)", fontSize: 16, lineHeight: "24px", color: "var(--bone)" }}>
        This isn't a uniform. It's what the other team sees before the lights go out.
      </p>
    </PhotoSection>
  );
}

function MerchSection({ onCta }) {
  return (
    <PhotoSection image="https://atxbulls.com/merch-hero.png" alt="ATX Bulls blackout hoodie, shirt, cap, horn hat, and beanie collection"
      overlay={<Stamp lines={["OFFICIAL", "DROP", "001"]} style={{ position: "absolute", right: 110, top: 150 }} />}>
      <SectionHeading eyebrow="Official ATX Bulls gear · Drop 001" lead="Wear your" emphasis="horns." lede="Blackout essentials built for the fans." />
      <div style={{ marginTop: 34 }}><Button size="xl" onClick={onCta}>Shop now</Button></div>
      <ProofRow items={["Premium heavyweight", "Limited edition", "Built in Austin"]} style={{ marginTop: 44, maxWidth: 620 }} />
    </PhotoSection>
  );
}
Object.assign(window, { BannerSection, TryoutsSection, FamilySection, StorySection, UniformSection, MerchSection });
