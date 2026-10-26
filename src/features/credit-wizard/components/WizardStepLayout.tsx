import React from 'react';
import { ScrollView, Text, View } from 'react-native';
import {
  ArrowRightIcon,
  BaseButton,
  ChevronLeftIcon,
  ErrorBanner,
  ProcessTopBar,
} from '@/shared/ui';
import { WIZARD_COPY } from '../constants/WizardCopy.constants';
import {
  WIZARD_STEP_LAYOUT_COLORS,
  WIZARD_STEP_LAYOUT_CONSTANTS,
  WIZARD_STEP_LAYOUT_DIMENSIONS,
  WIZARD_STEP_LAYOUT_NUMERICAL,
  WIZARD_STEP_LAYOUT_STYLES,
  WIZARD_STEP_LAYOUT_TEST_IDS,
} from '../constants/WizardStepLayout.constants';
import { useKeyboardAutoScroll } from '../hooks/useKeyboardAutoScroll';
import type { WizardStepLayoutProps } from '../types/WizardStepLayout.types';
import { WizardProgressHeader } from './WizardProgressHeader';

const NOOP_VOID = (): void => undefined;

export const WizardStepLayout = ({
  backButtonIcon,
  backButtonLabel = WIZARD_COPY.BUTTONS.BACK,
  children,
  currentStep = WIZARD_STEP_LAYOUT_NUMERICAL.DEFAULT_CURRENT_STEP,
  description,
  disabled = false,
  extraScrollPadding = WIZARD_STEP_LAYOUT_DIMENSIONS.EXTRA_KEYBOARD_SCROLL_OFFSET,
  isSubmitDisabled = false,
  isSubmitting = false,
  modal,
  onBack,
  onClose,
  onSubmit,
  submitButtonIcon,
  submitButtonLabel = WIZARD_COPY.BUTTONS.NEXT,
  submitError,
  testID,
  testIds,
  title,
  totalSteps = WIZARD_STEP_LAYOUT_NUMERICAL.DEFAULT_TOTAL_STEPS,
  userInitials = WIZARD_STEP_LAYOUT_CONSTANTS.DEFAULT_USER_INITIALS,
}: WizardStepLayoutProps): React.JSX.Element => {
  const { contentContainerStyle, handleScroll, onInputFocus, scrollViewRef } =
    useKeyboardAutoScroll({
      bottomBarHeight: WIZARD_STEP_LAYOUT_DIMENSIONS.BOTTOM_BAR_HEIGHT,
      extraScrollPadding,
    });

  const resolvedChildren =
    typeof children === 'function' ? children({ onInputFocus }) : children;

  const defaultBackIcon = (
    <ChevronLeftIcon
      color={WIZARD_STEP_LAYOUT_COLORS.BACK_ICON}
      size={WIZARD_STEP_LAYOUT_DIMENSIONS.BACK_ICON_SIZE}
      strokeWidth={WIZARD_STEP_LAYOUT_DIMENSIONS.BACK_ICON_STROKE_WIDTH}
    />
  );

  const defaultSubmitIcon = (
    <ArrowRightIcon
      color={WIZARD_STEP_LAYOUT_COLORS.SUBMIT_ICON}
      size={WIZARD_STEP_LAYOUT_DIMENSIONS.SUBMIT_ICON_SIZE}
      strokeWidth={WIZARD_STEP_LAYOUT_DIMENSIONS.SUBMIT_ICON_STROKE_WIDTH}
    />
  );

  const hasBackButton = Boolean(onBack);

  return (
    <View
      className={WIZARD_STEP_LAYOUT_STYLES.CONTAINER}
      testID={
        testID ?? testIds?.container ?? WIZARD_STEP_LAYOUT_TEST_IDS.CONTAINER
      }
    >
      <ProcessTopBar
        onClose={onClose ?? NOOP_VOID}
        testID={
          testIds?.processTopBar ?? WIZARD_STEP_LAYOUT_TEST_IDS.PROCESS_TOP_BAR
        }
        userInitials={userInitials}
      />

      <View className={WIZARD_STEP_LAYOUT_STYLES.KEYBOARD_AVOIDING_VIEW}>
        <ScrollView
          className={WIZARD_STEP_LAYOUT_STYLES.SCROLL_VIEW}
          contentContainerStyle={contentContainerStyle}
          keyboardDismissMode='on-drag'
          keyboardShouldPersistTaps='handled'
          onScroll={handleScroll}
          ref={scrollViewRef}
          scrollEventThrottle={
            WIZARD_STEP_LAYOUT_NUMERICAL.SCROLL_EVENT_THROTTLE_MS
          }
          showsVerticalScrollIndicator={false}
          testID={
            testIds?.scrollView ?? WIZARD_STEP_LAYOUT_TEST_IDS.SCROLL_VIEW
          }
        >
          <View className={WIZARD_STEP_LAYOUT_STYLES.SCROLL_CONTENT}>
            {/* 1. Wizard Progress Header */}
            <WizardProgressHeader
              currentStep={currentStep}
              testID={
                testIds?.wizardHeader ??
                WIZARD_STEP_LAYOUT_TEST_IDS.WIZARD_HEADER
              }
              totalSteps={totalSteps}
            />

            {/* 2. Step Title & Description Block */}
            <View className={WIZARD_STEP_LAYOUT_STYLES.HEADER_BLOCK}>
              <Text
                accessibilityRole='header'
                className={WIZARD_STEP_LAYOUT_STYLES.TITLE}
                testID={testIds?.title ?? WIZARD_STEP_LAYOUT_TEST_IDS.TITLE}
              >
                {title}
              </Text>
              <Text
                className={WIZARD_STEP_LAYOUT_STYLES.DESCRIPTION}
                testID={
                  testIds?.description ??
                  WIZARD_STEP_LAYOUT_TEST_IDS.DESCRIPTION
                }
              >
                {description}
              </Text>
            </View>

            {submitError ? <ErrorBanner message={submitError} /> : null}

            {/* 3. Form Content Slot */}
            {resolvedChildren}
          </View>
        </ScrollView>

        {/* 4. Fixed Bottom CTA Bar */}
        <View
          className={
            hasBackButton
              ? WIZARD_STEP_LAYOUT_STYLES.BOTTOM_BAR
              : WIZARD_STEP_LAYOUT_STYLES.BOTTOM_BAR_FULL
          }
          testID={testIds?.bottomBar ?? WIZARD_STEP_LAYOUT_TEST_IDS.BOTTOM_BAR}
        >
          {hasBackButton ? (
            <BaseButton
              className={WIZARD_STEP_LAYOUT_STYLES.BACK_BUTTON}
              disabled={disabled || isSubmitting}
              icon={backButtonIcon ?? defaultBackIcon}
              label={backButtonLabel}
              onPress={onBack ?? NOOP_VOID}
              testID={
                testIds?.backButton ?? WIZARD_STEP_LAYOUT_TEST_IDS.BACK_BUTTON
              }
              variant='neutral'
            />
          ) : null}

          <BaseButton
            className={
              hasBackButton
                ? WIZARD_STEP_LAYOUT_STYLES.SUBMIT_BUTTON
                : WIZARD_STEP_LAYOUT_STYLES.SUBMIT_BUTTON_FULL
            }
            disabled={isSubmitDisabled || disabled || isSubmitting}
            fullWidth={!hasBackButton}
            iconRight={submitButtonIcon ?? defaultSubmitIcon}
            label={submitButtonLabel}
            loading={isSubmitting}
            onPress={onSubmit}
            testID={
              testIds?.submitButton ?? WIZARD_STEP_LAYOUT_TEST_IDS.SUBMIT_BUTTON
            }
            variant='primary'
          />
        </View>
      </View>

      {modal}
    </View>
  );
};

WizardStepLayout.displayName = 'WizardStepLayout';
