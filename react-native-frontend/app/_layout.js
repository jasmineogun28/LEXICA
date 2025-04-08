import { Stack } from "expo-router";
import { ResponseProvider } from "./context/ResponseContext";

export default function RootLayout() {

  return (
    <ResponseProvider> 
      <Stack screenOptions={{ headerShown: true }}>
        <Stack.Screen name="(screens)/index" /> 
        <Stack.Screen name="(screens)/introScreen" />
        <Stack.Screen name="(screens)/options" />
        <Stack.Screen name="(tabs)" />
      </Stack>
    </ResponseProvider>
  );
}
