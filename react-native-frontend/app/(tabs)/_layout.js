import { Tabs } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import { ResponseProvider } from '../context/ResponseContext'; 

export default function TabNavigator() {
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
      </Tabs>
  );
}
