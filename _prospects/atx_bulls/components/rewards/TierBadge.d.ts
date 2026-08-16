/**
 * Fan status mark — four stacked bars, filled to the fan's level.
 * Intentional addition for the rewards platform; uses brand colours only (no gold/silver metals).
 */
export interface TierBadgeProps {
  tier?: "rookie" | "starter" | "captain" | "legend";
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
  style?: React.CSSProperties;
}
export declare function TierBadge(props: TierBadgeProps): JSX.Element;
export declare const TIERS: Record<string, { label: string; color: string }>;
