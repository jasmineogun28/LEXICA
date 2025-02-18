// import { Tabs } from 'expo-router';

// import Ionicons from '@expo/vector-icons/Ionicons';


// export default function TabLayout() {
//   return (
//     <Tabs
//       screenOptions={{
//       tabBarActiveTintColor: '#ffb703',
//       headerStyle: {
//         backgroundColor: '#023047',
//       },
//       headerShadowVisible: false,
//       headerTintColor: '#fff',
//       tabBarStyle: {
//       backgroundColor: '#023047',
//       },
//     }}
//     >
//       <Tabs.Screen
//         name="index"
//         options={{
//           title: 'Home',
//           tabBarIcon: ({ color, focused }) => (
//             <Ionicons name={focused ? 'home-sharp' : 'home-outline'} color={color} size={24} />
//           ),
//         }}
//       />
      
//       {/* <Tabs.Screen
//         name="record"
//         options={{
//           title: 'Recording Function Page',
//           tabBarIcon: ({ color, focused }) => (
//             <Ionicons name={focused ? 'mic' : 'mic-off'} color={color} size={24} />
//           ),
//         }}
//       /> */}

//       <Tabs.Screen
//         name="testAPI"
//         options={{
//           title: 'Test API',
//           tabBarIcon: ({ color, focused }) => (
//             <Ionicons name={focused ? 'battery-charging' : 'battery-dead'} color={color} size={24}/>
//           ),
//         }}
//       />

//       <Tabs.Screen
//         name="vocabWrapped"
//         options={{
//           title: 'Vocab Wrapped',
//           tabBarIcon: ({ color, focused }) => (
//             <Ionicons name={focused ? 'information-circle' : 'information-circle-outline'} color={color} size={24}/>
//           ),
//         }}
//       />
      
//       <Tabs.Screen
//         name="learn"
//         options={{
//           title: 'Learning Page',
//           tabBarIcon: ({ color, focused }) => (
//             <Ionicons name={focused ? 'information-circle' : 'information-circle-outline'} color={color} size={24}/>
//           ),
//         }}
//       />
//     </Tabs>
//   );
// }


import { Tabs } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#ffb703',
        headerStyle: {
          backgroundColor: '#023047',
        },
        headerShadowVisible: false,
        headerTintColor: '#fff',
        tabBarStyle: {
          backgroundColor: '#023047',
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'home-sharp' : 'home-outline'} color={color} size={24} />
          ),
        }}
      />

      <Tabs.Screen
        name="testAPI"
        options={{
          title: 'Test API',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'battery-charging' : 'battery-dead'} color={color} size={24} />
          ),
        }}
      />

      <Tabs.Screen
        name="vocabWrapped"
        options={{
          title: 'Vocab Wrapped',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'information-circle' : 'information-circle-outline'} color={color} size={24} />
          ),
        }}
      />

      <Tabs.Screen
        name="learn"
        options={{
          title: 'Learning Page',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'information-circle' : 'information-circle-outline'} color={color} size={24} />
          ),
        }}
      />

      {/* Hidden screens */}
      <Tabs.Screen
        name="record"
        options={{
          tabBarStyle: { display: 'none' },  // Hide from tab bar
        }}
      />
      <Tabs.Screen
        name="Fileupload"
        options={{
          tabBarStyle: { display: 'none' },  // Hide from tab bar
        }}
      />
    </Tabs>
  );
}
