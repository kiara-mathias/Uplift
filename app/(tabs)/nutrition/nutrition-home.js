// ====================
// CONFIGURATION
// ====================

const QUESTIONS_CONFIG = [
  {
    id: 'age',
    question: "What's your age?",
    type: 'number',
    placeholder: 'e.g., 20',
    unit: 'years',
    validation: (value) => value >= 16 && value <= 100,
    required: true
  },
  {
    id: 'gender',
    question: "Gender (for accurate calorie calculation)",
    type: 'select',
    options: ['Male', 'Female', 'Other'],
    required: true
  },
  {
    id: 'weight',
    question: "What's your current weight?",
    type: 'number',
    placeholder: 'e.g., 65',
    unit: 'kg',
    validation: (value) => value >= 30 && value <= 300,
    required: true
  },
  {
    id: 'height',
    question: "What's your height?",
    type: 'number',
    placeholder: 'e.g., 170',
    unit: 'cm',
    validation: (value) => value >= 120 && value <= 250,
    required: true
  },
  {
    id: 'activityLevel',
    question: "How active are you?",
    type: 'select',
    options: ['Sedentary (mostly sitting)', 'Lightly Active', 'Moderately Active', 'Very Active', 'Extremely Active'],
    required: true
  },
  {
    id: 'goal',
    question: "What's your main goal?",
    type: 'select',
    options: ['Better Energy for Studies', 'Maintain Current Weight', 'Gain Weight', 'Lose Weight', 'Build Muscle', 'General Wellness'],
    required: true
  },
  {
    id: 'restrictions',
    question: "Any dietary restrictions?",
    type: 'multiselect',
    options: ['None', 'Vegetarian', 'Vegan', 'Gluten-Free', 'Dairy-Free', 'Nut Allergies', 'Halal', 'Kosher', 'Other'],
    required: false
  },
  {
    id: 'studyHabits',
    question: "When do you usually study intensively?",
    type: 'select',
    options: ['Early Morning (5-9 AM)', 'Morning (9-12 PM)', 'Afternoon (12-5 PM)', 'Evening (5-9 PM)', 'Night (9 PM-1 AM)', 'Late Night (1-5 AM)'],
    required: true
  }
];

// ====================
// UTILITIES & CALCULATIONS
// ====================

class NutritionCalculator {
  static calculateBMR(profile) {
    const { age, weight, height, gender } = profile;
    if (!age || !weight || !height) return 2000;

    const baseBMR = (10 * weight) + (6.25 * height) - (5 * age);
    return gender === 'Female' ? baseBMR - 161 : baseBMR + 5;
  }

  static calculateCalorieNeeds(profile) {
    const bmr = this.calculateBMR(profile);

    const activityMultipliers = {
      'Sedentary (mostly sitting)': 1.2,
      'Lightly Active': 1.375,
      'Moderately Active': 1.55,
      'Very Active': 1.725,
      'Extremely Active': 1.9
    };

    const multiplier = activityMultipliers[profile.activityLevel] || 1.2;
    return Math.round(bmr * multiplier);
  }

  static calculateWaterNeeds(profile) {
    return profile.weight ? Math.round(profile.weight * 35) : 2500;
  }
}

class ProfileValidator {
  static validateField(question, value) {
    if (question.required && (!value || (Array.isArray(value) && value.length === 0))) {
      return { isValid: false, message: 'This field is required' };
    }

    if (question.validation && value && !question.validation(value)) {
      return { isValid: false, message: `Please enter a valid ${question.id}` };
    }

    return { isValid: true };
  }
}

// ====================
// STATE MANAGEMENT
// ====================

import { useReducer } from 'react';

const initialState = {
  currentStep: 0,
  profile: {},
  showSummary: false,
  errors: {}
};

function profileReducer(state, action) {
  switch (action.type) {
    case 'SET_FIELD':
      return {
        ...state,
        profile: { ...state.profile, [action.field]: action.value },
        errors: { ...state.errors, [action.field]: '' }
      };
    case 'NEXT_STEP':
      return { ...state, currentStep: state.currentStep + 1 };
    case 'PREV_STEP':
      return { ...state, currentStep: state.currentStep - 1 };
    case 'SHOW_SUMMARY':
      return { ...state, showSummary: true };
    case 'RESET':
      return { currentStep: 0, profile: {}, showSummary: false, errors: {} };
    case 'SET_ERROR':
      return { ...state, errors: { ...state.errors, [action.field]: action.error } };
    case 'CLEAR_ERROR':
      return { ...state, errors: { ...state.errors, [action.field]: '' } };
    default:
      return state;
  }
}

// ====================
// COMPONENTS
// ====================

import { useTheme } from '@/context/ThemeContext';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const ProgressBar = ({ progress, theme }) => (
  <View style={styles.progressContainer}>
    <View style={[styles.progressBar, { backgroundColor: theme.border }]}>
      <View 
        style={[styles.progressFill, { backgroundColor: theme.accent, width: `${progress}%` }]} 
      />
    </View>
    <Text style={[styles.progressText, { color: theme.secondaryText }]}>
      {Math.round(progress)}% Complete
    </Text>
  </View>
);

const SummaryCard = ({ title, children, theme }) => (
  <View style={[styles.summaryCard, { backgroundColor: theme.surface }]}>
    <Text style={[styles.summaryTitle, { color: theme.text }]}>{title}</Text>
    {children}
  </View>
);

const NavButtons = ({ onPrev, onNext, canGoPrev, canGoNext, nextLabel = 'Next', theme }) => (
  <View style={styles.navigationContainer}>
    <TouchableOpacity
      style={[styles.navButton, { backgroundColor: theme.surface }, !canGoPrev && { opacity: 0.5 }]}
      onPress={onPrev}
      disabled={!canGoPrev}
    >
      <MaterialIcons name="arrow-back" size={20} color={theme.text} />
      <Text style={[styles.navButtonText, { color: theme.text }]}>Back</Text>
    </TouchableOpacity>

    <TouchableOpacity
      style={[styles.navButton, styles.nextButton, { backgroundColor: theme.accent }, !canGoNext && { opacity: 0.5, backgroundColor: theme.border }]}
      onPress={onNext}
      disabled={!canGoNext}
    >
      <Text style={[styles.nextButtonText, { color: canGoNext ? '#fff' : theme.secondaryText }]}>{nextLabel}</Text>
      <MaterialIcons name="arrow-forward" size={20} color={canGoNext ? '#fff' : theme.secondaryText} />
    </TouchableOpacity>
  </View>
);

const QuestionRenderer = ({ question, value, onChange, error, theme }) => {
  const handleMultiSelect = (option) => {
    const current = value || [];
    if (option === 'None') {
      onChange(['None']);
      return;
    }

    let updated;
    if (current.includes(option)) {
      updated = current.filter((item) => item !== option);
    } else {
      updated = [...current.filter((item) => item !== 'None'), option];
    }

    onChange(updated.length ? updated : ['None']);
  };

  return (
    <View style={styles.questionContainer}>
      <Text style={[styles.question, { color: theme.text }]}>
        {question.question}
        {question.required && <Text style={{ color: theme.error }}> *</Text>}
      </Text>

      {question.type === 'number' && (
        <View style={styles.numberInputContainer}>
          <TextInput
            style={[styles.numberInput, { backgroundColor: theme.surface, color: theme.text, borderColor: error ? theme.error : theme.accent }]}
            placeholder={question.placeholder}
            placeholderTextColor={theme.secondaryText}
            value={value?.toString() || ''}
            onChangeText={(text) => onChange(parseInt(text) || '')}
            keyboardType="numeric"
          />
          {question.unit && <Text style={[styles.unit, { color: theme.secondaryText }]}>{question.unit}</Text>}
        </View>
      )}

      {question.type === 'select' && (
        <View style={styles.optionsContainer}>
          {question.options?.map((option, index) => (
            <TouchableOpacity
              key={index}
              style={[styles.optionButton, { backgroundColor: theme.surface }, value === option && { backgroundColor: theme.accent, borderWidth: 2, borderColor: theme.accent }]}
              onPress={() => onChange(option)}
            >
              <Text style={[styles.optionText, { color: value === option ? '#fff' : theme.text }]}>{option}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {question.type === 'multiselect' && (
        <View style={styles.optionsContainer}>
          {question.options?.map((option, index) => {
            const isSelected = (value || []).includes(option);
            return (
              <TouchableOpacity
                key={index}
                style={[styles.optionButton, { backgroundColor: theme.surface }, isSelected && { backgroundColor: theme.accent, borderWidth: 2, borderColor: theme.accent }]}
                onPress={() => handleMultiSelect(option)}
              >
                <Text style={[styles.optionText, { color: isSelected ? '#fff' : theme.text }]}>{option}</Text>
                {isSelected && <MaterialIcons name="check" size={16} color="#fff" style={{ marginLeft: 8 }} />}
              </TouchableOpacity>
            );
          })}
        </View>
      )}

      {error && <Text style={[styles.errorText, { color: theme.error }]}>{error}</Text>}
    </View>
  );
};

// ====================
// MAIN COMPONENT
// ====================

export default function NutritionSetup() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { darkMode } = useTheme();

  const theme = {
    accent: darkMode ? '#66BB6A' : '#4CAF50',
    text: darkMode ? '#fff' : '#000',
    secondaryText: darkMode ? '#aaa' : '#666',
    surface: darkMode ? '#2a2a4a' : '#f8f8f8',
    border: darkMode ? '#3a3a5c' : '#e0e0e0',
    error: '#F44336'
  };

  const [state, dispatch] = useReducer(profileReducer, initialState);

  const currentQuestion = QUESTIONS_CONFIG[state.currentStep];
  const progress = ((state.currentStep + 1) / QUESTIONS_CONFIG.length) * 100;

  const handleFieldChange = (field, value) => {
    dispatch({ type: 'SET_FIELD', field, value });
    dispatch({ type: 'CLEAR_ERROR', field });
  };

  const handleNext = () => {
    const validation = ProfileValidator.validateField(currentQuestion, state.profile[currentQuestion.id]);

    if (!validation.isValid) {
      dispatch({ type: 'SET_ERROR', field: currentQuestion.id, error: validation.message || '' });
      return;
    }

    if (state.currentStep < QUESTIONS_CONFIG.length - 1) {
      dispatch({ type: 'NEXT_STEP' });
    } else {
      dispatch({ type: 'SHOW_SUMMARY' });
    }
  };

  const handlePrev = () => {
    dispatch({ type: 'PREV_STEP' });
  };

  const handleFinish = () => {
    const calorieGoal = NutritionCalculator.calculateCalorieNeeds(state.profile);
    const waterGoal = NutritionCalculator.calculateWaterNeeds(state.profile);

    router.push({
      pathname: '/features/nutrition/nutrition-dashboard',
      params: {
        profile: JSON.stringify(state.profile),
        calorieGoal,
        waterGoal
      }
    });
  };

  const canGoNext = !state.errors[currentQuestion?.id];
  const canGoPrev = state.currentStep > 0;

  return (
    <LinearGradient
      colors={darkMode ? ['#2d4a22', '#000'] : ['#f0f8f0', '#fff']}
      style={[styles.gradient, { paddingTop: insets.top }]}
    >
      <ScrollView contentContainerStyle={{ padding: 24 }}>
        {!state.showSummary ? (
          <>
            <ProgressBar progress={progress} theme={theme} />
            <Text style={[styles.heading, { color: theme.text }]}>Build Your Nutrition Profile</Text>
            <Text style={[styles.subtitle, { color: theme.secondaryText }]}>
              Help us personalize your wellness journey for better study performance
            </Text>

            <QuestionRenderer
              question={currentQuestion}
              value={state.profile[currentQuestion.id]}
              onChange={(value) => handleFieldChange(currentQuestion.id, value)}
              error={state.errors[currentQuestion.id]}
              theme={theme}
            />

            <NavButtons
              onPrev={handlePrev}
              onNext={handleNext}
              canGoPrev={canGoPrev}
              canGoNext={canGoNext}
              nextLabel={state.currentStep === QUESTIONS_CONFIG.length - 1 ? 'Review' : 'Next'}
              theme={theme}
            />
          </>
        ) : (
          <>
            <Text style={[styles.heading, { color: theme.text }]}>Your Nutrition Profile</Text>
            <Text style={[styles.subtitle, { color: theme.secondaryText }]}>
              Review your information and get your personalized recommendations
            </Text>

            <SummaryCard title="Daily Goals" theme={theme}>
              <View style={styles.goalRow}>
                <MaterialIcons name="local-fire-department" size={20} color="#FF6B35" />
                <Text style={[styles.goalText, { color: theme.text }]}>{NutritionCalculator.calculateCalorieNeeds(state.profile)} calories</Text>
              </View>
              <View style={styles.goalRow}>
                <MaterialIcons name="water-drop" size={20} color="#2196F3" />
                <Text style={[styles.goalText, { color: theme.text }]}>{NutritionCalculator.calculateWaterNeeds(state.profile)}ml water</Text>
              </View>
            </SummaryCard>

            <SummaryCard title="Your Profile" theme={theme}>
              <Text style={[styles.summaryItem, { color: theme.secondaryText }]}>
                {state.profile.age} years • {state.profile.gender} • {state.profile.weight}kg • {state.profile.height}cm
              </Text>
              <Text style={[styles.summaryItem, { color: theme.secondaryText }]}>
                Goal: {state.profile.goal}
              </Text>
              <Text style={[styles.summaryItem, { color: theme.secondaryText }]}>
                Study Time: {state.profile.studyHabits}
              </Text>
              {state.profile.restrictions && state.profile.restrictions.length > 0 && state.profile.restrictions[0] !== 'None' && (
                <Text style={[styles.summaryItem, { color: theme.secondaryText }]}>
                  Restrictions: {state.profile.restrictions.join(', ')}
                </Text>
              )}
            </SummaryCard>

            <View style={styles.actionButtons}>
              <TouchableOpacity
                style={[styles.editButton, { backgroundColor: theme.surface }]}
                onPress={() => dispatch({ type: 'RESET' })}
              >
                <MaterialIcons name="edit" size={20} color={theme.accent} />
                <Text style={[styles.editButtonText, { color: theme.accent }]}>Edit</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.startButton, { backgroundColor: theme.accent }]}
                onPress={handleFinish}
              >
                <Text style={styles.startButtonText}>Start Tracking</Text>
                <MaterialIcons name="arrow-forward" size={20} color="#fff" />
              </TouchableOpacity>
            </View>
          </>
        )}
      </ScrollView>
    </LinearGradient>
  );
}

// ====================
// STYLES
// ====================

const styles = StyleSheet.create({
  gradient: { flex: 1 },
  progressContainer: { marginBottom: 32 },
  progressBar: { height: 6, borderRadius: 3, marginBottom: 8 },
  progressFill: { height: '100%', borderRadius: 3 },
  progressText: { fontSize: 12, textAlign: 'center', fontWeight: '500' },
  heading: { fontSize: 28, fontWeight: '800', marginBottom: 8, letterSpacing: 1 },
  subtitle: { fontSize: 16, marginBottom: 32, fontWeight: '500', lineHeight: 22 },
  questionContainer: { marginBottom: 40 },
  question: { fontSize: 20, fontWeight: '700', marginBottom: 20, lineHeight: 26 },
  numberInputContainer: { flexDirection: 'row', alignItems: 'center' },
  numberInput: { flex: 1, borderWidth: 2, borderRadius: 12, padding: 16, fontSize: 16, fontWeight: '600' },
  unit: { fontSize: 16, fontWeight: '600', marginLeft: 16 },
  optionsContainer: { gap: 12 },
  optionButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16, borderRadius: 12 },
  optionText: { fontSize: 16, fontWeight: '500', flex: 1 },
  errorText: { fontSize: 14, marginTop: 8, fontWeight: '500' },
  navigationContainer: { flexDirection: 'row', justifyContent: 'space-between', gap: 16, marginTop: 20 },
  navButton: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 16, borderRadius: 12, gap: 8 },
  navButtonText: { fontSize: 16, fontWeight: '600' },
  nextButton: { elevation: 4, shadowColor: '#4CAF50', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8 },
  nextButtonText: { fontSize: 16, fontWeight: '600' },
  summaryCard: { padding: 20, borderRadius: 16, marginBottom: 20 },
  summaryTitle: { fontSize: 18, fontWeight: '700', marginBottom: 16 },
  goalRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 8 },
  goalText: { fontSize: 16, fontWeight: '600' },
  summaryItem: { fontSize: 14, marginBottom: 8, lineHeight: 20 },
  actionButtons: { flexDirection: 'row', gap: 16, marginTop: 20 },
  editButton: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 16, borderRadius: 12, gap: 8 },
  editButtonText: { fontSize: 16, fontWeight: '600' },
  startButton: { flex: 2, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 16, borderRadius: 12, gap: 8, elevation: 4, shadowColor: '#4CAF50', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8 },
  startButtonText: { color: '#fff', fontSize: 16, fontWeight: '700' }
});
