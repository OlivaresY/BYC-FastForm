import {
  AlertCircle,
  Calendar,
  Car,
  CheckCircle2,
  ChevronRight,
  Landmark,
  Lock,
  Printer,
} from 'lucide-react-native';
import React, { useCallback } from 'react';
import { ActivityIndicator, Pressable, Text, View } from 'react-native';
import { esCR } from '@/shared/i18n';
import {
  APPLICATION_STATUS_VALUES,
  DOSSIER_CARD_COLORS,
  DOSSIER_CARD_DIMENSIONS,
  DOSSIER_CARD_STATUS_STYLES,
  DOSSIER_CARD_STYLES,
  DOSSIER_CARD_TEST_IDS,
  HISTORY_INTERNAL_STRINGS,
  HISTORY_TEMPLATE_TOKENS,
} from '../constants';
import type { ApplicationStatus, DossierCardProps } from '../types';

const STATUS_BADGE_LABELS: Readonly<Record<ApplicationStatus, string>> = {
  [APPLICATION_STATUS_VALUES.APPROVED]: esCR.history.badges.approved,
  [APPLICATION_STATUS_VALUES.DRAFT]: esCR.history.badges.draft,
  [APPLICATION_STATUS_VALUES.PENDING]: esCR.history.badges.pending,
  [APPLICATION_STATUS_VALUES.REJECTED]: esCR.history.badges.rejected,
} as const;

const formatApplicantA11yLabel = (
  template: string,
  applicantName: string,
): string => template.replace(HISTORY_TEMPLATE_TOKENS.APPLICANT, applicantName);

interface DossierDetailRowProps {
  icon: React.JSX.Element;
  label: string;
  numberOfLines: number;
  textClassName: string;
}

const DossierDetailRow = ({
  icon,
  label,
  numberOfLines,
  textClassName,
}: DossierDetailRowProps): React.JSX.Element => (
  <View className={DOSSIER_CARD_STYLES.DETAILS_ROW}>
    {icon}
    <Text
      className={textClassName}
      numberOfLines={numberOfLines}
    >
      {label}
    </Text>
  </View>
);

const DossierCardComponent = ({
  dossier,
  isPrinting = false,
  onPressQuickPrint,
  onPressRetry,
  onPressViewDossier,
  testID,
}: DossierCardProps): React.JSX.Element => {
  const isApprovedForQuickPrint =
    dossier.status === APPLICATION_STATUS_VALUES.APPROVED &&
    dossier.canQuickPrint;
  const isRejected = dossier.status === APPLICATION_STATUS_VALUES.REJECTED;
  const isPrintingActive = Boolean(isPrinting);
  const isRetryDisabled = !onPressRetry;

  const statusStyle =
    DOSSIER_CARD_STATUS_STYLES[dossier.status] ??
    DOSSIER_CARD_STATUS_STYLES[APPLICATION_STATUS_VALUES.DRAFT];
  const statusLabel =
    STATUS_BADGE_LABELS[dossier.status] ?? esCR.history.badges.draft;

  const quickPrintA11yLabel = formatApplicantA11yLabel(
    esCR.history.cards.printButtonA11y,
    dossier.applicantName,
  );
  const retryA11yLabel = formatApplicantA11yLabel(
    esCR.history.cards.retryButtonA11y,
    dossier.applicantName,
  );
  const viewDossierA11yLabel = formatApplicantA11yLabel(
    esCR.history.cards.viewDossierButtonA11y,
    dossier.applicantName,
  );

  const handlePressQuickPrint = useCallback((): void => {
    if (!isApprovedForQuickPrint || isPrintingActive) {
      return;
    }

    void onPressQuickPrint(dossier);
  }, [dossier, isApprovedForQuickPrint, isPrintingActive, onPressQuickPrint]);

  const handlePressRetry = useCallback((): void => {
    if (!onPressRetry) {
      return;
    }

    onPressRetry(dossier);
  }, [dossier, onPressRetry]);

  const handlePressViewDossier = useCallback((): void => {
    onPressViewDossier(dossier);
  }, [dossier, onPressViewDossier]);

  return (
    <View
      className={DOSSIER_CARD_STYLES.CARD_ROOT}
      testID={testID ?? DOSSIER_CARD_TEST_IDS.CARD_ROOT}
    >
      <View className={DOSSIER_CARD_STYLES.HEADER_ROW}>
        <View className={DOSSIER_CARD_STYLES.HEADER_INFO}>
          <Text
            className={DOSSIER_CARD_STYLES.APPLICANT_NAME}
            numberOfLines={1}
          >
            {dossier.applicantName}
          </Text>
          <Text
            className={DOSSIER_CARD_STYLES.ID_SUBTITLE}
            numberOfLines={1}
          >
            {`${esCR.history.cards.idPrefix}${HISTORY_INTERNAL_STRINGS.SPACE}${dossier.identificationNumber}`}
          </Text>
        </View>

        <View
          accessibilityRole='text'
          className={`${DOSSIER_CARD_STYLES.STATUS_BADGE_BASE} ${statusStyle.containerClassName}`}
          testID={DOSSIER_CARD_TEST_IDS.STATUS_BADGE}
        >
          <Text
            className={`${DOSSIER_CARD_STYLES.STATUS_BADGE_TEXT_BASE} ${statusStyle.textClassName}`}
          >
            {statusLabel}
          </Text>
        </View>
      </View>

      <View className={DOSSIER_CARD_STYLES.DETAILS_BOX}>
        <DossierDetailRow
          icon={
            <Car
              accessible={false}
              color={DOSSIER_CARD_COLORS.PRIMARY_TEXT}
              importantForAccessibility='no'
              size={DOSSIER_CARD_DIMENSIONS.META_ICON_SIZE_PX}
            />
          }
          label={dossier.vehicleSummary}
          numberOfLines={2}
          textClassName={DOSSIER_CARD_STYLES.DETAILS_PRIMARY_TEXT}
        />
        <DossierDetailRow
          icon={
            <Landmark
              accessible={false}
              color={DOSSIER_CARD_COLORS.SECONDARY_TEXT}
              importantForAccessibility='no'
              size={DOSSIER_CARD_DIMENSIONS.META_ICON_SIZE_PX}
            />
          }
          label={dossier.primaryBankLabel}
          numberOfLines={2}
          textClassName={DOSSIER_CARD_STYLES.DETAILS_META_TEXT}
        />
        <DossierDetailRow
          icon={
            <Calendar
              accessible={false}
              color={DOSSIER_CARD_COLORS.SECONDARY_TEXT}
              importantForAccessibility='no'
              size={DOSSIER_CARD_DIMENSIONS.META_ICON_SIZE_PX}
            />
          }
          label={dossier.formattedDate}
          numberOfLines={1}
          textClassName={DOSSIER_CARD_STYLES.DETAILS_META_TEXT}
        />
      </View>

      <View className={DOSSIER_CARD_STYLES.STATUS_INDICATOR_ROW}>
        {isApprovedForQuickPrint ? (
          <>
            <CheckCircle2
              accessible={false}
              color={DOSSIER_CARD_COLORS.PRIMARY_GREEN}
              importantForAccessibility='no'
              size={DOSSIER_CARD_DIMENSIONS.STATUS_ICON_SIZE_PX}
            />
            <Text
              className={DOSSIER_CARD_STYLES.STATUS_INDICATOR_TEXT_APPROVED}
              numberOfLines={1}
            >
              {esCR.history.cards.readyToPrint}
            </Text>
          </>
        ) : isRejected ? (
          <>
            <AlertCircle
              accessible={false}
              color={DOSSIER_CARD_COLORS.CORPORATE_RED}
              importantForAccessibility='no'
              size={DOSSIER_CARD_DIMENSIONS.STATUS_ICON_SIZE_PX}
            />
            <Text
              className={DOSSIER_CARD_STYLES.STATUS_INDICATOR_TEXT_REJECTED}
              numberOfLines={1}
            >
              {esCR.history.cards.rejectedMessage}
            </Text>
          </>
        ) : (
          <>
            <Lock
              accessible={false}
              color={DOSSIER_CARD_COLORS.MUTED_ICON}
              importantForAccessibility='no'
              size={DOSSIER_CARD_DIMENSIONS.STATUS_ICON_SIZE_PX}
            />
            <Text
              className={DOSSIER_CARD_STYLES.STATUS_INDICATOR_TEXT_LOCKED}
              numberOfLines={1}
            >
              {esCR.history.cards.printLockedMessage}
            </Text>
          </>
        )}
      </View>

      <View className={DOSSIER_CARD_STYLES.ACTIONS_ROW}>
        {isRejected ? (
          <Pressable
            accessibilityLabel={retryA11yLabel}
            accessibilityRole='button'
            accessibilityState={{ disabled: isRetryDisabled }}
            className={
              isRetryDisabled
                ? `${DOSSIER_CARD_STYLES.RETRY_BUTTON} ${DOSSIER_CARD_STYLES.RETRY_BUTTON_DISABLED}`
                : DOSSIER_CARD_STYLES.RETRY_BUTTON
            }
            disabled={isRetryDisabled}
            onPress={isRetryDisabled ? undefined : handlePressRetry}
            testID={DOSSIER_CARD_TEST_IDS.RETRY_BUTTON}
          >
            <Text
              className={DOSSIER_CARD_STYLES.RETRY_TEXT}
              numberOfLines={1}
            >
              {esCR.history.cards.retryButton}
            </Text>
          </Pressable>
        ) : isApprovedForQuickPrint ? (
          <Pressable
            accessibilityLabel={quickPrintA11yLabel}
            accessibilityRole='button'
            accessibilityState={{
              busy: isPrintingActive,
              disabled: isPrintingActive,
            }}
            className={DOSSIER_CARD_STYLES.QUICK_PRINT_ACTIVE_BUTTON}
            disabled={isPrintingActive}
            onPress={isPrintingActive ? undefined : handlePressQuickPrint}
            testID={DOSSIER_CARD_TEST_IDS.QUICK_PRINT_BUTTON}
          >
            {isPrintingActive ? (
              <>
                <ActivityIndicator
                  color={DOSSIER_CARD_COLORS.PRIMARY_GREEN}
                  size='small'
                />
                <Text
                  className={DOSSIER_CARD_STYLES.QUICK_PRINT_ACTIVE_TEXT}
                  numberOfLines={1}
                >
                  {esCR.history.cards.printInProgress}
                </Text>
              </>
            ) : (
              <>
                <Printer
                  accessible={false}
                  color={DOSSIER_CARD_COLORS.PRIMARY_GREEN}
                  importantForAccessibility='no'
                  size={DOSSIER_CARD_DIMENSIONS.ACTION_ICON_SIZE_PX}
                />
                <Text
                  className={DOSSIER_CARD_STYLES.QUICK_PRINT_ACTIVE_TEXT}
                  numberOfLines={1}
                >
                  {esCR.history.cards.printButton}
                </Text>
              </>
            )}
          </Pressable>
        ) : (
          <Pressable
            accessibilityLabel={quickPrintA11yLabel}
            accessibilityRole='button'
            accessibilityState={{ disabled: true }}
            className={DOSSIER_CARD_STYLES.QUICK_PRINT_LOCKED_BUTTON}
            disabled={true}
            onPress={undefined}
            testID={DOSSIER_CARD_TEST_IDS.QUICK_PRINT_BUTTON}
          >
            <Lock
              accessible={false}
              color={DOSSIER_CARD_COLORS.MUTED_ICON}
              importantForAccessibility='no'
              size={DOSSIER_CARD_DIMENSIONS.ACTION_ICON_SIZE_PX}
            />
            <Text
              className={DOSSIER_CARD_STYLES.QUICK_PRINT_LOCKED_TEXT}
              numberOfLines={1}
            >
              {esCR.history.cards.printButton}
            </Text>
          </Pressable>
        )}

        <Pressable
          accessibilityLabel={viewDossierA11yLabel}
          accessibilityRole='button'
          className={DOSSIER_CARD_STYLES.VIEW_DOSSIER_BUTTON}
          onPress={handlePressViewDossier}
          testID={DOSSIER_CARD_TEST_IDS.VIEW_DOSSIER_BUTTON}
        >
          <Text
            className={DOSSIER_CARD_STYLES.VIEW_DOSSIER_TEXT}
            numberOfLines={1}
          >
            {esCR.history.cards.viewDossierButton}
          </Text>
          <ChevronRight
            accessible={false}
            color={DOSSIER_CARD_COLORS.PRIMARY_TEXT}
            importantForAccessibility='no'
            size={DOSSIER_CARD_DIMENSIONS.ACTION_ICON_SIZE_PX}
          />
        </Pressable>
      </View>
    </View>
  );
};

export const DossierCard = React.memo(DossierCardComponent);

DossierCard.displayName = 'DossierCard';
