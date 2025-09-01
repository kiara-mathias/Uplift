import { MaterialIcons } from '@expo/vector-icons';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function HabitCard({ habit, onEdit, onDelete, theme }) {
  return (
    <View style={[styles.card, { backgroundColor: theme.card }]}>
      <View style={{flexDirection:'row', justifyContent:'space-between', alignItems:'center'}}>
        <Text style={{ color: theme.text, fontWeight:'bold' }}>{habit.name}</Text>
        <View style={{flexDirection:'row'}}>
          <TouchableOpacity style={[styles.iconButton, { backgroundColor: theme.accent }]} onPress={onEdit}>
            <MaterialIcons name="edit" size={20} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity style={[styles.iconButton, { backgroundColor:'#f44336' }]} onPress={onDelete}>
            <MaterialIcons name="delete" size={20} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { padding:15, borderRadius:16, marginBottom:12, elevation:2 },
  iconButton: { padding:6, borderRadius:8, marginLeft:5 },
});
