/** 44x44 square icon control — social row on the orange invert, utility icons on ink. */
export interface IconSquareProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon: string;
  label: string;
  /** ink = 2px ink border (on orange). bone = 2px hairline (on ink). */
  variant?: "ink" | "bone";
  size?: number;
}
export declare function IconSquare(props: IconSquareProps): JSX.Element;
