import React from 'react';
import Svg, { Circle, Path, Rect } from 'react-native-svg';
import type { IconProps } from './Icons.types';

export const BanknoteIcon = ({
  color = '#5A6B80',
  height,
  size = 24,
  strokeWidth = 2,
  width,
  ...rest
}: IconProps): React.JSX.Element => (
  <Svg
    accessible={false}
    fill='none'
    height={height ?? size}
    importantForAccessibility='no'
    stroke={color}
    strokeLinecap='round'
    strokeLinejoin='round'
    strokeWidth={strokeWidth}
    viewBox='0 0 24 24'
    width={width ?? size}
    {...rest}
  >
    <Rect
      height={12}
      rx={2}
      width={20}
      x={2}
      y={6}
    />
    <Circle
      cx={12}
      cy={12}
      r={2}
    />
    <Path d='M6 12h.01M18 12h.01' />
  </Svg>
);
