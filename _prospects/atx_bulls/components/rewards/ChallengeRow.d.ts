/** One earnable challenge — attend, check in, share, predict. */
export interface ChallengeRowProps {
  title: string;
  detail?: string;
  icon?: string;
  reward?: number;
  progress?: number;
  goal?: number;
  done?: boolean;
  onClick?: () => void;
  style?: React.CSSProperties;
}
export declare function ChallengeRow(props: ChallengeRowProps): JSX.Element;
