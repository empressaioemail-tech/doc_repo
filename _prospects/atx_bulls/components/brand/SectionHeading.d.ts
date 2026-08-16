/**
 * The copy stack every section repeats: eyebrow, huge H2 with an orange em, uppercase lede.
 */
export interface SectionHeadingProps {
  eyebrow?: string;
  eyebrowTone?: "orange" | "muted" | "ink";
  /** First words of the headline, in bone. */
  lead: string;
  /** The punch words, rendered orange and upright — never italic. */
  emphasis?: string;
  /** Any words after the emphasis. */
  trail?: string;
  /** Uppercase condensed subhead. Never sentence-case body copy. */
  lede?: string;
  /** CSS size override; defaults to --display-section. */
  size?: string;
  /** Flip to ink type for the orange invert sections. */
  invert?: boolean;
  style?: React.CSSProperties;
}
export declare function SectionHeading(props: SectionHeadingProps): JSX.Element;
