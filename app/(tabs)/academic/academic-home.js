import { Palettes } from '@/constants/Colors';
import { useTheme } from '@/context/ThemeContext';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function AcademicHome() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { darkMode } = useTheme();
  const theme = darkMode ? Palettes.academic.dark : Palettes.academic.light;

  // Example academic tasks
  const tasks = [
    { label: 'Academic tracker', route: '/academic/academic', icon: 'assignment', colors: ['#6c63ff', '#9591ee'] }
    // { label: 'Exams', icon: 'event-note', colors: ['#262182', '#6c63ff'] },
    // { label: 'Projects', icon: 'folder', colors: ['#9591ee', '#6c63ff'] },
  ];

  return (
    <LinearGradient
      colors={darkMode ? ['#232347', '#000'] : ['#f3f4fe', '#fff']}
      style={[styles.gradient, { paddingTop: insets.top }]}
    >
      <ScrollView contentContainerStyle={{ padding: 24 }}>
        <Text style={[styles.heading, { color: theme.text }]}>Academic Dashboard</Text>
        <Text style={[styles.subtitle, { color: theme.secondaryText }]}>
          Track your assignments, exams, and projects!
        </Text>

        <View style={styles.cardsContainer}>
          {tasks.map((task, idx) => (
            <TouchableOpacity
              key={idx}
              style={styles.cardWrapper}
              activeOpacity={0.9}
              onPress={() => router.push(task.route)}
            >
              <LinearGradient
                colors={task.colors}
                start={[0, 0]}
                end={[1, 1]}
                style={styles.card}
              >
                <MaterialIcons name={task.icon} size={32} color="#fff" style={{ marginBottom: 10 }} />
                <Text style={styles.cardText}>{task.label}</Text>
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
    shadowColor: '#6c63ff',
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