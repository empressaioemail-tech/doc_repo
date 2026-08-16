/**
 * Digital ticket in the fan wallet. Orange cap rule, dashed tear line, Barlow 900 seat data.
 */
export interface TicketStubProps {
  matchup: string;
  date: string;
  time: string;
  venue: string;
  section: string;
  row: string;
  seat: string;
  status?: string;
  style?: React.CSSProperties;
}
export declare function TicketStub(props: TicketStubProps): JSX.Element;
