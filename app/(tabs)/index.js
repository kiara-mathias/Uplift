import { Palettes } from '@/constants/Colors';
import { useTheme } from '@/context/ThemeContext';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient'; // <-- import this
import { useRouter } from 'expo-router';
import { ScrollView, StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function Home() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { darkMode, setDarkMode } = useTheme();
  const theme = darkMode ? Palettes.home.dark : Palettes.home.light;

  const focusAreas = [
    { label: 'Academics', route: '/academic/academic', icon: 'school', colors: ['#6c63ff', '#9591ee'] },
    { label: 'Habits', route: '/habits/habits', icon: 'check-circle', colors: ['#FFA500', '#FFD580'] },
    { label: 'Nutrition', route: '/nutrition/index', icon: 'restaurant', colors: ['#3CB371', '#a8e063'] },
    { label: 'Well-being', route: '/wellbeing/index', icon: 'self-improvement', colors: ['#6A5ACD', '#b39ddb'] },
    { label: 'Hobbies', route: '/hobbies/index', icon: 'brush', colors: ['#FF69B4', '#FFB6C1'] },
  ];

  return (
    <LinearGradient
      colors={darkMode ? ['#232347', '#000'] : ['#f3f4fe', '#fff']}
      style={[styles.gradient, { paddingTop: insets.top }]}
    >
      <ScrollView contentContainerStyle={{ padding: 24 }}>
        <View style={styles.toggleRow}>
          <Text style={{ color: theme.text, fontWeight: '700', fontSize: 18, marginRight: 8 }}>Dark Mode</Text>
          <Switch
            value={darkMode}
            onValueChange={setDarkMode}
            trackColor={{ false: '#ccc', true: theme.accent }}
            thumbColor={darkMode ? theme.accent : '#fff'}
            style={styles.switch}
          />
        </View>
        <Text style={[styles.welcome, { color: theme.text }]}>Welcome 👋</Text>
        <Text style={[styles.subtitle, { color: theme.secondaryText }]}>
          What would you like to focus on today?
        </Text>

        <View style={styles.cardsContainer}>
          {focusAreas.map((area, idx) => (
            <TouchableOpacity
              key={idx}
              style={styles.cardWrapper}
              onPress={() => router.push(area.route)}
              activeOpacity={0.9}
            >
              <LinearGradient
                colors={area.colors}
                start={[0, 0]}
                end={[1, 1]}
                style={styles.card}
              >
                <MaterialIcons name={area.icon} size={36} color="#fff" style={{ marginBottom: 12 }} />
                <Text style={styles.cardText}>{area.label}</Text>
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
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginBottom: 18,
  },
  switch: {
    transform: [{ scaleX: 1.2 }, { scaleY: 1.2 }],
  },
  welcome: {
    fontSize: 32,
    fontWeight: '800',
    marginBottom: 8,
    letterSpacing: 1,
  },
  subtitle: {
    fontSize: 18,
    marginBottom: 28,
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
    paddingVertical: 36,
    paddingHorizontal: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 18,
    textAlign: 'center',
    letterSpacing: 0.5,
  },
});
