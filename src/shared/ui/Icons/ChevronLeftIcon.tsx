import React from 'react';
import Svg, { Path } from 'react-native-svg';
import type { IconProps } from './Icons.types';

export const ChevronLeftIcon = ({
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
    <Path d='m15 18-6-6 6-6' />
  </Svg>
);
