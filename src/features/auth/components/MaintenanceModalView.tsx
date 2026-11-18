import { Wrench } from 'lucide-react-native';
import React from 'react';
import { Modal, StyleSheet, Text, View } from 'react-native';
import {
  MAINTENANCE_MODAL_COLORS,
  MAINTENANCE_MODAL_COPY,
  MAINTENANCE_MODAL_NUMERICAL,
  MAINTENANCE_MODAL_STYLES,
  MAINTENANCE_MODAL_TEST_IDS,
} from '../constants/MaintenanceModalView.constants';

const NOOP_VOID = (): void => undefined;

const modalStyles = StyleSheet.create({
  backdrop: {
    backgroundColor: MAINTENANCE_MODAL_COLORS.BACKDROP,
  },
  cardShadow: {
    elevation: 6,
    shadowColor: MAINTENANCE_MODAL_COLORS.SHADOW_COLOR,
    shadowOffset: { height: 6, width: 0 },
    shadowOpacity: 0.16,
    shadowRadius: 14,
  },
});

export interface MaintenanceModalViewProps {
  isVisible: boolean;
  testID?: string;
}

export const MaintenanceModalView = React.memo(
  ({
    isVisible,
    testID = MAINTENANCE_MODAL_TEST_IDS.MODAL,
  }: MaintenanceModalViewProps): React.JSX.Element => (
    <Modal
      animationType='fade'
      onRequestClose={NOOP_VOID}
      statusBarTranslucent
      testID={testID}
      transparent
      visible={isVisible}
    >
      <View
        className={MAINTENANCE_MODAL_STYLES.BACKDROP}
        style={modalStyles.backdrop}
        testID={MAINTENANCE_MODAL_TEST_IDS.BACKDROP}
      >
        <View
          accessibilityViewIsModal
          className={MAINTENANCE_MODAL_STYLES.CARD}
          style={modalStyles.cardShadow}
          testID={MAINTENANCE_MODAL_TEST_IDS.CARD}
        >
          <View
            className={MAINTENANCE_MODAL_STYLES.ICON_CONTAINER}
            testID={MAINTENANCE_MODAL_TEST_IDS.ICON_CONTAINER}
          >
            <Wrench
              color={MAINTENANCE_MODAL_COLORS.ICON_COLOR}
              size={MAINTENANCE_MODAL_NUMERICAL.ICON_SIZE}
              strokeWidth={MAINTENANCE_MODAL_NUMERICAL.ICON_STROKE_WIDTH}
            />
          </View>

          <Text
            accessibilityRole='header'
            className={MAINTENANCE_MODAL_STYLES.TITLE}
            testID={MAINTENANCE_MODAL_TEST_IDS.TITLE}
          >
            {MAINTENANCE_MODAL_COPY.TITLE}
          </Text>

          <Text
            className={MAINTENANCE_MODAL_STYLES.BODY}
            testID={MAINTENANCE_MODAL_TEST_IDS.BODY}
          >
            {MAINTENANCE_MODAL_COPY.BODY}
          </Text>
        </View>
      </View>
    </Modal>
  ),
);

MaintenanceModalView.displayName = 'MaintenanceModalView';

export default MaintenanceModalView;
