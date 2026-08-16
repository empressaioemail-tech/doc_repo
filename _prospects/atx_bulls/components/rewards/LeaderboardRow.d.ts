/** One rank row. The signed-in fan's row inverts to a full orange field. */
export interface LeaderboardRowProps {
  rank: number;
  name: string;
  points: number;
  tier?: "rookie" | "starter" | "captain" | "legend";
  you?: boolean;
  trend?: "up" | "down";
  style?: React.CSSProperties;
}
export declare function LeaderboardRow(props: LeaderboardRowProps): JSX.Element;
