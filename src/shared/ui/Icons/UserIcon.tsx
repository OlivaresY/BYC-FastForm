import React from 'react';
import Svg, { Circle, Path } from 'react-native-svg';
import type { IconProps } from './Icons.types';

export const UserIcon = ({
  color = '#5A6B80',
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
    <Circle cx={12} cy={7} fill='none' r={4} />
    <Path d='M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2' />
  </Svg>
);
