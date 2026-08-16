/** Square progress rail for tier and challenge progress. Orange fill on a hairline well. */
export interface ProgressBarProps {
  value?: number;
  max?: number;
  height?: number;
  /** 9px muted micro-label, top left. */
  label?: string;
  /** Counter, top right, e.g. "1,240 / 2,000". */
  caption?: string;
  style?: React.CSSProperties;
}
export declare function ProgressBar(props: ProgressBarProps): JSX.Element;
