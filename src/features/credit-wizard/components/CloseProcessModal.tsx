import React from "react";
import { Modal, Pressable, Text, View } from "react-native";
import { BookmarkIcon, CloseIcon, SaveIcon } from "@/shared/ui/Icons";
import { BaseButton } from "../../../shared/ui/BaseButton/BaseButton";
import { BASE_BUTTON_VARIANTS } from "../../../shared/ui/BaseButton/constants/BaseButton.constants";
import {
  CLOSE_PROCESS_MODAL_COLORS,
  CLOSE_PROCESS_MODAL_COPY,
  CLOSE_PROCESS_MODAL_ICON_SIZES,
  CLOSE_PROCESS_MODAL_TEST_IDS,
} from "../constants/CloseProcessModal.constants";
export interface CloseProcessModalProps {
  onClose: () => void;
  onDiscard: () => void;
  onSaveDraft: () => void;
  visible: boolean;
}

/**
 * CloseProcessModal presents a confirmation dialog when the user attempts
 * to exit the credit application wizard.
 *
 * UX Behavior:
 * - Tapping the semi-transparent backdrop or the top-right close button triggers
 *   `onClose` (safe dismissal returning to the form).
 * - Tapping inside the white modal card does not propagate the press event to the backdrop.
 * - `onSaveDraft` and `onDiscard` require explicit button confirmation.
 */
export const CloseProcessModal = ({
  onClose,
  onDiscard,
  onSaveDraft,
  visible,
}: CloseProcessModalProps): React.JSX.Element => (
  <Modal
    animationType="fade"
    onRequestClose={onClose}
    statusBarTranslucent
    transparent
    visible={visible}
  >
    <Pressable
      accessibilityLabel={CLOSE_PROCESS_MODAL_COPY.CLOSE_ACCESSIBILITY_LABEL}
      className="flex-1 items-center justify-center bg-black/50 px-6"
      onPress={onClose}
      testID={CLOSE_PROCESS_MODAL_TEST_IDS.BACKDROP}
    >
      <Pressable
        accessibilityViewIsModal
        className="w-[90%] max-w-[340px] items-center rounded-3xl bg-white px-6 py-8"
        onPress={(event) => event?.stopPropagation?.()}
        testID={CLOSE_PROCESS_MODAL_TEST_IDS.CONTAINER}
      >
        <Pressable
          accessibilityLabel={
            CLOSE_PROCESS_MODAL_COPY.CLOSE_ACCESSIBILITY_LABEL
          }
          accessibilityRole="button"
          className="absolute right-3 top-3 min-h-[48px] min-w-[48px] items-center justify-center rounded-full active:bg-black/5"
          hitSlop={{ bottom: 8, left: 8, right: 8, top: 8 }}
          onPress={onClose}
          testID={CLOSE_PROCESS_MODAL_TEST_IDS.CLOSE_BUTTON}
        >
          <CloseIcon
            color={CLOSE_PROCESS_MODAL_COLORS.CLOSE_ICON}
            size={CLOSE_PROCESS_MODAL_ICON_SIZES.CLOSE}
          />
        </Pressable>

        <View className="h-14 w-14 items-center justify-center rounded-full bg-brand-beige">
          <BookmarkIcon
            color={CLOSE_PROCESS_MODAL_COLORS.BADGE_ICON}
            size={CLOSE_PROCESS_MODAL_ICON_SIZES.BADGE}
          />
        </View>

        <Text
          accessibilityRole="header"
          className="mt-6 text-center text-xl font-bold text-text-primary"
          testID={CLOSE_PROCESS_MODAL_TEST_IDS.TITLE}
        >
          {CLOSE_PROCESS_MODAL_COPY.TITLE}
        </Text>

        <Text
          className="mb-8 mt-3 text-center text-base text-text-secondary"
          testID={CLOSE_PROCESS_MODAL_TEST_IDS.BODY}
        >
          {CLOSE_PROCESS_MODAL_COPY.BODY}
        </Text>

        <View className="w-full gap-3">
          <BaseButton
            icon={
              <SaveIcon
                color={CLOSE_PROCESS_MODAL_COLORS.SAVE_ICON}
                size={CLOSE_PROCESS_MODAL_ICON_SIZES.SAVE}
              />
            }
            label={CLOSE_PROCESS_MODAL_COPY.SAVE_DRAFT}
            onPress={onSaveDraft}
            testID={CLOSE_PROCESS_MODAL_TEST_IDS.SAVE_DRAFT_BUTTON}
            variant={BASE_BUTTON_VARIANTS.PRIMARY}
          />
          <BaseButton
            label={CLOSE_PROCESS_MODAL_COPY.DISCARD}
            onPress={onDiscard}
            testID={CLOSE_PROCESS_MODAL_TEST_IDS.DISCARD_BUTTON}
            variant={BASE_BUTTON_VARIANTS.GHOST}
          />
        </View>
      </Pressable>
    </Pressable>
  </Modal>
);
