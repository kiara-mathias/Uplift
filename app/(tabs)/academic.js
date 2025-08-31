import { Picker } from '@react-native-picker/picker';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { Alert, Button, FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import * as Progress from 'react-native-progress';

export default function Academic() {
  const [subjectName, setSubjectName] = useState('');
  const [difficulty, setDifficulty] = useState('Easy');
  const [subjects, setSubjects] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState('');
  const [editDifficulty, setEditDifficulty] = useState('Easy');

  const BACKEND_URL = 'http://192.168.1.4:5000';

  useEffect(() => {
    fetchSubjects();
  }, []);

  const fetchSubjects = () => {
    axios.get(`${BACKEND_URL}/subjects`)
      .then(res => {
        const validSubjects = Array.isArray(res.data) 
          ? res.data.filter(sub => sub && sub.id !== undefined) 
          : [];
        setSubjects(validSubjects);
      })
      .catch(err => console.log(err));
  };

  const addSubject = () => {
    if (!subjectName.trim()) return alert('Please enter a valid subject name!');
    axios.post(`${BACKEND_URL}/subjects`, {
      name: subjectName.trim(),
      difficulty,
      progress: 0,
    })
    .then(() => {
      setSubjectName('');
      setDifficulty('Easy');
      fetchSubjects();
    })
    .catch(err => console.log(err));
  };

  const incrementProgress = (id) => {
    const updated = subjects.map(sub => {
      if (sub.id === id) {
        const newProgress = Math.min(sub.progress + 10, 100);
        return { ...sub, progress: newProgress };
      }
      return sub;
    });
    setSubjects(updated);
    const subToUpdate = updated.find(sub => sub.id === id);
    if (subToUpdate) {
      axios.put(`${BACKEND_URL}/subjects/${id}`, subToUpdate)
        .catch(err => console.log(err));
    }
  };

  const deleteSubject = (id) => {
    Alert.alert('Delete Subject', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => {
        axios.delete(`${BACKEND_URL}/subjects/${id}`)
          .then(() => fetchSubjects())
          .catch(err => console.log(err));
      }}
    ]);
  };

  const startEditing = (sub) => {
    setEditingId(sub.id);
    setEditName(sub.name);
    setEditDifficulty(sub.difficulty);
  };

  const saveEdit = () => {
    if (!editName.trim()) return alert('Name cannot be empty!');
    const updated = { ...subjects.find(s => s.id === editingId), name: editName.trim(), difficulty: editDifficulty };
    axios.put(`${BACKEND_URL}/subjects/${editingId}`, updated)
      .then(() => {
        setEditingId(null);
        setEditName('');
        setEditDifficulty('Easy');
        fetchSubjects();
      })
      .catch(err => console.log(err));
  };

  const getProgressColor = (difficulty) => {
    switch(difficulty) {
      case 'Easy': return '#4caf50';
      case 'Medium': return '#ff9800';
      case 'Hard': return '#f44336';
      default: return '#2196f3';
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      {editingId === item.id ? (
        <>
          <TextInput
            value={editName}
            onChangeText={setEditName}
            style={styles.input}
            placeholder="Subject Name"
          />
          <Picker selectedValue={editDifficulty} onValueChange={setEditDifficulty} style={styles.picker}>
            <Picker.Item label="Easy" value="Easy" />
            <Picker.Item label="Medium" value="Medium" />
            <Picker.Item label="Hard" value="Hard" />
          </Picker>
          <View style={{flexDirection:'row', justifyContent:'space-between'}}>
            <Button title="Save" onPress={saveEdit} color="#4caf50"/>
            <Button title="Cancel" onPress={() => setEditingId(null)} color="#f44336"/>
          </View>
        </>
      ) : (
        <>
          <View style={{flexDirection:'row', justifyContent:'space-between', alignItems:'center'}}>
            <TouchableOpacity onPress={() => incrementProgress(item.id)}>
              <Text style={styles.subjectName}>{item.name}</Text>
            </TouchableOpacity>
            <View style={{flexDirection:'row', alignItems:'center'}}>
              <Text style={styles.difficulty}>{item.difficulty}</Text>
              <Button title="Edit" onPress={() => startEditing(item)} color="#2196f3"/>
              <Button title="Delete" onPress={() => deleteSubject(item.id)} color="#f44336"/>
            </View>
          </View>

          <Progress.Bar
            progress={item.progress / 100}
            width={null}
            color={getProgressColor(item.difficulty)}
            style={{marginTop:5}}
          />
          <Text style={{marginTop:5}}>{item.progress}% completed</Text>

          <View style={{flexDirection:'row', marginTop:5}}>
            {[1,2,3,4,5].map(day => (
              <View key={day} style={{
                width: 12, height:12, borderRadius:6, marginRight:5,
                backgroundColor: day <= Math.ceil(item.progress / 20) ? getProgressColor(item.difficulty) : '#ccc'
              }}/>
            ))}
          </View>
        </>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.dashboardTitle}>Academic Dashboard</Text>
      <TextInput
        value={subjectName}
        onChangeText={setSubjectName}
        placeholder="Subject Name"
        style={styles.input}
      />
      <Picker selectedValue={difficulty} onValueChange={setDifficulty} style={styles.picker}>
        <Picker.Item label="Easy" value="Easy" />
        <Picker.Item label="Medium" value="Medium" />
        <Picker.Item label="Hard" value="Hard" />
      </Picker>
      <Button title="Add Subject" onPress={addSubject} color="#2196f3" />

      <FlatList
        data={subjects.filter(sub => sub && sub.id !== undefined)}
        keyExtractor={item => item.id.toString()}
        renderItem={renderItem}
        ListEmptyComponent={<Text style={{textAlign:'center', marginTop:20}}>No subjects yet. Add one above!</Text>}
        style={{marginTop:15}}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding:15, backgroundColor:'#f2f2f2', paddingBottom:50, flex:1 },
  input: { borderWidth:1, borderColor:'#ddd', padding:10, marginBottom:10, borderRadius:8, backgroundColor:'#fafafa' },
  picker: { borderWidth:1, borderColor:'#ddd', marginBottom:10, backgroundColor:'#fafafa', borderRadius:8 },
  dashboardTitle: { fontSize:18, fontWeight:'bold', marginBottom:10 },
  card: { backgroundColor:'#fff', padding:15, borderRadius:12, marginBottom:12, elevation:2, shadowColor:'#000', shadowOffset:{width:0,height:1}, shadowOpacity:0.1, shadowRadius:2 },
  subjectName: { fontWeight:'bold', fontSize:16 },
  difficulty: { fontWeight:'bold', color:'#555', marginRight:5 },
});
