import { Palettes } from '@/constants/Colors';
import { MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from '@react-native-picker/picker';
import axios from 'axios';
import { useEffect, useState } from 'react';
import {
  FlatList, KeyboardAvoidingView, Platform, StatusBar,
  StyleSheet,
  Text, TextInput, TouchableOpacity, View
} from 'react-native';
import * as Progress from 'react-native-progress';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

export default function Academic() {
  const [subjectName, setSubjectName] = useState('');
  const [difficulty, setDifficulty] = useState('Easy');
  const [subjects, setSubjects] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState('');
  const [editDifficulty, setEditDifficulty] = useState('Easy');
  const [darkMode, setDarkMode] = useState(false);

  const BACKEND_URL = 'http://127.0.0.1:5000/academic'; // update if using device: local IP
  const insets = useSafeAreaInsets();

  const theme = darkMode ? Palettes.academic.dark : Palettes.academic.light;

  const difficultyColors = {
    Easy: '#4caf50',
    Medium: '#ff9800',
    Hard: '#f44336',
  };

  useEffect(() => {
    fetchSubjects();
  }, []);

  // --------- FETCH TASKS FROM BACKEND ----------
  const fetchSubjects = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const res = await axios.get(`${BACKEND_URL}/`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSubjects(res.data);
    } catch (err) {
      console.log(err);
      alert('Failed to fetch tasks from backend');
    }
  };

  // --------- ADD NEW TASK ----------
  const addSubject = async () => {
    if (!subjectName.trim()) return alert('Please enter a valid subject name!');
    try {
      const token = await AsyncStorage.getItem('token');
      await axios.post(`${BACKEND_URL}/`, {
        subject: subjectName.trim(),
        task_name: 'Initial Task',
        deadline: new Date().toISOString(),
        completed: false
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSubjectName('');
      setDifficulty('Easy');
      fetchSubjects();
    } catch (err) {
      console.log(err);
      alert('Failed to add task');
    }
  };

  // --------- TOGGLE COMPLETION / UPDATE TASK ----------
  const toggleCompleted = async (id, currentCompleted) => {
    try {
      const token = await AsyncStorage.getItem('token');
      const task = subjects.find(s => s.id === id);
      await axios.put(`${BACKEND_URL}/${id}`, { ...task, completed: !currentCompleted }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchSubjects();
    } catch (err) {
      console.log(err);
      alert('Failed to update task');
    }
  };

  // --------- DELETE TASK ----------
  const deleteSubject = async (id) => {
    const isWeb = typeof window !== 'undefined' && window.confirm;
    if (isWeb && !window.confirm('Are you sure you want to delete this subject?')) return;

    try {
      const token = await AsyncStorage.getItem('token');
      await axios.delete(`${BACKEND_URL}/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSubjects(prev => prev.filter(sub => sub.id !== id));
    } catch (err) {
      console.log(err);
      alert('Failed to delete task');
    }
  };

  // --------- EDIT TASK ----------
  const startEditing = (sub) => {
    setEditingId(sub.id);
    setEditName(sub.subject);
    setEditDifficulty(sub.difficulty);
  };

  const saveEdit = async () => {
    if (!editName.trim()) return alert('Name cannot be empty!');
    const updated = { ...subjects.find(s => s.id === editingId), subject: editName.trim(), difficulty: editDifficulty };
    try {
      const token = await AsyncStorage.getItem('token');
      await axios.put(`${BACKEND_URL}/${editingId}`, updated, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setEditingId(null);
      setEditName('');
      setEditDifficulty('Easy');
      fetchSubjects();
    } catch (err) {
      console.log(err);
      alert('Failed to update task');
    }
  };

  const renderItem = ({ item }) => (
    <View style={[styles.card, { backgroundColor: theme.card }]}>
      {editingId === item.id ? (
        <>
          <TextInput
            value={editName}
            onChangeText={setEditName}
            style={[styles.input, { backgroundColor: theme.inputBackground, color: theme.text }]}
            placeholder="Subject Name"
            placeholderTextColor={theme.secondaryText}
          />
          <Picker selectedValue={editDifficulty} onValueChange={setEditDifficulty} style={[styles.picker, { backgroundColor: theme.inputBackground, color: theme.text }]}>
            <Picker.Item label="Easy" value="Easy" />
            <Picker.Item label="Medium" value="Medium" />
            <Picker.Item label="Hard" value="Hard" />
          </Picker>
          <View style={{flexDirection:'row', justifyContent:'space-between', marginTop:5}}>
            <TouchableOpacity style={[styles.saveButton, { backgroundColor: theme.accent }]} onPress={saveEdit}>
              <Text style={{ color: theme.buttonText }}>Save</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.deleteButton, { backgroundColor: '#f44336' }]} onPress={() => setEditingId(null)}>
              <Text style={{ color: theme.buttonText }}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </>
      ) : (
        <>
          <View style={{flexDirection:'row', justifyContent:'space-between', alignItems:'center'}}>
            <TouchableOpacity onPress={() => toggleCompleted(item.id, item.completed)}>
              <Text style={[styles.subjectName, { color: theme.text }]}>{item.subject}</Text>
            </TouchableOpacity>
            <View style={{flexDirection:'row', alignItems:'center'}}>
              <Text style={[styles.difficulty, { color: theme.secondaryText }]}>{item.difficulty}</Text>
              <TouchableOpacity style={[styles.iconButton, { backgroundColor: theme.accent }]} onPress={() => startEditing(item)}>
                <MaterialIcons name="edit" size={20} color="#fff" />
              </TouchableOpacity>
              <TouchableOpacity style={[styles.iconButton, { backgroundColor: '#f44336' }]} onPress={() => deleteSubject(item.id)}>
                <MaterialIcons name="delete" size={20} color="#fff" />
              </TouchableOpacity>
            </View>
          </View>
          <Progress.Bar
            progress={item.completed ? 1 : 0}
            width={null}
            color={difficultyColors[item.difficulty] || theme.accent}
            borderRadius={6}
            style={{marginTop:5}}
          />
          <Text style={{marginTop:5, color: theme.secondaryText}}>{item.completed ? 'Completed' : 'Incomplete'}</Text>
        </>
      )}
    </View>
  );

  return (
    <SafeAreaView style={{flex:1, backgroundColor: theme.background, paddingTop: insets.top}}>
      <StatusBar barStyle={darkMode ? "light-content" : "dark-content"} backgroundColor={theme.background} />
      <KeyboardAvoidingView style={{flex:1}} behavior={Platform.OS === "ios" ? "padding" : "height"}>
        <View style={{padding:15}}>
          <TextInput
            value={subjectName}
            onChangeText={setSubjectName}
            placeholder="Subject Name"
            placeholderTextColor={theme.secondaryText}
            style={[styles.input, { backgroundColor: theme.inputBackground, color: theme.text }]}
          />
          <Picker selectedValue={difficulty} onValueChange={setDifficulty} style={[styles.picker, { backgroundColor: theme.inputBackground, color: theme.text }]} >
            <Picker.Item label="Easy" value="Easy" />
            <Picker.Item label="Medium" value="Medium" />
            <Picker.Item label="Hard" value="Hard" />
          </Picker>
          <TouchableOpacity style={[styles.addButton, { backgroundColor: theme.accent }]} onPress={addSubject}>
            <Text style={{ color: theme.buttonText, fontWeight:'bold' }}>Add Subject</Text>
          </TouchableOpacity>
          <FlatList
            data={subjects}
            keyExtractor={item => item.id.toString()}
            renderItem={renderItem}
            ListEmptyComponent={<Text style={{textAlign:'center', marginTop:20, color: theme.secondaryText}}>No subjects yet. Add one above!</Text>}
          />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  input: { borderWidth:1, borderColor:'#ddd', padding:10, marginBottom:10, borderRadius:12 },
  picker: { borderWidth:1, borderColor:'#ddd', marginBottom:10, borderRadius:12 },
  addButton: { padding:12, borderRadius:12, alignItems:'center', marginBottom:10 },
  card: { padding:15, borderRadius:16, marginBottom:12, elevation:2, shadowColor:'#000', shadowOffset:{width:0,height:1}, shadowOpacity:0.1, shadowRadius:2 },
  subjectName: { fontWeight:'bold', fontSize:16 },
  difficulty: { fontWeight:'bold', marginRight:5 },
  iconButton: { padding:6, borderRadius:8, marginLeft:5 },
  saveButton: { padding:10, borderRadius:12, alignItems:'center', flex:1, marginRight:5 },
  deleteButton: { padding:10, borderRadius:12, alignItems:'center', flex:1 }
});
