import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import { useRouter } from "expo-router";

const IntroScreen = () => {
  const router = useRouter();

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.card}>
        <Text style={styles.title}>Welcome to Lexica!</Text>

      <Text style={styles.subheading}>Ready to Level Up Your Vocabulary?</Text>

      <Text style={styles.bodyText}>
        Lexica is your personal language trainer, crafted to help you improve your vocabulary and language skills through personalized feedback.
      </Text>

      <Text style={styles.sectionTitle}>🎯 What You Can Do:</Text>
      <Text style={styles.bodyText}>
        • Record a new audio{'\n'}
        • Upload audio or text files{'\n'}
        • Get instant feedback on your speech clarity, filler words, and tone{'\n'}
      </Text>

      <Text style={styles.sectionTitle}>🛠️ External Tools Utilised:</Text>
      <Text style={styles.bodyText}>
        • <Text style={styles.bold}>AssemblyAI</Text> {'\n'}
        • <Text style={styles.bold}>Google TTS</Text>
      </Text>

      <Text style={styles.note}>
        ⚠️ Your files are not stored permanently, and no personal data is kept. However, it is advised to avoid uploading sensitive information where possible.
      </Text>

      <TouchableOpacity
        style={styles.button}
        onPress={() => router.push("/(screens)/options")}
      >
        <Text style={styles.buttonText}>LET’S GET STARTED</Text>
      </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#e0f7fa",
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 20,
    padding: 25,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 6,
  },
  title: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#023047",
    textAlign: "center",
    marginBottom: 10,
  },
  subheading: {
    fontSize: 20,
    textAlign: "center",
    color: "#555",
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#014f86",
    marginTop: 20,
    marginBottom: 8,
  },
  bodyText: {
    fontSize: 16,
    color: "#333",
    lineHeight: 24,
  },
  bold: {
    fontWeight: "bold",
  },
  note: {
    fontSize: 14,
    color: "#9e9e9e",
    fontStyle: "italic",
    marginTop: 20,
  },
  button: {
    backgroundColor: "#023047",
    paddingVertical: 14,
    borderRadius: 30,
    marginTop: 30,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
});

export default IntroScreen;
