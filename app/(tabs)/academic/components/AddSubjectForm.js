import { Picker, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function AddSubjectForm({ subjectName, setSubjectName, difficulty, setDifficulty, onAdd, theme }) {
  return (
    <View>
      <TextInput
        value={subjectName}
        onChangeText={setSubjectName}
        placeholder="Subject Name"
        placeholderTextColor={theme.secondaryText}
        style={[styles.input, { backgroundColor: theme.inputBackground, color: theme.text }]}
      />
      <Picker
        selectedValue={difficulty}
        onValueChange={setDifficulty}
        style={[styles.picker, { backgroundColor: theme.inputBackground, color: theme.text }]}
      >
        <Picker.Item label="Easy" value="Easy" />
        <Picker.Item label="Medium" value="Medium" />
        <Picker.Item label="Hard" value="Hard" />
      </Picker>
      <TouchableOpacity style={[styles.addButton, { backgroundColor: theme.accent }]} onPress={onAdd}>
        <Text style={{ color: theme.buttonText, fontWeight:'bold' }}>Add Subject</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  input: { borderWidth:1, borderColor:'#ddd', padding:10, marginBottom:10, borderRadius:12 },
  picker: { borderWidth:1, borderColor:'#ddd', marginBottom:10, borderRadius:12 },
  addButton: { padding:12, borderRadius:12, alignItems:'center', marginBottom:10 },
});
