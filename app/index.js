import { useTheme } from '@/context/ThemeContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Animated,
  Easing,
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
  const [showSplash, setShowSplash] = useState(false);
  const [showLanding, setShowLanding] = useState(false);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const logoScale = useRef(new Animated.Value(0.7)).current;
  const buttonTranslate = useRef(new Animated.Value(60)).current;
  const buttonOpacity = useRef(new Animated.Value(0)).current;

  // ----- FOR TESTING: Force landing page to show -----
  const FORCE_LANDING = true;

  // Check if user is logged in
  useEffect(() => {
    const checkLoggedIn = async () => {
      try {
        const loggedIn = await AsyncStorage.getItem('loggedIn');
        if (loggedIn === 'true' && !FORCE_LANDING) {
          setShowSplash(true);
          setTimeout(() => router.replace('/(tabs)'), 1000);
        } else {
          setShowLanding(true);
        }
      } catch {
        setShowLanding(true);
      } finally {
        setChecking(false);
      }
    };
    checkLoggedIn();
  }, []);

  // Animate landing page
  useEffect(() => {
    if (!checking && showLanding) {
      Animated.sequence([
        Animated.parallel([
          Animated.timing(fadeAnim, { toValue: 1, duration: 700, useNativeDriver: true }),
          Animated.spring(logoScale, { toValue: 1, friction: 5, useNativeDriver: true }),
        ]),
        Animated.delay(200),
        Animated.parallel([
          Animated.timing(buttonTranslate, {
            toValue: 0,
            duration: 600,
            easing: Easing.out(Easing.exp),
            useNativeDriver: true,
          }),
          Animated.timing(buttonOpacity, { toValue: 1, duration: 600, useNativeDriver: true }),
        ]),
      ]).start();
    }
  }, [checking, showLanding]);

  // Loader while checking AsyncStorage
  if (checking) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#4CAF50" />
      </View>
    );
  }

  // Splash for logged-in users (only if FORCE_LANDING = false)
  if (showSplash) {
    return (
      <View style={[styles.splashContainer, { backgroundColor: darkMode ? '#121212' : '#f5f9ff' }]}>
        <Animated.Image
          source={require('../assets/images/logo.png')}
          style={{
            width: 120,
            height: 120,
            transform: [
              { scale: fadeAnim.interpolate({ inputRange: [0, 1], outputRange: [0.7, 1] }) },
            ],
            opacity: fadeAnim,
          }}
        />
      </View>
    );
  }

  // Landing Page
  if (showLanding) {
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
          <Animated.Image
            source={require('../assets/images/logo.png')}
            style={[styles.logo, { transform: [{ scale: logoScale }] }]}
          />

          <Animated.Text style={[styles.quote, { opacity: fadeAnim }]}>
            "Balance your habits, academics, and hobbies – uplift yourself daily."
          </Animated.Text>

          <Animated.View
            style={{ width: '100%', opacity: buttonOpacity, transform: [{ translateY: buttonTranslate }] }}
          >
            {/* Get Started Button */}
            <TouchableOpacity style={styles.button} onPress={() => router.push('/user_auth/login')}>
              <Text style={styles.buttonText}>Get Started</Text>
            </TouchableOpacity>

            {/* Logout Button (for testing) */}
            <TouchableOpacity
              style={[styles.button, { backgroundColor: '#ff5252', marginTop: 12 }]}
              onPress={async () => {
                await AsyncStorage.removeItem('loggedIn');
                setShowLanding(true);
                setShowSplash(false);
                console.log('Logged out, landing page reset!');
              }}
            >
              <Text style={styles.buttonText}>Logout (Reset)</Text>
            </TouchableOpacity>
          </Animated.View>
        </KeyboardAvoidingView>
      </ImageBackground>
    );
  }

  return null;
}

const styles = StyleSheet.create({
  splashContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loader: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  background: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  overlay: { width: '90%', borderRadius: 28, padding: 32, alignItems: 'center', top: '10%' },
  logo: { width: 110, height: 110, marginBottom: 24, resizeMode: 'contain' },
  quote: { fontSize: 20, fontWeight: '600', textAlign: 'center', marginBottom: 36 },
  button: { width: '100%', paddingVertical: 14, borderRadius: 22, alignItems: 'center', marginBottom: 18, backgroundColor: '#4CAF50' },
  buttonText: { fontSize: 17, fontWeight: '700', color: '#fff' },
  toggleContainer: { position: 'absolute', top: 60, right: 30, flexDirection: 'row', alignItems: 'center', zIndex: 10 },
  toggleLabel: { fontSize: 15, marginRight: 8, fontWeight: '600', opacity: 0.8 },
});
