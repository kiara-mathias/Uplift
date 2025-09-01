import { MaterialIcons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';

// Correct imports with exact folder & file names
import Academic from './(tabs)/academic/academic';
import Habits from './(tabs)/habits/habits';

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator screenOptions={{ headerShown: false }}>
        <Tab.Screen 
          name="Academic" 
          component={Academic} 
          options={{ tabBarIcon: ({ color, size }) => <MaterialIcons name="school" color={color} size={size} /> }}
        />
        <Tab.Screen 
          name="Habits" 
          component={Habits} 
          options={{ tabBarIcon: ({ color, size }) => <MaterialIcons name="checklist" color={color} size={size} /> }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
