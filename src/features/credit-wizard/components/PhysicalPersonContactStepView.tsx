import React from 'react';
import { Text, View } from 'react-native';
import { BaseButton } from '@/shared/ui/BaseButton';
import { ArrowRightIcon, ChevronLeftIcon } from '@/shared/ui/Icons';
import { KeyboardAwareStepLayout } from '@/shared/ui/KeyboardAwareStepLayout';
import { ProcessTopBar } from '@/shared/ui/ProcessTopBar';
import {
  PHYSICAL_PERSON_CONTACT_STEP_VIEW_COLORS,
  PHYSICAL_PERSON_CONTACT_STEP_VIEW_CONSTANTS,
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
  onSubmit,
  options,
  testID,
  viewModel: viewModelProp,
}: PhysicalPersonContactStepViewProps): React.JSX.Element => {
  const defaultViewModel = usePhysicalPersonContactViewModel({ onSubmit });
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
        userInitials={
          PHYSICAL_PERSON_CONTACT_STEP_VIEW_CONSTANTS.MOCK_USER_INITIALS
        }
      />

      <KeyboardAwareStepLayout
        bottomBarHeight={
          PHYSICAL_PERSON_CONTACT_STEP_VIEW_DIMENSIONS.BOTTOM_BAR_HEIGHT
        }
        extraScrollPadding={
          PHYSICAL_PERSON_CONTACT_STEP_VIEW_DIMENSIONS.EXTRA_KEYBOARD_SCROLL_OFFSET
        }
        footer={
          <View
            className={PHYSICAL_PERSON_CONTACT_STEP_VIEW_STYLES.BOTTOM_BAR}
            testID={PHYSICAL_PERSON_CONTACT_STEP_VIEW_TEST_IDS.BOTTOM_BAR}
          >
            <BaseButton
              className={PHYSICAL_PERSON_CONTACT_STEP_VIEW_STYLES.BACK_BUTTON}
              disabled={disabled}
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
              disabled={!isValid || disabled}
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
        }
        scrollViewTestID={
          PHYSICAL_PERSON_CONTACT_STEP_VIEW_TEST_IDS.SCROLL_VIEW
        }
      >
        {({ onInputFocus }) => (
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
              onInputFocus={onInputFocus}
              options={options}
              testID={PHYSICAL_PERSON_CONTACT_STEP_VIEW_TEST_IDS.FORM}
              viewModel={viewModel}
            />
          </View>
        )}
      </KeyboardAwareStepLayout>
    </View>
  );
};
