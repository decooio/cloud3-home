import { CSSProperties } from "react";

export interface BaseProps{
  className?: string;
  style?: CSSProperties;
  disableTheme?: boolean;
}

export interface BasePropsWithChildren extends BaseProps {
  children: any
}