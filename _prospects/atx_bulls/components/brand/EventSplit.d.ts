export interface EventSplitItem { label: string; value: string }
/** Hairline-boxed label/value grid — the tryouts DATE / LOCATION block. */
export interface EventSplitProps {
  items: EventSplitItem[];
  style?: React.CSSProperties;
}
export declare function EventSplit(props: EventSplitProps): JSX.Element;
