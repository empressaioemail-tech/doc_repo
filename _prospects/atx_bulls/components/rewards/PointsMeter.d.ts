/**
 * Points balance hero for the fan app: huge Archivo Black total, tier bars, progress rail.
 */
export interface PointsMeterProps {
  points?: number;
  tier?: "rookie" | "starter" | "captain" | "legend";
  nextTier?: string;
  toNext?: number;
  /** Eyebrow label. "Horn points" is the product name for the currency. */
  label?: string;
  style?: React.CSSProperties;
}
export declare function PointsMeter(props: PointsMeterProps): JSX.Element;
