import React from "react";
import Svg, { Circle, Path } from "react-native-svg";
import type { IconProps } from "./Icons.types";

export const ClockIcon = ({
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
    <Circle cx={12} cy={12} fill="none" r={10} />
    <Path d="M12 6v6l4 2" />
  </Svg>
);
