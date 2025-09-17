import { Palettes } from '@/constants/Colors';
import { useTheme } from '@/context/ThemeContext';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function HabitsHome() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { darkMode } = useTheme();
  const theme = darkMode ? Palettes.habits.dark : Palettes.habits.light;

  const habits = [
    { label: 'Habit Tracker', route: '/features/habits/_habits', icon: 'check-circle', colors: ['#FFA500', '#FFD580'] },
    { label: 'Daily Routine', route: '/habits/routine', icon: 'calendar-today', colors: ['#6c63ff', '#9591ee'] },
    { label: 'Goals', route: '/habits/goals', icon: 'star', colors: ['#262182', '#6c63ff'] },
  ];

  return (
    <LinearGradient
      colors={darkMode ? ['#232347', '#000'] : ['#f3f4fe', '#fff']}
      style={[styles.gradient, { paddingTop: insets.top }]}
    >
      <ScrollView contentContainerStyle={{ padding: 24 }}>
        <Text style={[styles.heading, { color: theme.text }]}>Habits Dashboard</Text>
        <Text style={[styles.subtitle, { color: theme.secondaryText }]}>
          Build and track your habits for a better you!
        </Text>

        <View style={styles.cardsContainer}>
          {habits.map((habit, idx) => (
            <TouchableOpacity
              key={idx}
              style={styles.cardWrapper}
              activeOpacity={0.9}
              onPress={() => router.push(habit.route)}
            >
              <LinearGradient
                colors={habit.colors}
                start={[0, 0]}
                end={[1, 1]}
                style={styles.card}
              >
                <MaterialIcons name={habit.icon} size={32} color="#fff" style={{ marginBottom: 10 }} />
                <Text style={styles.cardText}>{habit.label}</Text>
              </LinearGradient>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  heading: {
    fontSize: 28,
    fontWeight: '800',
    marginBottom: 8,
    letterSpacing: 1,
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 24,
    fontWeight: '500',
  },
  cardsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  cardWrapper: {
    width: '48%',
    marginBottom: 18,
    borderRadius: 18,
    overflow: 'hidden',
    elevation: 6,
    shadowColor: '#FFA500',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.18,
    shadowRadius: 12,
  },
  card: {
    borderRadius: 18,
    paddingVertical: 28,
    paddingHorizontal: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
    textAlign: 'center',
    letterSpacing: 0.5,
  },
});