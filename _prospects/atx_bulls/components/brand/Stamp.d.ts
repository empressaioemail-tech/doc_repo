/**
 * Circular frosted stamp overlaid on photography — the only circle in the system.
 */
export interface StampProps {
  /** 2–3 short lines, e.g. ["OFFICIAL","2027","UNIFORM"]. */
  lines: string[];
  /** 108–116px on the live site. */
  size?: number;
  /** Degrees of tilt. 8 on the live site. */
  rotate?: number;
  style?: React.CSSProperties;
}
export declare function Stamp(props: StampProps): JSX.Element;
