import React from 'react';
import Svg, { Circle, Path } from 'react-native-svg';
import type { IconProps } from './Icons.types';

export const MapPinIcon = ({
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
    <Path d='M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0' />
    <Circle
      cx={12}
      cy={10}
      r={3}
    />
  </Svg>
);
