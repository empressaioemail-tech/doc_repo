/** In-page filter switcher. 3px orange underline on the active item. */
export interface TabsProps {
  items: Array<string | { id: string; label: string }>;
  active: string;
  onChange?: (id: string) => void;
  style?: React.CSSProperties;
}
export declare function Tabs(props: TabsProps): JSX.Element;
