import React, { useState } from 'react';
import { View } from 'react-native';
import { BaseButton } from '@/shared/ui';

export const MODAL_STORY_WRAPPER_CONSTANTS = {
  DEFAULT_TITLE: 'Abrir Modal',
} as const;

interface ModalStoryWrapperProps {
  children: (isOpen: boolean, onClose: () => void) => React.ReactNode;
  title?: string;
}

export const ModalStoryWrapper = ({
  children,
  title = MODAL_STORY_WRAPPER_CONSTANTS.DEFAULT_TITLE,
}: ModalStoryWrapperProps): React.JSX.Element => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <View className='flex-1 items-center justify-center p-4'>
      <BaseButton
        label={title}
        onPress={(): void => setIsOpen(true)}
        variant='primary'
      />

      {/* Render the modal passing the state and the close handler */}
      {children(isOpen, (): void => setIsOpen(false))}
    </View>
  );
};
