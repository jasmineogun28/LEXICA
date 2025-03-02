// import React from "react";
// import { createStackNavigator } from "@react-navigation/stack";
// import { NavigationContainer } from "@react-navigation/native";
// import LoadingScreen from "./screens/index";
// import IntroScreen from "./screens/introScreen";
// import TabNavigator from "./(tabs)/_layout"; // Import your tab navigation

// const Stack = createStackNavigator();

// export default function App() {
//     return (
//         <NavigationContainer>
//             <Stack.Navigator initialRouteName="Loading" screenOptions={{ headerShown: false }}>
//                 <Stack.Screen name="Loading" component={LoadingScreen} />
//                 <Stack.Screen name="Intro" component={IntroScreen} />
//                 <Stack.Screen name="MainApp" component={TabNavigator} />
//             </Stack.Navigator>
//         </NavigationContainer>
//     );
// }

import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import RootLayout from "./_layout.js";  // Import the root layout

export default function App() {
  return (
    <NavigationContainer>
      <RootLayout />
    </NavigationContainer>
  );
}
