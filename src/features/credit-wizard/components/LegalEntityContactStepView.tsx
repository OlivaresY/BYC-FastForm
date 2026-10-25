import React, { useCallback } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  ArrowRightIcon,
  BaseButton,
  ChevronLeftIcon,
  ErrorBanner,
  ProcessTopBar,
} from '@/shared/ui';
import {
  LEGAL_ENTITY_CONTACT_STEP_VIEW_COLORS,
  LEGAL_ENTITY_CONTACT_STEP_VIEW_CONSTANTS,
  LEGAL_ENTITY_CONTACT_STEP_VIEW_COPY,
  LEGAL_ENTITY_CONTACT_STEP_VIEW_DIMENSIONS,
  LEGAL_ENTITY_CONTACT_STEP_VIEW_NUMERICAL,
  LEGAL_ENTITY_CONTACT_STEP_VIEW_STYLES,
  LEGAL_ENTITY_CONTACT_STEP_VIEW_TEST_IDS,
} from '../constants/LegalEntityContactStepView.constants';
import { useKeyboardAutoScroll } from '../hooks/useKeyboardAutoScroll';
import { useLegalEntityContactViewModel } from '../hooks/useLegalEntityContactViewModel';
import type { LegalEntityContactStepViewProps } from '../types/LegalEntityContactStepView.types';
import { LegalEntityContactForm } from './LegalEntityContactForm';
import { WizardProgressHeader } from './WizardProgressHeader';

const NOOP_VOID = (): void => undefined;

export const LegalEntityContactStepView = ({
  currentStep,
  disabled = false,
  onClose,
  onSubmit,
  testID,
  totalSteps,
  viewModel: viewModelProp,
}: LegalEntityContactStepViewProps): React.JSX.Element => {
  const insets = useSafeAreaInsets();
  const defaultViewModel = useLegalEntityContactViewModel({ onSubmit });
  const viewModel = viewModelProp ?? defaultViewModel;
  const { control, handleNextStep, isSubmitting, isValid, submitError } =
    viewModel;

  const dynamicBottomPadding =
    Math.max(insets.bottom, 16) +
    LEGAL_ENTITY_CONTACT_STEP_VIEW_DIMENSIONS.BASE_FOOTER_HEIGHT;

  const { contentContainerStyle, handleScroll, onInputFocus, scrollViewRef } =
    useKeyboardAutoScroll({
      bottomBarHeight: dynamicBottomPadding,
      extraScrollPadding:
        LEGAL_ENTITY_CONTACT_STEP_VIEW_DIMENSIONS.EXTRA_KEYBOARD_SCROLL_OFFSET,
    });

  const handleSubmitPress = useCallback((): void => {
    void handleNextStep();
  }, [handleNextStep]);

  const handleBackPress = useCallback((): void => {
    onClose?.();
  }, [onClose]);

  return (
    <View
      className={LEGAL_ENTITY_CONTACT_STEP_VIEW_STYLES.CONTAINER}
      testID={testID ?? LEGAL_ENTITY_CONTACT_STEP_VIEW_TEST_IDS.CONTAINER}
    >
      <ProcessTopBar
        onClose={onClose ?? NOOP_VOID}
        testID={LEGAL_ENTITY_CONTACT_STEP_VIEW_TEST_IDS.PROCESS_TOP_BAR}
        userInitials={
          LEGAL_ENTITY_CONTACT_STEP_VIEW_CONSTANTS.MOCK_USER_INITIALS
        }
      />

      <View
        className={LEGAL_ENTITY_CONTACT_STEP_VIEW_STYLES.KEYBOARD_AVOIDING_VIEW}
      >
        <ScrollView
          className={LEGAL_ENTITY_CONTACT_STEP_VIEW_STYLES.SCROLL_VIEW}
          contentContainerStyle={contentContainerStyle}
          keyboardDismissMode='on-drag'
          keyboardShouldPersistTaps='handled'
          onScroll={handleScroll}
          ref={scrollViewRef}
          scrollEventThrottle={
            LEGAL_ENTITY_CONTACT_STEP_VIEW_NUMERICAL.SCROLL_EVENT_THROTTLE_MS
          }
          showsVerticalScrollIndicator={false}
          testID={LEGAL_ENTITY_CONTACT_STEP_VIEW_TEST_IDS.SCROLL_VIEW}
        >
          <View
            className={LEGAL_ENTITY_CONTACT_STEP_VIEW_STYLES.SCROLL_CONTENT}
          >
            {/* 1. Wizard Progress Header */}
            <WizardProgressHeader
              currentStep={currentStep}
              testID={LEGAL_ENTITY_CONTACT_STEP_VIEW_TEST_IDS.WIZARD_HEADER}
              totalSteps={totalSteps}
            />

            {/* 2. Step Title & Description Block */}
            <View
              className={LEGAL_ENTITY_CONTACT_STEP_VIEW_STYLES.HEADER_BLOCK}
            >
              <Text
                accessibilityRole='header'
                className={LEGAL_ENTITY_CONTACT_STEP_VIEW_STYLES.TITLE}
                testID={LEGAL_ENTITY_CONTACT_STEP_VIEW_TEST_IDS.TITLE}
              >
                {LEGAL_ENTITY_CONTACT_STEP_VIEW_COPY.TITLE}
              </Text>
              <Text
                className={LEGAL_ENTITY_CONTACT_STEP_VIEW_STYLES.DESCRIPTION}
                testID={LEGAL_ENTITY_CONTACT_STEP_VIEW_TEST_IDS.DESCRIPTION}
              >
                {LEGAL_ENTITY_CONTACT_STEP_VIEW_COPY.DESCRIPTION}
              </Text>
            </View>

            {submitError ? <ErrorBanner message={submitError} /> : null}

            {/* 3. Legal Entity Contact Form (4 Card Sections) */}
            <LegalEntityContactForm
              control={control}
              disabled={disabled || isSubmitting}
              onInputFocus={onInputFocus}
              testID={LEGAL_ENTITY_CONTACT_STEP_VIEW_TEST_IDS.FORM}
            />
          </View>
        </ScrollView>

        {/* 4. Fixed Bottom CTA Bar */}
        <View
          className={LEGAL_ENTITY_CONTACT_STEP_VIEW_STYLES.BOTTOM_BAR}
          style={{ paddingBottom: Math.max(insets.bottom, 16) }}
          testID={LEGAL_ENTITY_CONTACT_STEP_VIEW_TEST_IDS.BOTTOM_BAR}
        >
          <BaseButton
            className={LEGAL_ENTITY_CONTACT_STEP_VIEW_STYLES.BACK_BUTTON}
            disabled={disabled || isSubmitting}
            icon={
              <ChevronLeftIcon
                color={LEGAL_ENTITY_CONTACT_STEP_VIEW_COLORS.BACK_ICON}
                size={LEGAL_ENTITY_CONTACT_STEP_VIEW_DIMENSIONS.BACK_ICON_SIZE}
                strokeWidth={
                  LEGAL_ENTITY_CONTACT_STEP_VIEW_DIMENSIONS.BACK_ICON_STROKE_WIDTH
                }
              />
            }
            label={LEGAL_ENTITY_CONTACT_STEP_VIEW_COPY.BACK_BUTTON}
            onPress={handleBackPress}
            testID={LEGAL_ENTITY_CONTACT_STEP_VIEW_TEST_IDS.BACK_BUTTON}
            variant='neutral'
          />

          <BaseButton
            className={LEGAL_ENTITY_CONTACT_STEP_VIEW_STYLES.SUBMIT_BUTTON}
            disabled={!isValid || disabled || isSubmitting}
            iconRight={
              <ArrowRightIcon
                color={LEGAL_ENTITY_CONTACT_STEP_VIEW_COLORS.SUBMIT_ICON}
                size={
                  LEGAL_ENTITY_CONTACT_STEP_VIEW_DIMENSIONS.SUBMIT_ICON_SIZE
                }
                strokeWidth={
                  LEGAL_ENTITY_CONTACT_STEP_VIEW_DIMENSIONS.SUBMIT_ICON_STROKE_WIDTH
                }
              />
            }
            label={LEGAL_ENTITY_CONTACT_STEP_VIEW_COPY.SUBMIT_BUTTON}
            loading={isSubmitting}
            onPress={handleSubmitPress}
            testID={LEGAL_ENTITY_CONTACT_STEP_VIEW_TEST_IDS.SUBMIT_BUTTON}
            variant='primary'
          />
        </View>
      </View>
    </View>
  );
};
