import React, { useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

interface ModalStoryWrapperProps {
  children: (isOpen: boolean, onClose: () => void) => React.ReactNode;
  title?: string;
}

export const ModalStoryWrapper = ({
  title = 'Abrir Modal',
  children,
}: ModalStoryWrapperProps): React.JSX.Element => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <View className='flex-1 items-center justify-center p-4'>
      <TouchableOpacity
        className='rounded-xl bg-blue-600 px-6 py-4 shadow-sm active:bg-blue-700'
        onPress={() => setIsOpen(true)}
      >
        <Text className='text-lg font-bold text-white'>{title}</Text>
      </TouchableOpacity>

      {/* Render the modal passing the state and the close handler */}
      {children(isOpen, () => setIsOpen(false))}
    </View>
  );
};
