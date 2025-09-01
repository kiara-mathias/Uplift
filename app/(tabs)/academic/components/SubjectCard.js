import { MaterialIcons } from '@expo/vector-icons';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import * as Progress from 'react-native-progress';

export default function SubjectCard({ subject, onEdit, onDelete, onIncrement, theme, difficultyColors }) {
  return (
    <View style={[styles.card, { backgroundColor: theme.card }]}>
      <View style={{flexDirection:'row', justifyContent:'space-between', alignItems:'center'}}>
        <TouchableOpacity onPress={() => onIncrement(subject.id)}>
          <Text style={[styles.subjectName, { color: theme.text }]}>{subject.name}</Text>
        </TouchableOpacity>
        <View style={{flexDirection:'row', alignItems:'center'}}>
          <Text style={{ color: theme.secondaryText, marginRight:5 }}>{subject.difficulty}</Text>
          <TouchableOpacity style={[styles.iconButton, { backgroundColor: theme.accent }]} onPress={onEdit}>
            <MaterialIcons name="edit" size={20} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity style={[styles.iconButton, { backgroundColor: '#f44336' }]} onPress={onDelete}>
            <MaterialIcons name="delete" size={20} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>
      <Progress.Bar
        progress={subject.progress / 100}
        width={null}
        color={difficultyColors[subject.difficulty]}
        borderRadius={6}
        style={{ marginTop:5 }}
      />
      <Text style={{marginTop:5, color: theme.secondaryText}}>{subject.progress}% completed</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { padding:15, borderRadius:16, marginBottom:12, elevation:2 },
  subjectName: { fontWeight:'bold', fontSize:16 },
  iconButton: { padding:6, borderRadius:8, marginLeft:5 },
});
