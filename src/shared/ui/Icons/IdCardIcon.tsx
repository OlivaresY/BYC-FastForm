import React from "react";
import Svg, { Path, Rect } from "react-native-svg";
import type { IconProps } from "./Icons.types";

export const IdCardIcon = ({
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
    <Rect fill="none" height={16} rx={2} ry={2} width={18} x={3} y={4} />
    <Path d="M7 8h10" />
    <Path d="M7 12h4" />
    <Path d="M7 16h8" />
  </Svg>
);
