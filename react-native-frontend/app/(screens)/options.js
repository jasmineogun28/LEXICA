import React from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import { useRouter } from "expo-router";

const OptionsScreen = () => {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Would you like to record a new audio file or upload a file?</Text>

      <View style={styles.button}>
      <Button title="RECORD" onPress={() => router.push("/(screens)/record")} />
      </View>

      <View style={styles.button}>
      <Button title="UPLOAD" onPress={() => router.push("/(screens)/upload")} />
        </View>

        <View style={styles.button}>
      <Button title="FIX API" onPress={() => router.push("/(screens)/fixApi")} />
        </View>
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
  button: {
    margin: 10,
  },
});

export default OptionsScreen;
