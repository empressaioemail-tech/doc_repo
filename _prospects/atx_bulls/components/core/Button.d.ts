/**
 * Primary CTA. Orange fill, ink type, bottom-right chamfer, trailing NE arrow.
 * Hover inverts to bone and rises 2px. Never rounded, never scaled.
 */
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** primary = orange field. bone = for use on an orange invert. ink = on bone. */
  variant?: "primary" | "bone" | "ink";
  /** sm 42px · md 56px · lg 64px (tryouts) · xl 68px (merch) */
  size?: "sm" | "md" | "lg" | "xl";
  /** Trailing north-east arrow. On by default — the site uses it on every CTA. */
  arrow?: boolean;
  /** Orange bloom under featured CTAs only. */
  glow?: boolean;
  full?: boolean;
  children?: React.ReactNode;
}
export declare function Button(props: ButtonProps): JSX.Element;
