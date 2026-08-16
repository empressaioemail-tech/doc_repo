/**
 * A redeemable item in the rewards catalog.
 */
export interface RewardCardProps {
  title: string;
  /** 9px uppercase kicker: Experience, Merch, Ticket. */
  category?: string;
  cost: number;
  image?: string;
  imageAlt?: string;
  /** Square corner flag, e.g. "Limited". */
  flag?: string;
  /** Tier-gated: dimmed, disabled, still visible. */
  locked?: boolean;
  onRedeem?: () => void;
  style?: React.CSSProperties;
}
export declare function RewardCard(props: RewardCardProps): JSX.Element;
