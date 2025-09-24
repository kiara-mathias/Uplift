import { Colors, Palettes } from '@/constants/Colors';
import { useTheme } from '@/context/ThemeContext';
import { MaterialIcons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';

function TabLayoutContent() {
  const { darkMode } = useTheme();
  const colorScheme = darkMode ? 'dark' : 'light';

  const getTabOptions = (paletteKey, iconName, label) => {
    const palette = Palettes[paletteKey]?.[colorScheme];
    return {
      title: label,
      tabBarIcon: ({ color, size }) => (
        <MaterialIcons name={iconName} size={size} color={color} />
      ),
      tabBarStyle: {
        backgroundColor: palette?.background ?? Colors[colorScheme].background,
      },
      tabBarActiveTintColor: palette?.accent ?? Colors[colorScheme].tint,
      tabBarInactiveTintColor: palette?.secondaryText ?? Colors[colorScheme].icon,
      headerStyle: {
        backgroundColor: palette?.background ?? Colors[colorScheme].background,
      },
      headerTintColor: palette?.text ?? Colors[colorScheme].text,
    };
  };

  return (
    <Tabs screenOptions={{ headerShown: false }}>
      <Tabs.Screen name="index" options={getTabOptions('home', 'home', 'Home')} />
      <Tabs.Screen name="academic/academic-home" options={getTabOptions('academic', 'school', 'Academic')} />
      <Tabs.Screen name="habits/habits-home" options={getTabOptions('habits', 'check-circle', 'Habits')} />
      <Tabs.Screen name="hobbies/hobbies-home" options={getTabOptions('hobbies', 'brush', 'Hobbies')} />
      <Tabs.Screen name="nutrition/nutrition-home" options={getTabOptions('nutrition', 'restaurant', 'Nutrition')} />
      <Tabs.Screen name="well-being/well-being" options={getTabOptions('wellness', 'self-improvement', 'Wellness')} />

      {/* <Tabs.Screen name="nutrition/nutrition" options={getTabOptions('nutrition', 'restaurant', 'Nutrition')} /> */}
    </Tabs>
  );
}

export default TabLayoutContent;
