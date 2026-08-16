/** Orange kicker with a 34x3px leading bar. Every section opens with one. */
export interface EyebrowProps {
  tone?: "orange" | "muted" | "ink";
  children?: React.ReactNode;
  style?: React.CSSProperties;
}
export declare function Eyebrow(props: EyebrowProps): JSX.Element;
