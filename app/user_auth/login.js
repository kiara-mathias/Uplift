import { useTheme } from '@/context/ThemeContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, Dimensions, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import * as Animatable from 'react-native-animatable';

const { width } = Dimensions.get('window');

export default function Login() {
  const router = useRouter();
  const { darkMode } = useTheme();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    if (email && password) {
      await AsyncStorage.setItem('loggedIn', 'true');
      router.replace('/(tabs)'); // <-- go to Home tab
    } else {
      Alert.alert('Error', 'Please enter email and password.');
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: darkMode ? '#121212' : '#f5f9ff' }]}>
      <Animatable.Text animation="fadeInDown" style={[styles.title, { color: darkMode ? '#fff' : '#222' }]}>
        Welcome Back 👋
      </Animatable.Text>

      <Animatable.View animation="fadeInUp" delay={200} style={[styles.card, { backgroundColor: darkMode ? '#232347' : '#fff' }]}>
        <TextInput
          style={[styles.input, { backgroundColor: darkMode ? '#232347' : '#fafafa', color: darkMode ? '#fff' : '#000' }]}
          placeholder="Email"
          placeholderTextColor="#aaa"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          style={[styles.input, { backgroundColor: darkMode ? '#232347' : '#fafafa', color: darkMode ? '#fff' : '#000' }]}
          placeholder="Password"
          placeholderTextColor="#aaa"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.signupButton} onPress={() => router.push('/user_auth/signup')}>
          <Text style={styles.signupText}>Don't have an account? Sign Up</Text>
        </TouchableOpacity>
      </Animatable.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 40 },
  card: {
    width: width * 0.85,
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  input: { width: '100%', borderWidth: 1, borderColor: '#ddd', borderRadius: 10, padding: 12, marginBottom: 16 },
  button: { backgroundColor: '#6c63ff', paddingVertical: 14, borderRadius: 14, alignItems: 'center' },
  buttonText: { color: '#fff', fontWeight: '700', fontSize: 16 },
  signupButton: { marginTop: 12, alignItems: 'center' },
  signupText: { color: '#6c63ff', fontWeight: '600' },
});
