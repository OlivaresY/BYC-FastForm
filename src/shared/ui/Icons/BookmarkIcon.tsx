import React from "react";
import Svg, { Path } from "react-native-svg";
import type { IconProps } from "./Icons.types";

export const BookmarkIcon = ({
  color = "#5A6B80",
  height,
  size = 24,
  strokeWidth = 2,
  width,
  ...rest
}: IconProps): React.JSX.Element => (
  <Svg
    fill="none"
    height={height ?? size}
    stroke={color}
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth={strokeWidth}
    viewBox="0 0 24 24"
    width={width ?? size}
    {...rest}
  >
    <Path d="M19 21l-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
  </Svg>
);
