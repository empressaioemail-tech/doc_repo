/**
 * Full-bleed orange marquee band: "HORNS UP × HARD HITS × HEART OF TEXAS ×".
 * 54px tall, ink type, 22s linear loop, disabled under prefers-reduced-motion.
 */
export interface TickerProps {
  /** Short shouted phrases. Defaults to the team chant. */
  items?: string[];
  /** Glyph between phrases. The site uses a 24px multiplication sign. */
  separator?: string;
  /** Seconds per loop. 22 on the live site. */
  speed?: number;
  style?: React.CSSProperties;
}
export declare function Ticker(props: TickerProps): JSX.Element;
