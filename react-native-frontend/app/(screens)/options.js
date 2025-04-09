import React from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import { useRouter } from "expo-router";

const OptionsScreen = () => {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Would you like to record a new audio file or upload a file?</Text>

      <View style={styles.buttonRow}>
        <View style={styles.button}>
          <Button title="RECORD" onPress={() => router.push("/(screens)/record")} />
        </View>

        <View style={styles.button}>
          <Button title="UPLOAD" onPress={() => router.push("/(screens)/upload")} />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // justifyContent: "center",
    alignItems: "center",
    paddingTop: 80,
    paddingHorizontal: 20,
    backgroundColor: "#c0eef0",
  },
  text: {
    fontSize: 22,
    fontWeight: '500',
    marginBottom: 20,
    color: '#023047',
    textAlign: 'center',
  },
  buttonRow: {
    flexDirection: "row", // ← this is the key
    justifyContent: "center",
    alignItems: "center",
    gap: 10, // works in web, not all RN versions — see below
  },
  button: {
    marginHorizontal: 5,
  },
});

export default OptionsScreen;
