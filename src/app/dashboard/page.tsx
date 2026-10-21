import React from "react";
import { Text, View } from "react-native";

const DashboardPage = (): React.JSX.Element => {
  return (
    <View className="flex-1 items-center justify-center bg-background">
      <Text className="text-base font-semibold text-text-primary">
        Panel de Control
      </Text>
    </View>
  );
};

export default DashboardPage;
