import { Palettes } from '@/constants/Colors';
import { useTheme } from '@/context/ThemeContext';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import {
    Alert,
    Modal,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// Get hobbies from questionnaire results
const getHobbiesFromParams = (params) => {
  try {
    if (params?.hobbies) {
      const hobbiesList = JSON.parse(params.hobbies);
      return hobbiesList.map((hobby, index) => ({
        id: index + 1,
        name: hobby,
        priority: index + 1
      }));
    }
  } catch (error) {
    console.log('Error parsing hobbies:', error);
  }
  
  // Fallback hobbies for development/testing
  return [
    { id: 1, name: "Reading", priority: 1 },
    { id: 2, name: "Painting", priority: 2 },
    { id: 3, name: "Crafting", priority: 3 }
  ];
};

const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export default function HobbiesTracker() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const params = useLocalSearchParams();
  const { darkMode } = useTheme();
  const theme = darkMode ? Palettes.hobbies.dark : Palettes.hobbies.light;

  // Get user's hobbies from questionnaire results
  const userHobbies = getHobbiesFromParams(params);
  
  // Get schedule info (optional for future use)
  const userSchedule = params?.schedule ? JSON.parse(params.schedule) : null;

  // State for tracking daily activities
  const [weeklyProgress, setWeeklyProgress] = useState(() => {
    const progress = {};
    userHobbies.forEach(hobby => {
      progress[hobby.id] = {};
      daysOfWeek.forEach(day => {
        progress[hobby.id][day] = false;
      });
    });
    return progress;
  });

  // State for journal entries
  const [journalEntries, setJournalEntries] = useState({});
  const [showJournalModal, setShowJournalModal] = useState(false);
  const [selectedHobby, setSelectedHobby] = useState(null);
  const [selectedDay, setSelectedDay] = useState(null);
  const [currentJournalText, setCurrentJournalText] = useState('');

  // Get current week dates
  const getCurrentWeekDates = () => {
    const today = new Date();
    const currentDay = today.getDay();
    const monday = new Date(today);
    monday.setDate(today.getDate() - (currentDay === 0 ? 6 : currentDay - 1));
    
    return daysOfWeek.map((_, index) => {
      const date = new Date(monday);
      date.setDate(monday.getDate() + index);
      return date.getDate();
    });
  };

  const weekDates = getCurrentWeekDates();

  // Toggle hobby completion for a day
  const toggleHobbyDay = (hobbyId, day) => {
    setWeeklyProgress(prev => ({
      ...prev,
      [hobbyId]: {
        ...prev[hobbyId],
        [day]: !prev[hobbyId][day]
      }
    }));
  };

  // Open journal modal
  const openJournal = (hobby, day) => {
    const journalKey = `${hobby.id}-${day}`;
    setSelectedHobby(hobby);
    setSelectedDay(day);
    setCurrentJournalText(journalEntries[journalKey] || '');
    setShowJournalModal(true);
  };

  // Save journal entry
  const saveJournalEntry = () => {
    if (!selectedHobby || !selectedDay) return;
    
    const journalKey = `${selectedHobby.id}-${selectedDay}`;
    setJournalEntries(prev => ({
      ...prev,
      [journalKey]: currentJournalText
    }));
    
    setShowJournalModal(false);
    setCurrentJournalText('');
    setSelectedHobby(null);
    setSelectedDay(null);
  };

  // Calculate weekly stats
  const getWeeklyStats = () => {
    let totalSessions = 0;
    let completedSessions = 0;
    
    userHobbies.forEach(hobby => {
      daysOfWeek.forEach(day => {
        totalSessions++;
        if (weeklyProgress[hobby.id][day]) {
          completedSessions++;
        }
      });
    });
    
    return {
      completedSessions,
      totalSessions,
      completionRate: totalSessions > 0 ? Math.round((completedSessions / totalSessions) * 100) : 0
    };
  };

  const stats = getWeeklyStats();

  return (
    <LinearGradient
      colors={darkMode ? ['#232347', '#000'] : ['#f3f4fe', '#fff']}
      style={[styles.gradient, { paddingTop: insets.top }]}
    >
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <MaterialIcons name="arrow-back" size={24} color={theme.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.text }]}>Your Hobbies</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Weekly Stats */}
        <View style={[styles.statsCard, { backgroundColor: darkMode ? '#2a2a4a' : '#f8f9ff' }]}>
          <Text style={[styles.statsTitle, { color: theme.text }]}>This Week's Progress</Text>
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={[styles.statNumber, { color: theme.accent }]}>{stats.completedSessions}</Text>
              <Text style={[styles.statLabel, { color: theme.secondaryText }]}>Sessions</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={[styles.statNumber, { color: theme.accent }]}>{stats.completionRate}%</Text>
              <Text style={[styles.statLabel, { color: theme.secondaryText }]}>Complete</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={[styles.statNumber, { color: theme.accent }]}>{userHobbies.length}</Text>
              <Text style={[styles.statLabel, { color: theme.secondaryText }]}>Hobbies</Text>
            </View>
          </View>
        </View>

        {/* Weekly Calendar Header */}
        <View style={styles.calendarHeader}>
          <Text style={[styles.calendarTitle, { color: theme.text }]}>Weekly Tracker</Text>
          <View style={styles.daysHeader}>
            <View style={styles.hobbyColumn} />
            {daysOfWeek.map((day, index) => (
              <View key={day} style={styles.dayColumn}>
                <Text style={[styles.dayLabel, { color: theme.secondaryText }]}>{day}</Text>
                <Text style={[styles.dateLabel, { color: theme.accent }]}>{weekDates[index]}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Hobbies Tracking Grid */}
        {userHobbies.map((hobby) => (
          <View key={hobby.id} style={[styles.hobbyRow, { backgroundColor: darkMode ? '#2a2a4a' : '#f8f9ff' }]}>
            <View style={styles.hobbyInfo}>
              <View style={styles.hobbyHeader}>
                <View style={[styles.priorityBadge, { backgroundColor: theme.accent }]}>
                  <Text style={styles.priorityText}>{hobby.priority}</Text>
                </View>
                <Text style={[styles.hobbyName, { color: theme.text }]}>{hobby.name}</Text>
              </View>
            </View>
            
            {daysOfWeek.map((day) => (
              <View key={day} style={styles.dayCell}>
                <TouchableOpacity
                  style={[
                    styles.checkBox,
                    weeklyProgress[hobby.id][day] 
                      ? { backgroundColor: theme.accent } 
                      : { backgroundColor: 'transparent', borderWidth: 2, borderColor: theme.accent }
                  ]}
                  onPress={() => toggleHobbyDay(hobby.id, day)}
                >
                  {weeklyProgress[hobby.id][day] && (
                    <MaterialIcons name="check" size={16} color="#fff" />
                  )}
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={styles.journalButton}
                  onPress={() => openJournal(hobby, day)}
                >
                  <MaterialIcons 
                    name="edit-note" 
                    size={16} 
                    color={journalEntries[`${hobby.id}-${day}`] ? theme.accent : theme.secondaryText} 
                  />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        ))}

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: theme.accent }]}
            onPress={() => {
              // Mark all today's hobbies as done
              const today = new Date().getDay();
              const todayKey = daysOfWeek[today === 0 ? 6 : today - 1];
              
              setWeeklyProgress(prev => {
                const updated = { ...prev };
                userHobbies.forEach(hobby => {
                  updated[hobby.id] = {
                    ...updated[hobby.id],
                    [todayKey]: true
                  };
                });
                return updated;
              });
            }}
          >
            <MaterialIcons name="today" size={20} color="#fff" />
            <Text style={styles.actionButtonText}>Mark Today Complete</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: darkMode ? '#2a2a4a' : '#f3f4fe' }]}
            onPress={() => {
              Alert.alert(
                'Reset Week?',
                'This will clear all progress and journal entries for this week.',
                [
                  { text: 'Cancel', style: 'cancel' },
                  { 
                    text: 'Reset', 
                    style: 'destructive',
                    onPress: () => {
                      setWeeklyProgress(() => {
                        const progress = {};
                        userHobbies.forEach(hobby => {
                          progress[hobby.id] = {};
                          daysOfWeek.forEach(day => {
                            progress[hobby.id][day] = false;
                          });
                        });
                        return progress;
                      });
                      setJournalEntries({});
                    }
                  }
                ]
              );
            }}
          >
            <MaterialIcons name="refresh" size={20} color={theme.accent} />
            <Text style={[styles.actionButtonText, { color: theme.accent }]}>Reset Week</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Journal Modal */}
      <Modal
        visible={showJournalModal}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <View style={[styles.modalContainer, { backgroundColor: darkMode ? '#1a1a2e' : '#fff' }]}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setShowJournalModal(false)}>
              <MaterialIcons name="close" size={24} color={theme.text} />
            </TouchableOpacity>
            <Text style={[styles.modalTitle, { color: theme.text }]}>
              {selectedHobby?.name} - {selectedDay}
            </Text>
            <TouchableOpacity onPress={saveJournalEntry}>
              <Text style={[styles.saveButton, { color: theme.accent }]}>Save</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.modalContent}>
            <Text style={[styles.journalLabel, { color: theme.text }]}>
              How did your {selectedHobby?.name.toLowerCase()} session go?
            </Text>
            <TextInput
              style={[
                styles.journalInput,
                { 
                  backgroundColor: darkMode ? '#2a2a4a' : '#f8f9ff',
                  color: theme.text,
                  borderColor: theme.accent
                }
              ]}
              placeholder="Write about your experience, what you learned, how you felt..."
              placeholderTextColor={theme.secondaryText}
              multiline
              numberOfLines={8}
              value={currentJournalText}
              onChangeText={setCurrentJournalText}
              textAlignVertical="top"
            />
          </View>
        </View>
      </Modal>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
  },
  placeholder: { width: 40 },
  scrollContent: {
    padding: 24,
  },
  statsCard: {
    padding: 20,
    borderRadius: 16,
    marginBottom: 24,
  },
  statsTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 16,
    textAlign: 'center',
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '800',
  },
  statLabel: {
    fontSize: 12,
    fontWeight: '500',
    marginTop: 4,
  },
  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: '#ccc',
    opacity: 0.3,
  },
  calendarHeader: {
    marginBottom: 16,
  },
  calendarTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 12,
  },
  daysHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  hobbyColumn: {
    flex: 2,
  },
  dayColumn: {
    flex: 1,
    alignItems: 'center',
  },
  dayLabel: {
    fontSize: 12,
    fontWeight: '600',
  },
  dateLabel: {
    fontSize: 14,
    fontWeight: '700',
    marginTop: 2,
  },
  hobbyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    marginBottom: 8,
    minHeight: 70,
  },
  hobbyInfo: {
    flex: 2,
  },
  hobbyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  priorityBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  priorityText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
  },
  hobbyName: {
    fontSize: 14,
    fontWeight: '600',
    flex: 1,
  },
  dayCell: {
    flex: 1,
    alignItems: 'center',
    gap: 8,
  },
  checkBox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  journalButton: {
    padding: 4,
  },
  quickActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 24,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 16,
    gap: 8,
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
  },
  modalContainer: {
    flex: 1,
    paddingTop: 60,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  saveButton: {
    fontSize: 16,
    fontWeight: '700',
  },
  modalContent: {
    flex: 1,
    padding: 24,
  },
  journalLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  journalInput: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    fontSize: 14,
    minHeight: 200,
  },
});