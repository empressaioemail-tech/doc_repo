/**
 * The repeating section pattern: full-bleed cinematic photo, left-shaded to near-black,
 * faint 88px grid masked toward the image, copy stack on the left.
 */
export interface PhotoSectionProps {
  /** Photo URL. Live assets are listed in readme.md. */
  image?: string;
  alt?: string;
  /** 900–940px on the live site. */
  minHeight?: number;
  /** Radial orange bloom inside the photo. */
  glow?: boolean;
  /** Faint hairline grid over the shaded side. */
  grid?: boolean;
  align?: "center" | "flex-end" | "flex-start";
  /** Absolutely-positioned extras (stamps, vertical lockups, badges). */
  overlay?: React.ReactNode;
  children?: React.ReactNode;
  style?: React.CSSProperties;
}
export declare function PhotoSection(props: PhotoSectionProps): JSX.Element;
