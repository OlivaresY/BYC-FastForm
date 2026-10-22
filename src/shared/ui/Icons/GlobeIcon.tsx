import React from 'react';
import Svg, { Path } from 'react-native-svg';
import type { IconProps } from './Icons.types';

export const GlobeIcon = ({
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
    <Path d='M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2z' />
    <Path d='M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z' />
    <Path d='M2 12h20' />
  </Svg>
);
