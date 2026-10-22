import React from 'react';
import Svg, { Path } from 'react-native-svg';
import type { IconProps } from './Icons.types';

export const DocumentIcon = ({
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
    <Path d='M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z' />
    <Path d='M14 2v6h6' />
    <Path d='M16 13H8' />
    <Path d='M16 17H8' />
    <Path d='M10 9H8' />
  </Svg>
);
