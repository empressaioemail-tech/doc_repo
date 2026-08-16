/**
 * Flat surface. Hairlines, not cards: zero radius, 1px --line, no drop shadow.
 */
export interface PanelProps {
  /** panel = #15110f fill. hairline = border only. ink, orange (invert), frost (over photos). */
  variant?: "panel" | "hairline" | "ink" | "orange" | "frost";
  /** Bottom-right chamfer, matching the VIP modal. */
  chamfer?: boolean;
  /** Hover raises 2px and turns the hairline orange. */
  interactive?: boolean;
  padding?: number | string;
  children?: React.ReactNode;
  style?: React.CSSProperties;
}
export declare function Panel(props: PanelProps): JSX.Element;
