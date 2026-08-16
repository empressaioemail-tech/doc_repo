/**
 * The conversion moment: a full orange field with ink type, centred lockup and
 * underline-only email capture. The only inverted section on the site.
 */
export interface JoinInvertProps {
  eyebrow?: string;
  title?: string;
  sub?: string;
  /** Lucide icon names for the square social row. */
  socials?: string[];
  base?: string;
  onSubmit?: (email: string) => void;
  style?: React.CSSProperties;
}
export declare function JoinInvert(props: JoinInvertProps): JSX.Element;
