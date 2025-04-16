import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter } from "expo-router";

const IntroScreen = () => {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to Lexica!</Text>
      <Text style={styles.text}>
        The personalized vocabulary tool, designed {'\n'} to help you improve your
        vocabulary and language skills.
        {'\n'}
        {'\n'}
        You'll be able to upload short and long-form audio {'\n'}and text and get some
        feedback on your speech.
      </Text>

      <TouchableOpacity
        style={styles.button}
        onPress={() => router.push("/(screens)/options")}
      >
        <Text style={styles.buttonText}>LET'S GET STARTED!</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#c0eef0",
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 60,
    fontWeight: "bold",
    color: "#023047",
    textAlign: "center",
    marginBottom: 20,
    fontFamily: "sans-serif",
  },
  text: {
    fontSize: 30,
    color: "#023047",
    textAlign: "center",
    marginBottom: 15,
    fontFamily: "sans-serif",
  },
  button: {
    backgroundColor: "#023047",
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 30,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    marginTop: 20,
  },
  buttonText: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
  },
});

export default IntroScreen;
