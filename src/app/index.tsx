import React from "react";
import { StyleSheet, Text, View } from "react-native";

const Index = (): React.JSX.Element => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>BYC FastForm - Home</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    backgroundColor: "#F7F7F6",
    flex: 1,
    justifyContent: "center",
  },
  text: {
    color: "#1C1917",
    fontSize: 18,
    fontWeight: "600",
  },
});

export default Index;
