import { useTheme } from '@/context/ThemeContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

export default function Landing() {
  const { darkMode, setDarkMode } = useTheme();
  const router = useRouter();
  const [checking, setChecking] = useState(true);
  const [username, setUsername] = useState(null);

  // Check if user is logged in
  useEffect(() => {
    const checkLoggedIn = async () => {
      try {
        const token = await AsyncStorage.getItem('access_token'); // JWT token from signup/login
        const storedUsername = await AsyncStorage.getItem('username'); // username if stored
        if (token) {
          setUsername(storedUsername || 'User');
          router.replace('/(tabs)'); // redirect logged-in user
        }
      } catch (error) {
        console.log('Error checking login:', error);
      } finally {
        setChecking(false);
      }
    };
    checkLoggedIn();
  }, []);

  // Loader while checking AsyncStorage
  if (checking) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#4CAF50" />
      </View>
    );
  }

  // Landing Page for new users
  return (
    <ImageBackground
      source={{ uri: 'https://images.unsplash.com/photo-1506784365847-bbad939e9335' }}
      style={styles.background}
      blurRadius={2}
    >
      <StatusBar barStyle={darkMode ? 'light-content' : 'dark-content'} />
      <View style={styles.toggleContainer}>
        <Text style={[styles.toggleLabel, { color: darkMode ? '#fff' : '#222' }]}>
          {darkMode ? 'Dark' : 'Light'} Mode
        </Text>
        <Switch
          value={darkMode}
          onValueChange={setDarkMode}
          thumbColor="#4CAF50"
          trackColor={{ false: '#ccc', true: '#333' }}
        />
      </View>

      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.overlay}>
        <Text style={[styles.title, { color: darkMode ? '#fff' : '#222' }]}>Welcome to Uplift</Text>
        <Text style={[styles.quote, { color: darkMode ? '#ddd' : '#555' }]}>
          "Balance your habits, academics, and hobbies – uplift yourself daily."
        </Text>

        <TouchableOpacity style={styles.button} onPress={() => router.push('/user_auth/signup')}>
          <Text style={styles.buttonText}>Get Started</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.button, { backgroundColor: '#6c63ff' }]} onPress={() => router.push('/user_auth/login')}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  loader: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  background: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  overlay: { width: '90%', borderRadius: 28, padding: 32, alignItems: 'center', top: '10%' },
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 20 },
  quote: { fontSize: 18, fontWeight: '500', textAlign: 'center', marginBottom: 36 },
  button: { width: '100%', paddingVertical: 14, borderRadius: 22, alignItems: 'center', marginBottom: 18, backgroundColor: '#4CAF50' },
  buttonText: { fontSize: 17, fontWeight: '700', color: '#fff' },
  toggleContainer: { position: 'absolute', top: 60, right: 30, flexDirection: 'row', alignItems: 'center', zIndex: 10 },
  toggleLabel: { fontSize: 15, marginRight: 8, fontWeight: '600', opacity: 0.8 },
});
