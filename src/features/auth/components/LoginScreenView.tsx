import { zodResolver } from '@hookform/resolvers/zod';
import {
  ArrowRight,
  Car,
  Eye,
  EyeOff,
  Lock,
  Mail,
  ShieldCheck,
} from 'lucide-react-native';
import React, { useCallback, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { BASE_BUTTON_VARIANTS, BaseButton, CustomTextInput } from '@/shared/ui';
import {
  LOGIN_SCREEN_COLORS,
  LOGIN_SCREEN_COPY,
  LOGIN_SCREEN_NUMERICAL,
  LOGIN_SCREEN_STYLES,
  LOGIN_SCREEN_TEST_IDS,
} from '../constants/LoginScreenView.constants';
import { useAuthViewModel } from '../hooks/useAuthViewModel';
import { LoginCredentialsSchema } from '../schemas/LoginCredentials.schema';
import {
  supabaseAuthProvider,
  type IAuthProvider,
} from '../services/auth.service';
import type { LoginCredentials } from '../types/Auth.types';

const NOOP_VOID = (): void => undefined;

const cardShadowStyles = StyleSheet.create({
  cardShadow: {
    elevation: 4,
    shadowColor: '#000000',
    shadowOffset: { height: 4, width: 0 },
    shadowOpacity: 0.12,
    shadowRadius: 10,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'space-between',
  },
});

export interface LoginScreenViewProps {
  authProvider?: IAuthProvider;
  onForgotPasswordPress?: () => void;
  onSuccess?: () => void | Promise<void>;
  testID?: string;
}

export const LoginScreenView = React.memo(
  ({
    authProvider = supabaseAuthProvider,
    onForgotPasswordPress = NOOP_VOID,
    onSuccess,
    testID = LOGIN_SCREEN_TEST_IDS.CONTAINER,
  }: LoginScreenViewProps): React.JSX.Element => {
    const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false);
    const [isPasswordFocused, setIsPasswordFocused] = useState<boolean>(false);

    const { authError, clearError, isLoading, signIn } = useAuthViewModel({
      authProvider,
      onSuccess,
    });

    const {
      control,
      formState: { errors },
      handleSubmit,
    } = useForm<LoginCredentials>({
      defaultValues: {
        email: '',
        password: '',
      },
      mode: 'onSubmit',
      resolver: zodResolver(LoginCredentialsSchema),
    });

    const handleTogglePasswordVisibility = useCallback((): void => {
      setIsPasswordVisible((previous) => !previous);
    }, []);

    const handleValidSubmit = useCallback(
      async (data: LoginCredentials): Promise<void> => {
        await signIn(data);
      },
      [signIn],
    );

    const handleFormSubmit = useCallback((): void => {
      void handleSubmit(handleValidSubmit)();
    }, [handleSubmit, handleValidSubmit]);

    const passwordBorderClass = errors.password
      ? LOGIN_SCREEN_STYLES.PASSWORD_INPUT_BORDER_ERROR
      : isPasswordFocused
        ? LOGIN_SCREEN_STYLES.PASSWORD_INPUT_BORDER_FOCUSED
        : LOGIN_SCREEN_STYLES.PASSWORD_INPUT_BORDER_BASE;

    const emailLeftIcon = (
      <Mail
        color={LOGIN_SCREEN_COLORS.ICON_SECONDARY}
        size={LOGIN_SCREEN_NUMERICAL.INPUT_ICON_SIZE}
      />
    );

    const submitArrowIcon = (
      <ArrowRight
        color={LOGIN_SCREEN_COLORS.WHITE}
        size={LOGIN_SCREEN_NUMERICAL.SUBMIT_ICON_SIZE}
      />
    );

    return (
      <View className={LOGIN_SCREEN_STYLES.SCREEN_CONTAINER} testID={testID}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          className={LOGIN_SCREEN_STYLES.KEYBOARD_AVOIDING}
        >
          <ScrollView
            contentContainerStyle={cardShadowStyles.scrollContent}
            keyboardDismissMode='on-drag'
            keyboardShouldPersistTaps='handled'
            showsVerticalScrollIndicator={false}
          >
            <View className={LOGIN_SCREEN_STYLES.SCROLL_CONTENT}>
              <View>
                {/* Header */}
                <View
                  className={LOGIN_SCREEN_STYLES.HEADER_ROW}
                  testID={LOGIN_SCREEN_TEST_IDS.HEADER}
                >
                  <Text className={LOGIN_SCREEN_STYLES.HEADER_BRAND_RED}>
                    {LOGIN_SCREEN_COPY.BRAND_CORIMOTORS}
                  </Text>
                  <Text className={LOGIN_SCREEN_STYLES.HEADER_BRAND_SECONDARY}>
                    {LOGIN_SCREEN_COPY.BRAND_SEPARATOR_BYC}
                  </Text>
                </View>

                {/* Top Badge */}
                <View
                  className={LOGIN_SCREEN_STYLES.BADGE_CONTAINER}
                  testID={LOGIN_SCREEN_TEST_IDS.BADGE}
                >
                  <Car
                    color={LOGIN_SCREEN_COLORS.BADGE_TEXT}
                    size={LOGIN_SCREEN_NUMERICAL.BADGE_ICON_SIZE}
                  />
                  <Text className={LOGIN_SCREEN_STYLES.BADGE_TEXT}>
                    {LOGIN_SCREEN_COPY.BADGE_TEXT}
                  </Text>
                </View>

                {/* Main Logo */}
                <View
                  className={LOGIN_SCREEN_STYLES.LOGO_CONTAINER}
                  testID={LOGIN_SCREEN_TEST_IDS.LOGO}
                >
                  <Text accessibilityRole='header'>
                    <Text className={LOGIN_SCREEN_STYLES.LOGO_TEXT_BLACK}>
                      {LOGIN_SCREEN_COPY.LOGO_B}
                    </Text>
                    <Text className={LOGIN_SCREEN_STYLES.LOGO_TEXT_RED}>
                      {LOGIN_SCREEN_COPY.LOGO_Y}
                    </Text>
                    <Text className={LOGIN_SCREEN_STYLES.LOGO_TEXT_BLACK}>
                      {LOGIN_SCREEN_COPY.LOGO_C_FASTFORM}
                    </Text>
                  </Text>
                  <Text className={LOGIN_SCREEN_STYLES.LOGO_SUBTITLE}>
                    {LOGIN_SCREEN_COPY.LOGO_SUBTITLE}
                  </Text>
                </View>

                {/* Login Card */}
                <View
                  className={LOGIN_SCREEN_STYLES.CARD_CONTAINER}
                  style={cardShadowStyles.cardShadow}
                  testID={LOGIN_SCREEN_TEST_IDS.CARD}
                >
                  <Text
                    accessibilityRole='header'
                    className={LOGIN_SCREEN_STYLES.CARD_TITLE}
                  >
                    {LOGIN_SCREEN_COPY.CARD_TITLE}
                  </Text>
                  <Text className={LOGIN_SCREEN_STYLES.CARD_SUBTITLE}>
                    {LOGIN_SCREEN_COPY.CARD_SUBTITLE}
                  </Text>

                  {/* Email Field */}
                  <View className={LOGIN_SCREEN_STYLES.FIELD_SPACING}>
                    <Controller
                      control={control}
                      name='email'
                      render={({ field: { onBlur, onChange, value } }) => (
                        <CustomTextInput
                          autoCapitalize='none'
                          autoComplete='email'
                          autoCorrect={false}
                          editable={!isLoading}
                          error={errors.email?.message}
                          keyboardType='email-address'
                          label={LOGIN_SCREEN_COPY.EMAIL_LABEL}
                          leftIcon={emailLeftIcon}
                          onBlur={onBlur}
                          onChangeText={(text: string): void => {
                            if (authError) {
                              clearError();
                            }
                            onChange(text);
                          }}
                          placeholder={LOGIN_SCREEN_COPY.EMAIL_PLACEHOLDER}
                          testID={LOGIN_SCREEN_TEST_IDS.EMAIL_INPUT}
                          value={value}
                        />
                      )}
                    />
                  </View>

                  {/* Password Field */}
                  <View>
                    <Text className={LOGIN_SCREEN_STYLES.PASSWORD_LABEL}>
                      {LOGIN_SCREEN_COPY.PASSWORD_LABEL}
                    </Text>
                    <Controller
                      control={control}
                      name='password'
                      render={({ field: { onBlur, onChange, value } }) => (
                        <View
                          className={`${LOGIN_SCREEN_STYLES.PASSWORD_INPUT_WRAPPER} ${passwordBorderClass}`}
                        >
                          <Lock
                            color={LOGIN_SCREEN_COLORS.ICON_SECONDARY}
                            size={LOGIN_SCREEN_NUMERICAL.INPUT_ICON_SIZE}
                          />
                          <TextInput
                            accessibilityLabel={
                              LOGIN_SCREEN_COPY.PASSWORD_LABEL
                            }
                            aria-invalid={Boolean(errors.password)}
                            autoCapitalize='none'
                            autoComplete='password'
                            autoCorrect={false}
                            className={LOGIN_SCREEN_STYLES.PASSWORD_INPUT}
                            editable={!isLoading}
                            onBlur={(): void => {
                              setIsPasswordFocused(false);
                              onBlur();
                            }}
                            onChangeText={(text: string): void => {
                              if (authError) {
                                clearError();
                              }
                              onChange(text);
                            }}
                            onFocus={(): void => {
                              setIsPasswordFocused(true);
                            }}
                            placeholder={LOGIN_SCREEN_COPY.PASSWORD_PLACEHOLDER}
                            placeholderTextColor={
                              LOGIN_SCREEN_COLORS.TEXT_SECONDARY
                            }
                            secureTextEntry={!isPasswordVisible}
                            testID={LOGIN_SCREEN_TEST_IDS.PASSWORD_INPUT}
                            value={value}
                          />
                          <TouchableOpacity
                            accessibilityLabel={
                              isPasswordVisible
                                ? LOGIN_SCREEN_COPY.HIDE_PASSWORD_A11Y
                                : LOGIN_SCREEN_COPY.SHOW_PASSWORD_A11Y
                            }
                            accessibilityRole='button'
                            className={
                              LOGIN_SCREEN_STYLES.PASSWORD_TOGGLE_BUTTON
                            }
                            disabled={isLoading}
                            onPress={handleTogglePasswordVisibility}
                            testID={
                              LOGIN_SCREEN_TEST_IDS.PASSWORD_TOGGLE_BUTTON
                            }
                          >
                            {isPasswordVisible ? (
                              <EyeOff
                                color={LOGIN_SCREEN_COLORS.ICON_SECONDARY}
                                size={LOGIN_SCREEN_NUMERICAL.INPUT_ICON_SIZE}
                              />
                            ) : (
                              <Eye
                                color={LOGIN_SCREEN_COLORS.ICON_SECONDARY}
                                size={LOGIN_SCREEN_NUMERICAL.INPUT_ICON_SIZE}
                              />
                            )}
                          </TouchableOpacity>
                        </View>
                      )}
                    />
                    {errors.password?.message ? (
                      <Text
                        className={LOGIN_SCREEN_STYLES.PASSWORD_ERROR_TEXT}
                        testID={LOGIN_SCREEN_TEST_IDS.PASSWORD_ERROR}
                      >
                        {errors.password.message}
                      </Text>
                    ) : null}
                  </View>

                  {/* Forgot Password Link */}
                  <TouchableOpacity
                    accessibilityLabel={LOGIN_SCREEN_COPY.FORGOT_PASSWORD}
                    accessibilityRole='button'
                    className={LOGIN_SCREEN_STYLES.FORGOT_PASSWORD_BUTTON}
                    disabled={isLoading}
                    onPress={onForgotPasswordPress}
                    testID={LOGIN_SCREEN_TEST_IDS.FORGOT_PASSWORD_BUTTON}
                  >
                    <Text className={LOGIN_SCREEN_STYLES.FORGOT_PASSWORD_TEXT}>
                      {LOGIN_SCREEN_COPY.FORGOT_PASSWORD}
                    </Text>
                  </TouchableOpacity>

                  {/* Auth Error Message */}
                  {authError ? (
                    <Text
                      accessibilityRole='alert'
                      className={LOGIN_SCREEN_STYLES.AUTH_ERROR_TEXT}
                      testID={LOGIN_SCREEN_TEST_IDS.AUTH_ERROR}
                    >
                      {authError}
                    </Text>
                  ) : null}

                  {/* Primary Submit Button */}
                  <BaseButton
                    className={LOGIN_SCREEN_STYLES.SUBMIT_BUTTON}
                    disabled={isLoading}
                    fullWidth
                    iconRight={submitArrowIcon}
                    isLoading={isLoading}
                    label={LOGIN_SCREEN_COPY.SUBMIT_BUTTON}
                    onPress={handleFormSubmit}
                    testID={LOGIN_SCREEN_TEST_IDS.SUBMIT_BUTTON}
                    variant={BASE_BUTTON_VARIANTS.PRIMARY}
                  />
                </View>
              </View>

              {/* Footer */}
              <View
                className={LOGIN_SCREEN_STYLES.FOOTER_CONTAINER}
                testID={LOGIN_SCREEN_TEST_IDS.FOOTER}
              >
                <View className={LOGIN_SCREEN_STYLES.FOOTER_SECURITY_ROW}>
                  <ShieldCheck
                    color={LOGIN_SCREEN_COLORS.ICON_SECONDARY}
                    size={LOGIN_SCREEN_NUMERICAL.FOOTER_ICON_SIZE}
                  />
                  <Text className={LOGIN_SCREEN_STYLES.FOOTER_SECURITY_TEXT}>
                    {LOGIN_SCREEN_COPY.FOOTER_SECURITY}
                  </Text>
                </View>
                <Text className={LOGIN_SCREEN_STYLES.FOOTER_COPYRIGHT}>
                  {LOGIN_SCREEN_COPY.FOOTER_COPYRIGHT}
                </Text>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    );
  },
);

LoginScreenView.displayName = 'LoginScreenView';

export default LoginScreenView;
