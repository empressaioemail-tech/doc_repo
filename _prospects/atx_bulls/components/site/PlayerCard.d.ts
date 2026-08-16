/**
 * Roster card. Defined in the live stylesheet but not yet rendered on any page —
 * use it for team surfaces rather than inventing a new roster treatment.
 */
export interface PlayerCardProps {
  number: string | number;
  name: string;
  position: string;
  image?: string;
  height?: number;
  style?: React.CSSProperties;
}
export declare function PlayerCard(props: PlayerCardProps): JSX.Element;
