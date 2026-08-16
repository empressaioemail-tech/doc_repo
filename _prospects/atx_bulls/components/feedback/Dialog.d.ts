/**
 * Modal, built on the VIP modal's geometry: chamfered panel, blurred near-black scrim,
 * 44px ink close square. `invert` gives the orange field for conversion moments.
 */
export interface DialogProps {
  open?: boolean;
  title: React.ReactNode;
  eyebrow?: string;
  /** Orange field with ink type. */
  invert?: boolean;
  onClose?: () => void;
  footer?: React.ReactNode;
  children?: React.ReactNode;
  width?: number;
  style?: React.CSSProperties;
}
export declare function Dialog(props: DialogProps): JSX.Element;
