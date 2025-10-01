import { useTheme } from '@/context/ThemeContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, Dimensions, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import * as Animatable from 'react-native-animatable';

const { width } = Dimensions.get('window');

export default function Signup() {
  const router = useRouter();
  const { darkMode } = useTheme();
  const [username, setUsername] = useState(''); // NEW
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // updated to handle auth during signup by connecting to backend
  const handleSignup = async () => {
    if (!username || !email || !password) {
        Alert.alert('Error', 'Please enter username, email, and password.');
        return;
    }

    try {
        const response = await fetch('http://127.0.0.1:5000/auth/signup', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, email, password })
        });

        const data = await response.json();

        if (response.ok) {
            // Save JWT token locally
            await AsyncStorage.setItem('token', data.access_token);
            // Navigate to home tab
            router.replace('/(tabs)');
        } else {
            Alert.alert('Signup Failed', data.error);
        }
    } catch (err) {
        Alert.alert('Error', 'Network error. Try again.');
        console.log(err);
    }
};


  return (
    <View style={[styles.container, { backgroundColor: darkMode ? '#121212' : '#f5f9ff' }]}>
      <Animatable.Text animation="fadeInDown" style={[styles.title, { color: darkMode ? '#fff' : '#222' }]}>
        Create Account
      </Animatable.Text>

      <Animatable.View animation="fadeInUp" delay={200} style={[styles.card, { backgroundColor: darkMode ? '#232347' : '#fff' }]}>
        <TextInput
          style={[styles.input, { backgroundColor: darkMode ? '#232347' : '#fafafa', color: darkMode ? '#fff' : '#000' }]}
          placeholder="Username"
          placeholderTextColor="#aaa"
          autoCapitalize="none"
          value={username}
          onChangeText={setUsername}
        />
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

        <TouchableOpacity style={styles.button} onPress={handleSignup}>
          <Text style={styles.buttonText}>Sign Up</Text>
        </TouchableOpacity>


        <TouchableOpacity style={styles.signupButton} onPress={() => router.push('/user_auth/login')}>
          <Text style={styles.signupText}>Already have an account? Login</Text>
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

