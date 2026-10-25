import React from 'react';
import Svg, { Path, Rect } from 'react-native-svg';
import type { IconProps } from './Icons.types';

export const SmartphoneIcon = ({
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
      height={20}
      rx={2}
      ry={2}
      width={14}
      x={5}
      y={2}
    />
    <Path d='M12 18h.01' />
  </Svg>
);
