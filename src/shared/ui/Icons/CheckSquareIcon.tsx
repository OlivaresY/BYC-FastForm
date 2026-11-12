import React from 'react';
import Svg, { Path, Rect } from 'react-native-svg';
import type { IconProps } from './Icons.types';

export const CheckSquareIcon = ({
  color = '#111111',
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
    <Rect
      height={18}
      rx={2}
      ry={2}
      width={18}
      x={3}
      y={3}
    />
    <Path d='m9 12 2 2 4-4' />
  </Svg>
);

