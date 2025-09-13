import { Palettes } from '@/constants/Colors';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

export default function Home() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const theme = Palettes.home.light;

  const focusAreas = [
    { label: 'Academics', route: '/academic/academic-home', icon: 'school', color: '#8B4513' },
    { label: 'Habits', route: '/habits/habits-home', icon: 'check-circle', color: '#FFA500' },
    { label: 'Nutrition', route: '/nutrition/index', icon: 'restaurant', color: '#3CB371' },
    { label: 'Well-being', route: '/wellbeing/index', icon: 'self-improvement', color: '#6A5ACD' },
    { label: 'Hobbies', route: '/hobbies/index', icon: 'brush', color: '#FF69B4' },
  ];

  return (
    <SafeAreaView style={[styles.container, { paddingTop: insets.top, backgroundColor: theme.background }]}>
      <ScrollView contentContainerStyle={{ padding: 20 }}>
        <Text style={[styles.welcome, { color: theme.text }]}>Welcome, Kiara 👋</Text>
        <Text style={[styles.subtitle, { color: theme.secondaryText }]}>
          What would you like to focus on today?
        </Text>

        <View style={styles.cardsContainer}>
          {focusAreas.map((area, idx) => (
            <TouchableOpacity
              key={idx}
              style={[styles.card, { backgroundColor: area.color }]}
              onPress={() => router.push(area.route)}
              activeOpacity={0.85}
            >
              <MaterialIcons name={area.icon} size={32} color="#fff" style={{ marginBottom: 10 }} />
              <Text style={styles.cardText}>{area.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  welcome: { fontSize: 28, fontWeight: '700', marginBottom: 5 },
  subtitle: { fontSize: 16, marginBottom: 20 },
  cardsContainer: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  card: {
    width: '48%',
    borderRadius: 16,
    paddingVertical: 30,
    paddingHorizontal: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 5,
  },
  cardText: { color: '#fff', fontWeight: '600', fontSize: 16, textAlign: 'center' },
});
