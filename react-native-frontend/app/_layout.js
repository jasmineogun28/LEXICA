import { Stack } from "expo-router";
import { ResponseProvider } from "./context/ResponseContext";

export default function RootLayout() {

  return (
    <ResponseProvider> 
      <Stack
        screenOptions={{
          headerShown: true,
          headerStyle: { backgroundColor: "#023047" }, 
          headerTintColor: "#ffffff", 
          headerTitleStyle: { fontWeight: "bold" }, 
        }}
      >
        <Stack.Screen name="(screens)/index" options={{title: "Loading"}} /> 
        <Stack.Screen name="(screens)/introScreen" options={{title: "Home"}}/>
        <Stack.Screen name="(screens)/options" options={{title: "Options"}}/>
        <Stack.Screen name="(screens)/record" options={{title: "New Play"}}/>
        <Stack.Screen name="(screens)/upload" options={{title: "Upload"}}/>
        <Stack.Screen name="(tabs)" options={{title:"Results"}}/>
      </Stack>
    </ResponseProvider>
  );
}
