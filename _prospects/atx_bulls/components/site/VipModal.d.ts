/**
 * The site's only modal. Orange chamfered panel over a blurred near-black scrim,
 * 48px ink close square in the corner. Every unbuilt CTA opens this.
 */
export interface VipModalProps {
  open?: boolean;
  title?: string;
  sub?: string;
  onClose?: () => void;
  onSubmit?: (email: string) => void;
  style?: React.CSSProperties;
}
export declare function VipModal(props: VipModalProps): JSX.Element;
