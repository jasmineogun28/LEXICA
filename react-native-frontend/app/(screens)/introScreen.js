import React from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import { useRouter } from "expo-router";

const IntroScreen = () => {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.title}> Welcome to Lexica!</Text>
      <Text style={styles.text}> The personalised vocabulary tool, {'\n'}designed to help you improve your vocabulary and language skills.</Text>
      <Button title="PRESS TO GET STARTED" onPress={() => router.push("/(screens)/options")} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // justifyContent: "center",
    paddingTop: 80,
    alignItems: "center",
    backgroundColor: "#c0eef0",
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#023047',
    textAlign: 'center', 
  },
  text: {
    fontSize: 22,
    marginBottom: 20,
    color: '#023047',
    textAlign: 'center',
  },
});

export default IntroScreen;
