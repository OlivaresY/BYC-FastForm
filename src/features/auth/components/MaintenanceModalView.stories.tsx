import React, { useCallback, useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import type { Meta, StoryObj } from '@storybook/react-native';
import { BASE_BUTTON_VARIANTS, BaseButton } from '@/shared/ui';
import {
  MaintenanceModalView,
  type MaintenanceModalViewProps,
} from './MaintenanceModalView';

const PREVIEW_AUTO_CLOSE_MS = 10000 as const;

const PREVIEW_COPY = {
  BUTTON_LABEL: 'Previsualizar Modal (10s)',
  CUSTOM_BACKEND_MESSAGE:
    'Estamos realizando mejoras en la plataforma de crédito. Volveremos en 15 minutos.',
  DESCRIPTION:
    'Este modal bloquea toda la aplicación durante una ventana de mantenimiento. Presiona el botón para previsualizarlo sin bloquear la navegación de Storybook; se cerrará automáticamente tras 10 segundos.',
  TITLE: 'Vista Previa de Mantenimiento',
} as const;

type MaintenancePreviewWrapperProps = Omit<
  MaintenanceModalViewProps,
  'isVisible'
>;

const MaintenancePreviewWrapper = ({
  message,
  testID,
}: MaintenancePreviewWrapperProps): React.JSX.Element => {
  const [isPreviewOpen, setIsPreviewOpen] = useState<boolean>(false);

  const handleOpenPreview = useCallback((): void => {
    setIsPreviewOpen(true);
  }, []);

  useEffect(() => {
    if (!isPreviewOpen) {
      return undefined;
    }

    const timerId = setTimeout(() => {
      setIsPreviewOpen(false);
    }, PREVIEW_AUTO_CLOSE_MS);

    return () => {
      clearTimeout(timerId);
    };
  }, [isPreviewOpen]);

  return (
    <View className='flex-1 items-center justify-center bg-[#F7F7F6] px-6'>
      <View className='w-full max-w-sm items-center rounded-2xl bg-white p-6'>
        <Text className='text-center text-lg font-bold text-[#111111]'>
          {PREVIEW_COPY.TITLE}
        </Text>
        <Text className='mb-6 mt-2 text-center text-sm leading-5 text-[#5A6B80]'>
          {PREVIEW_COPY.DESCRIPTION}
        </Text>
        <BaseButton
          className='min-h-[48px] bg-[#B91C1C]'
          fullWidth
          label={PREVIEW_COPY.BUTTON_LABEL}
          onPress={handleOpenPreview}
          variant={BASE_BUTTON_VARIANTS.PRIMARY}
        />
      </View>

      <MaintenanceModalView
        isVisible={isPreviewOpen}
        message={message}
        testID={testID}
      />
    </View>
  );
};

const meta = {
  argTypes: {
    isVisible: {
      control: false,
      table: {
        disable: true,
      },
    },
  },
  args: {
    isVisible: false,
  },
  component: MaintenanceModalView,
  title: 'Features/Auth/Maintenance Modal View',
} satisfies Meta<typeof MaintenanceModalView>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    isVisible: false,
  },
  render: ({ message, testID }): React.JSX.Element => (
    <MaintenancePreviewWrapper message={message} testID={testID} />
  ),
};

export const CustomBackendMessage: Story = {
  args: {
    isVisible: false,
    message: PREVIEW_COPY.CUSTOM_BACKEND_MESSAGE,
  },
  render: ({ message, testID }): React.JSX.Element => (
    <MaintenancePreviewWrapper message={message} testID={testID} />
  ),
};
