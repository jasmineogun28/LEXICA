import { View, StyleSheet, Text } from "react-native";
import { Link } from "expo-router";

export default function NotFoundScreen() {
  return (
    <View style={styles.container}>
      <Link href="/(screens)/index" style={styles.button}>Go to Home Screen</Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#25292e",
  },
  text: {
    color: "#fff",
    fontSize: 20,
    marginBottom: 10,
  },
  button: {
    fontSize: 18,
    textDecorationLine: "underline",
    color: "#1E90FF",
  },
});
