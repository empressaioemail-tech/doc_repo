/**
 * Site header: 78px, mark left, centred caps links, orange CTA right.
 * Transparent over the hero; `solid` after scroll (ink at 90%, 18px blur, hairline).
 */
export interface NavBarProps {
  /** Live order: TRYOUTS STORY TEAM UNIFORM MERCH. */
  links?: string[];
  cta?: string;
  solid?: boolean;
  base?: string;
  onCta?: () => void;
  onLink?: (label: string) => void;
  style?: React.CSSProperties;
}
export declare function NavBar(props: NavBarProps): JSX.Element;
