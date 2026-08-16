/** Hairline-separated credibility row under a CTA. 10px muted caps. */
export interface ProofRowProps {
  /** 2–4 short phrases, e.g. ["2027 season","Arena football","Austin, Texas"]. */
  items: string[];
  tone?: "muted" | "ink";
  style?: React.CSSProperties;
}
export declare function ProofRow(props: ProofRowProps): JSX.Element;
