import { Palettes } from '@/constants/Colors';
import { useTheme } from '@/context/ThemeContext';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const questions = [
  {
    question: "Which activity excites you the most?",
    type: "hobby",
    options: ["Painting", "Playing music", "Photography", "Reading", "Crafting", "Writing", "Gardening", "Cooking"]
  },
  {
    question: "What's your second favorite activity?",
    type: "hobby",
    options: ["Painting", "Playing music", "Photography", "Reading", "Crafting", "Writing", "Gardening", "Cooking"]
  },
  {
    question: "Pick a third hobby you'd like to explore:",
    type: "hobby",
    options: ["Painting", "Playing music", "Photography", "Reading", "Crafting", "Writing", "Gardening", "Cooking"]
  },
  {
    question: "What time of day do you feel most creative?",
    type: "time",
    options: ["Early Morning (6-9 AM)", "Morning (9-12 PM)", "Afternoon (12-5 PM)", "Evening (5-8 PM)", "Night (8-11 PM)"]
  },
  {
    question: "How many days a week would you like to pursue hobbies?",
    type: "frequency",
    options: ["2-3 days", "4-5 days", "Daily", "Weekends only", "Flexible schedule"]
  },
  {
    question: "How long can you dedicate per hobby session?",
    type: "duration",
    options: ["15-30 minutes", "30-60 minutes", "1-2 hours", "2+ hours", "Varies by mood"]
  },
  {
    question: "What inspires you most?",
    type: "inspiration",
    options: ["Nature", "Stories", "Colors", "Sounds", "Textures", "People", "Travel"]
  },
  {
    question: "Pick a word that describes your ideal hobby experience:",
    type: "experience",
    options: ["Relaxing", "Exciting", "Creative", "Social", "Skillful", "Mindful", "Challenging"]
  }
];

export default function HobbiesHome() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { darkMode } = useTheme();
  const theme = darkMode ? Palettes.hobbies.dark : Palettes.hobbies.light;

  // Track answers and whether the quiz is complete
  const [answers, setAnswers] = useState(Array(questions.length).fill(null));
  const [showTracker, setShowTracker] = useState(false);

  // Handle answer selection
  const handleSelect = (qIdx, option) => {
    const newAnswers = [...answers];
    newAnswers[qIdx] = option;
    setAnswers(newAnswers);
  };

  // Generate personalized hobby plan
  const generateHobbyPlan = () => {
    const selectedHobbies = [];
    const hobbyQuestions = questions.filter(q => q.type === 'hobby');
    
    hobbyQuestions.forEach((q, idx) => {
      const answerIdx = questions.findIndex(question => question === q);
      if (answers[answerIdx] && !selectedHobbies.includes(answers[answerIdx])) {
        selectedHobbies.push(answers[answerIdx]);
      }
    });

    const preferredTime = answers[questions.findIndex(q => q.type === 'time')] || "Morning (9-12 PM)";
    const frequency = answers[questions.findIndex(q => q.type === 'frequency')] || "4-5 days";
    const duration = answers[questions.findIndex(q => q.type === 'duration')] || "30-60 minutes";

    return {
      hobbies: selectedHobbies.slice(0, 3), // Limit to 3 hobbies
      schedule: {
        preferredTime,
        frequency,
        duration
      }
    };
  };

  // When all questions are answered, show tracker
  const handleFinish = () => {
    const plan = generateHobbyPlan();
    if (plan.hobbies.length === 0) {
      Alert.alert("Please select at least one hobby", "Make sure to answer the hobby-related questions.");
      return;
    }
    setShowTracker(true);
  };

  // Reset quiz
  const handleResetQuiz = () => {
    setAnswers(Array(questions.length).fill(null));
    setShowTracker(false);
  };

  const hobbyPlan = showTracker ? generateHobbyPlan() : null;

  return (
    <LinearGradient
      colors={darkMode ? ['#232347', '#000'] : ['#f3f4fe', '#fff']}
      style={[styles.gradient, { paddingTop: insets.top }]}
    >
      <ScrollView contentContainerStyle={{ padding: 24 }}>
        {!showTracker ? (
          <>
            <Text style={[styles.heading, { color: theme.text }]}>Discover Your Hobbies!</Text>
            <Text style={[styles.subtitle, { color: theme.secondaryText }]}>
              Answer a few questions to create your personalized hobby schedule.
            </Text>
            
            {questions.map((q, qIdx) => (
              <View key={qIdx} style={styles.questionBlock}>
                <Text style={[styles.question, { color: theme.text }]}>
                  {qIdx + 1}. {q.question}
                </Text>
                <View style={styles.optionsContainer}>
                  {q.options.map((option, oIdx) => (
                    <TouchableOpacity
                      key={oIdx}
                      style={[
                        styles.optionBtn,
                        { backgroundColor: darkMode ? '#2a2a4a' : '#f3f4fe' },
                        answers[qIdx] === option && { 
                          backgroundColor: theme.accent,
                          borderWidth: 2,
                          borderColor: darkMode ? '#fff' : theme.accent
                        }
                      ]}
                      onPress={() => handleSelect(qIdx, option)}
                    >
                      <Text style={[
                        styles.optionText,
                        { color: answers[qIdx] === option ? '#fff' : theme.text }
                      ]}>
                        {option}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            ))}

            <TouchableOpacity
              style={[
                styles.finishBtn,
                answers.every(Boolean) 
                  ? { backgroundColor: theme.accent } 
                  : { backgroundColor: '#ccc' }
              ]}
              disabled={!answers.every(Boolean)}
              onPress={handleFinish}
            >
              <MaterialIcons name="auto-awesome" size={20} color="#fff" style={{ marginRight: 8 }} />
              <Text style={styles.finishBtnText}>Create My Hobby Plan</Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            <View style={styles.headerContainer}>
              <Text style={[styles.heading, { color: theme.text }]}>Your Hobby Plan</Text>
              <TouchableOpacity
                style={styles.editBtn}
                onPress={handleResetQuiz}
              >
                <MaterialIcons name="edit" size={18} color={theme.accent} />
                <Text style={[styles.editBtnText, { color: theme.accent }]}>Edit</Text>
              </TouchableOpacity>
            </View>

            <Text style={[styles.subtitle, { color: theme.secondaryText }]}>
              Your personalized hobbies and schedule
            </Text>

            {/* Schedule Summary */}
            <View style={[styles.scheduleCard, { backgroundColor: darkMode ? '#2a2a4a' : '#f8f9ff' }]}>
              <Text style={[styles.scheduleTitle, { color: theme.text }]}>Your Schedule</Text>
              <View style={styles.scheduleDetails}>
                <View style={styles.scheduleItem}>
                  <MaterialIcons name="access-time" size={16} color={theme.accent} />
                  <Text style={[styles.scheduleText, { color: theme.secondaryText }]}>
                    {hobbyPlan.schedule.preferredTime}
                  </Text>
                </View>
                <View style={styles.scheduleItem}>
                  <MaterialIcons name="event-repeat" size={16} color={theme.accent} />
                  <Text style={[styles.scheduleText, { color: theme.secondaryText }]}>
                    {hobbyPlan.schedule.frequency}
                  </Text>
                </View>
                <View style={styles.scheduleItem}>
                  <MaterialIcons name="timer" size={16} color={theme.accent} />
                  <Text style={[styles.scheduleText, { color: theme.secondaryText }]}>
                    {hobbyPlan.schedule.duration}
                  </Text>
                </View>
              </View>
            </View>

            {/* Hobby Cards */}
            <View style={styles.cardsContainer}>
              {hobbyPlan.hobbies.map((hobby, idx) => (
                <TouchableOpacity
                  key={idx}
                  style={styles.cardWrapper}
                  activeOpacity={0.9}
                  onPress={() => router.push(`/features/hobbies/${hobby.toLowerCase().replace(' ', '-')}`)}
                >
                  <LinearGradient
                    colors={['#6c63ff', '#9591ee']}
                    start={[0, 0]}
                    end={[1, 1]}
                    style={styles.card}
                  >
                    <MaterialIcons name="favorite" size={24} color="#fff" style={{ marginBottom: 8 }} />
                    <Text style={styles.cardText}>{hobby}</Text>
                    <Text style={styles.cardSubtext}>Tap to track</Text>
                  </LinearGradient>
                </TouchableOpacity>
              ))}
            </View>

            {/* Action Buttons */}
            <View style={styles.actionButtons}>
              <TouchableOpacity
                style={[styles.actionBtn, { backgroundColor: theme.accent }]}
                onPress={() => router.push('/features/hobbies/tracker')}
              >
                <MaterialIcons name="track-changes" size={20} color="#fff" />
                <Text style={styles.actionBtnText}>Open Tracker</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.actionBtn, { backgroundColor: darkMode ? '#2a2a4a' : '#f3f4fe' }]}
                onPress={() => router.push('/features/hobbies/schedule')}
              >
                <MaterialIcons name="schedule" size={20} color={theme.accent} />
                <Text style={[styles.actionBtnText, { color: theme.accent }]}>Set Schedule</Text>
              </TouchableOpacity>
            </View>
          </>
        )}
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: { flex: 1 },
  heading: { fontSize: 28, fontWeight: '800', marginBottom: 8, letterSpacing: 1 },
  subtitle: { fontSize: 16, marginBottom: 24, fontWeight: '500' },
  questionBlock: { marginBottom: 24 },
  question: { fontSize: 16, fontWeight: '700', marginBottom: 12 },
  optionsContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  optionBtn: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginBottom: 8,
    minWidth: 100,
  },
  optionText: {
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
  },
  finishBtn: {
    marginTop: 32,
    paddingVertical: 16,
    borderRadius: 25,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: '#6c63ff',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  finishBtnText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  editBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
  },
  editBtnText: {
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 4,
  },
  scheduleCard: {
    padding: 20,
    borderRadius: 16,
    marginBottom: 24,
  },
  scheduleTitle: {
    fontSize: 18,
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
  cardsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  cardWrapper: {
    width: '48%',
    marginBottom: 16,
    borderRadius: 20,
    overflow: 'hidden',
    elevation: 6,
    shadowColor: '#6c63ff',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.18,
    shadowRadius: 12,
  },
  card: {
    borderRadius: 20,
    paddingVertical: 24,
    paddingHorizontal: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 14,
    textAlign: 'center',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  cardSubtext: {
    color: '#fff',
    fontSize: 12,
    opacity: 0.8,
    textAlign: 'center',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  actionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 20,
    gap: 8,
  },
  actionBtnText: {
    fontWeight: '600',
    fontSize: 14,
  },
});