/** Underlined secondary action. 2px rule, uppercase condensed, NE arrow. */
export interface TextLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  /** bone on ink backgrounds, ink on the orange invert. */
  variant?: "bone" | "ink";
  /** Space between label and arrow. Defaults 34 (bone) / 48 (ink). */
  gap?: number;
  children?: React.ReactNode;
}
export declare function TextLink(props: TextLinkProps): JSX.Element;
