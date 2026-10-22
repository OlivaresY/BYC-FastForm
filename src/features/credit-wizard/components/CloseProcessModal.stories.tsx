import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-native';
import { ModalStoryWrapper } from '@/shared/components/ModalStoryWrapper';
import { CloseProcessModal } from './CloseProcessModal';

const meta = {
  title: 'Features/CreditWizard/CloseProcessModal',
  component: CloseProcessModal,
  args: {
    onClose: () => console.log('Close clicked'),
    onDiscard: () => console.log('Discard clicked'),
    onSaveDraft: () => console.log('Save draft clicked'),
    visible: false,
  },
} satisfies Meta<typeof CloseProcessModal>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <ModalStoryWrapper title='Abrir Modal de Cierre'>
      {(isOpen, onClose) => (
        <CloseProcessModal
          {...args}
          onClose={onClose}
          onDiscard={() => {
            if (args.onDiscard) args.onDiscard();
            onClose();
          }}
          onSaveDraft={() => {
            if (args.onSaveDraft) args.onSaveDraft();
            onClose();
          }}
          visible={isOpen}
        />
      )}
    </ModalStoryWrapper>
  ),
  args: {
    visible: false,
  },
};

export const Visible: Story = {
  render: (args) => (
    <ModalStoryWrapper title='Abrir Modal de Cierre (Visible)'>
      {(isOpen, onClose) => (
        <CloseProcessModal
          {...args}
          onClose={onClose}
          onDiscard={() => {
            if (args.onDiscard) args.onDiscard();
            onClose();
          }}
          onSaveDraft={() => {
            if (args.onSaveDraft) args.onSaveDraft();
            onClose();
          }}
          visible={isOpen}
        />
      )}
    </ModalStoryWrapper>
  ),
  args: {
    visible: true,
  },
};
