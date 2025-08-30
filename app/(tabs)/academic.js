import { Picker } from '@react-native-picker/picker';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { Button, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import * as Progress from 'react-native-progress';

export default function Academic() {
  const [subjectName, setSubjectName] = useState('');
  const [difficulty, setDifficulty] = useState('Easy');
  const [subjects, setSubjects] = useState([]);
  const BACKEND_URL = 'http://192.168.1.7:5000';

  // Add new subject
  const addSubject = () => {
    if (!subjectName) return alert('Please enter subject name!');

    axios.post(`${BACKEND_URL}/subjects`, {
      name: subjectName,
      difficulty: difficulty,
      progress: 0,
    })
    .then(res => {
      console.log('Subject added:', res.data);
      // Reset form
      setSubjectName('');
      setDifficulty('Easy');
      // Refresh dashboard
      fetchSubjects();
    })
    .catch(err => console.log(err));
  };

  // Fetch subjects from backend
  const fetchSubjects = () => {
    axios.get(`${BACKEND_URL}/subjects`)
      .then(res => {
        console.log('Fetched subjects:', res.data);
        setSubjects(res.data);
      })
      .catch(err => console.log(err));
  };

  useEffect(() => {
    fetchSubjects();
  }, []);

  // Helper to color-code progress bar
  const getProgressColor = (difficulty) => {
    switch(difficulty) {
      case 'Easy': return '#4caf50'; // green
      case 'Medium': return '#ff9800'; // orange
      case 'Hard': return '#f44336'; // red
      default: return '#2196f3'; // blue
    }
  }

  return (
    <ScrollView style={styles.container}>
      
      {/* Add Subject Form */}
      <View style={styles.formCard}>
        <Text style={styles.formTitle}>Add New Subject</Text>

        <TextInput
          placeholder="Enter subject name"
          value={subjectName}
          onChangeText={setSubjectName}
          style={styles.input}
        />

        <Picker
          selectedValue={difficulty}
          onValueChange={(itemValue) => setDifficulty(itemValue)}
          style={styles.picker}
        >
          <Picker.Item label="Easy" value="Easy" />
          <Picker.Item label="Medium" value="Medium" />
          <Picker.Item label="Hard" value="Hard" />
        </Picker>

        <Button title="Add Subject" onPress={addSubject} color="#2196f3" />
      </View>

      {/* Dashboard */}
      <Text style={styles.dashboardTitle}>Academic Dashboard</Text>
      {subjects.length === 0 && <Text style={{textAlign:'center'}}>No subjects yet. Add one above!</Text>}

      {subjects.map((sub, index) => (
        <View key={index} style={styles.card}>
          <View style={{flexDirection:'row', justifyContent:'space-between'}}>
            <Text style={styles.subjectName}>{sub.name}</Text>
            <Text style={styles.difficulty}>{sub.difficulty}</Text>
          </View>

          <Progress.Bar
            progress={sub.progress / 100}
            width={null}
            color={getProgressColor(sub.difficulty)}
            style={{marginTop: 5}}
          />
          <Text style={{marginTop: 5}}>{sub.progress}% completed</Text>
        </View>
      ))}
    </ScrollView>
  );
}

// Styles
const styles = StyleSheet.create({
  container: {
    padding: 15,
    backgroundColor: '#f2f2f2',
  },
  formCard: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    elevation: 3, // shadow for Android
    shadowColor: '#000', // shadow for iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  formTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
    backgroundColor: '#fafafa',
  },
  picker: {
    borderWidth: 1,
    borderColor: '#ddd',
    marginBottom: 10,
    backgroundColor: '#fafafa',
  },
  dashboardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  card: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  subjectName: {
    fontWeight: 'bold',
    fontSize: 16,
  },
});
