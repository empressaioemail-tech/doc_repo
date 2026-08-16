export interface ScheduleGame { date: string; opponent: string; venue: string }
/**
 * Bone-inverted schedule table. Latent in the live CSS; the 2027 schedule is
 * not published, so treat rows as placeholders.
 */
export interface ScheduleTableProps {
  games: ScheduleGame[];
  style?: React.CSSProperties;
}
export declare function ScheduleTable(props: ScheduleTableProps): JSX.Element;
