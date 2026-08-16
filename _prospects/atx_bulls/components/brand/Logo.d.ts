/**
 * The official ATX Bulls mark / lockup, and the AF1 league mark.
 * Never redraw or recolour these.
 */
export interface LogoProps {
  /** mark = bull head. lockup = ATX BULLS + head. af1 = league mark (navy/red, not team colours). */
  variant?: "mark" | "lockup" | "af1";
  height?: number;
  /** The hero lockup's heavy shadow: drop-shadow(0 20px 54px #000000bf) + orange bloom. */
  dropShadow?: boolean;
  /** Path prefix for the local fallback files, e.g. "../../". */
  base?: string;
  style?: React.CSSProperties;
}
export declare function Logo(props: LogoProps): JSX.Element;
