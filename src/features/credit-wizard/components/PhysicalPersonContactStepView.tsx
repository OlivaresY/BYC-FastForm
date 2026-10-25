import React from 'react';
import { ScrollView, Text, View } from 'react-native';
import {
  ArrowRightIcon,
  BaseButton,
  ChevronLeftIcon,
  ErrorBanner,
  ProcessTopBar,
} from '@/shared/ui';
import {
  PHYSICAL_PERSON_CONTACT_STEP_VIEW_COLORS,
  PHYSICAL_PERSON_CONTACT_STEP_VIEW_CONSTANTS,
  PHYSICAL_PERSON_CONTACT_STEP_VIEW_COPY,
  PHYSICAL_PERSON_CONTACT_STEP_VIEW_DIMENSIONS,
  PHYSICAL_PERSON_CONTACT_STEP_VIEW_NUMERICAL,
  PHYSICAL_PERSON_CONTACT_STEP_VIEW_STYLES,
  PHYSICAL_PERSON_CONTACT_STEP_VIEW_TEST_IDS,
} from '../constants/PhysicalPersonContactStepView.constants';
import { useKeyboardAutoScroll } from '../hooks/useKeyboardAutoScroll';
import { usePhysicalPersonContactViewModel } from '../hooks/usePhysicalPersonContactViewModel';
import type { PhysicalPersonContactStepViewProps } from '../types/PhysicalPersonContactStepView.types';
import { PhysicalPersonContactForm } from './PhysicalPersonContactForm';
import { WizardProgressHeader } from './WizardProgressHeader';

const NOOP_VOID = (): void => undefined;

export const PhysicalPersonContactStepView = ({
  currentStep = PHYSICAL_PERSON_CONTACT_STEP_VIEW_NUMERICAL.DEFAULT_CURRENT_STEP,
  disabled = false,
  onClose,
  onSubmit,
  options,
  testID,
  totalSteps = PHYSICAL_PERSON_CONTACT_STEP_VIEW_NUMERICAL.DEFAULT_TOTAL_STEPS,
  viewModel: viewModelProp,
}: PhysicalPersonContactStepViewProps): React.JSX.Element => {
  const defaultViewModel = usePhysicalPersonContactViewModel({ onSubmit });
  const viewModel = viewModelProp ?? defaultViewModel;
  const { control, handleNextStep, isSubmitting, isValid, submitError } =
    viewModel;

  const { contentContainerStyle, handleScroll, onInputFocus, scrollViewRef } =
    useKeyboardAutoScroll({
      bottomBarHeight:
        PHYSICAL_PERSON_CONTACT_STEP_VIEW_DIMENSIONS.BOTTOM_BAR_HEIGHT,
      extraScrollPadding:
        PHYSICAL_PERSON_CONTACT_STEP_VIEW_DIMENSIONS.EXTRA_KEYBOARD_SCROLL_OFFSET,
    });

  return (
    <View
      className={PHYSICAL_PERSON_CONTACT_STEP_VIEW_STYLES.CONTAINER}
      testID={testID ?? PHYSICAL_PERSON_CONTACT_STEP_VIEW_TEST_IDS.CONTAINER}
    >
      <ProcessTopBar
        onClose={onClose ?? NOOP_VOID}
        testID={PHYSICAL_PERSON_CONTACT_STEP_VIEW_TEST_IDS.PROCESS_TOP_BAR}
        userInitials={
          PHYSICAL_PERSON_CONTACT_STEP_VIEW_CONSTANTS.MOCK_USER_INITIALS
        }
      />

      <View
        className={
          PHYSICAL_PERSON_CONTACT_STEP_VIEW_STYLES.KEYBOARD_AVOIDING_VIEW
        }
      >
        <ScrollView
          className={PHYSICAL_PERSON_CONTACT_STEP_VIEW_STYLES.SCROLL_VIEW}
          contentContainerStyle={contentContainerStyle}
          keyboardDismissMode='on-drag'
          keyboardShouldPersistTaps='handled'
          onScroll={handleScroll}
          ref={scrollViewRef}
          scrollEventThrottle={
            PHYSICAL_PERSON_CONTACT_STEP_VIEW_NUMERICAL.SCROLL_EVENT_THROTTLE_MS
          }
          showsVerticalScrollIndicator={false}
          testID={PHYSICAL_PERSON_CONTACT_STEP_VIEW_TEST_IDS.SCROLL_VIEW}
        >
          <View
            className={PHYSICAL_PERSON_CONTACT_STEP_VIEW_STYLES.SCROLL_CONTENT}
          >
            {/* 1. Wizard Progress Header */}
            <WizardProgressHeader
              currentStep={currentStep}
              testID={PHYSICAL_PERSON_CONTACT_STEP_VIEW_TEST_IDS.WIZARD_HEADER}
              totalSteps={totalSteps}
            />

            {/* 2. Step Title & Description Block */}
            <View
              className={PHYSICAL_PERSON_CONTACT_STEP_VIEW_STYLES.HEADER_BLOCK}
            >
              <Text
                accessibilityRole='header'
                className={PHYSICAL_PERSON_CONTACT_STEP_VIEW_STYLES.TITLE}
                testID={PHYSICAL_PERSON_CONTACT_STEP_VIEW_TEST_IDS.TITLE}
              >
                {PHYSICAL_PERSON_CONTACT_STEP_VIEW_COPY.TITLE}
              </Text>
              <Text
                className={PHYSICAL_PERSON_CONTACT_STEP_VIEW_STYLES.DESCRIPTION}
                testID={PHYSICAL_PERSON_CONTACT_STEP_VIEW_TEST_IDS.DESCRIPTION}
              >
                {PHYSICAL_PERSON_CONTACT_STEP_VIEW_COPY.DESCRIPTION}
              </Text>
            </View>

            {submitError ? <ErrorBanner message={submitError} /> : null}

            {/* 3. Physical Person Contact Form (4 Card Sections) */}
            <PhysicalPersonContactForm
              control={control}
              disabled={disabled || isSubmitting}
              onInputFocus={onInputFocus}
              options={options}
              testID={PHYSICAL_PERSON_CONTACT_STEP_VIEW_TEST_IDS.FORM}
            />
          </View>
        </ScrollView>

        {/* 4. Fixed Bottom CTA Bar */}
        <View
          className={PHYSICAL_PERSON_CONTACT_STEP_VIEW_STYLES.BOTTOM_BAR}
          testID={PHYSICAL_PERSON_CONTACT_STEP_VIEW_TEST_IDS.BOTTOM_BAR}
        >
          <BaseButton
            className={PHYSICAL_PERSON_CONTACT_STEP_VIEW_STYLES.BACK_BUTTON}
            disabled={disabled || isSubmitting}
            icon={
              <ChevronLeftIcon
                color={PHYSICAL_PERSON_CONTACT_STEP_VIEW_COLORS.BACK_ICON}
                size={
                  PHYSICAL_PERSON_CONTACT_STEP_VIEW_DIMENSIONS.BACK_ICON_SIZE
                }
                strokeWidth={
                  PHYSICAL_PERSON_CONTACT_STEP_VIEW_DIMENSIONS.BACK_ICON_STROKE_WIDTH
                }
              />
            }
            label={PHYSICAL_PERSON_CONTACT_STEP_VIEW_COPY.BACK_BUTTON}
            onPress={onClose ?? NOOP_VOID}
            testID={PHYSICAL_PERSON_CONTACT_STEP_VIEW_TEST_IDS.BACK_BUTTON}
            variant='neutral'
          />

          <BaseButton
            className={PHYSICAL_PERSON_CONTACT_STEP_VIEW_STYLES.SUBMIT_BUTTON}
            disabled={!isValid || disabled || isSubmitting}
            iconRight={
              <ArrowRightIcon
                color={PHYSICAL_PERSON_CONTACT_STEP_VIEW_COLORS.SUBMIT_ICON}
                size={
                  PHYSICAL_PERSON_CONTACT_STEP_VIEW_DIMENSIONS.SUBMIT_ICON_SIZE
                }
                strokeWidth={
                  PHYSICAL_PERSON_CONTACT_STEP_VIEW_DIMENSIONS.SUBMIT_ICON_STROKE_WIDTH
                }
              />
            }
            label={PHYSICAL_PERSON_CONTACT_STEP_VIEW_COPY.SUBMIT_BUTTON}
            loading={isSubmitting}
            onPress={(): void => {
              void handleNextStep();
            }}
            testID={PHYSICAL_PERSON_CONTACT_STEP_VIEW_TEST_IDS.SUBMIT_BUTTON}
            variant='primary'
          />
        </View>
      </View>
    </View>
  );
};
