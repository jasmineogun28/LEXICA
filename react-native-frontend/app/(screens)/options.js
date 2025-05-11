import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, useWindowDimensions, Platform, ScrollView } from "react-native";
import { useRouter } from "expo-router";

const OptionsScreen = () => {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isSmallScreen = width < 600;

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <Text style={[styles.text, isSmallScreen && styles.textSmall]}>
        Would you like to record a new audio file or upload a file?
      </Text>

      <View style={[styles.buttonContainer, isSmallScreen && styles.buttonColumn]}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push("/(screens)/record")}
        >
          <Text style={styles.buttonText}>🎙️ Record</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push("/(screens)/upload")}
        >
          <Text style={styles.buttonText}>📁 Upload</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#c0eef0",
  },
  text: {
    fontSize: 40,
    fontWeight: "bold",
    color: "#023047",
    textAlign: "center",
    marginBottom: 40,
  },
  textSmall: {
    fontSize: 28,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 20, // will be ignored on Android, but used in web/iOS
  },
  buttonColumn: {
    flexDirection: "column",
    alignItems: "center",
  },
  button: {
    backgroundColor: "#023047",
    paddingVertical: 14,
    paddingHorizontal: 30,
    borderRadius: 25,
    marginBottom: 20,
    width: 200,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 3,
  },
  buttonText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
  },
});

export default OptionsScreen;
