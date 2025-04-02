import React from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import { useRouter } from "expo-router";

const IntroScreen = () => {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.text}>
        Welcome to Lexica!{'\n'}The personalised vocabulary tool
      </Text>
      <Button title="PRESS TO GET STARTED" onPress={() => router.push("/(screens)/options")} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    // backgroundColor: "#219ebc",
  },
  text: {
    fontSize: 22,
    marginBottom: 20,
    color: '#023047',
    textAlign: 'center',
  },
});

export default IntroScreen;
