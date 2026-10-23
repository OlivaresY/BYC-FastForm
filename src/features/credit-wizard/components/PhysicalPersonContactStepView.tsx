import React from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  View,
} from 'react-native';
import { BaseButton } from '@/shared/ui/BaseButton';
import { ArrowRightIcon } from '@/shared/ui/Icons';
import { ProcessTopBar } from '@/shared/ui/ProcessTopBar';
import {
  PHYSICAL_PERSON_CONTACT_STEP_VIEW_COLORS,
  PHYSICAL_PERSON_CONTACT_STEP_VIEW_COPY,
  PHYSICAL_PERSON_CONTACT_STEP_VIEW_DIMENSIONS,
  PHYSICAL_PERSON_CONTACT_STEP_VIEW_NUMERICAL,
  PHYSICAL_PERSON_CONTACT_STEP_VIEW_STYLES,
  PHYSICAL_PERSON_CONTACT_STEP_VIEW_TEST_IDS,
} from '../constants/PhysicalPersonContactStepView.constants';
import { usePhysicalPersonContactViewModel } from '../hooks/usePhysicalPersonContactViewModel';
import type { PhysicalPersonContactStepViewProps } from '../types/PhysicalPersonContactStepView.types';
import { PhysicalPersonContactForm } from './PhysicalPersonContactForm';
import { WizardProgressHeader } from './WizardProgressHeader';

const NOOP_VOID = (): void => undefined;

export const PhysicalPersonContactStepView = ({
  disabled = false,
  onClose,
  options,
  testID,
  viewModel: viewModelProp,
}: PhysicalPersonContactStepViewProps): React.JSX.Element => {
  const defaultViewModel = usePhysicalPersonContactViewModel();
  const viewModel = viewModelProp ?? defaultViewModel;
  const { control, errors, handleNextStep, isValid } = viewModel;

  return (
    <View
      className={PHYSICAL_PERSON_CONTACT_STEP_VIEW_STYLES.CONTAINER}
      testID={testID ?? PHYSICAL_PERSON_CONTACT_STEP_VIEW_TEST_IDS.CONTAINER}
    >
      <ProcessTopBar
        onClose={onClose ?? NOOP_VOID}
        testID={PHYSICAL_PERSON_CONTACT_STEP_VIEW_TEST_IDS.PROCESS_TOP_BAR}
        userInitials='YO'
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        className={
          PHYSICAL_PERSON_CONTACT_STEP_VIEW_STYLES.KEYBOARD_AVOIDING_VIEW
        }
        keyboardVerticalOffset={
          Platform.OS === 'ios'
            ? PHYSICAL_PERSON_CONTACT_STEP_VIEW_DIMENSIONS.KEYBOARD_VERTICAL_OFFSET_IOS
            : 0
        }
      >
        <ScrollView
          className={PHYSICAL_PERSON_CONTACT_STEP_VIEW_STYLES.SCROLL_VIEW}
          keyboardShouldPersistTaps='handled'
          showsVerticalScrollIndicator={false}
          testID={PHYSICAL_PERSON_CONTACT_STEP_VIEW_TEST_IDS.SCROLL_VIEW}
        >
          <View
            className={PHYSICAL_PERSON_CONTACT_STEP_VIEW_STYLES.SCROLL_CONTENT}
          >
            {/* 1. Wizard Progress Header (Step 2 of 4) */}
            <WizardProgressHeader
              currentStep={
                PHYSICAL_PERSON_CONTACT_STEP_VIEW_NUMERICAL.CURRENT_STEP
              }
              testID={PHYSICAL_PERSON_CONTACT_STEP_VIEW_TEST_IDS.WIZARD_HEADER}
              totalSteps={
                PHYSICAL_PERSON_CONTACT_STEP_VIEW_NUMERICAL.TOTAL_STEPS
              }
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

            {/* 3. Physical Person Contact Form (4 Card Sections) */}
            <PhysicalPersonContactForm
              control={control}
              disabled={disabled}
              errors={errors}
              options={options}
              testID={PHYSICAL_PERSON_CONTACT_STEP_VIEW_TEST_IDS.FORM}
              viewModel={viewModel}
            />
          </View>
        </ScrollView>

        {/* 4. Fixed Bottom CTA Bar */}
        <View
          className={PHYSICAL_PERSON_CONTACT_STEP_VIEW_STYLES.BOTTOM_BAR}
          testID={PHYSICAL_PERSON_CONTACT_STEP_VIEW_TEST_IDS.BOTTOM_BAR}
        >
          <BaseButton
            className={PHYSICAL_PERSON_CONTACT_STEP_VIEW_STYLES.SUBMIT_BUTTON}
            disabled={!isValid || disabled}
            fullWidth
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
            onPress={(): void => {
              void handleNextStep();
            }}
            testID={PHYSICAL_PERSON_CONTACT_STEP_VIEW_TEST_IDS.SUBMIT_BUTTON}
            variant='primary'
          />
        </View>
      </KeyboardAvoidingView>
    </View>
  );
};
