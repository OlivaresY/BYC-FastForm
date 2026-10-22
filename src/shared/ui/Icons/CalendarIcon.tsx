import React from 'react';
import Svg, { Path, Rect } from 'react-native-svg';
import type { IconProps } from './Icons.types';

export const CalendarIcon = ({
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
    <Rect fill='none' height={18} rx={2} ry={2} width={18} x={3} y={4} />
    <Path d='M16 2v4' />
    <Path d='M8 2v4' />
    <Path d='M3 10h18' />
  </Svg>
);
