import React from "react";
import Svg, { Path } from "react-native-svg";
import type { IconProps } from "./Icons.types";

export const ChevronDownIcon = ({
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
    <Path d="M6 9l6 6 6-6" />
  </Svg>
);
