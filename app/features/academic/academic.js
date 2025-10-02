import { Palettes } from '@/constants/Colors';
import { MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from '@react-native-picker/picker';
import axios from 'axios';
import { useEffect, useState } from 'react';
import {
  Alert, FlatList, Image, KeyboardAvoidingView, Platform, ScrollView, StatusBar,
  StyleSheet, Switch, Text, TextInput, TouchableOpacity, View
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
  const insets = useSafeAreaInsets();

  const BACKEND_URL = 'http://127.0.0.1:5000';
  const theme = darkMode ? Palettes.academic.dark : Palettes.academic.light;

  const difficultyColors = {
    Easy: '#4caf50',
    Medium: '#ff9800',
    Hard: '#f44336',
  };

  useEffect(() => {
    fetchSubjects();
  }, []);

  const getToken = async () => await AsyncStorage.getItem('token');

  const fetchSubjects = async () => {
    try {
      const token = await getToken();
      const res = await axios.get(`${BACKEND_URL}/subjects`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSubjects(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.log(err);
    }
  };

  const addSubject = async () => {
    if (!subjectName.trim()) return alert('Please enter a valid subject name!');
    try {
      const token = await getToken();
      await axios.post(`${BACKEND_URL}/subjects`, {
        name: subjectName.trim(),
        difficulty,
        progress: 0
      }, { headers: { Authorization: `Bearer ${token}` }});
      setSubjectName('');
      setDifficulty('Easy');
      fetchSubjects();
    } catch (err) {
      console.log(err);
    }
  };

  const updateSubject = async (subject) => {
    try {
      const token = await getToken();
      await axios.put(`${BACKEND_URL}/subjects/${subject.id}`, subject, {
        headers: { Authorization: `Bearer ${token}` }
      });
    } catch (err) {
      console.log(err);
    }
  };

  const incrementProgress = async (id, by = 10) => {
    setSubjects(prev =>
      prev.map(sub => {
        if (sub.id === id) {
          const newProgress = Math.min(sub.progress + by, 100);
          updateSubject({ ...sub, progress: newProgress });
          return { ...sub, progress: newProgress };
        }
        return sub;
      })
    );
  };

  const deleteSubject = async (id) => {
    Alert.alert('Delete Subject', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: async () => {
        try {
          const token = await getToken();
          await axios.delete(`${BACKEND_URL}/subjects/${id}`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          setSubjects(prev => prev.filter(sub => sub.id !== id));
        } catch (err) {
          console.log(err);
          alert('Failed to delete subject');
        }
      }}
    ]);
  };

  const startEditing = (sub) => {
    setEditingId(sub.id);
    setEditName(sub.name);
    setEditDifficulty(sub.difficulty);
  };

  const saveEdit = async () => {
    if (!editName.trim()) return alert('Name cannot be empty!');
    const updated = { ...subjects.find(s => s.id === editingId), name: editName.trim(), difficulty: editDifficulty };
    try {
      await updateSubject(updated);
      setEditingId(null);
      setEditName('');
      setEditDifficulty('Easy');
      fetchSubjects();
    } catch (err) {
      console.log(err);
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
            <TouchableOpacity onPress={() => incrementProgress(item.id)}>
              <Text style={[styles.subjectName, { color: theme.text }]}>{item.name}</Text>
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
            progress={item.progress / 100}
            width={null}
            color={difficultyColors[item.difficulty] || theme.accent}
            borderRadius={6}
            style={{marginTop:5}}
          />
          <Text style={{marginTop:5, color: theme.secondaryText}}>{item.progress}% completed</Text>

          <View style={{flexDirection:'row', alignItems:'center', marginTop:5}}>
            {['M','T','W','Th','F'].map((day, idx) => (
              <TouchableOpacity
                key={idx}
                onPress={() => incrementProgress(item.id, 20)}
                style={{ alignItems:'center', marginRight:8 }}
              >
                <View style={{
                  width: 16,
                  height:16,
                  borderRadius:8,
                  backgroundColor: idx+1 <= Math.ceil(item.progress / 20)
                    ? (difficultyColors[item.difficulty] || theme.accent)
                    : '#ccc'
                }}/>
                <Text style={{color: theme.secondaryText, fontSize:10, marginTop:2}}>{day}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </>
      )}
    </View>
  );

  return (
    <SafeAreaView style={{flex:1, backgroundColor: theme.background, paddingTop: insets.top}}>
      <StatusBar barStyle={darkMode ? "light-content" : "dark-content"} backgroundColor={theme.background} />
      <KeyboardAvoidingView style={{flex:1}} behavior={Platform.OS === "ios" ? "padding" : "height"}>
        <ScrollView contentContainerStyle={styles.container}>
          
          <View style={{flexDirection:'row', justifyContent:'space-between', alignItems:'center', marginBottom:15}}>
            <View style={{flexDirection:'row', alignItems:'center'}}>
              <Text style={[styles.dashboardTitle, { color: theme.text }]}>Academic Dashboard</Text>
              <Image 
                source={require('../../../assets/images/undraw_studying.png')} 
                style={styles.profileImage} 
              />
            </View>
            <View style={{flexDirection:'row', alignItems:'center'}}>
              <Text style={{color: theme.secondaryText, marginRight:5}}>{darkMode ? 'Dark' : 'Light'}</Text>
              <Switch value={darkMode} onValueChange={setDarkMode} thumbColor={theme.accent} />
            </View>
          </View>

          {/* Add Subject Form */}
          <TextInput
            value={subjectName}
            onChangeText={setSubjectName}
            placeholder="Subject Name"
            placeholderTextColor={theme.secondaryText}
            style={[styles.input, { backgroundColor: theme.inputBackground, color: theme.text }]}
          />
          <Picker selectedValue={difficulty} onValueChange={setDifficulty} style={[styles.picker, { backgroundColor: theme.inputBackground, color: theme.text }]}>
            <Picker.Item label="Easy" value="Easy" />
            <Picker.Item label="Medium" value="Medium" />
            <Picker.Item label="Hard" value="Hard" />
          </Picker>
          <TouchableOpacity style={[styles.addButton, { backgroundColor: theme.accent }]} onPress={addSubject}>
            <Text style={{ color: theme.buttonText, fontWeight:'bold' }}>Add Subject</Text>
          </TouchableOpacity>

          {/* Subjects List */}
          <FlatList
            data={subjects}
            keyExtractor={item => item.id.toString()}
            renderItem={renderItem}
            ListEmptyComponent={<Text style={{textAlign:'center', marginTop:20, color: theme.secondaryText}}>No subjects yet. Add one above!</Text>}
            scrollEnabled={false}
            style={{marginTop:15}}
          />

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { padding:15, paddingBottom:50 },
  dashboardTitle: { fontSize:20, fontWeight:'bold' },
  profileImage: { width:24, height:24, borderRadius:12, marginLeft:8 },
  input: { borderWidth:1, borderColor:'#ddd', padding:10, marginBottom:10, borderRadius:12 },
  picker: { borderWidth:1, borderColor:'#ddd', marginBottom:10, borderRadius:12 },
  addButton: { padding:12, borderRadius:12, alignItems:'center', marginBottom:10 },
  card: { padding:15, borderRadius:16, marginBottom:12, elevation:2, shadowColor:'#000', shadowOffset:{width:0,height:1}, shadowOpacity:0.1, shadowRadius:2 },
  subjectName: { fontWeight:'bold', fontSize:16 },
  difficulty: { fontWeight:'bold', marginRight:5 },
  iconButton: { padding:6, borderRadius:8, marginLeft:5 },
  saveButton: { padding:10, borderRadius:12, alignItems:'center', flex:1, marginRight:5 },
  deleteButton: { padding:10, borderRadius:12, alignItems:'center', flex:1 },
});
