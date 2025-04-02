import React, { useEffect } from "react";
import { View, Text, ActivityIndicator, StyleSheet } from "react-native";
import { useRouter } from "expo-router";

const LoadingScreen = () => {
  const router = useRouter();

  useEffect(() => {
    console.log("LoadingScreen mounted");
    setTimeout(() => {
      console.log("Navigating to Intro...");
      router.push("/(screens)/introScreen"); 
    }, 2000);
  }, []);

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#3498db" />
      <Text style={styles.text}>Loading...</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
  },
  text: {
    marginTop: 10,
    fontSize: 18,
  },
});

export default LoadingScreen;
