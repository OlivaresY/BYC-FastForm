import { zodResolver } from '@hookform/resolvers/zod';
import {
  AlertCircle,
  ArrowRight,
  Car,
  Eye,
  EyeOff,
  Lock,
  Mail,
  ShieldCheck,
} from 'lucide-react-native';
import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
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
  type LayoutChangeEvent,
} from 'react-native';
import { SafeAreaInsetsContext } from 'react-native-safe-area-context';
import Svg, { Circle, Path } from 'react-native-svg';
import {
  BASE_BUTTON_VARIANTS,
  BaseButton,
  CustomTextInput,
  KeyboardAutoScrollContext,
  useKeyboardAutoScroll,
  type KeyboardAutoScrollContextValue,
} from '@/shared/ui';
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

const DEFAULT_SAFE_AREA_INSETS = {
  bottom: 0,
  left: 0,
  right: 0,
  top: 0,
} as const;
const SOCIAL_ICON_VIEW_BOX = '0 0 24 24';

interface FeedbackAlertBannerProps {
  containerClassName: string;
  message: string;
  testID: string;
}

const FeedbackAlertBanner = ({
  containerClassName,
  message,
  testID,
}: FeedbackAlertBannerProps): React.JSX.Element => (
  <View
    accessibilityLiveRegion='polite'
    accessibilityRole='alert'
    className={`${LOGIN_SCREEN_STYLES.ALERT_BANNER_CONTAINER} ${containerClassName}`}
    style={cardShadowStyles.alertBanner}
  >
    <AlertCircle
      accessible={false}
      color={LOGIN_SCREEN_COLORS.BRAND_RED}
      importantForAccessibility='no'
      size={LOGIN_SCREEN_NUMERICAL.ALERT_ICON_SIZE}
    />
    <Text className={LOGIN_SCREEN_STYLES.ALERT_BANNER_TEXT} testID={testID}>
      {message}
    </Text>
  </View>
);

const GoogleBrandIcon = (): React.JSX.Element => (
  <Svg
    accessible={false}
    fill='none'
    height={LOGIN_SCREEN_NUMERICAL.SOCIAL_ICON_SIZE}
    importantForAccessibility='no'
    viewBox={SOCIAL_ICON_VIEW_BOX}
    width={LOGIN_SCREEN_NUMERICAL.SOCIAL_ICON_SIZE}
  >
    <Path
      d='M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z'
      fill={LOGIN_SCREEN_COLORS.GOOGLE_BLUE}
    />
    <Path
      d='M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z'
      fill={LOGIN_SCREEN_COLORS.GOOGLE_GREEN}
    />
    <Path
      d='M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z'
      fill={LOGIN_SCREEN_COLORS.GOOGLE_YELLOW}
    />
    <Path
      d='M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z'
      fill={LOGIN_SCREEN_COLORS.GOOGLE_RED}
    />
  </Svg>
);

const FacebookBrandIcon = (): React.JSX.Element => (
  <Svg
    accessible={false}
    fill='none'
    height={LOGIN_SCREEN_NUMERICAL.SOCIAL_ICON_SIZE}
    importantForAccessibility='no'
    viewBox={SOCIAL_ICON_VIEW_BOX}
    width={LOGIN_SCREEN_NUMERICAL.SOCIAL_ICON_SIZE}
  >
    <Circle cx='12' cy='12' fill={LOGIN_SCREEN_COLORS.WHITE} r='10' />
    <Path
      d='M13.5 21.8v-7h2.3l.4-2.7h-2.7v-1.7c0-.8.2-1.3 1.4-1.3h1.4V6.6c-.2 0-1.1-.1-2.1-.1-2.1 0-3.5 1.3-3.5 3.6v2H8.4v2.7h2.3v7c.9.2 1.9.2 2.8 0z'
      fill={LOGIN_SCREEN_COLORS.FACEBOOK_BLUE}
    />
  </Svg>
);

const cardShadowStyles = StyleSheet.create({
  alertBanner: {
    backgroundColor: LOGIN_SCREEN_COLORS.ALERT_BACKGROUND,
  },
  cardShadow: {
    elevation: 4,
    shadowColor: LOGIN_SCREEN_COLORS.SHADOW_BLACK,
    shadowOffset: { height: 4, width: 0 },
    shadowOpacity: 0.12,
    shadowRadius: 10,
  },
  keyboardAvoiding: {
    flex: 1,
  },
  scrollContentIdle: {
    flexGrow: 1,
    justifyContent: 'space-between',
  },
  scrollContentKeyboardOpen: {
    flexGrow: 1,
    justifyContent: 'flex-start',
    paddingBottom: LOGIN_SCREEN_NUMERICAL.KEYBOARD_OPEN_PADDING_BOTTOM,
  },
});

export interface LoginScreenViewProps {
  authProvider?: IAuthProvider;
  onFacebookPress?: () => void | Promise<void>;
  onForgotPasswordPress?: () => void | Promise<void>;
  onGooglePress?: () => void | Promise<void>;
  onSuccess?: () => void | Promise<void>;
  testID?: string;
}

export const LoginScreenView = React.memo(
  ({
    authProvider = supabaseAuthProvider,
    onFacebookPress,
    onForgotPasswordPress,
    onGooglePress,
    onSuccess,
    testID = LOGIN_SCREEN_TEST_IDS.CONTAINER,
  }: LoginScreenViewProps): React.JSX.Element => {
    const safeAreaInsets =
      useContext(SafeAreaInsetsContext) ?? DEFAULT_SAFE_AREA_INSETS;
    const isSubmittingRef = useRef<boolean>(false);
    const [viewportHeight, setViewportHeight] = useState<number>(0);
    const [contentHeight, setContentHeight] = useState<number>(0);
    const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false);
    const [isPasswordFocused, setIsPasswordFocused] = useState<boolean>(false);
    const [feedbackNotice, setFeedbackNotice] = useState<string | null>(null);

    const { handleScroll, keyboardHeight, onInputFocus, scrollViewRef } =
      useKeyboardAutoScroll({
        bottomBarHeight: 0,
        extraScrollPadding: LOGIN_SCREEN_NUMERICAL.KEYBOARD_OPEN_PADDING_BOTTOM,
      });

    const isKeyboardVisible = keyboardHeight > 0;
    const isContentOverflowing =
      viewportHeight > 0 &&
      contentHeight >
        viewportHeight + LOGIN_SCREEN_NUMERICAL.SCROLL_OVERFLOW_TOLERANCE_PX;
    const isScrollEnabled = isKeyboardVisible || isContentOverflowing;

    const autoScrollContextValue = useMemo<KeyboardAutoScrollContextValue>(
      () => ({ onInputFocus }),
      [onInputFocus],
    );

    const handleScrollViewLayout = useCallback(
      (event: LayoutChangeEvent): void => {
        setViewportHeight(event.nativeEvent.layout.height);
      },
      [],
    );

    const handleContentSizeChange = useCallback(
      (_width: number, height: number): void => {
        setContentHeight(height);
      },
      [],
    );

    useEffect(
      () => (): void => {
        isSubmittingRef.current = false;
      },
      [],
    );

    const headerContainerStyle = useMemo(
      () => ({
        paddingTop:
          safeAreaInsets.top + LOGIN_SCREEN_NUMERICAL.HEADER_TOP_PADDING,
      }),
      [safeAreaInsets.top],
    );

    const footerContainerStyle = useMemo(
      () => ({
        paddingBottom:
          safeAreaInsets.bottom + LOGIN_SCREEN_NUMERICAL.FOOTER_BOTTOM_PADDING,
      }),
      [safeAreaInsets.bottom],
    );

    const { authError, clearError, isLoading, signIn } = useAuthViewModel({
      authProvider,
      onSuccess,
    });

    const [prevAuthError, setPrevAuthError] = useState<string | null>(
      authError,
    );
    if (authError !== prevAuthError) {
      setPrevAuthError(authError);
      if (authError) {
        setFeedbackNotice(null);
      }
    }

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

    const clearFeedbackState = useCallback((): void => {
      if (authError) {
        clearError();
      }
      if (feedbackNotice) {
        setFeedbackNotice(null);
      }
    }, [authError, clearError, feedbackNotice]);

    const handleTogglePasswordVisibility = useCallback((): void => {
      setIsPasswordVisible((previous) => !previous);
    }, []);

    const handleValidSubmit = useCallback(
      async (data: LoginCredentials): Promise<void> => {
        if (isLoading || isSubmittingRef.current) {
          return;
        }
        isSubmittingRef.current = true;
        setFeedbackNotice(null);
        try {
          await signIn(data);
        } catch (error: unknown) {
          console.error('[LoginScreenView] Sign-in failed:', error);
          setFeedbackNotice(LOGIN_SCREEN_COPY.UNEXPECTED_ACTION_ERROR);
        } finally {
          isSubmittingRef.current = false;
        }
      },
      [isLoading, signIn],
    );

    const handleFormSubmit = useCallback((): void => {
      setFeedbackNotice(null);
      if (isLoading || isSubmittingRef.current) {
        return;
      }
      void handleSubmit(handleValidSubmit)();
    }, [handleSubmit, handleValidSubmit, isLoading]);

    const handleFallbackActionPress = useCallback(
      async (
        handler: (() => void | Promise<void>) | undefined,
        fallbackNotice: string,
      ): Promise<void> => {
        if (authError) {
          clearError();
        }
        setFeedbackNotice(null);
        if (!handler) {
          setFeedbackNotice(fallbackNotice);
          return;
        }
        try {
          await handler();
        } catch (error: unknown) {
          console.error('[LoginScreenView] Action handler failed:', error);
          setFeedbackNotice(LOGIN_SCREEN_COPY.UNEXPECTED_ACTION_ERROR);
        }
      },
      [authError, clearError],
    );

    const handleForgotPasswordButtonPress = useCallback((): void => {
      void handleFallbackActionPress(
        onForgotPasswordPress,
        LOGIN_SCREEN_COPY.FORGOT_PASSWORD_NOTICE,
      );
    }, [handleFallbackActionPress, onForgotPasswordPress]);

    const handleGoogleButtonPress = useCallback((): void => {
      void handleFallbackActionPress(
        onGooglePress,
        LOGIN_SCREEN_COPY.EXTERNAL_PROVIDER_NOTICE,
      );
    }, [handleFallbackActionPress, onGooglePress]);

    const handleFacebookButtonPress = useCallback((): void => {
      void handleFallbackActionPress(
        onFacebookPress,
        LOGIN_SCREEN_COPY.EXTERNAL_PROVIDER_NOTICE,
      );
    }, [handleFallbackActionPress, onFacebookPress]);

    const passwordBorderClass = errors.password
      ? LOGIN_SCREEN_STYLES.PASSWORD_INPUT_BORDER_ERROR
      : isPasswordFocused
        ? LOGIN_SCREEN_STYLES.PASSWORD_INPUT_BORDER_FOCUSED
        : LOGIN_SCREEN_STYLES.PASSWORD_INPUT_BORDER_BASE;

    const passwordToggleIconColor = isLoading
      ? LOGIN_SCREEN_COLORS.ICON_DISABLED
      : LOGIN_SCREEN_COLORS.ICON_SECONDARY;

    const visibleFeedbackNotice = authError ? null : feedbackNotice;

    const emailLeftIcon = (
      <Mail
        accessible={false}
        color={LOGIN_SCREEN_COLORS.ICON_SECONDARY}
        importantForAccessibility='no'
        size={LOGIN_SCREEN_NUMERICAL.INPUT_ICON_SIZE}
      />
    );

    const submitArrowIcon = (
      <ArrowRight
        accessible={false}
        color={LOGIN_SCREEN_COLORS.WHITE}
        importantForAccessibility='no'
        size={LOGIN_SCREEN_NUMERICAL.SUBMIT_ICON_SIZE}
      />
    );

    return (
      <KeyboardAutoScrollContext.Provider value={autoScrollContextValue}>
        <View className={LOGIN_SCREEN_STYLES.SCREEN_CONTAINER} testID={testID}>
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={cardShadowStyles.keyboardAvoiding}
          >
            <ScrollView
              bounces={false}
              contentContainerStyle={
                isKeyboardVisible
                  ? cardShadowStyles.scrollContentKeyboardOpen
                  : cardShadowStyles.scrollContentIdle
              }
              keyboardDismissMode='on-drag'
              keyboardShouldPersistTaps='handled'
              onContentSizeChange={handleContentSizeChange}
              onLayout={handleScrollViewLayout}
              onScroll={handleScroll}
              overScrollMode='never'
              ref={scrollViewRef}
              scrollEnabled={isScrollEnabled}
              scrollEventThrottle={
                LOGIN_SCREEN_NUMERICAL.SCROLL_EVENT_THROTTLE_MS
              }
              showsVerticalScrollIndicator={false}
              testID={LOGIN_SCREEN_TEST_IDS.SCROLL_VIEW}
            >
              {/* Top Brand Header */}
              <View
                className={LOGIN_SCREEN_STYLES.HEADER_CONTAINER}
                style={headerContainerStyle}
                testID={LOGIN_SCREEN_TEST_IDS.HEADER}
              >
                <View className={LOGIN_SCREEN_STYLES.HEADER_ROW}>
                  <Text className={LOGIN_SCREEN_STYLES.HEADER_BRAND_RED}>
                    {LOGIN_SCREEN_COPY.BRAND_CORIMOTORS}
                  </Text>
                  <Text className={LOGIN_SCREEN_STYLES.HEADER_BRAND_SECONDARY}>
                    {LOGIN_SCREEN_COPY.BRAND_SEPARATOR_BYC}
                  </Text>
                </View>
              </View>

              <View className={LOGIN_SCREEN_STYLES.CENTER_SECTION}>
                {/* Top Badge */}
                <View
                  className={LOGIN_SCREEN_STYLES.BADGE_CONTAINER}
                  testID={LOGIN_SCREEN_TEST_IDS.BADGE}
                >
                  <Car
                    accessible={false}
                    color={LOGIN_SCREEN_COLORS.BADGE_TEXT}
                    importantForAccessibility='no'
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
                          accessibilityState={{ disabled: isLoading }}
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
                            clearFeedbackState();
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
                            accessible={false}
                            color={LOGIN_SCREEN_COLORS.ICON_SECONDARY}
                            importantForAccessibility='no'
                            size={LOGIN_SCREEN_NUMERICAL.INPUT_ICON_SIZE}
                          />
                          <TextInput
                            accessibilityLabel={
                              LOGIN_SCREEN_COPY.PASSWORD_LABEL
                            }
                            accessibilityState={{ disabled: isLoading }}
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
                              clearFeedbackState();
                              onChange(text);
                            }}
                            onFocus={(event): void => {
                              setIsPasswordFocused(true);
                              onInputFocus(event);
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
                            accessibilityState={{ disabled: isLoading }}
                            className={`${LOGIN_SCREEN_STYLES.PASSWORD_TOGGLE_BUTTON} ${isLoading ? LOGIN_SCREEN_STYLES.PASSWORD_TOGGLE_DISABLED : ''}`}
                            disabled={isLoading}
                            onPress={handleTogglePasswordVisibility}
                            testID={
                              LOGIN_SCREEN_TEST_IDS.PASSWORD_TOGGLE_BUTTON
                            }
                          >
                            {isPasswordVisible ? (
                              <EyeOff
                                accessible={false}
                                color={passwordToggleIconColor}
                                importantForAccessibility='no'
                                size={LOGIN_SCREEN_NUMERICAL.INPUT_ICON_SIZE}
                              />
                            ) : (
                              <Eye
                                accessible={false}
                                color={passwordToggleIconColor}
                                importantForAccessibility='no'
                                size={LOGIN_SCREEN_NUMERICAL.INPUT_ICON_SIZE}
                              />
                            )}
                          </TouchableOpacity>
                        </View>
                      )}
                    />
                    {errors.password?.message ? (
                      <Text
                        accessibilityLiveRegion='polite'
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
                    accessibilityState={{ disabled: isLoading }}
                    className={LOGIN_SCREEN_STYLES.FORGOT_PASSWORD_BUTTON}
                    disabled={isLoading}
                    onPress={handleForgotPasswordButtonPress}
                    testID={LOGIN_SCREEN_TEST_IDS.FORGOT_PASSWORD_BUTTON}
                  >
                    <Text className={LOGIN_SCREEN_STYLES.FORGOT_PASSWORD_TEXT}>
                      {LOGIN_SCREEN_COPY.FORGOT_PASSWORD}
                    </Text>
                  </TouchableOpacity>

                  {/* Auth Error Message */}
                  {authError ? (
                    <FeedbackAlertBanner
                      containerClassName={
                        LOGIN_SCREEN_STYLES.ALERT_BANNER_AUTH_SPACING
                      }
                      message={authError}
                      testID={LOGIN_SCREEN_TEST_IDS.AUTH_ERROR}
                    />
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

                  {/* Social Login Divider */}
                  <View
                    className={LOGIN_SCREEN_STYLES.DIVIDER_CONTAINER}
                    testID={LOGIN_SCREEN_TEST_IDS.DIVIDER}
                  >
                    <View className={LOGIN_SCREEN_STYLES.DIVIDER_LINE} />
                    <Text className={LOGIN_SCREEN_STYLES.DIVIDER_TEXT}>
                      {LOGIN_SCREEN_COPY.DIVIDER_TEXT}
                    </Text>
                    <View className={LOGIN_SCREEN_STYLES.DIVIDER_LINE} />
                  </View>

                  {/* Social Login Row */}
                  <View className={LOGIN_SCREEN_STYLES.SOCIAL_BUTTONS_ROW}>
                    <TouchableOpacity
                      accessibilityLabel={LOGIN_SCREEN_COPY.GOOGLE_BUTTON}
                      accessibilityRole='button'
                      accessibilityState={{ disabled: isLoading }}
                      className={`${LOGIN_SCREEN_STYLES.GOOGLE_BUTTON} ${isLoading ? LOGIN_SCREEN_STYLES.SOCIAL_BUTTON_DISABLED : ''}`}
                      disabled={isLoading}
                      onPress={handleGoogleButtonPress}
                      testID={LOGIN_SCREEN_TEST_IDS.GOOGLE_BUTTON}
                    >
                      <GoogleBrandIcon />
                      <Text className={LOGIN_SCREEN_STYLES.GOOGLE_BUTTON_TEXT}>
                        {LOGIN_SCREEN_COPY.GOOGLE_BUTTON}
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      accessibilityLabel={LOGIN_SCREEN_COPY.FACEBOOK_BUTTON}
                      accessibilityRole='button'
                      accessibilityState={{ disabled: isLoading }}
                      className={`${LOGIN_SCREEN_STYLES.FACEBOOK_BUTTON} ${isLoading ? LOGIN_SCREEN_STYLES.SOCIAL_BUTTON_DISABLED : ''}`}
                      disabled={isLoading}
                      onPress={handleFacebookButtonPress}
                      testID={LOGIN_SCREEN_TEST_IDS.FACEBOOK_BUTTON}
                    >
                      <FacebookBrandIcon />
                      <Text
                        className={LOGIN_SCREEN_STYLES.FACEBOOK_BUTTON_TEXT}
                      >
                        {LOGIN_SCREEN_COPY.FACEBOOK_BUTTON}
                      </Text>
                    </TouchableOpacity>
                  </View>

                  {/* Social / Forgot Password Feedback Notice */}
                  {visibleFeedbackNotice ? (
                    <FeedbackAlertBanner
                      containerClassName={
                        LOGIN_SCREEN_STYLES.ALERT_BANNER_NOTICE_SPACING
                      }
                      message={visibleFeedbackNotice}
                      testID={LOGIN_SCREEN_TEST_IDS.SOCIAL_NOTICE}
                    />
                  ) : null}
                </View>
              </View>

              {/* Footer */}
              <View
                className={LOGIN_SCREEN_STYLES.FOOTER_CONTAINER}
                style={footerContainerStyle}
                testID={LOGIN_SCREEN_TEST_IDS.FOOTER}
              >
                <View className={LOGIN_SCREEN_STYLES.FOOTER_SECURITY_ROW}>
                  <ShieldCheck
                    accessible={false}
                    color={LOGIN_SCREEN_COLORS.ICON_SECONDARY}
                    importantForAccessibility='no'
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
            </ScrollView>
          </KeyboardAvoidingView>
        </View>
      </KeyboardAutoScrollContext.Provider>
    );
  },
);

LoginScreenView.displayName = 'LoginScreenView';

export default LoginScreenView;
