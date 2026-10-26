import React from 'react';
import { Text, View } from 'react-native';

export interface SectionHeaderProps {
  className?: string;
  icon?: React.ReactNode;
  testID?: string;
  title: string;
  titleClassName?: string;
}

export const SECTION_HEADER_STYLES = {
  ROW: 'flex-row items-center gap-2 mb-1',
  TITLE: 'text-xs font-bold uppercase tracking-wider text-text-primary',
} as const;

export const SectionHeader = ({
  className,
  icon,
  testID,
  title,
  titleClassName,
}: SectionHeaderProps): React.JSX.Element => (
  <View
    className={
      className
        ? `${SECTION_HEADER_STYLES.ROW} ${className}`
        : SECTION_HEADER_STYLES.ROW
    }
    testID={testID}
  >
    {icon}
    <Text
      accessibilityRole='header'
      className={
        titleClassName
          ? `${SECTION_HEADER_STYLES.TITLE} ${titleClassName}`
          : SECTION_HEADER_STYLES.TITLE
      }
    >
      {title}
    </Text>
  </View>
);
