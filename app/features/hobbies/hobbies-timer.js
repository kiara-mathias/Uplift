import { Palettes } from '@/constants/Colors';
import { useTheme } from '@/context/ThemeContext';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import {
    Alert,
    Dimensions,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    Vibration,
    View
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

// Get hobbies from params or fallback
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
  
  return [
    { id: 1, name: "Reading", priority: 1 },
    { id: 2, name: "Painting", priority: 2 },
    { id: 3, name: "Crafting", priority: 3 }
  ];
};

// Predefined timer durations (in minutes)
const timerDurations = [
  { label: '15 min', value: 15 },
  { label: '30 min', value: 30 },
  { label: '45 min', value: 45 },
  { label: '1 hour', value: 60 },
  { label: '1.5 hours', value: 90 },
  { label: '2 hours', value: 120 }
];

export default function HobbiesTimer() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const params = useLocalSearchParams();
  const { darkMode } = useTheme();
  const theme = darkMode ? Palettes.hobbies.dark : Palettes.hobbies.light;

  // Get user's hobbies and schedule
  const userHobbies = getHobbiesFromParams(params);
  const userSchedule = params?.schedule ? JSON.parse(params.schedule) : null;

  // Timer states
  const [selectedHobby, setSelectedHobby] = useState(userHobbies[0]);
  const [selectedDuration, setSelectedDuration] = useState(30); // Default 30 minutes
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [timerMode, setTimerMode] = useState('setup'); // 'setup', 'running', 'finished'
  
  const intervalRef = useRef(null);

  // Format time for display
  const formatTime = (minutes) => {
    const hrs = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hrs > 0) {
      return `${hrs}:${mins.toString().padStart(2, '0')}`;
    }
    return `${mins}:00`;
  };

  // Format countdown time
  const formatCountdown = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Start timer
  const startTimer = () => {
    setTimeRemaining(selectedDuration * 60); // Convert to seconds
    setIsTimerActive(true);
    setTimerMode('running');
    
    intervalRef.current = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          handleTimerComplete();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  // Pause timer
  const pauseTimer = () => {
    setIsTimerActive(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  };

  // Resume timer
  const resumeTimer = () => {
    setIsTimerActive(true);
    intervalRef.current = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          handleTimerComplete();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  // Handle timer completion
  const handleTimerComplete = () => {
    setIsTimerActive(false);
    setTimerMode('finished');
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    
    // Vibrate and show alert
    Vibration.vibrate([500, 200, 500, 200, 500]);
    Alert.alert(
      "Time's Up! 🎉",
      `Your ${selectedHobby.name.toLowerCase()} session is complete!`,
      [
        {
          text: "Great!",
          onPress: () => setTimerMode('setup')
        }
      ]
    );
  };

  // Reset timer
  const resetTimer = () => {
    setIsTimerActive(false);
    setTimeRemaining(0);
    setTimerMode('setup');
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  // Get progress percentage for circular progress
  const getProgress = () => {
    if (timerMode !== 'running' || selectedDuration === 0) return 0;
    const totalSeconds = selectedDuration * 60;
    const elapsed = totalSeconds - timeRemaining;
    return (elapsed / totalSeconds) * 100;
  };

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
        <Text style={[styles.headerTitle, { color: theme.text }]}>Hobby Timer</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {timerMode === 'setup' && (
          <>
            {/* Hobby Selection */}
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: theme.text }]}>Choose Your Hobby</Text>
              <View style={styles.hobbiesGrid}>
                {userHobbies.map((hobby) => (
                  <TouchableOpacity
                    key={hobby.id}
                    style={[
                      styles.hobbyCard,
                      { backgroundColor: darkMode ? '#2a2a4a' : '#f8f9ff' },
                      selectedHobby.id === hobby.id && { 
                        backgroundColor: theme.accent,
                        borderWidth: 2,
                        borderColor: darkMode ? '#fff' : theme.accent
                      }
                    ]}
                    onPress={() => setSelectedHobby(hobby)}
                  >
                    <View style={[styles.priorityBadge, { 
                      backgroundColor: selectedHobby.id === hobby.id ? '#fff' : theme.accent 
                    }]}>
                      <Text style={[styles.priorityText, { 
                        color: selectedHobby.id === hobby.id ? theme.accent : '#fff' 
                      }]}>
                        {hobby.priority}
                      </Text>
                    </View>
                    <Text style={[styles.hobbyCardText, { 
                      color: selectedHobby.id === hobby.id ? '#fff' : theme.text 
                    }]}>
                      {hobby.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Duration Selection */}
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: theme.text }]}>Session Duration</Text>
              {userSchedule && (
                <Text style={[styles.scheduleHint, { color: theme.secondaryText }]}>
                  Your preferred duration: {userSchedule.duration}
                </Text>
              )}
              <View style={styles.durationGrid}>
                {timerDurations.map((duration) => (
                  <TouchableOpacity
                    key={duration.value}
                    style={[
                      styles.durationCard,
                      { backgroundColor: darkMode ? '#2a2a4a' : '#f8f9ff' },
                      selectedDuration === duration.value && { 
                        backgroundColor: theme.accent,
                        borderWidth: 2,
                        borderColor: darkMode ? '#fff' : theme.accent
                      }
                    ]}
                    onPress={() => setSelectedDuration(duration.value)}
                  >
                    <Text style={[styles.durationText, { 
                      color: selectedDuration === duration.value ? '#fff' : theme.text 
                    }]}>
                      {duration.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Schedule Info */}
            {userSchedule && (
              <View style={[styles.scheduleCard, { backgroundColor: darkMode ? '#2a2a4a' : '#f8f9ff' }]}>
                <Text style={[styles.scheduleTitle, { color: theme.text }]}>Your Preferences</Text>
                <View style={styles.scheduleDetails}>
                  <View style={styles.scheduleItem}>
                    <MaterialIcons name="access-time" size={16} color={theme.accent} />
                    <Text style={[styles.scheduleText, { color: theme.secondaryText }]}>
                      {userSchedule.preferredTime}
                    </Text>
                  </View>
                  <View style={styles.scheduleItem}>
                    <MaterialIcons name="event-repeat" size={16} color={theme.accent} />
                    <Text style={[styles.scheduleText, { color: theme.secondaryText }]}>
                      {userSchedule.frequency}
                    </Text>
                  </View>
                </View>
              </View>
            )}

            {/* Start Timer Button */}
            <TouchableOpacity
              style={[styles.startButton, { backgroundColor: theme.accent }]}
              onPress={startTimer}
            >
              <MaterialIcons name="play-arrow" size={24} color="#fff" />
              <Text style={styles.startButtonText}>
                Start {selectedHobby.name} Session ({formatTime(selectedDuration)})
              </Text>
            </TouchableOpacity>
          </>
        )}

        {timerMode === 'running' && (
          <View style={styles.timerContainer}>
            {/* Circular Progress */}
            <View style={styles.circularProgress}>
              <View style={[styles.progressRing, { borderColor: theme.accent + '20' }]}>
                <View 
                  style={[
                    styles.progressFill,
                    { 
                      borderColor: theme.accent,
                      transform: [{ rotate: `${(getProgress() * 3.6)}deg` }]
                    }
                  ]} 
                />
                <View style={styles.timerDisplay}>
                  <Text style={[styles.timeText, { color: theme.text }]}>
                    {formatCountdown(timeRemaining)}
                  </Text>
                  <Text style={[styles.hobbyLabel, { color: theme.secondaryText }]}>
                    {selectedHobby.name}
                  </Text>
                </View>
              </View>
            </View>

            {/* Timer Controls */}
            <View style={styles.timerControls}>
              <TouchableOpacity
                style={[styles.controlButton, { backgroundColor: darkMode ? '#2a2a4a' : '#f8f9ff' }]}
                onPress={resetTimer}
              >
                <MaterialIcons name="stop" size={24} color={theme.accent} />
                <Text style={[styles.controlButtonText, { color: theme.accent }]}>Stop</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.controlButton, { backgroundColor: theme.accent }]}
                onPress={isTimerActive ? pauseTimer : resumeTimer}
              >
                <MaterialIcons 
                  name={isTimerActive ? "pause" : "play-arrow"} 
                  size={24} 
                  color="#fff" 
                />
                <Text style={styles.controlButtonText}>
                  {isTimerActive ? 'Pause' : 'Resume'}
                </Text>
              </TouchableOpacity>
            </View>

            {/* Progress Stats */}
            <View style={[styles.statsContainer, { backgroundColor: darkMode ? '#2a2a4a' : '#f8f9ff' }]}>
              <View style={styles.statItem}>
                <Text style={[styles.statLabel, { color: theme.secondaryText }]}>Elapsed</Text>
                <Text style={[styles.statValue, { color: theme.accent }]}>
                  {formatCountdown((selectedDuration * 60) - timeRemaining)}
                </Text>
              </View>
              <View style={styles.statItem}>
                <Text style={[styles.statLabel, { color: theme.secondaryText }]}>Remaining</Text>
                <Text style={[styles.statValue, { color: theme.text }]}>
                  {formatCountdown(timeRemaining)}
                </Text>
              </View>
              <View style={styles.statItem}>
                <Text style={[styles.statLabel, { color: theme.secondaryText }]}>Progress</Text>
                <Text style={[styles.statValue, { color: theme.accent }]}>
                  {Math.round(getProgress())}%
                </Text>
              </View>
            </View>
          </View>
        )}
      </ScrollView>
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
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 16,
  },
  scheduleHint: {
    fontSize: 14,
    marginBottom: 12,
    fontStyle: 'italic',
  },
  hobbiesGrid: {
    gap: 12,
  },
  hobbyCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
  },
  priorityBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  priorityText: {
    fontSize: 14,
    fontWeight: '700',
  },
  hobbyCardText: {
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
  },
  durationGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  durationCard: {
    flex: 1,
    minWidth: '30%',
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
  },
  durationText: {
    fontSize: 14,
    fontWeight: '600',
  },
  scheduleCard: {
    padding: 20,
    borderRadius: 16,
    marginBottom: 16,
  },
  scheduleTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 12,
  },
  scheduleDetails: {
    gap: 8,
  },
  scheduleItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  scheduleText: {
    fontSize: 14,
    fontWeight: '500',
  },
  startButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    borderRadius: 25,
    gap: 8,
    elevation: 4,
    shadowColor: '#6c63ff',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  startButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  timerContainer: {
    alignItems: 'center',
    paddingTop: 20,
  },
  circularProgress: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 40,
  },
  progressRing: {
    width: 250,
    height: 250,
    borderRadius: 125,
    borderWidth: 8,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  progressFill: {
    position: 'absolute',
    width: 250,
    height: 250,
    borderRadius: 125,
    borderWidth: 8,
    borderColor: 'transparent',
    borderTopColor: '#6c63ff',
    borderRightColor: '#6c63ff',
  },
  timerDisplay: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  timeText: {
    fontSize: 48,
    fontWeight: '800',
    fontFamily: 'monospace',
  },
  hobbyLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 8,
  },
  timerControls: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 32,
  },
  controlButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 20,
    gap: 8,
  },
  controlButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  statsContainer: {
    flexDirection: 'row',
    padding: 20,
    borderRadius: 16,
    width: '100%',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 12,
    fontWeight: '500',
    marginBottom: 4,
  },
  statValue: {
    fontSize: 16,
    fontWeight: '700',
  },
});