import React from 'react';
import { View } from 'react-native';
import type { Meta, StoryObj } from '@storybook/react-native';
import {
  AUTH_SERVICE_ERRORS,
  type IAuthProvider,
} from '../services/auth.service';
import type { AuthUser, LoginCredentials } from '../types/Auth.types';
import { LoginScreenView } from './LoginScreenView';

const mockDefaultAuthProvider: IAuthProvider = {
  signInWithEmail: async (
    credentials: LoginCredentials,
  ): Promise<AuthUser> => ({
    email: credentials.email.trim().toLowerCase() || 'asesor@corimotors.com',
    id: 'storybook-advisor-id',
  }),
  signOut: async (): Promise<void> => undefined,
};

const mockSubmittingAuthProvider: IAuthProvider = {
  signInWithEmail: (): Promise<AuthUser> =>
    new Promise<AuthUser>(() => undefined),
  signOut: async (): Promise<void> => undefined,
};

const mockErrorAuthProvider: IAuthProvider = {
  signInWithEmail: async (): Promise<AuthUser> => {
    throw new Error(AUTH_SERVICE_ERRORS.INVALID_CREDENTIALS);
  },
  signOut: async (): Promise<void> => undefined,
};

const handleStoryCallback = (): void => undefined;

const meta = {
  argTypes: {
    authProvider: { control: false },
    onFacebookPress: { control: false },
    onForgotPasswordPress: { control: false },
    onGooglePress: { control: false },
    onSuccess: { control: false },
  },
  args: {
    authProvider: mockDefaultAuthProvider,
    onForgotPasswordPress: handleStoryCallback,
    onSuccess: handleStoryCallback,
  },
  component: LoginScreenView,
  decorators: [
    (Story: React.ComponentType): React.JSX.Element => (
      <View className='w-full flex-1 self-stretch bg-[#F7F7F6]'>
        <Story />
      </View>
    ),
  ],
  title: 'Features/Auth/Login Screen View',
} satisfies Meta<typeof LoginScreenView>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    authProvider: mockDefaultAuthProvider,
  },
};

export const Submitting: Story = {
  args: {
    authProvider: mockSubmittingAuthProvider,
  },
};

export const AuthError: Story = {
  args: {
    authProvider: mockErrorAuthProvider,
  },
};
