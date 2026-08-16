/** Transient confirmation on new surfaces. Panel fill, 3px orange left rule. */
export interface ToastProps {
  tone?: "orange" | "burnt";
  title: React.ReactNode;
  detail?: React.ReactNode;
  /** Optional Lucide glyph. */
  icon?: string;
  style?: React.CSSProperties;
}
export declare function Toast(props: ToastProps): JSX.Element;
