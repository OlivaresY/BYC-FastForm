import React from 'react';
import Svg, { Circle } from 'react-native-svg';
import type { IconProps } from './Icons.types';

export const CircleIcon = ({
  color = '#D1D5DB',
  height,
  size = 24,
  strokeWidth = 2,
  width,
  ...rest
}: IconProps): React.JSX.Element => (
  <Svg
    fill='none'
    height={height ?? size}
    stroke={color}
    strokeLinecap='round'
    strokeLinejoin='round'
    strokeWidth={strokeWidth}
    viewBox='0 0 24 24'
    width={width ?? size}
    {...rest}
  >
    <Circle cx={12} cy={12} fill='none' r={10} />
  </Svg>
);
