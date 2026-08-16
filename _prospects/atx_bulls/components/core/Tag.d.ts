/**
 * Square metadata tag. INTENTIONAL ADDITION — the live site has no badge component;
 * this exists for new surfaces (rewards, merch flags) and keeps the 0-radius rule.
 */
export interface TagProps {
  tone?: "orange" | "outline" | "bone" | "ink";
  children?: React.ReactNode;
  style?: React.CSSProperties;
}
export declare function Tag(props: TagProps): JSX.Element;
