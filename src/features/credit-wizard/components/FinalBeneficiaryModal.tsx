import React, { useMemo } from 'react';
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { BlurView } from 'expo-blur';
import { BaseButton } from '@/shared/ui/BaseButton';
import { CustomSelect } from '@/shared/ui/CustomSelect';
import { CustomTextInput } from '@/shared/ui/CustomTextInput';
import { CloseIcon } from '@/shared/ui/Icons';
import {
  BENEFICIARY_MODAL_COPY,
  BENEFICIARY_MODAL_DIMENSIONS,
  BENEFICIARY_MODAL_OPTIONS,
  BENEFICIARY_MODAL_STYLES,
  BENEFICIARY_MODAL_TEST_IDS,
} from '../constants/ApplicantStepView.constants';
import type { FinalBeneficiaryModalProps } from '../types/ApplicantStepView.types';
import { normalizeThirdPartyBirthDate } from '../types/ApplicantStepView.schema';

export const FinalBeneficiaryModal = ({
  errors,
  isOpen,
  onClose,
  onFieldChange,
  testID,
  values,
}: FinalBeneficiaryModalProps): React.JSX.Element => {
  const formattedBirthDate = useMemo(
    (): string => normalizeThirdPartyBirthDate(values.thirdPartyBirthDate),
    [values.thirdPartyBirthDate],
  );

  const handlers = useMemo(
    () => ({
      thirdPartyBirthDate: (val: string): void =>
        onFieldChange('thirdPartyBirthDate', val),
      thirdPartyDocNumber: (val: string): void =>
        onFieldChange('thirdPartyDocNumber', val),
      thirdPartyDocType: (val: string): void =>
        onFieldChange('thirdPartyDocType', val),
      thirdPartyFullName: (val: string): void =>
        onFieldChange('thirdPartyFullName', val),
      thirdPartyNationality: (val: string): void =>
        onFieldChange('thirdPartyNationality', val),
      thirdPartyRelationship: (val: string): void =>
        onFieldChange('thirdPartyRelationship', val),
    }),
    [onFieldChange],
  );

  return (
    <Modal
      animationType='slide'
      onRequestClose={onClose}
      statusBarTranslucent
      transparent
      visible={isOpen}
    >
      <View style={styles.backdropContainer}>
        <BlurView
          intensity={BENEFICIARY_MODAL_DIMENSIONS.BLUR_INTENSITY}
          style={StyleSheet.absoluteFill}
          tint='dark'
        />

        <Pressable
          accessibilityLabel={
            BENEFICIARY_MODAL_COPY.BACKDROP_ACCESSIBILITY_LABEL
          }
          accessibilityRole='button'
          onPress={onClose}
          style={StyleSheet.absoluteFill}
          testID={BENEFICIARY_MODAL_TEST_IDS.BACKDROP}
        />

        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.keyboardAvoidingContainer}
        >
          <View
            className={BENEFICIARY_MODAL_STYLES.MODAL_CONTAINER}
            testID={testID ?? BENEFICIARY_MODAL_TEST_IDS.MODAL_CONTAINER}
          >
            {/* Modal Header */}
            <View className={BENEFICIARY_MODAL_STYLES.HEADER_ROW}>
              <View className={BENEFICIARY_MODAL_STYLES.HEADER_TEXT_BLOCK}>
                <Text
                  accessibilityRole='header'
                  className={BENEFICIARY_MODAL_STYLES.TITLE}
                >
                  {BENEFICIARY_MODAL_COPY.TITLE}
                </Text>
                <Text className={BENEFICIARY_MODAL_STYLES.SUBTITLE}>
                  {BENEFICIARY_MODAL_COPY.SUBTITLE}
                </Text>
              </View>

              <Pressable
                accessibilityLabel={
                  BENEFICIARY_MODAL_COPY.CLOSE_ACCESSIBILITY_LABEL
                }
                accessibilityRole='button'
                className={BENEFICIARY_MODAL_STYLES.CLOSE_BUTTON}
                hitSlop={{ bottom: 8, left: 8, right: 8, top: 8 }}
                onPress={onClose}
                testID={BENEFICIARY_MODAL_TEST_IDS.CLOSE_BUTTON}
              >
                <CloseIcon
                  color='currentColor'
                  size={BENEFICIARY_MODAL_DIMENSIONS.CLOSE_ICON_SIZE}
                />
              </Pressable>
            </View>

            {/* Scrollable Form Body */}
            <ScrollView
              className={BENEFICIARY_MODAL_STYLES.SCROLL_VIEW}
              contentContainerStyle={styles.scrollContent}
              keyboardShouldPersistTaps='handled'
              showsVerticalScrollIndicator={false}
            >
              {/* Document Type & Number */}
              <CustomSelect
                errorMessage={errors?.thirdPartyDocType}
                label={BENEFICIARY_MODAL_COPY.DOC_TYPE_LABEL}
                onValueChange={handlers.thirdPartyDocType}
                options={BENEFICIARY_MODAL_OPTIONS.DOC_TYPE}
                placeholder={BENEFICIARY_MODAL_COPY.DOC_TYPE_PLACEHOLDER}
                testID={BENEFICIARY_MODAL_TEST_IDS.DOC_TYPE_INPUT}
                value={values.thirdPartyDocType}
              />

              <CustomTextInput
                error={errors?.thirdPartyDocNumber}
                label={BENEFICIARY_MODAL_COPY.DOC_NUMBER_LABEL}
                leftIcon='hash'
                onChangeText={handlers.thirdPartyDocNumber}
                placeholder={BENEFICIARY_MODAL_COPY.DOC_NUMBER_PLACEHOLDER}
                testID={BENEFICIARY_MODAL_TEST_IDS.DOC_NUMBER_INPUT}
                value={values.thirdPartyDocNumber}
              />

              {/* Full Name */}
              <CustomTextInput
                error={errors?.thirdPartyFullName}
                label={BENEFICIARY_MODAL_COPY.FULL_NAME_LABEL}
                onChangeText={handlers.thirdPartyFullName}
                placeholder={BENEFICIARY_MODAL_COPY.FULL_NAME_PLACEHOLDER}
                testID={BENEFICIARY_MODAL_TEST_IDS.FULL_NAME_INPUT}
                value={values.thirdPartyFullName}
              />

              {/* Relationship */}
              <CustomSelect
                errorMessage={errors?.thirdPartyRelationship}
                label={BENEFICIARY_MODAL_COPY.RELATIONSHIP_LABEL}
                onValueChange={handlers.thirdPartyRelationship}
                options={BENEFICIARY_MODAL_OPTIONS.RELATIONSHIP}
                placeholder={BENEFICIARY_MODAL_COPY.RELATIONSHIP_PLACEHOLDER}
                testID={BENEFICIARY_MODAL_TEST_IDS.RELATIONSHIP_INPUT}
                value={values.thirdPartyRelationship}
              />

              {/* Birth Date */}
              <CustomTextInput
                error={errors?.thirdPartyBirthDate}
                label={BENEFICIARY_MODAL_COPY.BIRTH_DATE_LABEL}
                leftIcon='calendar'
                onChangeText={handlers.thirdPartyBirthDate}
                placeholder={BENEFICIARY_MODAL_COPY.BIRTH_DATE_PLACEHOLDER}
                testID={BENEFICIARY_MODAL_TEST_IDS.BIRTH_DATE_INPUT}
                value={formattedBirthDate}
              />

              {/* Nationality */}
              <CustomSelect
                errorMessage={errors?.thirdPartyNationality}
                label={BENEFICIARY_MODAL_COPY.NATIONALITY_LABEL}
                leftIcon='globe'
                onValueChange={handlers.thirdPartyNationality}
                options={BENEFICIARY_MODAL_OPTIONS.NATIONALITY}
                placeholder={BENEFICIARY_MODAL_COPY.NATIONALITY_PLACEHOLDER}
                testID={BENEFICIARY_MODAL_TEST_IDS.NATIONALITY_INPUT}
                value={values.thirdPartyNationality}
              />

              {/* Save Button */}
              <BaseButton
                className={BENEFICIARY_MODAL_STYLES.SAVE_BUTTON}
                fullWidth
                label={BENEFICIARY_MODAL_COPY.SAVE_BUTTON}
                onPress={onClose}
                testID={BENEFICIARY_MODAL_TEST_IDS.SAVE_BUTTON}
                variant='primary'
              />
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
};

export const FinalBeneficiaryModalMemo = React.memo(FinalBeneficiaryModal);

const styles = StyleSheet.create({
  backdropContainer: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  keyboardAvoidingContainer: {
    width: '100%',
  },
  scrollContent: {
    gap: 16,
    paddingBottom: 16,
  },
});
