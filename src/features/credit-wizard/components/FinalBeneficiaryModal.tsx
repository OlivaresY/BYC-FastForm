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
import {
  ClockIcon,
  CloseIcon,
  IdCardIcon,
  PhoneIcon,
  UserIcon,
} from '@/shared/ui/Icons';
import {
  BENEFICIARY_MODAL_COLORS,
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
  onSave,
  testID,
  thirdPartyValues,
  values: valuesProp,
}: FinalBeneficiaryModalProps): React.JSX.Element => {
  const values = valuesProp ?? thirdPartyValues ?? {};

  const docType = values.thirdPartyDocType ?? values.identificationType;
  const docNumber =
    values.thirdPartyDocNumber ?? values.identificationNumber ?? '';
  const fullName = values.thirdPartyFullName ?? values.fullName ?? '';
  const relationship = values.thirdPartyRelationship ?? values.relationship;
  const rawBirthDate = values.thirdPartyBirthDate ?? values.birthDate;
  const nationality = values.thirdPartyNationality ?? values.nationality;

  const phone = values.thirdPartyPhone ?? values.phone ?? '';
  const email = values.thirdPartyEmail ?? values.email ?? '';

  const normalizedDocType =
    docType === 'cedula_nacional' ? 'national_id' : docType;
  const normalizedRelationship =
    relationship === 'conyuge' ? 'spouse' : relationship;
  const normalizedNationality =
    nationality === 'costarricense' ? 'CR' : nationality;

  const formattedBirthDate = useMemo((): string => {
    if (rawBirthDate instanceof Date) {
      return normalizeThirdPartyBirthDate(rawBirthDate);
    }
    return typeof rawBirthDate === 'string' ? rawBirthDate : '';
  }, [rawBirthDate]);

  const handlers = useMemo(
    () => ({
      email: (val: string): void => {
        onFieldChange?.('thirdPartyEmail', val);
        onFieldChange?.('email', val);
      },
      phone: (val: string): void => {
        onFieldChange?.('thirdPartyPhone', val);
        onFieldChange?.('phone', val);
      },
      thirdPartyBirthDate: (val: string): void =>
        onFieldChange?.('thirdPartyBirthDate', val),
      thirdPartyDocNumber: (val: string): void =>
        onFieldChange?.('thirdPartyDocNumber', val),
      thirdPartyDocType: (val: string): void =>
        onFieldChange?.('thirdPartyDocType', val),
      thirdPartyFullName: (val: string): void =>
        onFieldChange?.('thirdPartyFullName', val),
      thirdPartyNationality: (val: string): void =>
        onFieldChange?.('thirdPartyNationality', val),
      thirdPartyRelationship: (val: string): void =>
        onFieldChange?.('thirdPartyRelationship', val),
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
              {/* SECTION 1: DOCUMENTO DE IDENTIDAD */}
              <View
                className='mb-2 flex-row items-center gap-2'
                testID={BENEFICIARY_MODAL_TEST_IDS.SECTION_1_HEADER}
              >
                <IdCardIcon
                  color={BENEFICIARY_MODAL_COLORS.SECTION_ICON_STROKE}
                  size={BENEFICIARY_MODAL_DIMENSIONS.SECTION_ICON_SIZE}
                  strokeWidth={
                    BENEFICIARY_MODAL_DIMENSIONS.SECTION_ICON_STROKE_WIDTH
                  }
                />
                <Text className='text-sm font-bold uppercase text-slate-800'>
                  {BENEFICIARY_MODAL_COPY.SECTION_1_TITLE}
                </Text>
              </View>

              <Text
                className={BENEFICIARY_MODAL_STYLES.GROUP_LABEL}
                testID={BENEFICIARY_MODAL_TEST_IDS.IDENTIFICATION_LABEL}
              >
                {BENEFICIARY_MODAL_COPY.IDENTIFICATION_LABEL}
              </Text>

              <CustomSelect
                errorMessage={errors?.thirdPartyDocType}
                onValueChange={handlers.thirdPartyDocType}
                options={BENEFICIARY_MODAL_OPTIONS.DOC_TYPE}
                placeholder={BENEFICIARY_MODAL_COPY.DOC_TYPE_PLACEHOLDER}
                required={true}
                testID={BENEFICIARY_MODAL_TEST_IDS.DOC_TYPE_INPUT}
                value={normalizedDocType}
              />

              <CustomTextInput
                error={errors?.thirdPartyDocNumber}
                onChangeText={handlers.thirdPartyDocNumber}
                placeholder={BENEFICIARY_MODAL_COPY.DOC_NUMBER_PLACEHOLDER}
                required={true}
                testID={BENEFICIARY_MODAL_TEST_IDS.DOC_NUMBER_INPUT}
                value={docNumber}
              />

              {/* SECTION 2: NOMBRES Y APELLIDOS OFICIALES */}
              <View
                className='mb-2 mt-6 flex-row items-center gap-2'
                testID={BENEFICIARY_MODAL_TEST_IDS.SECTION_2_HEADER}
              >
                <UserIcon
                  color={BENEFICIARY_MODAL_COLORS.SECTION_ICON_STROKE}
                  size={BENEFICIARY_MODAL_DIMENSIONS.SECTION_ICON_SIZE}
                  strokeWidth={
                    BENEFICIARY_MODAL_DIMENSIONS.SECTION_ICON_STROKE_WIDTH
                  }
                />
                <Text className='text-sm font-bold uppercase text-slate-800'>
                  {BENEFICIARY_MODAL_COPY.SECTION_2_TITLE}
                </Text>
              </View>

              <CustomTextInput
                error={errors?.thirdPartyFullName}
                label={BENEFICIARY_MODAL_COPY.FULL_NAME_LABEL}
                onChangeText={handlers.thirdPartyFullName}
                placeholder={BENEFICIARY_MODAL_COPY.FULL_NAME_PLACEHOLDER}
                required={true}
                testID={BENEFICIARY_MODAL_TEST_IDS.FULL_NAME_INPUT}
                value={fullName}
              />

              {/* SECTION 3: DATOS DE CONTACTO */}
              <View
                className='mb-2 mt-6 flex-row items-center gap-2'
                testID={BENEFICIARY_MODAL_TEST_IDS.SECTION_3_HEADER}
              >
                <PhoneIcon
                  color={BENEFICIARY_MODAL_COLORS.SECTION_ICON_STROKE}
                  size={BENEFICIARY_MODAL_DIMENSIONS.SECTION_ICON_SIZE}
                  strokeWidth={
                    BENEFICIARY_MODAL_DIMENSIONS.SECTION_ICON_STROKE_WIDTH
                  }
                />
                <Text className='text-sm font-bold uppercase text-slate-800'>
                  {BENEFICIARY_MODAL_COPY.SECTION_3_TITLE}
                </Text>
              </View>

              <CustomTextInput
                error={errors?.thirdPartyPhone ?? errors?.phone}
                keyboardType='phone-pad'
                label={BENEFICIARY_MODAL_COPY.PHONE_LABEL}
                onChangeText={handlers.phone}
                placeholder={BENEFICIARY_MODAL_COPY.PHONE_PLACEHOLDER}
                required={true}
                testID={BENEFICIARY_MODAL_TEST_IDS.PHONE_INPUT}
                value={phone}
              />

              <CustomTextInput
                autoCapitalize='none'
                error={errors?.thirdPartyEmail ?? errors?.email}
                keyboardType='email-address'
                label={BENEFICIARY_MODAL_COPY.EMAIL_LABEL}
                onChangeText={handlers.email}
                placeholder={BENEFICIARY_MODAL_COPY.EMAIL_PLACEHOLDER}
                required={true}
                testID={BENEFICIARY_MODAL_TEST_IDS.EMAIL_INPUT}
                value={email}
              />

              {/* SECTION 4: DATOS DEMOGRÁFICOS */}
              <View
                className='mb-2 mt-6 flex-row items-center gap-2'
                testID={BENEFICIARY_MODAL_TEST_IDS.SECTION_4_HEADER}
              >
                <ClockIcon
                  color={BENEFICIARY_MODAL_COLORS.SECTION_ICON_STROKE}
                  size={BENEFICIARY_MODAL_DIMENSIONS.SECTION_ICON_SIZE}
                  strokeWidth={
                    BENEFICIARY_MODAL_DIMENSIONS.SECTION_ICON_STROKE_WIDTH
                  }
                />
                <Text className='text-sm font-bold uppercase text-slate-800'>
                  {BENEFICIARY_MODAL_COPY.SECTION_4_TITLE}
                </Text>
              </View>

              <CustomSelect
                errorMessage={errors?.thirdPartyRelationship}
                label={BENEFICIARY_MODAL_COPY.RELATIONSHIP_LABEL}
                onValueChange={handlers.thirdPartyRelationship}
                options={BENEFICIARY_MODAL_OPTIONS.RELATIONSHIP}
                placeholder={BENEFICIARY_MODAL_COPY.RELATIONSHIP_PLACEHOLDER}
                required={true}
                testID={BENEFICIARY_MODAL_TEST_IDS.RELATIONSHIP_INPUT}
                value={normalizedRelationship}
              />

              <CustomTextInput
                error={errors?.thirdPartyBirthDate}
                label={BENEFICIARY_MODAL_COPY.BIRTH_DATE_LABEL}
                leftIcon='calendar'
                onChangeText={handlers.thirdPartyBirthDate}
                placeholder={BENEFICIARY_MODAL_COPY.BIRTH_DATE_PLACEHOLDER}
                required={true}
                testID={BENEFICIARY_MODAL_TEST_IDS.BIRTH_DATE_INPUT}
                value={formattedBirthDate}
              />

              <CustomSelect
                errorMessage={errors?.thirdPartyNationality}
                label={BENEFICIARY_MODAL_COPY.NATIONALITY_LABEL}
                leftIcon='globe'
                onValueChange={handlers.thirdPartyNationality}
                options={BENEFICIARY_MODAL_OPTIONS.NATIONALITY}
                placeholder={BENEFICIARY_MODAL_COPY.NATIONALITY_PLACEHOLDER}
                required={true}
                testID={BENEFICIARY_MODAL_TEST_IDS.NATIONALITY_INPUT}
                value={normalizedNationality}
              />
            </ScrollView>

            {/* Fixed Bottom Action Bar */}
            <View
              className={BENEFICIARY_MODAL_STYLES.BOTTOM_BAR}
              testID={BENEFICIARY_MODAL_TEST_IDS.BOTTOM_BAR}
            >
              <BaseButton
                className={BENEFICIARY_MODAL_STYLES.SAVE_BUTTON}
                fullWidth
                label={BENEFICIARY_MODAL_COPY.SAVE_BUTTON}
                onPress={onSave ?? onClose}
                testID={BENEFICIARY_MODAL_TEST_IDS.SAVE_BUTTON}
                variant='primary'
              />
            </View>
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
    flex: 1,
    justifyContent: 'flex-end',
    maxHeight: '85%',
    width: '100%',
  },
  scrollContent: {
    flexGrow: 1,
    gap: 12,
    paddingBottom: 40,
  },
});
