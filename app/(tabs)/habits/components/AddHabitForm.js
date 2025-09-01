import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function AddHabitForm({ habitName, setHabitName, onAdd, theme }) {
  return (
    <View>
      <TextInput
        value={habitName}
        onChangeText={setHabitName}
        placeholder="Habit Name"
        placeholderTextColor={theme.secondaryText}
        style={[styles.input, { backgroundColor: theme.inputBackground, color: theme.text }]}
      />
      <TouchableOpacity style={[styles.addButton, { backgroundColor: theme.accent }]} onPress={onAdd}>
        <Text style={{ color: theme.buttonText, fontWeight:'bold' }}>Add Habit</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  input: { borderWidth:1, borderColor:'#ddd', padding:10, marginBottom:10, borderRadius:12 },
  addButton: { padding:12, borderRadius:12, alignItems:'center', marginBottom:10 },
});
