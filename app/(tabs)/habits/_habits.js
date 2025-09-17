import { Palettes } from '@/constants/Colors'; // absolute import
import { MaterialIcons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { Alert, FlatList, KeyboardAvoidingView, Platform, ScrollView, StatusBar, StyleSheet, Switch, Text, TextInput, TouchableOpacity, View } from 'react-native';
import * as Progress from 'react-native-progress';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

export default function HabitsTracker() {
  const [habitName, setHabitName] = useState('');
  const [frequency, setFrequency] = useState('Daily');
  const [habits, setHabits] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState('');
  const [editFrequency, setEditFrequency] = useState('Daily');
  const [darkMode, setDarkMode] = useState(false);

  const BACKEND_URL = 'http://192.168.1.8:5001';
  const insets = useSafeAreaInsets();

  const current = darkMode ? Palettes.habits.dark : Palettes.habits.light;

  useEffect(() => {
    fetchHabits();
  }, []);

  const fetchHabits = () => {
    axios.get(`${BACKEND_URL}/habits`)
      .then(res => {
        const validHabits = Array.isArray(res.data) ? res.data.filter(h => h && h.id !== undefined) : [];
        setHabits(validHabits);
      })
      .catch(err => console.log(err));
  };

  const addHabit = () => {
    if (!habitName.trim()) return alert('Please enter a valid habit name!');
    axios.post(`${BACKEND_URL}/habits`, { name: habitName.trim(), frequency, progress: 0 })
      .then(() => {
        setHabitName('');
        setFrequency('Daily');
        fetchHabits();
      })
      .catch(err => console.log(err));
  };

  const incrementProgress = (id) => {
    setHabits(prev =>
      prev.map(h => {
        if (h.id === id) {
          const newProgress = Math.min(h.progress + 20, 100);
          axios.put(`${BACKEND_URL}/habits/${id}`, { ...h, progress: newProgress })
            .catch(err => console.log(err));
          return { ...h, progress: newProgress };
        }
        return h;
      })
    );
  };

  const deleteHabit = (id) => {
    const isWeb = typeof window !== 'undefined' && window.confirm;
    if (isWeb) {
      if (window.confirm('Delete this habit?')) {
        axios.delete(`${BACKEND_URL}/habits/${id}`)
          .then(() => setHabits(prev => prev.filter(h => h.id !== id)))
          .catch(err => console.log(err));
      }
    } else {
      Alert.alert('Delete Habit', 'Are you sure?', [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: async () => {
          try {
            await axios.delete(`${BACKEND_URL}/habits/${id}`);
            setHabits(prev => prev.filter(h => h.id !== id));
          } catch(err) {
            console.log(err);
            alert('Failed to delete habit');
          }
        }}
      ]);
    }
  };

  const startEditing = (h) => {
    setEditingId(h.id);
    setEditName(h.name);
    setEditFrequency(h.frequency);
  };

  const saveEdit = () => {
    if (!editName.trim()) return alert('Name cannot be empty!');
    const updated = { ...habits.find(h => h.id === editingId), name: editName.trim(), frequency: editFrequency };
    axios.put(`${BACKEND_URL}/habits/${editingId}`, updated)
      .then(() => {
        setEditingId(null);
        setEditName('');
        setEditFrequency('Daily');
        fetchHabits();
      })
      .catch(err => console.log(err));
  };

  const renderItem = ({ item }) => (
    <View style={[styles.card, { backgroundColor: current.card }]}>
      {editingId === item.id ? (
        <>
          <TextInput
            value={editName} onChangeText={setEditName}
            style={[styles.input, { backgroundColor: current.inputBackground, color: current.text }]}
            placeholder="Habit Name" placeholderTextColor={current.secondaryText}
          />
          <Picker selectedValue={editFrequency} onValueChange={setEditFrequency} style={[styles.picker, { backgroundColor: current.inputBackground, color: current.text }]}>
            <Picker.Item label="Daily" value="Daily" />
            <Picker.Item label="Weekly" value="Weekly" />
          </Picker>
          <View style={{flexDirection:'row', justifyContent:'space-between', marginTop:5}}>
            <TouchableOpacity style={[styles.saveButton, { backgroundColor: current.accent }]} onPress={saveEdit}>
              <Text style={{ color: current.buttonText }}>Save</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.deleteButton, { backgroundColor: '#f44336' }]} onPress={() => setEditingId(null)}>
              <Text style={{ color: current.buttonText }}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </>
      ) : (
        <>
          <View style={{flexDirection:'row', justifyContent:'space-between', alignItems:'center'}}>
            <TouchableOpacity onPress={() => incrementProgress(item.id)}>
              <Text style={[styles.habitName, { color: current.text }]}>{item.name}</Text>
            </TouchableOpacity>
            <View style={{flexDirection:'row', alignItems:'center'}}>
              <Text style={[styles.frequency, { color: current.secondaryText }]}>{item.frequency}</Text>
              <TouchableOpacity style={[styles.iconButton, { backgroundColor: current.accent }]} onPress={() => startEditing(item)}>
                <MaterialIcons name="edit" size={20} color="#fff" />
              </TouchableOpacity>
              <TouchableOpacity style={[styles.iconButton, { backgroundColor: '#f44336' }]} onPress={() => deleteHabit(item.id)}>
                <MaterialIcons name="delete" size={20} color="#fff" />
              </TouchableOpacity>
            </View>
          </View>

          <Progress.Bar
            progress={item.progress / 100}
            width={null}
            color={current.accent}
            borderRadius={6}
            style={{marginTop:5}}
          />
          <Text style={{marginTop:5, color: current.secondaryText}}>{item.progress}% completed</Text>

          <View style={{flexDirection:'row', marginTop:5}}>
            {[1,2,3,4,5].map(day => (
              <View key={day} style={{
                width: 12, height:12, borderRadius:6, marginRight:5,
                backgroundColor: day <= Math.ceil(item.progress / 20) ? current.accent : '#ccc'
              }}/>
            ))}
          </View>
        </>
      )}
    </View>
  );

  return (
    <SafeAreaView style={{flex:1, backgroundColor: current.background, paddingTop: insets.top}}>
      <StatusBar barStyle={darkMode ? "light-content" : "dark-content"} backgroundColor={current.background} />
      <KeyboardAvoidingView style={{flex:1, backgroundColor: current.background}} behavior={Platform.OS === "ios" ? "padding" : "height"}>
        <ScrollView contentContainerStyle={[styles.container, { backgroundColor: current.background, flexGrow: 1 }]}>
          
          {/* Header + Dark/Light Toggle */}
          <View style={{flexDirection:'row', justifyContent:'space-between', alignItems:'center', marginBottom:15}}>
            <Text style={[styles.dashboardTitle, { color: current.text }]}>Habit Tracker</Text>
            <View style={{flexDirection:'row', alignItems:'center'}}>
              <Text style={{color: current.secondaryText, marginRight:5}}>{darkMode ? 'Dark' : 'Light'}</Text>
              <Switch value={darkMode} onValueChange={setDarkMode} thumbColor={current.accent} />
            </View>
          </View>

          {/* Add Habit Form */}
          <TextInput
            value={habitName} onChangeText={setHabitName}
            placeholder="Habit Name" placeholderTextColor={current.secondaryText}
            style={[styles.input, { backgroundColor: current.inputBackground, color: current.text }]}
          />
          <Picker selectedValue={frequency} onValueChange={setFrequency} style={[styles.picker, { backgroundColor: current.inputBackground, color: current.text }]}>
            <Picker.Item label="Daily" value="Daily" />
            <Picker.Item label="Weekly" value="Weekly" />
          </Picker>
          <TouchableOpacity style={[styles.addButton, { backgroundColor: current.accent }]} onPress={addHabit}>
            <Text style={{ color: current.buttonText, fontWeight:'bold' }}>Add Habit</Text>
          </TouchableOpacity>

          {/* Habits List */}
          <FlatList
            data={habits.filter(h => h && h.id !== undefined)}
            keyExtractor={item => item.id.toString()}
            renderItem={renderItem}
            ListEmptyComponent={<Text style={{textAlign:'center', marginTop:20, color: current.secondaryText}}>No habits yet. Add one above!</Text>}
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
  input: { borderWidth:1, borderColor:'#ddd', padding:10, marginBottom:10, borderRadius:12 },
  picker: { borderWidth:1, borderColor:'#ddd', marginBottom:10, borderRadius:12 },
  addButton: { padding:12, borderRadius:12, alignItems:'center', marginBottom:10 },
  card: { padding:15, borderRadius:16, marginBottom:12, elevation:2, shadowColor:'#000', shadowOffset:{width:0,height:1}, shadowOpacity:0.1, shadowRadius:2 },
  habitName: { fontWeight:'bold', fontSize:16 },
  frequency: { fontWeight:'bold', marginRight:5 },
  iconButton: { padding:6, borderRadius:8, marginLeft:5 },
  saveButton: { padding:10, borderRadius:12, alignItems:'center', flex:1, marginRight:5 },
  deleteButton: { padding:10, borderRadius:12, alignItems:'center', flex:1 }
});
