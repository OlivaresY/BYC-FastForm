import React from 'react';
import Svg, { Path, Rect } from 'react-native-svg';
import type { IconProps } from './Icons.types';

export const MailIcon = ({
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
    <Rect height={16} rx={2} width={20} x={2} y={4} />
    <Path d='m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7' />
  </Svg>
);
