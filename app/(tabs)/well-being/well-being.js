'use client';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, ScrollView, Text, TextInput, TouchableOpacity, View, useWindowDimensions } from 'react-native';

const PRIMARY = '#6c63ff';
const CARD_BG = '#f3f4fe';
const TEXT = '#262182';
const BODY_TEXT = '#444';
const INPUT_BG = '#e9eafd';

const wellnessPalette = {
  light: {
    background: '#fff',
    card: CARD_BG,
    text: TEXT,
    secondaryText: BODY_TEXT,
    accent: PRIMARY,
    buttonText: '#fff',
    inputBackground: INPUT_BG,
  },
  dark: {
    background: '#000',
    card: '#232347',
    text: '#f3f4fe',
    secondaryText: '#9591ee',
    accent: PRIMARY,
    buttonText: '#fff',
    inputBackground: '#232347',
  },
};

export default function WellBeingScreen() {
  const [currentView, setCurrentView] = useState('onboarding');
  const [currentStep, setCurrentStep] = useState(1);
  const [theme, setTheme] = useState('light');
  const [userProfile, setUserProfile] = useState({
    sleep: {},
    mental: {},
    social: {},
    development: {}
  });
  const [dailyTracking, setDailyTracking] = useState({
    sleep: { hours: '', quality: '' },
    mood: '',
    socialActivity: '',
    developmentProgress: false
  });
  const [streaks, setStreaks] = useState({
    sleep: 0,
    mental: 0,
    social: 0,
    development: 0
  });

  const colors = wellnessPalette[theme];
  const { width: screenWidth } = useWindowDimensions();
  const cardWidth = screenWidth > 600 ? 600 : '90%';

  const onboardingSteps = [
    {
      title: 'Sleep & Physical Wellness',
      description: 'This helps us tailor your wellness plan.',
      icon: 'moon',
      questions: [
        { key: 'sleepHours', question: 'How many hours do you usually sleep?', type: 'select', options: ['Less than 5', '5-6 hours', '7-8 hours', '9+ hours'] },
        { key: 'sleepQuality', question: 'How would you rate your sleep quality?', type: 'select', options: ['Poor', 'Fair', 'Good', 'Excellent'] },
        { key: 'energyLevels', question: 'How often do you feel physically energized?', type: 'select', options: ['Rarely', 'Sometimes', 'Often', 'Always'] }
      ]
    },
    {
      title: 'Mental & Emotional Wellness',
      description: 'This helps us understand your mental wellbeing.',
      icon: 'brain',
      questions: [
        { key: 'stressLevel', question: 'How stressed do you feel on an average day?', type: 'select', options: ['Very stressed', 'Moderately stressed', 'Slightly stressed', 'Not stressed'] },
        { key: 'mindfulness', question: 'How often do you practice mindfulness or self-reflection?', type: 'select', options: ['Never', 'Rarely', 'Weekly', 'Daily'] },
        { key: 'mood', question: 'How would you describe your current mood?', type: 'select', options: ['Low', 'Neutral', 'Good', 'Great'] }
      ]
    },
    {
      title: 'Social Wellness / Fun',
      description: 'Let’s see how connected you are with others.',
      icon: 'people',
      questions: [
        { key: 'socialFreq', question: 'How often do you interact with friends or family?', type: 'select', options: ['Rarely', 'Weekly', 'Few times a week', 'Daily'] },
        { key: 'funTime', question: 'How often do you spend time doing something fun for yourself?', type: 'select', options: ['Rarely', 'Weekly', 'Few times a week', 'Daily'] },
        { key: 'interests', question: 'What types of social/fun activities interest you?', type: 'multiselect', options: ['Outdoor activities', 'Creative hobbies', 'Social gatherings', 'Sports', 'Reading', 'Gaming', 'Movies/TV', 'Travel'] }
      ]
    },
    {
      title: 'Self-Development / Personal Growth',
      description: 'Share your growth goals with us.',
      icon: 'target',
      questions: [
        { key: 'developmentGoal', question: 'What personal skill or trait do you want to develop?', type: 'text', placeholder: 'e.g., Become more confident, Learn a new language' },
        { key: 'frequency', question: 'How often would you like to work on this goal?', type: 'select', options: ['Daily', 'Few times a week', 'Weekly', 'Monthly'] },
        { key: 'support', question: 'What kind of support would help you succeed?', type: 'multiselect', options: ['Daily reminders', 'Progress tracking', 'Tips and advice', 'Milestone celebrations'] }
      ]
    }
  ];

  const handleAnswerChange = (category, key, value) => {
    setUserProfile(prev => ({ ...prev, [category]: { ...prev[category], [key]: value } }));
  };

  const handleNextStep = () => { if(currentStep < 4) setCurrentStep(currentStep + 1); else setCurrentView('dashboard'); };
  const handlePrevStep = () => { if(currentStep > 1) setCurrentStep(currentStep - 1); };
  const handleDailyTrackingUpdate = (category, value) => { setDailyTracking(prev => ({ ...prev, [category]: value })); };
  const handleStreakIncrement = (category) => { setStreaks(prev => ({ ...prev, [category]: prev[category] + 1 })); };

  const getWellnessScore = () => {
    const scores = {
      sleep: dailyTracking.sleep.hours && dailyTracking.sleep.quality ? 25 : 0,
      mental: dailyTracking.mood ? 25 : 0,
      social: dailyTracking.socialActivity ? 25 : 0,
      development: dailyTracking.developmentProgress ? 25 : 0
    };
    return Object.values(scores).reduce((a,b)=>a+b,0);
  };

  const toggleTheme = () => setTheme(prev => prev==='light'?'dark':'light');

  const OnboardingView = () => {
    const step = onboardingSteps[currentStep-1];
    const category = ['sleep','mental','social','development'][currentStep-1];

    return (
      <KeyboardAvoidingView behavior={Platform.OS==='ios'?'padding':'height'} style={{ flex:1 }}>
        <ScrollView contentContainerStyle={{ padding:24, backgroundColor: colors.background, alignItems:'center' }}>
          <View style={{ width:'100%', maxWidth:600 }}>
            <View style={{ flexDirection:'row', justifyContent:'space-between', alignItems:'center', marginBottom:16 }}>
              <View style={{ flexDirection:'row', alignItems:'center' }}>
                <Ionicons name={step.icon} size={32} color={colors.accent} style={{ marginRight: 12 }} />
                <Text style={{ fontSize:24, fontWeight:'bold', color:colors.text }}>{step.title}</Text>
              </View>
              <Text style={{ fontSize:14, color:colors.secondaryText }}>{currentStep} of 4</Text>
            </View>

            <Text style={{ color: colors.secondaryText, marginBottom:24 }}>{step.description}</Text>

            <View style={{ width:'100%', height:8, backgroundColor:colors.inputBackground, borderRadius:4, marginBottom:24 }}>
              <View style={{ width:`${(currentStep/4)*100}%`, height:8, backgroundColor:colors.accent, borderRadius:4 }}/>
            </View>

            {step.questions.map((q, idx) => (
              <View key={idx} style={{ backgroundColor:colors.card, padding:24, borderRadius:12, marginBottom:16 }}>
                <Text style={{ fontSize:18, fontWeight:'600', color:colors.text, marginBottom:12 }}>{q.question}</Text>

                {q.type==='select' && q.options.map((opt,i)=>(
                  <TouchableOpacity key={i} onPress={()=>handleAnswerChange(category,q.key,opt)} style={{
                    padding:12, borderRadius:8, borderWidth:1,
                    backgroundColor: userProfile[category][q.key]===opt?colors.accent:colors.background,
                    borderColor: userProfile[category][q.key]===opt?colors.accent:colors.inputBackground,
                    marginBottom:8
                  }}>
                    <Text style={{ color: userProfile[category][q.key]===opt?colors.buttonText:colors.text }}>{opt}</Text>
                  </TouchableOpacity>
                ))}

                {q.type==='text' && (
                  <TextInput placeholder={q.placeholder} value={userProfile[category][q.key]||''} onChangeText={(text)=>handleAnswerChange(category,q.key,text)}
                    style={{ backgroundColor:colors.inputBackground, color:colors.text, borderColor:colors.inputBackground, borderWidth:1, borderRadius:8, padding:12, fontSize:16 }}
                    placeholderTextColor={colors.secondaryText} />
                )}

                {q.type==='multiselect' && (
                  <View style={{ flexDirection:'row', flexWrap:'wrap', justifyContent:'space-between' }}>
                    {q.options.map((opt,i)=>(
                      <TouchableOpacity key={i} onPress={()=>{
                        const current = userProfile[category][q.key]||[];
                        const updated = current.includes(opt)?current.filter(item=>item!==opt):[...current,opt];
                        handleAnswerChange(category,q.key,updated);
                      }} style={{
                        padding:12, borderRadius:8, borderWidth:1, backgroundColor:(userProfile[category][q.key]||[]).includes(opt)?colors.accent:colors.background,
                        borderColor:(userProfile[category][q.key]||[]).includes(opt)?colors.accent:colors.inputBackground,
                        width:'48%', marginBottom:8
                      }}>
                        <Text style={{ color:(userProfile[category][q.key]||[]).includes(opt)?colors.buttonText:colors.text, textAlign:'center' }}>{opt}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
              </View>
            ))}

            <View style={{ flexDirection:'row', justifyContent:'space-between', marginTop:16 }}>
              <TouchableOpacity onPress={handlePrevStep} disabled={currentStep===1} style={{
                paddingHorizontal:24, paddingVertical:12, borderRadius:8, backgroundColor: currentStep===1?colors.inputBackground:colors.secondaryText, opacity: currentStep===1?0.5:1
              }}>
                <Text style={{ color: currentStep===1?colors.secondaryText:colors.buttonText, fontWeight:'600' }}>Previous</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleNextStep} style={{ paddingHorizontal:24, paddingVertical:12, borderRadius:8, backgroundColor: colors.accent }}>
                <Text style={{ color: colors.buttonText, fontWeight:'600' }}>{currentStep===4?'Complete Setup':'Next'}</Text>
              </TouchableOpacity>
            </View>

            <View style={{ alignItems:'center', marginTop:32 }}>
              <TouchableOpacity onPress={toggleTheme} style={{ paddingHorizontal:16, paddingVertical:8, borderRadius:8, backgroundColor:colors.inputBackground }}>
                <Text style={{ color:colors.text }}>Toggle {theme==='light'?'Dark':'Light'} Mode</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    );
  };

  const DashboardView = () => {
    const wellnessScore = getWellnessScore();

    return (
      <ScrollView contentContainerStyle={{ padding:24, backgroundColor: colors.background, alignItems:'center' }}>
        <View style={{ width:'100%', maxWidth:800 }}>
          <Text style={{ fontSize:32, fontWeight:'bold', color:colors.text, marginBottom:8 }}>Your Wellness Dashboard</Text>
          <Text style={{ color:colors.secondaryText, marginBottom:24 }}>Track your daily wellness activities and build healthy habits</Text>

          <View style={{ backgroundColor:colors.card, borderRadius:16, padding:24, marginBottom:24 }}>
            <View style={{ flexDirection:'row', justifyContent:'space-between', alignItems:'center', marginBottom:16 }}>
              <Text style={{ fontSize:20, fontWeight:'600', color:colors.text }}>Today's Wellness Score</Text>
              <Text style={{ fontSize:32, fontWeight:'bold', color:colors.accent }}>{wellnessScore}%</Text>
            </View>
            <View style={{ width:'100%', height:12, backgroundColor:colors.inputBackground, borderRadius:6 }}>
              <View style={{ width:`${wellnessScore}%`, height:12, backgroundColor:colors.accent, borderRadius:6 }}/>
            </View>
          </View>

          <View style={{ flexDirection:'row', justifyContent:'center', flexWrap:'wrap', marginTop:32 }}>
            <TouchableOpacity onPress={()=>setCurrentView('onboarding')} style={{ paddingHorizontal:24, paddingVertical:12, borderRadius:8, backgroundColor:colors.secondaryText, margin:4 }}>
              <Text style={{ color:colors.buttonText, fontWeight:'600' }}>Update Preferences</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={()=>{
              if(dailyTracking.sleep.hours && dailyTracking.sleep.quality) handleStreakIncrement('sleep');
              if(dailyTracking.mood) handleStreakIncrement('mental');
              if(dailyTracking.socialActivity) handleStreakIncrement('social');
              Alert.alert('Success','Progress saved! Keep up the great work! 🎉');
            }} style={{ paddingHorizontal:24, paddingVertical:12, borderRadius:8, backgroundColor:colors.accent, margin:4 }}>
              <Text style={{ color:colors.buttonText, fontWeight:'600' }}>Save Today's Progress</Text>
            </TouchableOpacity>
          </View>

          <View style={{ alignItems:'center', marginTop:32 }}>
            <TouchableOpacity onPress={toggleTheme} style={{ paddingHorizontal:16, paddingVertical:8, borderRadius:8, backgroundColor:colors.inputBackground }}>
              <Text style={{ color:colors.text }}>Toggle {theme==='light'?'Dark':'Light'} Mode</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    );
  };

  return <View style={{ flex:1 }}>{currentView==='onboarding'?<OnboardingView />:<DashboardView />}</View>;
}
