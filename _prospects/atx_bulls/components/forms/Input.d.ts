/**
 * Text field. No rounded corners, no grey chrome. Placeholders are uppercase.
 */
export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  hint?: string;
  error?: string;
  /** bordered = 2px edge, 58px tall. underline = 3px rule only, 24px type. */
  variant?: "bordered" | "underline";
  /** bone for ink backgrounds, ink for the orange invert. */
  tone?: "bone" | "ink";
  full?: boolean;
}
export declare function Input(props: InputProps): JSX.Element;
