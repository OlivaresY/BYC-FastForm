import React from "react";
import { Modal, Pressable, Text, View } from "react-native";
import Svg, { Path } from "react-native-svg";
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

interface IconProps {
  color: string;
  size: number;
}

const CloseIcon = ({ color, size }: IconProps): React.JSX.Element => (
  <Svg
    fill="none"
    height={size}
    stroke={color}
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth={CLOSE_PROCESS_MODAL_ICON_SIZES.STROKE_WIDTH}
    viewBox="0 0 24 24"
    width={size}
  >
    <Path d="M18 6 6 18" />
    <Path d="M6 6l12 12" />
  </Svg>
);

const BookmarkIcon = ({ color, size }: IconProps): React.JSX.Element => (
  <Svg
    fill="none"
    height={size}
    stroke={color}
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth={CLOSE_PROCESS_MODAL_ICON_SIZES.STROKE_WIDTH}
    viewBox="0 0 24 24"
    width={size}
  >
    <Path d="M19 21l-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
  </Svg>
);

const SaveIcon = ({ color, size }: IconProps): React.JSX.Element => (
  <Svg
    fill="none"
    height={size}
    stroke={color}
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth={CLOSE_PROCESS_MODAL_ICON_SIZES.STROKE_WIDTH}
    viewBox="0 0 24 24"
    width={size}
  >
    <Path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
    <Path d="M17 21v-8H7v8" />
    <Path d="M7 3v5h8" />
  </Svg>
);

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
    <View
      className="flex-1 items-center justify-center bg-black/50 px-6"
      testID={CLOSE_PROCESS_MODAL_TEST_IDS.BACKDROP}
    >
      <View
        accessibilityViewIsModal
        className="w-[90%] max-w-[340px] items-center rounded-3xl bg-white px-6 py-8"
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
      </View>
    </View>
  </Modal>
);
