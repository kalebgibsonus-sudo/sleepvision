import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AssessmentIntro } from './AssessmentIntro';
import { QuestionScreen } from './QuestionScreen';
import { TrustBuilderPopup } from './TrustBuilderPopup';
import { LoadingScreen } from './LoadingScreen';
import { ResultsSummary } from './ResultsSummary';
import { PaymentPage } from './PaymentPage';

export type AssessmentStep = 'intro' | 'questions' | 'loading' | 'results' | 'payment';

export interface AssessmentQuestion {
  id: string;
  question: string;
  options: {
    value: string;
    label: string;
  }[];
}

export interface AssessmentAnswers {
  [questionId: string]: string;
}

const questions: AssessmentQuestion[] = [
  // Basic Sleep Patterns
  {
    id: 'sleep_hours',
    question: 'How many hours do you usually sleep each night?',
    options: [
      { value: '4-5', label: '4-5 hours' },
      { value: '5-6', label: '5-6 hours' },
      { value: '6-7', label: '6-7 hours' },
      { value: '7-8', label: '7-8 hours' },
      { value: '8-9', label: '8-9 hours' },
      { value: '9+', label: '9+ hours' }
    ]
  },
  {
    id: 'sleep_quality',
    question: 'How would you rate your sleep quality?',
    options: [
      { value: 'poor', label: 'Poor - I wake up tired' },
      { value: 'fair', label: 'Fair - Sometimes rested' },
      { value: 'good', label: 'Good - Usually rested' },
      { value: 'excellent', label: 'Excellent - Always refreshed' }
    ]
  },
  {
    id: 'fall_asleep_time',
    question: 'How long does it usually take you to fall asleep?',
    options: [
      { value: '5-10', label: '5-10 minutes' },
      { value: '10-20', label: '10-20 minutes' },
      { value: '20-30', label: '20-30 minutes' },
      { value: '30-60', label: '30-60 minutes' },
      { value: '60+', label: 'More than 1 hour' }
    ]
  },
  {
    id: 'wake_up_frequency',
    question: 'How often do you wake up during the night?',
    options: [
      { value: 'never', label: 'Never or rarely' },
      { value: 'once', label: 'Once per night' },
      { value: 'twice', label: '2-3 times per night' },
      { value: 'multiple', label: '4+ times per night' }
    ]
  },

  // Schedule Consistency
  {
    id: 'bedtime_consistency',
    question: 'How consistent is your bedtime?',
    options: [
      { value: 'very_consistent', label: 'Same time every night (±15 mins)' },
      { value: 'mostly_consistent', label: 'Usually similar (±30 mins)' },
      { value: 'somewhat_consistent', label: 'Varies by 1-2 hours' },
      { value: 'inconsistent', label: 'Very irregular schedule' }
    ]
  },
  {
    id: 'weekend_schedule',
    question: 'How does your weekend sleep differ from weekdays?',
    options: [
      { value: 'same', label: 'Same schedule as weekdays' },
      { value: 'slightly_later', label: 'Sleep 1-2 hours later' },
      { value: 'much_later', label: 'Sleep 3+ hours later' },
      { value: 'catch_up', label: 'Sleep much longer to catch up' }
    ]
  },

  // Work & Lifestyle
  {
    id: 'work_schedule',
    question: 'What best describes your work schedule?',
    options: [
      { value: 'regular_day', label: 'Regular daytime (9-5)' },
      { value: 'early_start', label: 'Early start (before 7am)' },
      { value: 'late_shift', label: 'Evening/night shift' },
      { value: 'rotating', label: 'Rotating or irregular shifts' },
      { value: 'flexible', label: 'Flexible/work from home' }
    ]
  },
  {
    id: 'stress_levels',
    question: 'How would you rate your current stress levels?',
    options: [
      { value: 'low', label: 'Low - Generally relaxed' },
      { value: 'moderate', label: 'Moderate - Some daily stress' },
      { value: 'high', label: 'High - Frequently stressed' },
      { value: 'overwhelming', label: 'Overwhelming - Constantly anxious' }
    ]
  },

  // Physical Activity
  {
    id: 'exercise_frequency',
    question: 'How often do you exercise?',
    options: [
      { value: 'daily', label: 'Daily or almost daily' },
      { value: 'few_times_week', label: '3-4 times per week' },
      { value: 'weekly', label: '1-2 times per week' },
      { value: 'rarely', label: 'Rarely or never' }
    ]
  },
  {
    id: 'exercise_timing',
    question: 'When do you usually exercise?',
    options: [
      { value: 'morning', label: 'Morning (before 10am)' },
      { value: 'afternoon', label: 'Afternoon (10am-4pm)' },
      { value: 'evening', label: 'Evening (4pm-8pm)' },
      { value: 'night', label: 'Night (after 8pm)' },
      { value: 'varies', label: 'Times vary significantly' }
    ]
  },

  // Sleep Environment
  {
    id: 'bedroom_temperature',
    question: 'What temperature is your bedroom when you sleep?',
    options: [
      { value: 'cool', label: 'Cool (60-65°F / 15-18°C)' },
      { value: 'moderate', label: 'Moderate (66-70°F / 19-21°C)' },
      { value: 'warm', label: 'Warm (71-75°F / 22-24°C)' },
      { value: 'hot', label: 'Hot (75°F+ / 24°C+)' },
      { value: 'varies', label: 'Temperature varies significantly' }
    ]
  },
  {
    id: 'bedroom_darkness',
    question: 'How dark is your bedroom when you sleep?',
    options: [
      { value: 'completely_dark', label: 'Completely dark' },
      { value: 'mostly_dark', label: 'Mostly dark with some light' },
      { value: 'some_light', label: 'Some light from windows/devices' },
      { value: 'bright', label: 'Quite bright' }
    ]
  },
  {
    id: 'bedroom_noise',
    question: 'How would you describe the noise level in your bedroom?',
    options: [
      { value: 'silent', label: 'Completely silent' },
      { value: 'quiet', label: 'Very quiet with minimal sounds' },
      { value: 'moderate', label: 'Some background noise' },
      { value: 'noisy', label: 'Frequently noisy/disruptive' }
    ]
  },

  // Technology & Screen Time
  {
    id: 'screen_before_bed',
    question: 'How much time do you spend on screens before bed?',
    options: [
      { value: 'none', label: 'No screens 2+ hours before bed' },
      { value: 'minimal', label: 'Brief use (less than 30 mins)' },
      { value: 'moderate', label: '30-60 minutes' },
      { value: 'extensive', label: '1+ hours right before bed' }
    ]
  },
  {
    id: 'phone_in_bedroom',
    question: 'Where is your phone when you sleep?',
    options: [
      { value: 'outside_room', label: 'Outside the bedroom' },
      { value: 'across_room', label: 'Across the room, silent mode' },
      { value: 'nightstand', label: 'On nightstand, silent mode' },
      { value: 'next_to_bed', label: 'Next to bed with notifications' }
    ]
  },

  // Diet & Substances
  {
    id: 'caffeine_dependency',
    question: 'How much caffeine do you consume daily?',
    options: [
      { value: 'none', label: 'I don\'t drink caffeine' },
      { value: 'minimal', label: 'One cup in the morning' },
      { value: 'moderate', label: '2-3 cups throughout the day' },
      { value: 'high', label: '4+ cups or energy drinks' }
    ]
  },
  {
    id: 'last_caffeine_time',
    question: 'When do you have your last caffeine of the day?',
    options: [
      { value: 'morning', label: 'Before 10am' },
      { value: 'afternoon', label: '10am-2pm' },
      { value: 'late_afternoon', label: '2pm-6pm' },
      { value: 'evening', label: 'After 6pm' }
    ]
  },
  {
    id: 'alcohol_consumption',
    question: 'How often do you drink alcohol?',
    options: [
      { value: 'never', label: 'Never' },
      { value: 'rarely', label: 'Rarely (few times a year)' },
      { value: 'occasionally', label: 'Occasionally (1-2 times/week)' },
      { value: 'regularly', label: 'Regularly (3+ times/week)' }
    ]
  },
  {
    id: 'dinner_timing',
    question: 'When do you usually eat your last meal of the day?',
    options: [
      { value: 'early', label: '3+ hours before bed' },
      { value: 'moderate', label: '2-3 hours before bed' },
      { value: 'late', label: '1-2 hours before bed' },
      { value: 'very_late', label: 'Within 1 hour of bed' }
    ]
  },

  // Health & Medical
  {
    id: 'medications',
    question: 'Do you take any medications that might affect sleep?',
    options: [
      { value: 'none', label: 'No medications' },
      { value: 'unrelated', label: 'Medications unrelated to sleep' },
      { value: 'sleep_aids', label: 'Sleep aids or melatonin' },
      { value: 'stimulants', label: 'Stimulants or other medications' }
    ]
  },
  {
    id: 'health_conditions',
    question: 'Do you have any health conditions affecting sleep?',
    options: [
      { value: 'none', label: 'No known conditions' },
      { value: 'snoring', label: 'Snoring or sleep apnea' },
      { value: 'anxiety', label: 'Anxiety or depression' },
      { value: 'pain', label: 'Chronic pain or discomfort' },
      { value: 'other', label: 'Other medical conditions' }
    ]
  },

  // Sleep Habits & Routines
  {
    id: 'bedtime_routine',
    question: 'Do you have a consistent bedtime routine?',
    options: [
      { value: 'structured', label: 'Yes, same routine every night' },
      { value: 'loose', label: 'Loose routine, somewhat consistent' },
      { value: 'minimal', label: 'Minimal routine' },
      { value: 'none', label: 'No routine, just go to bed' }
    ]
  },
  {
    id: 'nap_frequency',
    question: 'How often do you nap during the day?',
    options: [
      { value: 'never', label: 'Never or very rarely' },
      { value: 'occasional', label: 'Occasionally when tired' },
      { value: 'regular', label: 'Regular short naps (20-30 mins)' },
      { value: 'long', label: 'Long naps (1+ hours)' }
    ]
  },

  // Energy & Mood
  {
    id: 'morning_energy',
    question: 'How do you feel when you wake up in the morning?',
    options: [
      { value: 'exhausted', label: 'Exhausted and groggy' },
      { value: 'tired', label: 'Tired but functional' },
      { value: 'okay', label: 'Okay, need some time to wake up' },
      { value: 'energized', label: 'Energized and ready to go' }
    ]
  },
  {
    id: 'afternoon_energy',
    question: 'How is your energy level in the afternoon (2-4pm)?',
    options: [
      { value: 'crash', label: 'Major energy crash, very tired' },
      { value: 'low', label: 'Noticeably lower energy' },
      { value: 'stable', label: 'Stable energy levels' },
      { value: 'high', label: 'Still high energy' }
    ]
  },

  // Goals & Priorities
  {
    id: 'main_sleep_goal',
    question: 'What is your main sleep improvement goal?',
    options: [
      { value: 'fall_asleep_faster', label: 'Fall asleep faster' },
      { value: 'sleep_longer', label: 'Sleep longer/get more hours' },
      { value: 'deeper_sleep', label: 'Get deeper, more restful sleep' },
      { value: 'consistent_schedule', label: 'Maintain consistent schedule' },
      { value: 'morning_energy', label: 'Wake up with more energy' },
      { value: 'reduce_stress', label: 'Reduce stress affecting sleep' }
    ]
  },
  {
    id: 'biggest_challenge',
    question: 'What is your biggest sleep challenge?',
    options: [
      { value: 'racing_thoughts', label: 'Racing thoughts/can\'t turn off mind' },
      { value: 'physical_discomfort', label: 'Physical discomfort or pain' },
      { value: 'schedule_demands', label: 'Work/life schedule demands' },
      { value: 'environmental', label: 'Bedroom environment issues' },
      { value: 'habits', label: 'Bad habits (screens, caffeine, etc.)' },
      { value: 'anxiety', label: 'Anxiety or worry about sleep' }
    ]
  }
];

const trustBuilders = [
  {
    message: "SleepVision helps over 10 million users a year improve their sleep.",
    icon: "👥"
  },
  {
    message: "People with poor sleep lose thousands of dollars yearly due to low productivity.",
    icon: "💰"
  },
  {
    message: "89% of SleepVision users report improved rest within 2 weeks.",
    icon: "📈"
  },
  {
    message: "Our AI analyzes 50+ sleep factors to create your personalized schedule.",
    icon: "🧠"
  },
  {
    message: "Better sleep improves memory, immune function, and mental clarity.",
    icon: "✨"
  },
  {
    message: "Sleep optimization can add 3-5 productive hours to your day.",
    icon: "⏰"
  },
  {
    message: "Quality sleep reduces stress hormones by up to 60%.",
    icon: "🧘"
  }
];

export function SleepAssessment() {
  const [currentStep, setCurrentStep] = useState<AssessmentStep>('intro');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<AssessmentAnswers>({});
  const [showTrustBuilder, setShowTrustBuilder] = useState(false);
  const [trustBuilderIndex, setTrustBuilderIndex] = useState(0);
  const [progress, setProgress] = useState(0);

  const handleStartAssessment = () => {
    setCurrentStep('questions');
  };

  const handleAnswer = (answer: string) => {
    const currentQuestion = questions[currentQuestionIndex];
    if (!currentQuestion) {
      console.error('Current question is undefined at index:', currentQuestionIndex);
      return;
    }

    setAnswers(prev => ({
      ...prev,
      [currentQuestion.id]: answer
    }));

    // Show trust builder after every 4-5 questions
    if ((currentQuestionIndex + 1) % 4 === 0 && currentQuestionIndex < questions.length - 1) {
      setShowTrustBuilder(true);
      setTrustBuilderIndex(Math.floor((currentQuestionIndex + 1) / 4) % trustBuilders.length);

      setTimeout(() => {
        setShowTrustBuilder(false);
      }, 3000);
    }

    if (currentQuestionIndex < questions.length - 1) {
      setTimeout(() => {
        setCurrentQuestionIndex(prev => {
          const nextIndex = prev + 1;
          if (nextIndex < questions.length) {
            return nextIndex;
          }
          return prev;
        });
        setProgress(((currentQuestionIndex + 2) / questions.length) * 100);
      }, showTrustBuilder ? 3500 : 500);
    } else {
      // Assessment complete, move to loading
      setTimeout(() => {
        setCurrentStep('loading');
      }, 500);
    }
  };

  const handleLoadingComplete = () => {
    setCurrentStep('results');
  };

  const handleUpgrade = () => {
    setCurrentStep('payment');
  };

  useEffect(() => {
    setProgress(((currentQuestionIndex + 1) / questions.length) * 100);
  }, [currentQuestionIndex]);

  return (
    <div className="min-h-screen bg-white">
      <AnimatePresence mode="wait">
        {currentStep === 'intro' && (
          <motion.div
            key="intro"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.6 }}
          >
            <AssessmentIntro onStart={handleStartAssessment} />
          </motion.div>
        )}

        {currentStep === 'questions' && questions[currentQuestionIndex] && (
          <motion.div
            key="questions"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.4 }}
          >
            <QuestionScreen
              question={questions[currentQuestionIndex]}
              onAnswer={handleAnswer}
              progress={progress}
              questionNumber={currentQuestionIndex + 1}
              totalQuestions={questions.length}
            />
          </motion.div>
        )}

        {currentStep === 'loading' && (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
          >
            <LoadingScreen onComplete={handleLoadingComplete} />
          </motion.div>
        )}

        {currentStep === 'results' && (
          <motion.div
            key="results"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.6 }}
          >
            <ResultsSummary answers={answers} onUpgrade={handleUpgrade} />
          </motion.div>
        )}

        {currentStep === 'payment' && (
          <motion.div
            key="payment"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.4 }}
          >
            <PaymentPage />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Trust Builder Popup */}
      <AnimatePresence>
        {showTrustBuilder && (
          <TrustBuilderPopup 
            message={trustBuilders[trustBuilderIndex].message}
            icon={trustBuilders[trustBuilderIndex].icon}
            onClose={() => setShowTrustBuilder(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
