import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" /> {/* Default loading screen */}
      <Stack.Screen name="introScreen" />
      <Stack.Screen name="(tabs)" /> {/* This includes the TabNavigator */}
    </Stack>
  );
}
