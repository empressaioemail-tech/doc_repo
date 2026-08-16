export interface TabBarItem { id: string; label: string; icon: string; count?: number }
/** Bottom app navigation. Intentional addition — active item takes a 3px orange top rule. */
export interface TabBarProps {
  items: TabBarItem[];
  active: string;
  onChange?: (id: string) => void;
  style?: React.CSSProperties;
}
export declare function TabBar(props: TabBarProps): JSX.Element;
