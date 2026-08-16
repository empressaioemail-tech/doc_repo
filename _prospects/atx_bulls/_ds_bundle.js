/* @ds-bundle: {"format":4,"namespace":"ATXBullsDesignSystem_a4b13b","components":[{"name":"EventSplit","sourcePath":"components/brand/EventSplit.jsx"},{"name":"Eyebrow","sourcePath":"components/brand/Eyebrow.jsx"},{"name":"Logo","sourcePath":"components/brand/Logo.jsx"},{"name":"ProofRow","sourcePath":"components/brand/ProofRow.jsx"},{"name":"SectionHeading","sourcePath":"components/brand/SectionHeading.jsx"},{"name":"Stamp","sourcePath":"components/brand/Stamp.jsx"},{"name":"Ticker","sourcePath":"components/brand/Ticker.jsx"},{"name":"VerticalLockup","sourcePath":"components/brand/VerticalLockup.jsx"},{"name":"Button","sourcePath":"components/core/Button.jsx"},{"name":"Icon","sourcePath":"components/core/Icon.jsx"},{"name":"IconSquare","sourcePath":"components/core/IconSquare.jsx"},{"name":"Panel","sourcePath":"components/core/Panel.jsx"},{"name":"Tag","sourcePath":"components/core/Tag.jsx"},{"name":"TextLink","sourcePath":"components/core/TextLink.jsx"},{"name":"Dialog","sourcePath":"components/feedback/Dialog.jsx"},{"name":"ProgressBar","sourcePath":"components/feedback/ProgressBar.jsx"},{"name":"Toast","sourcePath":"components/feedback/Toast.jsx"},{"name":"Checkbox","sourcePath":"components/forms/Checkbox.jsx"},{"name":"Input","sourcePath":"components/forms/Input.jsx"},{"name":"Switch","sourcePath":"components/forms/Switch.jsx"},{"name":"TabBar","sourcePath":"components/navigation/TabBar.jsx"},{"name":"Tabs","sourcePath":"components/navigation/Tabs.jsx"},{"name":"ChallengeRow","sourcePath":"components/rewards/ChallengeRow.jsx"},{"name":"LeaderboardRow","sourcePath":"components/rewards/LeaderboardRow.jsx"},{"name":"PointsMeter","sourcePath":"components/rewards/PointsMeter.jsx"},{"name":"RewardCard","sourcePath":"components/rewards/RewardCard.jsx"},{"name":"TicketStub","sourcePath":"components/rewards/TicketStub.jsx"},{"name":"TIERS","sourcePath":"components/rewards/TierBadge.jsx"},{"name":"TierBadge","sourcePath":"components/rewards/TierBadge.jsx"},{"name":"Footer","sourcePath":"components/site/Footer.jsx"},{"name":"JoinInvert","sourcePath":"components/site/JoinInvert.jsx"},{"name":"NavBar","sourcePath":"components/site/NavBar.jsx"},{"name":"PhotoSection","sourcePath":"components/site/PhotoSection.jsx"},{"name":"PlayerCard","sourcePath":"components/site/PlayerCard.jsx"},{"name":"ScheduleTable","sourcePath":"components/site/ScheduleTable.jsx"},{"name":"VipModal","sourcePath":"components/site/VipModal.jsx"}],"sourceHashes":{"components/brand/EventSplit.jsx":"6addd6ba78f7","components/brand/Eyebrow.jsx":"a92a5fdc40a1","components/brand/Logo.jsx":"22a28712bde4","components/brand/ProofRow.jsx":"109bae03752d","components/brand/SectionHeading.jsx":"9b172b749a6b","components/brand/Stamp.jsx":"55988ce79e01","components/brand/Ticker.jsx":"b2cd940b6d7f","components/brand/VerticalLockup.jsx":"9533d886a4e5","components/core/Button.jsx":"602940203b48","components/core/Icon.jsx":"ddeceb739fbc","components/core/IconSquare.jsx":"9519e37d1569","components/core/Panel.jsx":"a6981b85e914","components/core/Tag.jsx":"3c216ed4e87e","components/core/TextLink.jsx":"f03bca210b64","components/feedback/Dialog.jsx":"59442efe50ae","components/feedback/ProgressBar.jsx":"9eddb79550fc","components/feedback/Toast.jsx":"4d8694d57692","components/forms/Checkbox.jsx":"924405bd6083","components/forms/Input.jsx":"4b2c78f5e2ff","components/forms/Switch.jsx":"927b753d7b89","components/navigation/TabBar.jsx":"bfe893af3514","components/navigation/Tabs.jsx":"da74078ef6df","components/rewards/ChallengeRow.jsx":"57dc21ee405e","components/rewards/LeaderboardRow.jsx":"4df42ff52794","components/rewards/PointsMeter.jsx":"1b1eaceab9f4","components/rewards/RewardCard.jsx":"264effa4aecc","components/rewards/TicketStub.jsx":"94119db641b4","components/rewards/TierBadge.jsx":"aa77ccd3ab2b","components/site/Footer.jsx":"677dad427732","components/site/JoinInvert.jsx":"2b536d52306d","components/site/NavBar.jsx":"84369c969494","components/site/PhotoSection.jsx":"de0711f17778","components/site/PlayerCard.jsx":"5c70a6b6bbe9","components/site/ScheduleTable.jsx":"3237f5fa2f5c","components/site/VipModal.jsx":"b22642f6fb23","ui_kits/fan_rewards/AppShell.jsx":"31304ff0fda8","ui_kits/fan_rewards/GameDayScreen.jsx":"93b81fe89261","ui_kits/fan_rewards/HomeScreen.jsx":"4bd648aa15fa","ui_kits/fan_rewards/ProfileScreen.jsx":"d49e23dac18f","ui_kits/fan_rewards/RankScreen.jsx":"26954a4478a1","ui_kits/fan_rewards/RewardsScreen.jsx":"1203b5afa1ba","ui_kits/fan_rewards/data.js":"aa70648173b9","ui_kits/marketing_site/Hero.jsx":"d7de0a3b82e5","ui_kits/marketing_site/Sections.jsx":"1058357f5c12","ui_kits/marketing_site/Site.jsx":"8f74b09097ee"},"inlinedExternals":[],"unexposedExports":[]} */

(() => {

const __ds_ns = (window.ATXBullsDesignSystem_a4b13b = window.ATXBullsDesignSystem_a4b13b || {});

const __ds_scope = {};

(__ds_ns.__errors = __ds_ns.__errors || []);

// components/brand/EventSplit.jsx
try { (() => {
function EventSplit({
  items = [],
  style
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "repeat(" + items.length + ",1fr)",
      borderTop: "1px solid var(--line)",
      borderBottom: "1px solid var(--line)",
      ...style
    }
  }, items.map((it, i) => /*#__PURE__*/React.createElement("div", {
    key: it.label,
    style: {
      padding: "20px 24px",
      borderRight: i === items.length - 1 ? "none" : "1px solid var(--line)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--font-ui)",
      fontWeight: 800,
      fontSize: 9,
      letterSpacing: "0.2em",
      textTransform: "uppercase",
      color: "var(--muted)"
    }
  }, it.label), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 6,
      fontFamily: "var(--font-ui)",
      fontWeight: 900,
      fontSize: "var(--value-size)",
      textTransform: "uppercase",
      color: "var(--bone)"
    }
  }, it.value))));
}
Object.assign(__ds_scope, { EventSplit });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/brand/EventSplit.jsx", error: String((e && e.message) || e) }); }

// components/brand/Eyebrow.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function Eyebrow({
  children,
  tone = "orange",
  style,
  ...rest
}) {
  const color = tone === "muted" ? "var(--muted)" : tone === "ink" ? "var(--ink)" : "var(--orange)";
  return /*#__PURE__*/React.createElement("div", _extends({
    style: {
      display: "flex",
      alignItems: "center",
      gap: 12,
      margin: "0 0 24px",
      color,
      fontFamily: "var(--font-ui)",
      fontWeight: 800,
      fontSize: 12,
      lineHeight: 1,
      letterSpacing: "0.2em",
      textTransform: "uppercase",
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("span", {
    style: {
      display: "block",
      width: 34,
      height: 3,
      background: "currentColor"
    }
  }), children);
}
Object.assign(__ds_scope, { Eyebrow });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/brand/Eyebrow.jsx", error: String((e && e.message) || e) }); }

// components/brand/Logo.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/* Official art. Local files are screenshot-derived (low resolution, opaque
   background) — see assets/README.md. Prefer the live transparent PNGs when the
   page can reach the network. */
const SRC = {
  mark: "https://atxbulls.com/bulls-logo-official.png",
  lockup: "https://atxbulls.com/atx-bulls-official-logo.png",
  af1: "https://atxbulls.com/af1-logo.png"
};
const LOCAL = {
  mark: "assets/atx-bulls-mark-on-ink.png",
  lockup: "assets/atx-bulls-lockup-on-orange.png"
};
function Logo({
  variant = "mark",
  height = 56,
  dropShadow = false,
  base = "",
  style,
  ...rest
}) {
  const local = LOCAL[variant] ? base + LOCAL[variant] : null;
  return /*#__PURE__*/React.createElement("img", _extends({
    src: SRC[variant],
    alt: variant === "af1" ? "Arena Football One" : "ATX Bulls",
    onError: e => {
      if (local && e.currentTarget.src !== local) e.currentTarget.src = local;
    },
    style: {
      height,
      width: "auto",
      display: "block",
      filter: dropShadow ? "var(--logo-shadow)" : undefined,
      ...style
    }
  }, rest));
}
Object.assign(__ds_scope, { Logo });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/brand/Logo.jsx", error: String((e && e.message) || e) }); }

// components/brand/ProofRow.jsx
try { (() => {
function ProofRow({
  items = [],
  tone = "muted",
  style
}) {
  const color = tone === "ink" ? "var(--ink)" : "var(--muted)";
  const rule = tone === "ink" ? "var(--ink-hairline)" : "var(--line)";
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexWrap: "wrap",
      borderTop: "1px solid " + rule,
      ...style
    }
  }, items.map((t, i) => /*#__PURE__*/React.createElement("span", {
    key: t,
    style: {
      padding: "16px 22px 16px 0",
      marginRight: 22,
      borderRight: i === items.length - 1 ? "none" : "1px solid " + rule,
      fontFamily: "var(--font-ui)",
      fontWeight: 800,
      fontSize: 10,
      letterSpacing: "0.17em",
      textTransform: "uppercase",
      color
    }
  }, t)));
}
Object.assign(__ds_scope, { ProofRow });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/brand/ProofRow.jsx", error: String((e && e.message) || e) }); }

// components/brand/SectionHeading.jsx
try { (() => {
function SectionHeading({
  eyebrow,
  eyebrowTone,
  lead,
  emphasis,
  trail,
  lede,
  size,
  invert = false,
  style
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: style
  }, eyebrow && /*#__PURE__*/React.createElement(__ds_scope.Eyebrow, {
    tone: eyebrowTone || (invert ? "ink" : "orange")
  }, eyebrow), /*#__PURE__*/React.createElement("h2", {
    style: {
      fontSize: size || "var(--display-section)",
      color: invert ? "var(--ink)" : "var(--bone)",
      maxWidth: "14ch"
    }
  }, lead, " ", emphasis && /*#__PURE__*/React.createElement("em", null, emphasis), " ", trail), lede && /*#__PURE__*/React.createElement("p", {
    style: {
      margin: "22px 0 0",
      maxWidth: "26ch",
      fontFamily: "var(--font-ui)",
      fontWeight: 700,
      fontSize: "var(--lede-size)",
      lineHeight: 1.2,
      textTransform: "uppercase",
      color: invert ? "var(--ink)" : "var(--lede)"
    }
  }, lede));
}
Object.assign(__ds_scope, { SectionHeading });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/brand/SectionHeading.jsx", error: String((e && e.message) || e) }); }

// components/brand/Stamp.jsx
try { (() => {
function Stamp({
  lines = [],
  size = 112,
  rotate = 8,
  style
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      width: size,
      height: size,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      textAlign: "center",
      borderRadius: "50%",
      border: "2px solid var(--orange)",
      background: "var(--stamp-frost)",
      boxShadow: "var(--glow-stamp)",
      transform: "rotate(" + rotate + "deg)",
      fontFamily: "var(--font-ui)",
      fontWeight: 900,
      fontSize: 14,
      lineHeight: 0.88,
      letterSpacing: "0.04em",
      textTransform: "uppercase",
      color: "var(--orange)",
      padding: 10,
      ...style
    }
  }, lines.map((l, i) => /*#__PURE__*/React.createElement("span", {
    key: i
  }, l)));
}
Object.assign(__ds_scope, { Stamp });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/brand/Stamp.jsx", error: String((e && e.message) || e) }); }

// components/brand/Ticker.jsx
try { (() => {
function Ticker({
  items,
  separator = "×",
  speed = 22,
  style
}) {
  const run = items && items.length ? items : ["HORNS UP", "HARD HITS", "HEART OF TEXAS"];
  const strip = [...run, ...run, ...run, ...run, ...run, ...run];
  return /*#__PURE__*/React.createElement("div", {
    style: {
      overflow: "hidden",
      height: "var(--ticker-h)",
      display: "flex",
      alignItems: "center",
      background: "var(--orange)",
      ...style
    }
  }, /*#__PURE__*/React.createElement("style", null, "@keyframes atxTicker{from{transform:translateX(0)}to{transform:translateX(-50%)}}@media (prefers-reduced-motion:reduce){.atx-ticker__run{animation:none!important}}"), /*#__PURE__*/React.createElement("div", {
    className: "atx-ticker__run",
    style: {
      display: "flex",
      alignItems: "center",
      gap: 18,
      width: "max-content",
      animation: "atxTicker " + speed + "s linear infinite"
    }
  }, strip.map((t, i) => /*#__PURE__*/React.createElement("span", {
    key: i,
    style: {
      display: "inline-flex",
      alignItems: "center",
      gap: 18,
      fontFamily: "var(--font-ui)",
      fontWeight: 900,
      fontSize: 19,
      letterSpacing: "0.11em",
      textTransform: "uppercase",
      color: "var(--ink)",
      whiteSpace: "nowrap"
    }
  }, t, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 24,
      lineHeight: 1
    }
  }, separator)))));
}
Object.assign(__ds_scope, { Ticker });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/brand/Ticker.jsx", error: String((e && e.message) || e) }); }

// components/brand/VerticalLockup.jsx
try { (() => {
function VerticalLockup({
  children = "LOVED HERE · FEARED EVERYWHERE",
  tone = "bone",
  style
}) {
  return /*#__PURE__*/React.createElement("span", {
    style: {
      writingMode: "vertical-rl",
      fontFamily: "var(--font-ui)",
      fontWeight: 800,
      fontSize: 10,
      letterSpacing: "0.28em",
      textTransform: "uppercase",
      color: tone === "orange" ? "var(--orange)" : "var(--muted)",
      ...style
    }
  }, children);
}
Object.assign(__ds_scope, { VerticalLockup });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/brand/VerticalLockup.jsx", error: String((e && e.message) || e) }); }

// components/core/Button.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const {
  useState
} = React;
const H = {
  sm: 42,
  md: 56,
  lg: 64,
  xl: 68
};
const FS = {
  sm: 14,
  md: 14,
  lg: 15,
  xl: 17
};

/** The signature component: chamfered orange CTA with a trailing north-east arrow. */
function Button({
  variant = "primary",
  size = "md",
  arrow = true,
  glow = false,
  full = false,
  disabled = false,
  children,
  style,
  ...rest
}) {
  const [hover, setHover] = useState(false);
  const small = size === "sm";
  const skins = {
    primary: {
      background: hover ? "var(--bone)" : "var(--orange)",
      color: "var(--ink)"
    },
    bone: {
      background: hover ? "var(--orange)" : "var(--bone)",
      color: "var(--ink)"
    },
    ink: {
      background: hover ? "var(--panel)" : "var(--ink)",
      color: "var(--bone)"
    }
  };
  return /*#__PURE__*/React.createElement("button", _extends({
    disabled: disabled,
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    style: {
      display: full ? "flex" : "inline-flex",
      width: full ? "100%" : undefined,
      alignItems: "center",
      justifyContent: "space-between",
      gap: small ? "var(--btn-gap-sm)" : "var(--btn-gap)",
      minHeight: H[size],
      padding: "0 " + (small ? 18 : 26) + "px",
      border: 0,
      borderRadius: 0,
      clipPath: "var(--clip-button)",
      fontFamily: "var(--font-ui)",
      fontWeight: 900,
      fontSize: FS[size],
      letterSpacing: "var(--button-tracking)",
      textTransform: "uppercase",
      whiteSpace: "nowrap",
      cursor: disabled ? "not-allowed" : "pointer",
      opacity: disabled ? 0.45 : 1,
      boxShadow: glow ? "var(--glow-cta)" : "none",
      transform: hover && !disabled ? "translateY(var(--lift))" : "none",
      transition: "all var(--dur-base) var(--ease)",
      ...skins[variant],
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("span", null, children), arrow && /*#__PURE__*/React.createElement("svg", {
    width: "18",
    height: "18",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2.25",
    strokeLinecap: "square",
    "aria-hidden": "true"
  }, /*#__PURE__*/React.createElement("line", {
    x1: "7",
    y1: "17",
    x2: "17",
    y2: "7"
  }), /*#__PURE__*/React.createElement("polyline", {
    points: "7 7 17 7 17 17"
  })));
}
Object.assign(__ds_scope, { Button });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Button.jsx", error: String((e && e.message) || e) }); }

// components/core/Icon.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const {
  useEffect,
  useRef
} = React;
/* Lucide, loaded from CDN. Stroke inherits currentColor; the site draws its arrow
   at stroke-width 2.25, so icons run heavy here too. */
function Icon({
  name,
  size = 20,
  strokeWidth = 2.25,
  style,
  ...rest
}) {
  const ref = useRef(null);
  useEffect(() => {
    const draw = () => window.lucide && window.lucide.createIcons({
      nameAttr: "data-lucide",
      root: ref.current
    });
    draw();
    const t = setTimeout(draw, 300);
    return () => clearTimeout(t);
  }, [name, size, strokeWidth]);
  return /*#__PURE__*/React.createElement("span", _extends({
    ref: ref,
    "aria-hidden": "true",
    style: {
      display: "inline-flex",
      width: size,
      height: size,
      flex: "0 0 auto",
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("i", {
    "data-lucide": name,
    style: {
      width: size,
      height: size,
      strokeWidth
    }
  }));
}
Object.assign(__ds_scope, { Icon });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Icon.jsx", error: String((e && e.message) || e) }); }

// components/core/IconSquare.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const {
  useState
} = React;
function IconSquare({
  icon,
  label,
  variant = "ink",
  size = 44,
  style,
  ...rest
}) {
  const [hover, setHover] = useState(false);
  const onOrange = variant === "ink";
  const skin = onOrange ? {
    border: "2px solid var(--ink)",
    background: hover ? "var(--ink)" : "transparent",
    color: hover ? "var(--bone)" : "var(--ink)"
  } : {
    border: "2px solid var(--line)",
    background: hover ? "var(--bone)" : "transparent",
    color: hover ? "var(--ink)" : "var(--bone)"
  };
  return /*#__PURE__*/React.createElement("button", _extends({
    "aria-label": label,
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    style: {
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      width: size,
      height: size,
      borderRadius: 0,
      cursor: "pointer",
      transition: "all var(--dur-base) var(--ease)",
      ...skin,
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: icon,
    size: Math.round(size * 0.45)
  }));
}
Object.assign(__ds_scope, { IconSquare });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/IconSquare.jsx", error: String((e && e.message) || e) }); }

// components/core/Panel.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const {
  useState
} = React;
function Panel({
  variant = "panel",
  chamfer = false,
  interactive = false,
  padding = 24,
  children,
  style,
  ...rest
}) {
  const [hover, setHover] = useState(false);
  const skins = {
    panel: {
      background: "var(--panel)",
      border: "1px solid var(--line)"
    },
    hairline: {
      background: "transparent",
      border: "1px solid var(--line)"
    },
    ink: {
      background: "var(--ink)",
      border: "1px solid var(--line)"
    },
    orange: {
      background: "var(--orange)",
      border: "1px solid var(--orange)",
      color: "var(--ink)"
    },
    frost: {
      background: "var(--stamp-frost)",
      border: "1px solid var(--line)"
    }
  };
  return /*#__PURE__*/React.createElement("div", _extends({
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    style: {
      borderRadius: 0,
      padding,
      clipPath: chamfer ? "var(--clip-panel)" : undefined,
      transition: "all var(--dur-base) var(--ease)",
      cursor: interactive ? "pointer" : undefined,
      ...skins[variant],
      ...(interactive && hover ? {
        borderColor: "var(--orange)",
        transform: "translateY(var(--lift))"
      } : null),
      ...style
    }
  }, rest), children);
}
Object.assign(__ds_scope, { Panel });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Panel.jsx", error: String((e && e.message) || e) }); }

// components/core/Tag.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const TONES = {
  orange: {
    background: "var(--orange)",
    color: "var(--ink)",
    border: "1px solid var(--orange)"
  },
  outline: {
    background: "transparent",
    color: "var(--muted)",
    border: "1px solid var(--line)"
  },
  bone: {
    background: "var(--bone)",
    color: "var(--ink)",
    border: "1px solid var(--bone)"
  },
  ink: {
    background: "var(--ink)",
    color: "var(--bone)",
    border: "1px solid var(--ink)"
  }
};
function Tag({
  tone = "outline",
  children,
  style,
  ...rest
}) {
  return /*#__PURE__*/React.createElement("span", _extends({
    style: {
      display: "inline-flex",
      alignItems: "center",
      padding: "5px 10px",
      borderRadius: 0,
      fontFamily: "var(--font-ui)",
      fontWeight: 900,
      fontSize: 10,
      letterSpacing: "0.16em",
      textTransform: "uppercase",
      whiteSpace: "nowrap",
      ...TONES[tone],
      ...style
    }
  }, rest), children);
}
Object.assign(__ds_scope, { Tag });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Tag.jsx", error: String((e && e.message) || e) }); }

// components/core/TextLink.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const {
  useState
} = React;
function TextLink({
  variant = "bone",
  gap,
  children,
  style,
  ...rest
}) {
  const [hover, setHover] = useState(false);
  const ink = variant === "ink";
  return /*#__PURE__*/React.createElement("a", _extends({
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    style: {
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "space-between",
      gap: gap || (ink ? 48 : 34),
      padding: "14px 0",
      borderBottom: "2px solid " + (ink ? "var(--ink)" : hover ? "var(--orange)" : "var(--bone)"),
      color: ink ? "var(--ink)" : hover ? "var(--orange)" : "var(--bone)",
      fontFamily: "var(--font-ui)",
      fontWeight: 900,
      fontSize: 13,
      letterSpacing: "0.12em",
      textTransform: "uppercase",
      cursor: "pointer",
      transition: "all var(--dur-base) var(--ease)",
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("span", null, children), /*#__PURE__*/React.createElement("svg", {
    width: "16",
    height: "16",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2.25",
    strokeLinecap: "square",
    "aria-hidden": "true"
  }, /*#__PURE__*/React.createElement("line", {
    x1: "7",
    y1: "17",
    x2: "17",
    y2: "7"
  }), /*#__PURE__*/React.createElement("polyline", {
    points: "7 7 17 7 17 17"
  })));
}
Object.assign(__ds_scope, { TextLink });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/TextLink.jsx", error: String((e && e.message) || e) }); }

// components/feedback/Dialog.jsx
try { (() => {
function Dialog({
  open = true,
  title,
  eyebrow,
  invert = false,
  onClose,
  footer,
  children,
  width = 440,
  style
}) {
  if (!open) return null;
  const fg = invert ? "var(--ink)" : "var(--bone)";
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      inset: 0,
      zIndex: 50,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: 20,
      background: "var(--overlay-modal)",
      backdropFilter: "blur(var(--modal-blur))"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      width: "100%",
      maxWidth: width,
      background: invert ? "var(--orange)" : "var(--panel)",
      border: invert ? "none" : "1px solid var(--line)",
      clipPath: "var(--clip-panel)",
      boxShadow: "var(--shadow-modal)",
      ...style
    }
  }, onClose && /*#__PURE__*/React.createElement("button", {
    onClick: onClose,
    "aria-label": "Close",
    style: {
      position: "absolute",
      top: 0,
      right: 0,
      width: 44,
      height: 44,
      border: 0,
      background: invert ? "var(--ink)" : "var(--ink)",
      color: "var(--bone)",
      cursor: "pointer",
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center"
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "x",
    size: 18
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "28px 28px 0"
    }
  }, eyebrow && /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 12,
      marginBottom: 16,
      fontFamily: "var(--font-ui)",
      fontWeight: 800,
      fontSize: 12,
      letterSpacing: "0.2em",
      textTransform: "uppercase",
      color: invert ? "var(--ink)" : "var(--orange)"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 34,
      height: 3,
      background: "currentColor"
    }
  }), eyebrow), /*#__PURE__*/React.createElement("h3", {
    style: {
      fontSize: 40,
      color: fg
    }
  }, title)), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "16px 28px 24px",
      fontFamily: "var(--font-ui)",
      fontWeight: 700,
      fontSize: 15,
      letterSpacing: "0.06em",
      textTransform: "uppercase",
      color: invert ? "var(--ink)" : "var(--lede)"
    }
  }, children), footer && /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 12,
      justifyContent: "flex-start",
      padding: "0 28px 28px"
    }
  }, footer)));
}
Object.assign(__ds_scope, { Dialog });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/Dialog.jsx", error: String((e && e.message) || e) }); }

// components/feedback/ProgressBar.jsx
try { (() => {
function ProgressBar({
  value = 0,
  max = 100,
  height = 8,
  label,
  caption,
  style
}) {
  const pct = Math.max(0, Math.min(100, value / max * 100));
  return /*#__PURE__*/React.createElement("div", {
    style: {
      width: "100%",
      ...style
    }
  }, (label || caption) && /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "baseline",
      marginBottom: 8
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-ui)",
      fontWeight: 800,
      fontSize: 9,
      letterSpacing: "0.2em",
      textTransform: "uppercase",
      color: "var(--muted)"
    }
  }, label), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-ui)",
      fontWeight: 900,
      fontSize: 12,
      letterSpacing: "0.1em",
      color: "var(--bone)"
    }
  }, caption)), /*#__PURE__*/React.createElement("div", {
    style: {
      height,
      background: "var(--panel)",
      border: "1px solid var(--line)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: pct + "%",
      height: "100%",
      background: "var(--orange)",
      transition: "width var(--dur-slow) var(--ease)"
    }
  })));
}
Object.assign(__ds_scope, { ProgressBar });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/ProgressBar.jsx", error: String((e && e.message) || e) }); }

// components/feedback/Toast.jsx
try { (() => {
function Toast({
  tone = "orange",
  title,
  detail,
  icon,
  style
}) {
  const accent = tone === "burnt" ? "var(--burnt)" : "var(--orange)";
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "flex-start",
      gap: 14,
      padding: "16px 18px",
      background: "var(--panel)",
      border: "1px solid var(--line)",
      borderLeft: "3px solid " + accent,
      boxShadow: "var(--shadow-modal)",
      ...style
    }
  }, icon && /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: icon,
    size: 18,
    style: {
      color: accent,
      marginTop: 2
    }
  }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--font-ui)",
      fontWeight: 900,
      fontSize: 16,
      letterSpacing: "0.08em",
      textTransform: "uppercase",
      color: "var(--bone)"
    }
  }, title), detail && /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 3,
      fontFamily: "var(--font-ui)",
      fontWeight: 700,
      fontSize: 12,
      letterSpacing: "0.14em",
      textTransform: "uppercase",
      color: "var(--muted)"
    }
  }, detail)));
}
Object.assign(__ds_scope, { Toast });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/Toast.jsx", error: String((e && e.message) || e) }); }

// components/forms/Checkbox.jsx
try { (() => {
/** INTENTIONAL ADDITION for account surfaces; the live site has no checkbox. */
function Checkbox({
  checked = false,
  onChange,
  label,
  disabled,
  style
}) {
  return /*#__PURE__*/React.createElement("label", {
    style: {
      display: "inline-flex",
      alignItems: "center",
      gap: 12,
      minHeight: 44,
      cursor: disabled ? "not-allowed" : "pointer",
      opacity: disabled ? 0.45 : 1,
      ...style
    }
  }, /*#__PURE__*/React.createElement("span", {
    onClick: () => !disabled && onChange && onChange(!checked),
    style: {
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      width: 22,
      height: 22,
      flex: "0 0 auto",
      borderRadius: 0,
      background: checked ? "var(--orange)" : "transparent",
      border: "2px solid " + (checked ? "var(--orange)" : "var(--line)"),
      color: "var(--ink)",
      transition: "all var(--dur-base) var(--ease)"
    }
  }, checked && /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "check",
    size: 14,
    strokeWidth: 3.5
  })), label && /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-ui)",
      fontWeight: 700,
      fontSize: 14,
      letterSpacing: "0.06em",
      textTransform: "uppercase",
      color: "var(--bone)"
    }
  }, label));
}
Object.assign(__ds_scope, { Checkbox });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Checkbox.jsx", error: String((e && e.message) || e) }); }

// components/forms/Input.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const {
  useState
} = React;
/** Two shapes only: 2px bordered field (on ink or orange) and underline-only. */
function Input({
  label,
  hint,
  error,
  variant = "bordered",
  tone = "bone",
  full = true,
  style,
  ...rest
}) {
  const [focus, setFocus] = useState(false);
  const ink = tone === "ink";
  const edge = error ? "var(--burnt)" : focus ? "var(--orange)" : ink ? "var(--ink)" : "var(--line)";
  const underline = variant === "underline";
  return /*#__PURE__*/React.createElement("label", {
    style: {
      display: full ? "block" : "inline-block",
      width: full ? "100%" : undefined
    }
  }, label && /*#__PURE__*/React.createElement("span", {
    style: {
      display: "block",
      marginBottom: 8,
      fontFamily: "var(--font-ui)",
      fontWeight: 800,
      fontSize: 9,
      letterSpacing: "0.2em",
      textTransform: "uppercase",
      color: ink ? "var(--ink)" : "var(--muted)"
    }
  }, label), /*#__PURE__*/React.createElement("input", _extends({
    onFocus: () => setFocus(true),
    onBlur: () => setFocus(false),
    style: {
      width: "100%",
      height: underline ? 44 : 58,
      padding: underline ? "0 0 10px" : "0 16px",
      background: underline ? "transparent" : ink ? "#ffffff21" : "var(--panel)",
      border: underline ? "none" : "2px solid " + edge,
      borderBottom: underline ? "3px solid " + (ink ? "var(--ink)" : edge) : undefined,
      borderRadius: 0,
      outline: "none",
      fontFamily: "var(--font-ui)",
      fontWeight: 900,
      fontSize: underline ? 24 : 20,
      letterSpacing: "0.04em",
      textTransform: "uppercase",
      color: ink ? "var(--ink)" : "var(--bone)",
      transition: "border-color var(--dur-base) var(--ease)",
      ...style
    }
  }, rest)), (hint || error) && /*#__PURE__*/React.createElement("span", {
    style: {
      display: "block",
      marginTop: 8,
      fontFamily: "var(--font-ui)",
      fontWeight: 800,
      fontSize: 10,
      letterSpacing: "0.16em",
      textTransform: "uppercase",
      color: error ? "var(--burnt)" : ink ? "var(--ink)" : "var(--muted)"
    }
  }, error || hint));
}
Object.assign(__ds_scope, { Input });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Input.jsx", error: String((e && e.message) || e) }); }

// components/forms/Switch.jsx
try { (() => {
/** INTENTIONAL ADDITION for account settings. Square track, square knob — no pills. */
function Switch({
  checked = false,
  onChange,
  label,
  disabled,
  style
}) {
  return /*#__PURE__*/React.createElement("label", {
    style: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      gap: 20,
      minHeight: 44,
      cursor: disabled ? "not-allowed" : "pointer",
      opacity: disabled ? 0.45 : 1,
      ...style
    }
  }, label && /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-ui)",
      fontWeight: 700,
      fontSize: 14,
      letterSpacing: "0.06em",
      textTransform: "uppercase",
      color: "var(--bone)"
    }
  }, label), /*#__PURE__*/React.createElement("span", {
    onClick: () => !disabled && onChange && onChange(!checked),
    style: {
      position: "relative",
      width: 48,
      height: 24,
      flex: "0 0 auto",
      background: checked ? "var(--orange)" : "transparent",
      border: "2px solid " + (checked ? "var(--orange)" : "var(--line)"),
      transition: "all var(--dur-base) var(--ease)"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      position: "absolute",
      top: 2,
      left: checked ? 24 : 2,
      width: 16,
      height: 16,
      background: checked ? "var(--ink)" : "var(--muted)",
      transition: "left var(--dur-base) var(--ease)"
    }
  })));
}
Object.assign(__ds_scope, { Switch });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Switch.jsx", error: String((e && e.message) || e) }); }

// components/navigation/TabBar.jsx
try { (() => {
/** INTENTIONAL ADDITION: the brand has no app yet. Chrome follows the nav's rules. */
function TabBar({
  items = [],
  active,
  onChange,
  style
}) {
  return /*#__PURE__*/React.createElement("nav", {
    style: {
      display: "flex",
      background: "var(--nav-solid)",
      backdropFilter: "blur(var(--nav-blur))",
      borderTop: "1px solid var(--line)",
      paddingBottom: 8,
      ...style
    }
  }, items.map(it => {
    const on = it.id === active;
    return /*#__PURE__*/React.createElement("button", {
      key: it.id,
      onClick: () => onChange && onChange(it.id),
      style: {
        flex: 1,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 5,
        padding: "12px 0 8px",
        marginTop: -1,
        background: "transparent",
        border: 0,
        borderTop: "3px solid " + (on ? "var(--orange)" : "transparent"),
        color: on ? "var(--orange)" : "var(--muted)",
        cursor: "pointer",
        transition: "all var(--dur-base) var(--ease)"
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        position: "relative",
        display: "inline-flex"
      }
    }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
      name: it.icon,
      size: 21
    }), it.count ? /*#__PURE__*/React.createElement("span", {
      style: {
        position: "absolute",
        top: -5,
        right: -9,
        minWidth: 15,
        height: 15,
        padding: "0 3px",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        background: "var(--orange)",
        color: "var(--ink)",
        fontFamily: "var(--font-ui)",
        fontWeight: 900,
        fontSize: 10
      }
    }, it.count) : null), /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: "var(--font-ui)",
        fontWeight: 900,
        fontSize: 10,
        letterSpacing: "0.14em",
        textTransform: "uppercase"
      }
    }, it.label));
  }));
}
Object.assign(__ds_scope, { TabBar });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/navigation/TabBar.jsx", error: String((e && e.message) || e) }); }

// components/navigation/Tabs.jsx
try { (() => {
function Tabs({
  items = [],
  active,
  onChange,
  style
}) {
  return /*#__PURE__*/React.createElement("div", {
    role: "tablist",
    style: {
      display: "flex",
      gap: 28,
      borderBottom: "1px solid var(--line)",
      ...style
    }
  }, items.map(it => {
    const id = it.id || it;
    const on = id === active;
    return /*#__PURE__*/React.createElement("button", {
      key: id,
      role: "tab",
      "aria-selected": on,
      onClick: () => onChange && onChange(id),
      style: {
        padding: "0 0 12px",
        marginBottom: -1,
        background: "transparent",
        border: 0,
        borderBottom: "3px solid " + (on ? "var(--orange)" : "transparent"),
        color: on ? "var(--bone)" : "var(--muted)",
        fontFamily: "var(--font-ui)",
        fontWeight: 900,
        fontSize: 13,
        letterSpacing: "0.12em",
        textTransform: "uppercase",
        cursor: "pointer",
        transition: "all var(--dur-base) var(--ease)"
      }
    }, it.label || it);
  }));
}
Object.assign(__ds_scope, { Tabs });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/navigation/Tabs.jsx", error: String((e && e.message) || e) }); }

// components/rewards/ChallengeRow.jsx
try { (() => {
function ChallengeRow({
  title,
  detail,
  icon = "target",
  reward,
  progress,
  goal,
  done = false,
  onClick,
  style
}) {
  return /*#__PURE__*/React.createElement("div", {
    onClick: onClick,
    style: {
      display: "flex",
      alignItems: "center",
      gap: 16,
      padding: "18px 20px",
      background: "var(--panel)",
      border: "1px solid var(--line)",
      cursor: onClick ? "pointer" : undefined,
      ...style
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      width: 40,
      height: 40,
      flex: "0 0 auto",
      border: "2px solid " + (done ? "var(--line)" : "var(--orange)"),
      color: done ? "var(--muted)" : "var(--orange)"
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: done ? "check" : icon,
    size: 19,
    strokeWidth: done ? 3.5 : 2.25
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "baseline",
      justifyContent: "space-between",
      gap: 14
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-ui)",
      fontWeight: 900,
      fontSize: 17,
      letterSpacing: "0.06em",
      textTransform: "uppercase",
      color: done ? "var(--muted)" : "var(--bone)"
    }
  }, title), reward != null && /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-ui)",
      fontWeight: 900,
      fontSize: 15,
      letterSpacing: "0.08em",
      color: done ? "var(--muted)" : "var(--orange)",
      whiteSpace: "nowrap"
    }
  }, done ? "Earned" : "+" + reward.toLocaleString("en-US"))), detail && /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 4,
      fontFamily: "var(--font-ui)",
      fontWeight: 700,
      fontSize: 10,
      letterSpacing: "0.17em",
      textTransform: "uppercase",
      color: "var(--muted)"
    }
  }, detail), typeof progress === "number" && !done && /*#__PURE__*/React.createElement(__ds_scope.ProgressBar, {
    style: {
      marginTop: 10
    },
    value: progress,
    max: goal || 100,
    height: 5
  })));
}
Object.assign(__ds_scope, { ChallengeRow });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/rewards/ChallengeRow.jsx", error: String((e && e.message) || e) }); }

// components/rewards/RewardCard.jsx
try { (() => {
function RewardCard({
  title,
  category,
  cost,
  image,
  imageAlt,
  flag,
  locked = false,
  onRedeem,
  style
}) {
  return /*#__PURE__*/React.createElement(__ds_scope.Panel, {
    padding: 0,
    interactive: !locked,
    style: {
      overflow: "hidden",
      opacity: locked ? 0.6 : 1,
      ...style
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      aspectRatio: "16 / 10",
      background: "var(--ink)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      overflow: "hidden"
    }
  }, image ? /*#__PURE__*/React.createElement("img", {
    src: image,
    alt: imageAlt || title,
    style: {
      width: "100%",
      height: "100%",
      objectFit: "cover",
      filter: "var(--photo-filter)"
    }
  }) : /*#__PURE__*/React.createElement("div", {
    className: "atx-grid-overlay",
    style: {
      position: "absolute",
      inset: 0
    }
  }), !image && /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: locked ? "lock" : "image",
    size: 26,
    style: {
      color: "var(--line)",
      position: "relative"
    }
  }), flag && /*#__PURE__*/React.createElement(__ds_scope.Tag, {
    tone: "orange",
    style: {
      position: "absolute",
      top: 0,
      left: 0
    }
  }, flag)), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: 18
    }
  }, category && /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--font-ui)",
      fontWeight: 800,
      fontSize: 9,
      letterSpacing: "0.2em",
      textTransform: "uppercase",
      color: "var(--muted)"
    }
  }, category), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 8,
      fontFamily: "var(--font-display)",
      fontSize: 24,
      lineHeight: 0.86,
      letterSpacing: "-0.06em",
      textTransform: "uppercase",
      color: "var(--bone)"
    }
  }, title), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      gap: 12,
      marginTop: 18,
      paddingTop: 14,
      borderTop: "1px solid var(--line)"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-ui)",
      fontWeight: 900,
      fontSize: 20,
      letterSpacing: "0.06em",
      color: "var(--bone)"
    }
  }, cost.toLocaleString("en-US"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 10,
      letterSpacing: "0.2em",
      color: "var(--muted)"
    }
  }, " PTS")), /*#__PURE__*/React.createElement(__ds_scope.Button, {
    size: "sm",
    arrow: !locked,
    disabled: locked,
    onClick: onRedeem
  }, locked ? "Locked" : "Redeem"))));
}
Object.assign(__ds_scope, { RewardCard });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/rewards/RewardCard.jsx", error: String((e && e.message) || e) }); }

// components/rewards/TicketStub.jsx
try { (() => {
function TicketStub({
  matchup,
  date,
  time,
  venue,
  section,
  row,
  seat,
  status = "Valid",
  style
}) {
  const meta = [["Sec", section], ["Row", row], ["Seat", seat]];
  return /*#__PURE__*/React.createElement("div", {
    style: {
      background: "var(--panel)",
      border: "1px solid var(--line)",
      ...style
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      height: 6,
      background: "var(--orange)"
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: 22
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      gap: 14
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-ui)",
      fontWeight: 800,
      fontSize: 10,
      letterSpacing: "0.17em",
      textTransform: "uppercase",
      color: "var(--muted)"
    }
  }, date, " \xB7 ", time), /*#__PURE__*/React.createElement("span", {
    style: {
      display: "inline-flex",
      alignItems: "center",
      gap: 6,
      fontFamily: "var(--font-ui)",
      fontWeight: 900,
      fontSize: 10,
      letterSpacing: "0.17em",
      textTransform: "uppercase",
      color: "var(--orange)"
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "shield-check",
    size: 13
  }), status)), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 10,
      fontFamily: "var(--font-display)",
      fontSize: 42,
      lineHeight: 0.86,
      letterSpacing: "-0.06em",
      textTransform: "uppercase",
      color: "var(--bone)"
    }
  }, matchup), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 8,
      fontFamily: "var(--font-ui)",
      fontWeight: 700,
      fontSize: 13,
      letterSpacing: "0.14em",
      textTransform: "uppercase",
      color: "var(--lede)"
    }
  }, venue)), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      borderTop: "1px dashed var(--line)"
    }
  }, meta.map(([k, v]) => /*#__PURE__*/React.createElement("div", {
    key: k,
    style: {
      flex: 1,
      padding: "14px 20px",
      borderRight: "1px solid var(--line)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--font-ui)",
      fontWeight: 800,
      fontSize: 9,
      letterSpacing: "0.2em",
      textTransform: "uppercase",
      color: "var(--muted)"
    }
  }, k), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 4,
      fontFamily: "var(--font-ui)",
      fontWeight: 900,
      fontSize: 22,
      letterSpacing: "0.04em",
      color: "var(--bone)"
    }
  }, v))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      width: 88,
      background: "var(--ink)",
      color: "var(--bone)"
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "qr-code",
    size: 40
  }))));
}
Object.assign(__ds_scope, { TicketStub });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/rewards/TicketStub.jsx", error: String((e && e.message) || e) }); }

// components/rewards/TierBadge.jsx
try { (() => {
const TIERS = {
  rookie: {
    label: "Rookie",
    color: "var(--muted)"
  },
  starter: {
    label: "Starter",
    color: "var(--burnt)"
  },
  captain: {
    label: "Captain",
    color: "var(--orange)"
  },
  legend: {
    label: "Legend",
    color: "var(--bone)"
  }
};

/** Tier chevrons: 1–4 stacked bars, no metals, no medals. */
function TierBadge({
  tier = "rookie",
  size = "md",
  showLabel = true,
  style
}) {
  const order = ["rookie", "starter", "captain", "legend"];
  const level = Math.max(1, order.indexOf(tier) + 1);
  const t = TIERS[tier] || TIERS.rookie;
  const s = size === "lg" ? {
    w: 26,
    h: 5,
    gap: 3,
    fs: 13
  } : size === "sm" ? {
    w: 14,
    h: 3,
    gap: 2,
    fs: 10
  } : {
    w: 20,
    h: 4,
    gap: 2,
    fs: 11
  };
  return /*#__PURE__*/React.createElement("span", {
    style: {
      display: "inline-flex",
      alignItems: "center",
      gap: 10,
      ...style
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: "inline-flex",
      flexDirection: "column",
      gap: s.gap
    }
  }, [0, 1, 2, 3].map(i => /*#__PURE__*/React.createElement("span", {
    key: i,
    style: {
      width: s.w - i * 2,
      height: s.h,
      background: i < level ? t.color : "var(--line)"
    }
  }))), showLabel && /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-ui)",
      fontWeight: 900,
      fontSize: s.fs,
      letterSpacing: "0.18em",
      textTransform: "uppercase",
      color: t.color
    }
  }, t.label));
}
Object.assign(__ds_scope, { TIERS, TierBadge });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/rewards/TierBadge.jsx", error: String((e && e.message) || e) }); }

// components/rewards/LeaderboardRow.jsx
try { (() => {
function LeaderboardRow({
  rank,
  name,
  points,
  tier = "rookie",
  you = false,
  trend,
  style
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 16,
      padding: "14px 18px",
      background: you ? "var(--orange)" : "transparent",
      color: you ? "var(--ink)" : "var(--bone)",
      borderBottom: "1px solid var(--line)",
      ...style
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 44,
      fontFamily: "var(--font-display)",
      fontSize: 28,
      lineHeight: 0.86,
      letterSpacing: "-0.06em",
      color: you ? "var(--ink)" : rank <= 3 ? "var(--orange)" : "var(--muted)"
    }
  }, rank), !you && /*#__PURE__*/React.createElement(__ds_scope.TierBadge, {
    tier: tier,
    size: "sm",
    showLabel: false
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1,
      minWidth: 0,
      fontFamily: "var(--font-ui)",
      fontWeight: 900,
      fontSize: 16,
      letterSpacing: "0.08em",
      textTransform: "uppercase",
      overflow: "hidden",
      textOverflow: "ellipsis",
      whiteSpace: "nowrap"
    }
  }, name, you && " · you"), trend && /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: trend === "up" ? "trending-up" : "trending-down",
    size: 15,
    style: {
      color: you ? "var(--ink)" : "var(--muted)"
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-ui)",
      fontWeight: 900,
      fontSize: 15,
      letterSpacing: "0.06em"
    }
  }, points.toLocaleString("en-US")));
}
Object.assign(__ds_scope, { LeaderboardRow });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/rewards/LeaderboardRow.jsx", error: String((e && e.message) || e) }); }

// components/rewards/PointsMeter.jsx
try { (() => {
const fmt = n => n.toLocaleString("en-US");
function PointsMeter({
  points = 0,
  tier = "rookie",
  nextTier,
  toNext = 0,
  label = "Horn points",
  style
}) {
  const goal = points + toNext;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      padding: 24,
      background: "var(--panel)",
      border: "1px solid var(--line)",
      ...style
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "flex-start",
      justifyContent: "space-between",
      gap: 20
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 12,
      fontFamily: "var(--font-ui)",
      fontWeight: 800,
      fontSize: 12,
      letterSpacing: "0.2em",
      textTransform: "uppercase",
      color: "var(--orange)"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 34,
      height: 3,
      background: "currentColor"
    }
  }), label), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 10,
      fontFamily: "var(--font-display)",
      fontSize: 76,
      lineHeight: 0.86,
      letterSpacing: "-0.06em",
      color: "var(--bone)"
    }
  }, fmt(points))), /*#__PURE__*/React.createElement(__ds_scope.TierBadge, {
    tier: tier,
    size: "lg",
    showLabel: false
  })), nextTier && /*#__PURE__*/React.createElement(__ds_scope.ProgressBar, {
    style: {
      marginTop: 22
    },
    value: points,
    max: goal,
    label: fmt(toNext) + " to " + nextTier,
    caption: fmt(points) + " / " + fmt(goal)
  }));
}
Object.assign(__ds_scope, { PointsMeter });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/rewards/PointsMeter.jsx", error: String((e && e.message) || e) }); }

// components/site/Footer.jsx
try { (() => {
function Footer({
  socials = [],
  legal = "© 2027 ATX BULLS · AUSTIN, TEXAS",
  style
}) {
  return /*#__PURE__*/React.createElement("footer", {
    style: {
      borderTop: "1px solid var(--line)",
      padding: "34px 0",
      ...style
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "atx-shell",
    style: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      gap: 24,
      flexWrap: "wrap"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 12
    }
  }, socials.map(s => /*#__PURE__*/React.createElement(__ds_scope.IconSquare, {
    key: s,
    icon: s,
    label: s,
    variant: "bone",
    size: 40
  }))), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-body)",
      fontWeight: 700,
      fontSize: 10,
      letterSpacing: "0.12em",
      textTransform: "uppercase",
      color: "var(--muted)"
    }
  }, legal)));
}
Object.assign(__ds_scope, { Footer });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/site/Footer.jsx", error: String((e && e.message) || e) }); }

// components/site/JoinInvert.jsx
try { (() => {
const {
  useState
} = React;
function JoinInvert({
  eyebrow = "ATX Bulls · 2027",
  title = "Join VIP list",
  sub,
  socials = [],
  base = "",
  onSubmit,
  style
}) {
  const [email, setEmail] = useState("");
  return /*#__PURE__*/React.createElement("section", {
    style: {
      background: "var(--orange)",
      color: "var(--ink)",
      padding: "96px 0",
      ...style
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "atx-shell",
    style: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      textAlign: "center"
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Logo, {
    variant: "lockup",
    height: 200,
    base: base,
    style: {
      filter: "var(--logo-shadow-invert)"
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 28,
      fontFamily: "var(--font-ui)",
      fontWeight: 800,
      fontSize: 12,
      letterSpacing: "0.2em",
      textTransform: "uppercase"
    }
  }, eyebrow), /*#__PURE__*/React.createElement("h2", {
    style: {
      marginTop: 14,
      fontSize: "var(--display-invert)",
      color: "var(--ink)"
    }
  }, title), sub && /*#__PURE__*/React.createElement("p", {
    style: {
      margin: "16px 0 0",
      maxWidth: "34ch",
      fontFamily: "var(--font-ui)",
      fontWeight: 800,
      fontSize: 18,
      lineHeight: 1.2,
      textTransform: "uppercase"
    }
  }, sub), /*#__PURE__*/React.createElement("form", {
    onSubmit: e => {
      e.preventDefault();
      onSubmit && onSubmit(email);
    },
    style: {
      display: "grid",
      gridTemplateColumns: "1fr 60px",
      alignItems: "end",
      gap: 0,
      width: "min(560px,100%)",
      marginTop: 34,
      borderBottom: "3px solid var(--ink)"
    }
  }, /*#__PURE__*/React.createElement("input", {
    value: email,
    onChange: e => setEmail(e.target.value),
    placeholder: "YOU@EMAIL.COM",
    "aria-label": "Email address",
    style: {
      background: "transparent",
      border: 0,
      outline: "none",
      padding: "0 0 10px",
      fontFamily: "var(--font-ui)",
      fontWeight: 900,
      fontSize: 24,
      letterSpacing: "0.04em",
      textTransform: "uppercase",
      color: "var(--ink)"
    }
  }), /*#__PURE__*/React.createElement("button", {
    type: "submit",
    style: {
      height: 63,
      border: 0,
      background: "var(--ink)",
      color: "var(--bone)",
      fontFamily: "var(--font-ui)",
      fontWeight: 900,
      fontSize: 12,
      letterSpacing: "0.14em",
      textTransform: "uppercase",
      cursor: "pointer"
    }
  }, "Join")), socials.length > 0 && /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 12,
      marginTop: 34
    }
  }, socials.map(s => /*#__PURE__*/React.createElement(__ds_scope.IconSquare, {
    key: s,
    icon: s,
    label: s,
    variant: "ink"
  })))));
}
Object.assign(__ds_scope, { JoinInvert });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/site/JoinInvert.jsx", error: String((e && e.message) || e) }); }

// components/site/NavBar.jsx
try { (() => {
function NavBar({
  links = [],
  cta = "Reserve tickets",
  solid = false,
  base = "",
  onCta,
  onLink,
  style
}) {
  return /*#__PURE__*/React.createElement("header", {
    style: {
      position: "sticky",
      top: 0,
      zIndex: 20,
      height: "var(--nav-h)",
      display: "flex",
      alignItems: "center",
      background: solid ? "var(--nav-solid)" : "transparent",
      backdropFilter: solid ? "blur(var(--nav-blur))" : undefined,
      borderBottom: solid ? "1px solid var(--line)" : "1px solid transparent",
      transition: "all var(--dur-base) var(--ease)",
      ...style
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "atx-shell",
    style: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      gap: 32
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Logo, {
    variant: "mark",
    height: 54,
    base: base
  }), /*#__PURE__*/React.createElement("nav", {
    style: {
      display: "flex",
      gap: 34
    }
  }, links.map(l => /*#__PURE__*/React.createElement("a", {
    key: l,
    onClick: () => onLink && onLink(l),
    style: {
      fontFamily: "var(--font-ui)",
      fontWeight: 800,
      fontSize: 13,
      letterSpacing: "0.12em",
      textTransform: "uppercase",
      color: "var(--bone)",
      cursor: "pointer"
    }
  }, l))), /*#__PURE__*/React.createElement(__ds_scope.Button, {
    size: "sm",
    onClick: onCta
  }, cta)));
}
Object.assign(__ds_scope, { NavBar });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/site/NavBar.jsx", error: String((e && e.message) || e) }); }

// components/site/PhotoSection.jsx
try { (() => {
/** Full-bleed photo section: shaded left, faint grid, optional orange glow, copy stack left. */
function PhotoSection({
  image,
  alt = "",
  minHeight = 920,
  glow = true,
  grid = true,
  align = "center",
  children,
  overlay,
  style
}) {
  return /*#__PURE__*/React.createElement("section", {
    style: {
      position: "relative",
      minHeight,
      display: "flex",
      alignItems: align,
      overflow: "hidden",
      borderTop: "1px solid var(--line)",
      ...style
    }
  }, image && /*#__PURE__*/React.createElement("img", {
    src: image,
    alt: alt,
    style: {
      position: "absolute",
      inset: 0,
      width: "100%",
      height: "100%",
      objectFit: "cover",
      filter: "var(--photo-filter)"
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      inset: 0,
      background: "var(--photo-shade)"
    }
  }), grid && /*#__PURE__*/React.createElement("div", {
    className: "atx-grid-overlay",
    style: {
      position: "absolute",
      inset: 0,
      maskImage: "linear-gradient(90deg,#000 0%,#000 42%,transparent 72%)",
      WebkitMaskImage: "linear-gradient(90deg,#000 0%,#000 42%,transparent 72%)"
    }
  }), glow && /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      inset: 0,
      background: "var(--photo-glow)"
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      inset: 0,
      background: "var(--photo-fade-bottom)"
    }
  }), overlay, /*#__PURE__*/React.createElement("div", {
    className: "atx-shell",
    style: {
      position: "relative",
      zIndex: 2,
      paddingBlock: 96
    }
  }, children));
}
Object.assign(__ds_scope, { PhotoSection });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/site/PhotoSection.jsx", error: String((e && e.message) || e) }); }

// components/site/PlayerCard.jsx
try { (() => {
/** Latent in the live CSS (.player) — 600px tall panel with a huge orange number. */
function PlayerCard({
  number,
  name,
  position,
  image,
  height = 600,
  style
}) {
  return /*#__PURE__*/React.createElement("article", {
    style: {
      position: "relative",
      height,
      background: "var(--panel)",
      border: "1px solid var(--line)",
      overflow: "hidden",
      ...style
    }
  }, image ? /*#__PURE__*/React.createElement("img", {
    src: image,
    alt: name,
    style: {
      position: "absolute",
      inset: 0,
      width: "100%",
      height: "100%",
      objectFit: "cover",
      filter: "var(--photo-filter)"
    }
  }) : /*#__PURE__*/React.createElement("div", {
    className: "atx-grid-overlay",
    style: {
      position: "absolute",
      inset: 0
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      inset: 0,
      background: "linear-gradient(to top,#050403 8%,#05040366 46%,transparent 78%)"
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      position: "absolute",
      top: 18,
      right: 20,
      fontFamily: "var(--font-display)",
      fontSize: 112,
      lineHeight: .86,
      letterSpacing: "-0.06em",
      color: "var(--orange)"
    }
  }, number), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      left: 24,
      right: 24,
      bottom: 24
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--font-ui)",
      fontWeight: 800,
      fontSize: 10,
      letterSpacing: "0.2em",
      textTransform: "uppercase",
      color: "var(--muted)"
    }
  }, position), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 6,
      fontFamily: "var(--font-display)",
      fontSize: 34,
      lineHeight: .86,
      letterSpacing: "-0.06em",
      textTransform: "uppercase",
      color: "var(--bone)"
    }
  }, name)));
}
Object.assign(__ds_scope, { PlayerCard });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/site/PlayerCard.jsx", error: String((e && e.message) || e) }); }

// components/site/ScheduleTable.jsx
try { (() => {
/** Latent .schedule in the live CSS: the bone-inverted table. */
function ScheduleTable({
  games = [],
  style
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      background: "var(--bone)",
      color: "var(--ink)",
      ...style
    }
  }, games.map((g, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      display: "grid",
      gridTemplateColumns: "160px 1fr auto",
      alignItems: "center",
      gap: 24,
      padding: "22px 28px",
      borderTop: i === 0 ? "none" : "1px solid #08070626"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-display)",
      fontSize: 26,
      lineHeight: .86,
      letterSpacing: "-0.06em",
      textTransform: "uppercase"
    }
  }, g.date), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-ui)",
      fontWeight: 900,
      fontSize: 20,
      letterSpacing: "0.04em",
      textTransform: "uppercase"
    }
  }, g.opponent), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-ui)",
      fontWeight: 800,
      fontSize: 10,
      letterSpacing: "0.2em",
      textTransform: "uppercase",
      color: "#6b625b"
    }
  }, g.venue))));
}
Object.assign(__ds_scope, { ScheduleTable });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/site/ScheduleTable.jsx", error: String((e && e.message) || e) }); }

// components/site/VipModal.jsx
try { (() => {
const {
  useState
} = React;
function VipModal({
  open = true,
  title = "Join VIP list",
  sub = "Be first to know when tickets drop!",
  onClose,
  onSubmit,
  style
}) {
  const [email, setEmail] = useState("");
  if (!open) return null;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: "fixed",
      inset: 0,
      zIndex: 60,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: 20,
      background: "var(--overlay-modal)",
      backdropFilter: "blur(var(--modal-blur))"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      width: "min(620px,100%)",
      padding: 52,
      background: "var(--orange)",
      color: "var(--ink)",
      clipPath: "var(--clip-panel)",
      boxShadow: "var(--shadow-modal)",
      ...style
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: onClose,
    "aria-label": "Close",
    style: {
      position: "absolute",
      top: 0,
      right: 0,
      width: 48,
      height: 48,
      border: 0,
      background: "var(--ink)",
      color: "var(--bone)",
      cursor: "pointer",
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center"
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "x",
    size: 20
  })), /*#__PURE__*/React.createElement("h2", {
    style: {
      fontSize: 54,
      color: "var(--ink)"
    }
  }, title), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: "14px 0 28px",
      fontFamily: "var(--font-ui)",
      fontWeight: 800,
      fontSize: 16,
      letterSpacing: "0.04em",
      textTransform: "uppercase"
    }
  }, sub), /*#__PURE__*/React.createElement("form", {
    onSubmit: e => {
      e.preventDefault();
      onSubmit && onSubmit(email);
    },
    style: {
      display: "grid",
      gap: 14
    }
  }, /*#__PURE__*/React.createElement("input", {
    value: email,
    onChange: e => setEmail(e.target.value),
    placeholder: "YOU@EMAIL.COM",
    "aria-label": "Email address",
    style: {
      height: 58,
      padding: "0 16px",
      border: "2px solid var(--ink)",
      background: "#ffffff21",
      outline: "none",
      fontFamily: "var(--font-ui)",
      fontWeight: 900,
      fontSize: 20,
      letterSpacing: "0.04em",
      textTransform: "uppercase",
      color: "var(--ink)"
    }
  }), /*#__PURE__*/React.createElement("button", {
    type: "submit",
    style: {
      height: 58,
      border: 0,
      background: "var(--ink)",
      color: "var(--bone)",
      fontFamily: "var(--font-ui)",
      fontWeight: 900,
      fontSize: 12,
      letterSpacing: "0.14em",
      textTransform: "uppercase",
      cursor: "pointer"
    }
  }, "Join the VIP list"))));
}
Object.assign(__ds_scope, { VipModal });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/site/VipModal.jsx", error: String((e && e.message) || e) }); }

// ui_kits/fan_rewards/AppShell.jsx
try { (() => {
const {
  TabBar,
  IconSquare,
  Logo,
  Toast,
  Button,
  Input,
  Tag
} = window.ATXBullsDesignSystem_a4b13b;
function SignIn({
  onEnter
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      flex: 1,
      display: "flex",
      flexDirection: "column",
      justifyContent: "flex-end",
      padding: 22,
      background: "var(--ink)",
      overflow: "hidden"
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "atx-grid-overlay",
    style: {
      position: "absolute",
      inset: 0,
      WebkitMaskImage: "linear-gradient(180deg,#000,transparent 70%)"
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      inset: 0,
      background: "var(--photo-glow)"
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      top: 26,
      left: 22
    }
  }, /*#__PURE__*/React.createElement(Logo, {
    variant: "mark",
    height: 54,
    base: "../../"
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative"
    }
  }, /*#__PURE__*/React.createElement(Tag, {
    tone: "orange",
    style: {
      marginBottom: 16
    }
  }, "Fan rewards \xB7 2027"), /*#__PURE__*/React.createElement("h1", {
    style: {
      fontSize: 58
    }
  }, "Horns up,", /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("em", null, "Austin.")), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: "16px 0 26px",
      maxWidth: "26ch",
      fontFamily: "var(--font-ui)",
      fontWeight: 700,
      fontSize: 16,
      lineHeight: 1.3,
      letterSpacing: "0.06em",
      textTransform: "uppercase",
      color: "var(--lede)"
    }
  }, "Earn points every game. Trade them for seats, gear and sideline access."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 14
    }
  }, /*#__PURE__*/React.createElement(Input, {
    label: "Email address",
    placeholder: "YOU@EMAIL.COM"
  }), /*#__PURE__*/React.createElement(Button, {
    full: true,
    size: "lg",
    onClick: onEnter
  }, "Get in the arena"))));
}
function AppShell() {
  const d = window.ATX_DATA;
  const [signedIn, setSignedIn] = React.useState(false);
  const [tab, setTab] = React.useState("home");
  const [points, setPoints] = React.useState(d.fan.points);
  const [checkedIn, setCheckedIn] = React.useState(false);
  const [toast, setToast] = React.useState(null);
  const fire = t => {
    setToast(t);
    setTimeout(() => setToast(null), 3000);
  };
  const fan = {
    ...d.fan,
    points,
    toNext: Math.max(0, 2000 - points)
  };
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      width: 390,
      height: 844,
      display: "flex",
      flexDirection: "column",
      background: "var(--ink)",
      border: "1px solid var(--line)",
      overflow: "hidden"
    }
  }, !signedIn ? /*#__PURE__*/React.createElement(SignIn, {
    onEnter: () => setSignedIn(true)
  }) : /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("header", {
    style: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "14px 18px",
      background: "var(--nav-solid)",
      backdropFilter: "blur(var(--nav-blur))",
      borderBottom: "1px solid var(--line)"
    }
  }, /*#__PURE__*/React.createElement(Logo, {
    variant: "mark",
    height: 40,
    base: "../../"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 10
    }
  }, /*#__PURE__*/React.createElement(IconSquare, {
    icon: "bell",
    label: "Alerts",
    variant: "bone",
    size: 38
  }), /*#__PURE__*/React.createElement(IconSquare, {
    icon: "qr-code",
    label: "Wallet",
    variant: "bone",
    size: 38
  }))), /*#__PURE__*/React.createElement("main", {
    style: {
      flex: 1,
      overflowY: "auto",
      paddingTop: 18
    }
  }, tab === "home" && /*#__PURE__*/React.createElement(HomeScreen, {
    fan: fan,
    challenges: d.challenges,
    onGoRewards: () => setTab("rewards"),
    onGoGameDay: () => setTab("gameday")
  }), tab === "rewards" && /*#__PURE__*/React.createElement(RewardsScreen, {
    rewards: d.rewards,
    points: points,
    onRedeem: r => {
      setPoints(p => p - r.cost);
      fire({
        icon: "check",
        title: "Redeemed",
        detail: r.title + " · -" + r.cost.toLocaleString("en-US") + " pts"
      });
    }
  }), tab === "gameday" && /*#__PURE__*/React.createElement(GameDayScreen, {
    checkedIn: checkedIn,
    onCheckIn: () => {
      setCheckedIn(true);
      setPoints(p => p + 250);
      fire({
        icon: "check",
        title: "+250 points",
        detail: "Checked in at Gate C"
      });
    }
  }), tab === "rank" && /*#__PURE__*/React.createElement(RankScreen, {
    board: d.board
  }), tab === "me" && /*#__PURE__*/React.createElement(ProfileScreen, {
    fan: fan
  })), toast && /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      left: 18,
      right: 18,
      bottom: 88,
      zIndex: 30
    }
  }, /*#__PURE__*/React.createElement(Toast, toast)), /*#__PURE__*/React.createElement(TabBar, {
    active: tab,
    onChange: setTab,
    items: [{
      id: "home",
      label: "Home",
      icon: "house"
    }, {
      id: "rewards",
      label: "Rewards",
      icon: "gift",
      count: 3
    }, {
      id: "gameday",
      label: "Game day",
      icon: "ticket"
    }, {
      id: "rank",
      label: "Rank",
      icon: "trophy"
    }, {
      id: "me",
      label: "Me",
      icon: "user"
    }]
  })));
}
Object.assign(window, {
  AppShell,
  SignIn
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/fan_rewards/AppShell.jsx", error: String((e && e.message) || e) }); }

// ui_kits/fan_rewards/GameDayScreen.jsx
try { (() => {
const {
  TicketStub,
  Panel,
  Button,
  Tag,
  Icon,
  ProgressBar
} = window.ATXBullsDesignSystem_a4b13b;
function GameDayScreen({
  checkedIn,
  onCheckIn
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 18,
      padding: "0 18px 28px"
    }
  }, /*#__PURE__*/React.createElement("h1", {
    style: {
      fontSize: 46
    }
  }, "Game day"), /*#__PURE__*/React.createElement(TicketStub, {
    matchup: "Bulls vs. Rattlers",
    date: "Mar 20",
    time: "7:00 PM",
    venue: "Austin, Texas",
    section: "112",
    row: "F",
    seat: "7"
  }), /*#__PURE__*/React.createElement(Panel, {
    variant: checkedIn ? "panel" : "orange",
    chamfer: !checkedIn,
    padding: 20
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 10,
      fontFamily: "var(--font-ui)",
      fontWeight: 800,
      fontSize: 10,
      letterSpacing: "0.2em",
      textTransform: "uppercase",
      color: checkedIn ? "var(--muted)" : "var(--ink)"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 24,
      height: 3,
      background: "currentColor"
    }
  }), checkedIn ? "Checked in · 6:12 PM" : "Doors open 5:30 PM"), /*#__PURE__*/React.createElement("h3", {
    style: {
      marginTop: 10,
      fontSize: 34,
      color: checkedIn ? "var(--bone)" : "var(--ink)"
    }
  }, checkedIn ? "You're in." : "Check in at the gate"), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: "10px 0 18px",
      fontFamily: "var(--font-ui)",
      fontWeight: 700,
      fontSize: 13,
      letterSpacing: "0.1em",
      lineHeight: 1.35,
      textTransform: "uppercase",
      color: checkedIn ? "var(--lede)" : "var(--ink)"
    }
  }, checkedIn ? "250 points added. Streak extended to four games." : "Scan at any entrance to bank 250 points and keep your streak alive."), checkedIn ? /*#__PURE__*/React.createElement(Tag, {
    tone: "orange"
  }, "+250 points") : /*#__PURE__*/React.createElement(Button, {
    variant: "ink",
    full: true,
    size: "lg",
    onClick: onCheckIn
  }, "Check in")), /*#__PURE__*/React.createElement(Panel, {
    padding: 0
  }, [["clock", "Doors open", "5:30 PM"], ["map-pin", "Entrance", "Gate C · Level 1"], ["car", "Parking", "Garage 2, prepaid"], ["shirt", "Dress code", "Blackout"]].map(([ic, k, v], i, a) => /*#__PURE__*/React.createElement("div", {
    key: k,
    style: {
      display: "flex",
      alignItems: "center",
      gap: 14,
      padding: "15px 18px",
      borderBottom: i === a.length - 1 ? "none" : "1px solid var(--line)"
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: ic,
    size: 17,
    style: {
      color: "var(--orange)"
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1,
      fontFamily: "var(--font-ui)",
      fontWeight: 800,
      fontSize: 10,
      letterSpacing: "0.2em",
      textTransform: "uppercase",
      color: "var(--muted)"
    }
  }, k), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-ui)",
      fontWeight: 900,
      fontSize: 15,
      letterSpacing: "0.06em",
      textTransform: "uppercase",
      color: "var(--bone)"
    }
  }, v)))), /*#__PURE__*/React.createElement(Panel, {
    padding: 20
  }, /*#__PURE__*/React.createElement(ProgressBar, {
    value: 2,
    max: 3,
    label: "Attend three straight",
    caption: "2 / 3"
  }), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: "12px 0 0",
      fontFamily: "var(--font-ui)",
      fontWeight: 700,
      fontSize: 11,
      letterSpacing: "0.17em",
      textTransform: "uppercase",
      color: "var(--muted)"
    }
  }, "One more home game and 1,000 points land.")));
}
Object.assign(window, {
  GameDayScreen
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/fan_rewards/GameDayScreen.jsx", error: String((e && e.message) || e) }); }

// ui_kits/fan_rewards/HomeScreen.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const {
  PointsMeter,
  ChallengeRow,
  Panel,
  Tag,
  Button,
  TextLink,
  Icon,
  Ticker,
  RewardCard
} = window.ATXBullsDesignSystem_a4b13b;
function HomeScreen({
  fan,
  challenges,
  onGoRewards,
  onGoGameDay
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 18,
      padding: "0 0 28px"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "0 18px"
    }
  }, /*#__PURE__*/React.createElement(PointsMeter, {
    points: fan.points,
    tier: fan.tier,
    nextTier: fan.nextTier,
    toNext: fan.toNext
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "0 18px"
    }
  }, /*#__PURE__*/React.createElement(Panel, {
    variant: "orange",
    chamfer: true,
    padding: 18,
    interactive: true,
    onClick: onGoGameDay
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      gap: 14
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 10,
      fontFamily: "var(--font-ui)",
      fontWeight: 800,
      fontSize: 10,
      letterSpacing: "0.2em",
      textTransform: "uppercase",
      color: "var(--ink)"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 24,
      height: 3,
      background: "currentColor"
    }
  }), "Next game \xB7 12 days"), /*#__PURE__*/React.createElement("h3", {
    style: {
      marginTop: 8,
      fontSize: 32,
      color: "var(--ink)"
    }
  }, "Bulls vs. Rattlers"), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 6,
      fontFamily: "var(--font-ui)",
      fontWeight: 800,
      fontSize: 10,
      letterSpacing: "0.17em",
      textTransform: "uppercase",
      color: "var(--ink)"
    }
  }, "Mar 20 \xB7 Doors 5:30 PM \xB7 Kickoff 7:00 PM")), /*#__PURE__*/React.createElement(Icon, {
    name: "arrow-up-right",
    size: 22,
    style: {
      color: "var(--ink)"
    }
  })))), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "0 18px",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      gap: 12
    }
  }, /*#__PURE__*/React.createElement("h2", {
    style: {
      fontSize: 30
    }
  }, "Earn this week"), /*#__PURE__*/React.createElement(Tag, {
    tone: "orange"
  }, fan.streak, " game streak")), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "0 18px",
      display: "flex",
      flexDirection: "column",
      gap: 12
    }
  }, challenges.map(c => /*#__PURE__*/React.createElement(ChallengeRow, _extends({
    key: c.title
  }, c)))), /*#__PURE__*/React.createElement(Ticker, {
    items: ["HORNS UP", "HARD HITS", "HEART OF TEXAS"],
    speed: 18
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "0 18px",
      display: "flex",
      alignItems: "baseline",
      justifyContent: "space-between",
      gap: 12
    }
  }, /*#__PURE__*/React.createElement("h2", {
    style: {
      fontSize: 30
    }
  }, "Spend your points"), /*#__PURE__*/React.createElement(TextLink, {
    onClick: onGoRewards,
    gap: 14,
    style: {
      fontSize: 11
    }
  }, "All rewards")), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "0 18px"
    }
  }, /*#__PURE__*/React.createElement(RewardCard, {
    category: "Experience",
    title: "Sideline warmup pass",
    cost: 4000,
    flag: "Limited",
    onRedeem: onGoRewards
  })));
}
Object.assign(window, {
  HomeScreen
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/fan_rewards/HomeScreen.jsx", error: String((e && e.message) || e) }); }

// ui_kits/fan_rewards/ProfileScreen.jsx
try { (() => {
const {
  TierBadge,
  Panel,
  Switch,
  Button,
  ProgressBar,
  Icon
} = window.ATXBullsDesignSystem_a4b13b;
function ProfileScreen({
  fan
}) {
  const [reminders, setReminders] = React.useState(true);
  const [drops, setDrops] = React.useState(true);
  const [board, setBoard] = React.useState(false);
  const ladder = [["rookie", 0], ["starter", 1000], ["captain", 2000], ["legend", 5000]];
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 18,
      padding: "0 18px 28px"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 16
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 58,
      height: 58,
      border: "2px solid var(--line)",
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      color: "var(--muted)"
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "user",
    size: 24
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h1", {
    style: {
      fontSize: 34
    }
  }, fan.name), /*#__PURE__*/React.createElement(TierBadge, {
    tier: fan.tier,
    size: "sm",
    style: {
      marginTop: 6
    }
  }))), /*#__PURE__*/React.createElement(Panel, {
    padding: 20
  }, /*#__PURE__*/React.createElement(ProgressBar, {
    value: fan.points,
    max: fan.points + fan.toNext,
    label: "Next tier · " + fan.nextTier,
    caption: fan.points.toLocaleString("en-US") + " / " + (fan.points + fan.toNext).toLocaleString("en-US")
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "space-between",
      marginTop: 22
    }
  }, ladder.map(([t, at]) => /*#__PURE__*/React.createElement("div", {
    key: t,
    style: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: 8,
      opacity: fan.points >= at ? 1 : 0.4
    }
  }, /*#__PURE__*/React.createElement(TierBadge, {
    tier: t,
    showLabel: false
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-ui)",
      fontWeight: 900,
      fontSize: 11,
      letterSpacing: "0.1em",
      color: "var(--muted)"
    }
  }, at.toLocaleString("en-US")))))), /*#__PURE__*/React.createElement(Panel, {
    padding: 20
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 10,
      marginBottom: 10,
      fontFamily: "var(--font-ui)",
      fontWeight: 800,
      fontSize: 10,
      letterSpacing: "0.2em",
      textTransform: "uppercase",
      color: "var(--orange)"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 24,
      height: 3,
      background: "currentColor"
    }
  }), "Notifications"), /*#__PURE__*/React.createElement(Switch, {
    checked: reminders,
    onChange: setReminders,
    label: "Game day reminders"
  }), /*#__PURE__*/React.createElement(Switch, {
    checked: drops,
    onChange: setDrops,
    label: "Merch and ticket drops"
  }), /*#__PURE__*/React.createElement(Switch, {
    checked: board,
    onChange: setBoard,
    label: "Show me on leaderboards"
  })), /*#__PURE__*/React.createElement(Panel, {
    padding: 0
  }, [["wallet", "Payment methods"], ["ticket", "Ticket history"], ["shield", "Account and privacy"], ["circle-help", "Help"]].map(([ic, label], i, a) => /*#__PURE__*/React.createElement("div", {
    key: label,
    style: {
      display: "flex",
      alignItems: "center",
      gap: 14,
      padding: "15px 18px",
      borderBottom: i === a.length - 1 ? "none" : "1px solid var(--line)",
      cursor: "pointer"
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: ic,
    size: 17,
    style: {
      color: "var(--muted)"
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1,
      fontFamily: "var(--font-ui)",
      fontWeight: 800,
      fontSize: 13,
      letterSpacing: "0.12em",
      textTransform: "uppercase",
      color: "var(--bone)"
    }
  }, label), /*#__PURE__*/React.createElement(Icon, {
    name: "chevron-right",
    size: 15,
    style: {
      color: "var(--muted)"
    }
  })))), /*#__PURE__*/React.createElement(Button, {
    variant: "ink",
    arrow: false,
    full: true
  }, "Sign out"));
}
Object.assign(window, {
  ProfileScreen
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/fan_rewards/ProfileScreen.jsx", error: String((e && e.message) || e) }); }

// ui_kits/fan_rewards/RankScreen.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const {
  Tabs,
  LeaderboardRow,
  Panel,
  Tag
} = window.ATXBullsDesignSystem_a4b13b;
function RankScreen({
  board
}) {
  const [tab, setTab] = React.useState("Season");
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 18,
      padding: "0 18px 28px"
    }
  }, /*#__PURE__*/React.createElement("h1", {
    style: {
      fontSize: 46
    }
  }, "Standings"), /*#__PURE__*/React.createElement(Tabs, {
    items: ["Season", "Game day", "Friends"],
    active: tab,
    onChange: setTab
  }), /*#__PURE__*/React.createElement(Panel, {
    padding: 20
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 10,
      fontFamily: "var(--font-ui)",
      fontWeight: 800,
      fontSize: 10,
      letterSpacing: "0.2em",
      textTransform: "uppercase",
      color: "var(--orange)"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 24,
      height: 3,
      background: "currentColor"
    }
  }), "Your rank"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "flex-end",
      gap: 12,
      marginTop: 6
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-display)",
      fontSize: 68,
      lineHeight: 0.86,
      letterSpacing: "-0.06em",
      color: "var(--orange)"
    }
  }, "5"), /*#__PURE__*/React.createElement("span", {
    style: {
      paddingBottom: 10,
      fontFamily: "var(--font-ui)",
      fontWeight: 800,
      fontSize: 11,
      letterSpacing: "0.17em",
      textTransform: "uppercase",
      color: "var(--muted)"
    }
  }, "of 8,412 fans")), /*#__PURE__*/React.createElement(Tag, {
    tone: "orange",
    style: {
      marginTop: 12
    }
  }, "Up 3 this week")), /*#__PURE__*/React.createElement(Panel, {
    padding: 0
  }, board.map((r, i) => /*#__PURE__*/React.createElement(LeaderboardRow, _extends({
    key: r.rank
  }, r, {
    style: i === board.length - 1 ? {
      borderBottom: "none"
    } : null
  })))));
}
Object.assign(window, {
  RankScreen
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/fan_rewards/RankScreen.jsx", error: String((e && e.message) || e) }); }

// ui_kits/fan_rewards/RewardsScreen.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const {
  Tabs,
  RewardCard,
  Dialog,
  Button,
  Tag
} = window.ATXBullsDesignSystem_a4b13b;
function RewardsScreen({
  rewards,
  points,
  onRedeem
}) {
  const [tab, setTab] = React.useState("All");
  const [pending, setPending] = React.useState(null);
  const list = tab === "All" ? rewards : rewards.filter(r => r.group === tab);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "0 18px 28px"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "baseline",
      justifyContent: "space-between",
      gap: 12
    }
  }, /*#__PURE__*/React.createElement("h1", {
    style: {
      fontSize: 46
    }
  }, "Rewards"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-ui)",
      fontWeight: 900,
      fontSize: 16,
      letterSpacing: "0.08em",
      color: "var(--orange)"
    }
  }, points.toLocaleString("en-US"), " PTS")), /*#__PURE__*/React.createElement(Tabs, {
    items: ["All", "Tickets", "Merch", "Experiences"],
    active: tab,
    onChange: setTab,
    style: {
      margin: "18px 0 20px",
      overflowX: "auto"
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: 12
    }
  }, list.map(r => /*#__PURE__*/React.createElement(RewardCard, _extends({
    key: r.title
  }, r, {
    onRedeem: () => setPending(r)
  })))), pending && /*#__PURE__*/React.createElement(Dialog, {
    eyebrow: "Confirm",
    title: "Redeem " + pending.title.toLowerCase() + "?",
    width: 330,
    onClose: () => setPending(null),
    footer: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Button, {
      size: "sm",
      onClick: () => {
        onRedeem(pending);
        setPending(null);
      }
    }, "Redeem"), /*#__PURE__*/React.createElement(Button, {
      size: "sm",
      variant: "ink",
      arrow: false,
      onClick: () => setPending(null)
    }, "Not yet"))
  }, "Costs ", pending.cost.toLocaleString("en-US"), " horn points.", /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 14
    }
  }, /*#__PURE__*/React.createElement(Tag, null, "Balance after \xB7 ", (points - pending.cost).toLocaleString("en-US")))));
}
Object.assign(window, {
  RewardsScreen
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/fan_rewards/RewardsScreen.jsx", error: String((e && e.message) || e) }); }

// ui_kits/fan_rewards/data.js
try { (() => {
window.ATX_DATA = {
  fan: {
    name: "Marisol V.",
    points: 1240,
    tier: "starter",
    nextTier: "Captain",
    toNext: 760,
    streak: 3
  },
  challenges: [{
    icon: "map-pin",
    title: "Check in at the gate",
    detail: "Opening night only",
    reward: 250,
    progress: 0,
    goal: 1
  }, {
    icon: "flame",
    title: "Attend three straight",
    detail: "2 of 3 home games",
    reward: 1000,
    progress: 2,
    goal: 3
  }, {
    icon: "share-2",
    title: "Bring a friend",
    detail: "Referral joined March 4",
    reward: 500,
    done: true
  }, {
    icon: "shirt",
    title: "Wear your horns",
    detail: "Scan any Drop 001 tag in the arena",
    reward: 300,
    progress: 0,
    goal: 1
  }],
  rewards: [{
    category: "Experience",
    title: "Sideline warmup pass",
    cost: 4000,
    badge: "Limited",
    group: "Experiences"
  }, {
    category: "Merch",
    title: "Blackout horn hat",
    cost: 1500,
    group: "Merch"
  }, {
    category: "Merch",
    title: "Heavyweight hoodie",
    cost: 3200,
    group: "Merch"
  }, {
    category: "Ticket",
    title: "Two seats, opening night",
    cost: 12000,
    locked: true,
    group: "Tickets"
  }, {
    category: "Experience",
    title: "Tunnel walkout, four fans",
    cost: 9000,
    locked: true,
    group: "Experiences"
  }, {
    category: "Ticket",
    title: "Seat upgrade, any game",
    cost: 2500,
    group: "Tickets"
  }],
  board: [{
    rank: 1,
    name: "Dominguez, R.",
    points: 18420,
    tier: "legend",
    trend: "up"
  }, {
    rank: 2,
    name: "Marisol V.",
    points: 16110,
    tier: "captain",
    trend: "down"
  }, {
    rank: 3,
    name: "Hollis, T.",
    points: 14980,
    tier: "captain",
    trend: "up"
  }, {
    rank: 4,
    name: "Ngo, A.",
    points: 12040,
    tier: "starter",
    trend: "up"
  }, {
    rank: 5,
    name: "Bautista, J.",
    points: 9820,
    tier: "starter",
    you: true,
    trend: "up"
  }, {
    rank: 6,
    name: "Reyes, C.",
    points: 8710,
    tier: "rookie",
    trend: "down"
  }]
};
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/fan_rewards/data.js", error: String((e && e.message) || e) }); }

// ui_kits/marketing_site/Hero.jsx
try { (() => {
const {
  Logo,
  Button,
  VerticalLockup,
  ProofRow
} = window.ATXBullsDesignSystem_a4b13b;
function Hero({
  onCta
}) {
  return /*#__PURE__*/React.createElement("section", {
    style: {
      position: "relative",
      minHeight: 940,
      display: "flex",
      alignItems: "center",
      overflow: "hidden",
      marginTop: "calc(var(--nav-h) * -1)"
    }
  }, /*#__PURE__*/React.createElement("video", {
    autoPlay: true,
    muted: true,
    loop: true,
    playsInline: true,
    poster: "https://atxbulls.com/hero-main-event.png",
    style: {
      position: "absolute",
      inset: 0,
      width: "100%",
      height: "100%",
      objectFit: "cover",
      filter: "var(--photo-filter)"
    }
  }, /*#__PURE__*/React.createElement("source", {
    src: "https://atxbulls.com/atx-bulls-hero.mp4",
    type: "video/mp4"
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      inset: 0,
      background: "var(--photo-shade)"
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      inset: 0,
      background: "var(--photo-fade-bottom)"
    }
  }), /*#__PURE__*/React.createElement("div", {
    className: "atx-shell",
    style: {
      position: "relative",
      zIndex: 2,
      paddingTop: "var(--nav-h)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 12,
      fontFamily: "var(--font-ui)",
      fontWeight: 800,
      fontSize: 12,
      letterSpacing: "0.2em",
      textTransform: "uppercase",
      color: "var(--orange)"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 34,
      height: 3,
      background: "currentColor"
    }
  }), "Arena football contender"), /*#__PURE__*/React.createElement("h1", {
    style: {
      marginTop: 24,
      fontSize: "var(--display-hero)",
      maxWidth: "11ch"
    }
  }, "Austin's ", /*#__PURE__*/React.createElement("em", null, "new main"), " event."), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: "26px 0 0",
      maxWidth: "34ch",
      fontFamily: "var(--font-ui)",
      fontWeight: 700,
      fontSize: "var(--lede-hero-size)",
      lineHeight: 1.35,
      letterSpacing: "0.015em",
      textTransform: "uppercase",
      color: "var(--lede-hero)"
    }
  }, "Lights out. Horns up.", /*#__PURE__*/React.createElement("br", null), "The most electric new show in Texas."), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 34
    }
  }, /*#__PURE__*/React.createElement(Button, {
    size: "lg",
    glow: true,
    onClick: onCta
  }, "Get in the arena")), /*#__PURE__*/React.createElement(ProofRow, {
    items: ["2027 season", "Arena football", "Austin, Texas"],
    style: {
      marginTop: 46,
      maxWidth: 560
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      right: 34,
      top: "50%",
      transform: "translateY(-50%)",
      zIndex: 2
    }
  }, /*#__PURE__*/React.createElement(VerticalLockup, null, "Loved here \xB7 Feared everywhere")), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      right: 90,
      bottom: 54,
      zIndex: 2,
      textAlign: "center"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--font-ui)",
      fontWeight: 800,
      fontSize: 10,
      letterSpacing: "0.2em",
      textTransform: "uppercase",
      color: "var(--muted)",
      marginBottom: 10
    }
  }, "Official league member"), /*#__PURE__*/React.createElement(Logo, {
    variant: "af1",
    height: 64
  })));
}
Object.assign(window, {
  Hero
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/marketing_site/Hero.jsx", error: String((e && e.message) || e) }); }

// ui_kits/marketing_site/Sections.jsx
try { (() => {
const {
  PhotoSection,
  SectionHeading,
  Button,
  TextLink,
  Stamp,
  ProofRow,
  EventSplit
} = window.ATXBullsDesignSystem_a4b13b;
function BannerSection() {
  return /*#__PURE__*/React.createElement("section", {
    style: {
      position: "relative",
      height: 420,
      borderTop: "1px solid var(--line)",
      overflow: "hidden"
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: "https://atxbulls.com/austin-tough-banner.png",
    alt: "ATX Bulls player overlooking the Austin skyline with the words Arena Football, Austin Tough",
    style: {
      position: "absolute",
      inset: 0,
      width: "100%",
      height: "100%",
      objectFit: "cover",
      filter: "var(--photo-filter)"
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      inset: 0,
      background: "var(--photo-fade-bottom)"
    }
  }));
}
function TryoutsSection({
  onRegister
}) {
  return /*#__PURE__*/React.createElement(PhotoSection, {
    image: "https://atxbulls.com/origin-story-2027.png",
    alt: "ATX Bulls players in official uniforms being filmed beneath the team crest in Austin",
    overlay: /*#__PURE__*/React.createElement(Stamp, {
      lines: ["ARE", "YOU", "READY?"],
      style: {
        position: "absolute",
        right: 110,
        top: 160
      }
    })
  }, /*#__PURE__*/React.createElement(SectionHeading, {
    eyebrow: "First official ATX Bulls tryout",
    lead: "The wait",
    emphasis: "is over.",
    lede: "Your opportunity. Your future. Our team."
  }), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: "26px 0 0",
      maxWidth: "52ch",
      fontFamily: "var(--font-body)",
      fontSize: 16,
      lineHeight: "24px",
      color: "var(--bone)"
    }
  }, "Get evaluated. Be seen. Compete at the highest level\u2014and earn the right to help make Austin football history."), /*#__PURE__*/React.createElement(EventSplit, {
    style: {
      margin: "40px 0",
      maxWidth: 620
    },
    items: [{
      label: "Date",
      value: "August 30"
    }, {
      label: "Location",
      value: "Austin, Texas"
    }]
  }), /*#__PURE__*/React.createElement(Button, {
    size: "lg",
    glow: true,
    onClick: onRegister
  }, "Register for tryouts"), /*#__PURE__*/React.createElement(ProofRow, {
    items: ["Get evaluated", "Compete", "Make history"],
    style: {
      marginTop: 44,
      maxWidth: 520
    }
  }));
}
function FamilySection({
  onCta
}) {
  return /*#__PURE__*/React.createElement(PhotoSection, {
    image: "https://atxbulls.com/family-arena-2027.png",
    alt: "ATX Bulls family cheering together inside a packed arena"
  }, /*#__PURE__*/React.createElement(SectionHeading, {
    eyebrow: "Opening night. March 20, 2027",
    lead: "Austin.",
    emphasis: "Pick your side.",
    lede: "Make memories you'll never forget."
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 34
    }
  }, /*#__PURE__*/React.createElement(Button, {
    onClick: onCta
  }, "Save your seats")), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 44,
      fontFamily: "var(--font-ui)",
      fontWeight: 900,
      fontSize: 14,
      letterSpacing: "0.17em",
      textTransform: "uppercase",
      color: "var(--bone)"
    }
  }, "Family night starts here", /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 8,
      fontWeight: 800,
      fontSize: 10,
      letterSpacing: "0.17em",
      color: "var(--muted)"
    }
  }, "Doors open 5:30 PM \xB7 Kickoff 7:00 PM")));
}
function StorySection({
  onCta
}) {
  return /*#__PURE__*/React.createElement(PhotoSection, {
    image: "https://atxbulls.com/story-section-2027.png",
    alt: "Two ATX Bulls players standing before the team crest in Austin"
  }, /*#__PURE__*/React.createElement(SectionHeading, {
    eyebrow: "Our origin story",
    lead: "Built on",
    emphasis: "Texas pride."
  }), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: "26px 0 0",
      maxWidth: "48ch",
      fontFamily: "var(--font-body)",
      fontSize: 16,
      lineHeight: "24px",
      color: "var(--bone)"
    }
  }, "Born in Austin. Forged for the arena. This is the story of a city, a team, and a new tradition built to hit different."), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 30
    }
  }, /*#__PURE__*/React.createElement(TextLink, {
    onClick: onCta
  }, "Meet your team")));
}
function UniformSection() {
  return /*#__PURE__*/React.createElement(PhotoSection, {
    image: "https://atxbulls.com/uniform-reveal.png",
    alt: "New ATX Bulls uniform shown from the front, back, and side with official helmet",
    overlay: /*#__PURE__*/React.createElement(Stamp, {
      lines: ["OFFICIAL", "2027", "UNIFORM"],
      style: {
        position: "absolute",
        right: 110,
        bottom: 140
      }
    })
  }, /*#__PURE__*/React.createElement(SectionHeading, {
    eyebrow: "New ATX Bulls uniforms \xB7 2027",
    lead: "Texas orange.",
    emphasis: "Never looked better."
  }), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: "26px 0 0",
      maxWidth: "46ch",
      fontFamily: "var(--font-body)",
      fontSize: 16,
      lineHeight: "24px",
      color: "var(--bone)"
    }
  }, "This isn't a uniform. It's what the other team sees before the lights go out."));
}
function MerchSection({
  onCta
}) {
  return /*#__PURE__*/React.createElement(PhotoSection, {
    image: "https://atxbulls.com/merch-hero.png",
    alt: "ATX Bulls blackout hoodie, shirt, cap, horn hat, and beanie collection",
    overlay: /*#__PURE__*/React.createElement(Stamp, {
      lines: ["OFFICIAL", "DROP", "001"],
      style: {
        position: "absolute",
        right: 110,
        top: 150
      }
    })
  }, /*#__PURE__*/React.createElement(SectionHeading, {
    eyebrow: "Official ATX Bulls gear \xB7 Drop 001",
    lead: "Wear your",
    emphasis: "horns.",
    lede: "Blackout essentials built for the fans."
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 34
    }
  }, /*#__PURE__*/React.createElement(Button, {
    size: "xl",
    onClick: onCta
  }, "Shop now")), /*#__PURE__*/React.createElement(ProofRow, {
    items: ["Premium heavyweight", "Limited edition", "Built in Austin"],
    style: {
      marginTop: 44,
      maxWidth: 620
    }
  }));
}
Object.assign(window, {
  BannerSection,
  TryoutsSection,
  FamilySection,
  StorySection,
  UniformSection,
  MerchSection
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/marketing_site/Sections.jsx", error: String((e && e.message) || e) }); }

// ui_kits/marketing_site/Site.jsx
try { (() => {
const {
  NavBar,
  Ticker,
  JoinInvert,
  Footer,
  VipModal
} = window.ATXBullsDesignSystem_a4b13b;
function Site() {
  const [solid, setSolid] = React.useState(false);
  const [vip, setVip] = React.useState(false);
  const ref = React.useRef(null);
  const openVip = () => setVip(true);
  return /*#__PURE__*/React.createElement("div", {
    ref: ref,
    onScroll: e => setSolid(e.currentTarget.scrollTop > 40),
    style: {
      height: "100vh",
      overflowY: "auto",
      background: "var(--ink)"
    }
  }, /*#__PURE__*/React.createElement(NavBar, {
    links: ["Tryouts", "Story", "Team", "Uniform", "Merch"],
    solid: solid,
    base: "../../",
    onCta: openVip,
    onLink: openVip
  }), /*#__PURE__*/React.createElement(Hero, {
    onCta: openVip
  }), /*#__PURE__*/React.createElement(Ticker, null), /*#__PURE__*/React.createElement(BannerSection, null), /*#__PURE__*/React.createElement(TryoutsSection, {
    onRegister: () => window.open("https://form.fillout.com/t/qVMoDaWhEmus", "_blank")
  }), /*#__PURE__*/React.createElement(FamilySection, {
    onCta: openVip
  }), /*#__PURE__*/React.createElement(StorySection, {
    onCta: openVip
  }), /*#__PURE__*/React.createElement(UniformSection, null), /*#__PURE__*/React.createElement(MerchSection, {
    onCta: openVip
  }), /*#__PURE__*/React.createElement(JoinInvert, {
    sub: "Be first to know when tickets drop! Enter email below.",
    socials: ["instagram", "twitter", "youtube"],
    base: "../../",
    onSubmit: () => setVip(false)
  }), /*#__PURE__*/React.createElement(Footer, {
    socials: ["instagram", "twitter", "youtube"]
  }), /*#__PURE__*/React.createElement(VipModal, {
    open: vip,
    onClose: () => setVip(false),
    onSubmit: () => setVip(false)
  }));
}
Object.assign(window, {
  Site
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/marketing_site/Site.jsx", error: String((e && e.message) || e) }); }

__ds_ns.EventSplit = __ds_scope.EventSplit;

__ds_ns.Eyebrow = __ds_scope.Eyebrow;

__ds_ns.Logo = __ds_scope.Logo;

__ds_ns.ProofRow = __ds_scope.ProofRow;

__ds_ns.SectionHeading = __ds_scope.SectionHeading;

__ds_ns.Stamp = __ds_scope.Stamp;

__ds_ns.Ticker = __ds_scope.Ticker;

__ds_ns.VerticalLockup = __ds_scope.VerticalLockup;

__ds_ns.Button = __ds_scope.Button;

__ds_ns.Icon = __ds_scope.Icon;

__ds_ns.IconSquare = __ds_scope.IconSquare;

__ds_ns.Panel = __ds_scope.Panel;

__ds_ns.Tag = __ds_scope.Tag;

__ds_ns.TextLink = __ds_scope.TextLink;

__ds_ns.Dialog = __ds_scope.Dialog;

__ds_ns.ProgressBar = __ds_scope.ProgressBar;

__ds_ns.Toast = __ds_scope.Toast;

__ds_ns.Checkbox = __ds_scope.Checkbox;

__ds_ns.Input = __ds_scope.Input;

__ds_ns.Switch = __ds_scope.Switch;

__ds_ns.TabBar = __ds_scope.TabBar;

__ds_ns.Tabs = __ds_scope.Tabs;

__ds_ns.ChallengeRow = __ds_scope.ChallengeRow;

__ds_ns.LeaderboardRow = __ds_scope.LeaderboardRow;

__ds_ns.PointsMeter = __ds_scope.PointsMeter;

__ds_ns.RewardCard = __ds_scope.RewardCard;

__ds_ns.TicketStub = __ds_scope.TicketStub;

__ds_ns.TIERS = __ds_scope.TIERS;

__ds_ns.TierBadge = __ds_scope.TierBadge;

__ds_ns.Footer = __ds_scope.Footer;

__ds_ns.JoinInvert = __ds_scope.JoinInvert;

__ds_ns.NavBar = __ds_scope.NavBar;

__ds_ns.PhotoSection = __ds_scope.PhotoSection;

__ds_ns.PlayerCard = __ds_scope.PlayerCard;

__ds_ns.ScheduleTable = __ds_scope.ScheduleTable;

__ds_ns.VipModal = __ds_scope.VipModal;

})();
