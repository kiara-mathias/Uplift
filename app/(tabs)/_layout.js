import { Colors, Palettes } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { MaterialIcons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';

export default function TabLayout() {
  const colorScheme = useColorScheme(); // "light" or "dark"

  // Helper to pick the right palette for each tab
  const getTabOptions = (paletteKey, iconName, label) => {
    const palette = Palettes[paletteKey]?.[colorScheme ?? 'light'];

    return {
      title: label,
      tabBarIcon: ({ color, size }) => (
        <MaterialIcons name={iconName} size={size} color={color} />
      ),
      tabBarStyle: {
        backgroundColor: palette?.background ?? Colors[colorScheme ?? 'light'].background,
      },
      tabBarActiveTintColor: palette?.accent ?? Colors[colorScheme ?? 'light'].tint,
      tabBarInactiveTintColor: palette?.secondaryText ?? Colors[colorScheme ?? 'light'].icon,
      headerStyle: {
        backgroundColor: palette?.background ?? Colors[colorScheme ?? 'light'].background,
      },
      headerTintColor: palette?.text ?? Colors[colorScheme ?? 'light'].text,
    };
  };

  return (
    <Tabs screenOptions={{ headerShown: false }}>
      <Tabs.Screen
        name="index" // Home
        options={getTabOptions('home', 'home', 'Home')}
      />
      <Tabs.Screen
        name="academic/academic"
        options={getTabOptions('academic', 'school', 'Academic')}
      />
      <Tabs.Screen
        name="habits/habit"
        options={getTabOptions('habits', 'check-circle', 'Habits')}
      />
      <Tabs.Screen
        name="nutrition/nutrition"
        options={getTabOptions('nutrition', 'restaurant', 'Nutrition')}
      />
    </Tabs>
  );
}
