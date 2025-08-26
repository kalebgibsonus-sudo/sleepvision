import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Star, Users, Shield, Zap, Clock, Brain, Heart } from 'lucide-react';
import { AssessmentAnswers } from './SleepAssessment';

interface ResultsSummaryProps {
  answers: AssessmentAnswers;
  onUpgrade: () => void;
}

interface SleepAnalysis {
  score: number;
  quality: number;
  energy: number;
  recovery: number;
  summary: string;
  recommendations: string[];
}

function analyzeSleep(answers: AssessmentAnswers): SleepAnalysis {
  let score = 100;
  let qualityFactors = [];
  let energyFactors = [];
  let recoveryFactors = [];
  let recommendations: string[] = [];

  // Basic Sleep Patterns (40% of score)
  const sleepHours = answers.sleep_hours;
  if (sleepHours === '4-5') { score -= 25; qualityFactors.push("severely insufficient sleep"); }
  else if (sleepHours === '5-6') { score -= 20; qualityFactors.push("insufficient sleep duration"); }
  else if (sleepHours === '6-7') { score -= 10; qualityFactors.push("slightly low sleep duration"); }
  else if (sleepHours === '9+') { score -= 15; qualityFactors.push("excessive sleep duration"); }
  else { qualityFactors.push("optimal sleep duration"); }

  const quality = answers.sleep_quality;
  if (quality === 'poor') { score -= 25; qualityFactors.push("poor subjective sleep quality"); }
  else if (quality === 'fair') { score -= 15; qualityFactors.push("fair sleep quality"); }
  else if (quality === 'good') { score -= 5; qualityFactors.push("good sleep quality"); }
  else { qualityFactors.push("excellent sleep quality"); }

  const fallAsleep = answers.fall_asleep_time;
  if (fallAsleep === '60+') { score -= 20; qualityFactors.push("significant sleep onset delay"); }
  else if (fallAsleep === '30-60') { score -= 15; qualityFactors.push("moderate sleep onset delay"); }
  else if (fallAsleep === '20-30') { score -= 8; qualityFactors.push("mild sleep onset delay"); }
  else if (fallAsleep === '10-20') { qualityFactors.push("normal sleep onset"); }
  else { qualityFactors.push("very fast sleep onset"); }

  const wakeFreq = answers.wake_up_frequency;
  if (wakeFreq === 'multiple') { score -= 18; qualityFactors.push("frequent night wakings"); }
  else if (wakeFreq === 'twice') { score -= 12; qualityFactors.push("moderate night wakings"); }
  else if (wakeFreq === 'once') { score -= 6; qualityFactors.push("occasional night wakings"); }
  else { qualityFactors.push("consolidated sleep"); }

  // Schedule Consistency (15% of score)
  const consistency = answers.bedtime_consistency;
  if (consistency === 'inconsistent') { score -= 15; recoveryFactors.push("irregular sleep schedule"); }
  else if (consistency === 'somewhat_consistent') { score -= 10; recoveryFactors.push("moderately inconsistent schedule"); }
  else if (consistency === 'mostly_consistent') { score -= 5; recoveryFactors.push("mostly consistent schedule"); }
  else { recoveryFactors.push("excellent schedule consistency"); }

  const weekend = answers.weekend_schedule;
  if (weekend === 'much_later' || weekend === 'catch_up') { score -= 10; recoveryFactors.push("significant weekend schedule changes"); }
  else if (weekend === 'slightly_later') { score -= 5; recoveryFactors.push("mild weekend schedule shift"); }
  else { recoveryFactors.push("consistent weekend schedule"); }

  // Lifestyle & Stress (20% of score)
  const stress = answers.stress_levels;
  if (stress === 'overwhelming') { score -= 20; energyFactors.push("overwhelming stress levels"); }
  else if (stress === 'high') { score -= 15; energyFactors.push("high stress levels"); }
  else if (stress === 'moderate') { score -= 8; energyFactors.push("moderate stress levels"); }
  else { energyFactors.push("low stress levels"); }

  const workSchedule = answers.work_schedule;
  if (workSchedule === 'rotating') { score -= 15; recoveryFactors.push("irregular work shifts"); }
  else if (workSchedule === 'late_shift') { score -= 10; recoveryFactors.push("night shift work"); }
  else if (workSchedule === 'early_start') { score -= 5; recoveryFactors.push("early morning schedule"); }

  // Exercise Impact (10% of score)
  const exercise = answers.exercise_frequency;
  if (exercise === 'rarely') { score -= 10; energyFactors.push("sedentary lifestyle"); }
  else if (exercise === 'weekly') { score -= 5; energyFactors.push("minimal exercise"); }
  else if (exercise === 'few_times_week') { energyFactors.push("regular exercise"); }
  else { energyFactors.push("excellent exercise routine"); }

  const exerciseTiming = answers.exercise_timing;
  if (exerciseTiming === 'night') { score -= 8; qualityFactors.push("late evening exercise"); }
  else if (exerciseTiming === 'morning') { energyFactors.push("morning exercise routine"); }

  // Sleep Environment (15% of score)
  const temperature = answers.bedroom_temperature;
  if (temperature === 'hot') { score -= 12; qualityFactors.push("bedroom too warm"); }
  else if (temperature === 'varies') { score -= 8; qualityFactors.push("inconsistent bedroom temperature"); }
  else if (temperature === 'cool') { qualityFactors.push("optimal bedroom temperature"); }

  const darkness = answers.bedroom_darkness;
  if (darkness === 'bright') { score -= 15; qualityFactors.push("bedroom too bright"); }
  else if (darkness === 'some_light') { score -= 8; qualityFactors.push("some light interference"); }
  else if (darkness === 'completely_dark') { qualityFactors.push("optimal darkness"); }

  const noise = answers.bedroom_noise;
  if (noise === 'noisy') { score -= 12; qualityFactors.push("disruptive bedroom noise"); }
  else if (noise === 'moderate') { score -= 6; qualityFactors.push("some background noise"); }
  else { qualityFactors.push("quiet sleep environment"); }

  // Technology & Screen Time (10% of score)
  const screenTime = answers.screen_before_bed;
  if (screenTime === 'extensive') { score -= 15; qualityFactors.push("excessive pre-sleep screen time"); }
  else if (screenTime === 'moderate') { score -= 10; qualityFactors.push("moderate pre-sleep screen time"); }
  else if (screenTime === 'minimal') { score -= 5; qualityFactors.push("minimal pre-sleep screen time"); }
  else { qualityFactors.push("excellent screen hygiene"); }

  const phoneLocation = answers.phone_in_bedroom;
  if (phoneLocation === 'next_to_bed') { score -= 8; qualityFactors.push("phone disruptions"); }
  else if (phoneLocation === 'nightstand') { score -= 4; qualityFactors.push("phone nearby with notifications"); }
  else { qualityFactors.push("good phone boundaries"); }

  // Substances & Diet (15% of score)
  const caffeine = answers.caffeine_dependency;
  if (caffeine === 'high') { score -= 12; energyFactors.push("high caffeine dependency"); }
  else if (caffeine === 'moderate') { score -= 8; energyFactors.push("moderate caffeine use"); }
  else if (caffeine === 'minimal') { score -= 2; energyFactors.push("minimal caffeine use"); }
  else { energyFactors.push("no caffeine dependency"); }

  const lastCaffeine = answers.last_caffeine_time;
  if (lastCaffeine === 'evening') { score -= 15; qualityFactors.push("late caffeine consumption"); }
  else if (lastCaffeine === 'late_afternoon') { score -= 8; qualityFactors.push("afternoon caffeine affecting sleep"); }

  const alcohol = answers.alcohol_consumption;
  if (alcohol === 'regularly') { score -= 10; qualityFactors.push("regular alcohol consumption"); }
  else if (alcohol === 'occasionally') { score -= 5; qualityFactors.push("occasional alcohol use"); }

  const dinnerTiming = answers.dinner_timing;
  if (dinnerTiming === 'very_late') { score -= 10; qualityFactors.push("very late eating"); }
  else if (dinnerTiming === 'late') { score -= 6; qualityFactors.push("late dinner timing"); }

  // Health & Medical (10% of score)
  const medications = answers.medications;
  if (medications === 'stimulants') { score -= 12; qualityFactors.push("stimulant medications"); }
  else if (medications === 'sleep_aids') { score -= 8; recoveryFactors.push("sleep aid dependency"); }

  const healthConditions = answers.health_conditions;
  if (healthConditions === 'snoring') { score -= 15; qualityFactors.push("sleep apnea/snoring issues"); }
  else if (healthConditions === 'anxiety') { score -= 12; qualityFactors.push("anxiety affecting sleep"); }
  else if (healthConditions === 'pain') { score -= 10; qualityFactors.push("chronic pain issues"); }
  else if (healthConditions === 'other') { score -= 8; qualityFactors.push("medical conditions affecting sleep"); }

  // Sleep Habits & Energy (15% of score)
  const routine = answers.bedtime_routine;
  if (routine === 'none') { score -= 12; recoveryFactors.push("no bedtime routine"); }
  else if (routine === 'minimal') { score -= 8; recoveryFactors.push("minimal bedtime routine"); }
  else if (routine === 'loose') { score -= 4; recoveryFactors.push("inconsistent bedtime routine"); }
  else { recoveryFactors.push("strong bedtime routine"); }

  const napping = answers.nap_frequency;
  if (napping === 'long') { score -= 10; recoveryFactors.push("long daytime naps"); }
  else if (napping === 'regular' && answers.afternoon_energy === 'crash') { score -= 5; }

  const morningEnergy = answers.morning_energy;
  if (morningEnergy === 'exhausted') { score -= 20; energyFactors.push("severe morning fatigue"); }
  else if (morningEnergy === 'tired') { score -= 12; energyFactors.push("morning tiredness"); }
  else if (morningEnergy === 'okay') { score -= 6; energyFactors.push("slow morning awakening"); }
  else { energyFactors.push("excellent morning energy"); }

  const afternoonEnergy = answers.afternoon_energy;
  if (afternoonEnergy === 'crash') { score -= 15; energyFactors.push("severe afternoon energy crash"); }
  else if (afternoonEnergy === 'low') { score -= 8; energyFactors.push("afternoon energy dip"); }
  else if (afternoonEnergy === 'stable') { energyFactors.push("stable daytime energy"); }
  else { energyFactors.push("excellent sustained energy"); }

  // Ensure score doesn't go below 0
  score = Math.max(score, 0);

  // Calculate component scores based on factors
  const qualityScore = Math.max(20, Math.min(100, score + (qualityFactors.filter(f => f.includes('optimal') || f.includes('excellent') || f.includes('good')).length * 5)));
  const energyScore = Math.max(15, Math.min(100, score + (energyFactors.filter(f => f.includes('excellent') || f.includes('low stress') || f.includes('regular')).length * 8)));
  const recoveryScore = Math.max(25, Math.min(100, score + (recoveryFactors.filter(f => f.includes('excellent') || f.includes('consistent')).length * 6)));

  // Generate personalized recommendations
  recommendations = generateRecommendations(answers, qualityFactors, energyFactors, recoveryFactors);

  // Generate personalized summary
  const summary = generatePersonalizedSummary(score, answers, qualityFactors, energyFactors);

  return {
    score,
    quality: qualityScore,
    energy: energyScore,
    recovery: recoveryScore,
    summary,
    recommendations
  };
}

function generateRecommendations(answers: AssessmentAnswers, qualityFactors: string[], energyFactors: string[], recoveryFactors: string[]): string[] {
  const recommendations = [];

  // Sleep timing recommendations
  if (answers.fall_asleep_time === '30-60' || answers.fall_asleep_time === '60+') {
    recommendations.push("Practice relaxation techniques 30 minutes before bed");
  }

  // Environment recommendations
  if (answers.bedroom_temperature === 'hot' || answers.bedroom_temperature === 'warm') {
    recommendations.push("Cool your bedroom to 65-68°F for optimal sleep");
  }

  if (answers.bedroom_darkness !== 'completely_dark') {
    recommendations.push("Install blackout curtains or use an eye mask");
  }

  // Technology recommendations
  if (answers.screen_before_bed === 'moderate' || answers.screen_before_bed === 'extensive') {
    recommendations.push("Stop all screen use 1-2 hours before bed");
  }

  // Schedule recommendations
  if (answers.bedtime_consistency === 'inconsistent' || answers.bedtime_consistency === 'somewhat_consistent') {
    recommendations.push("Establish a consistent bedtime and wake time, even on weekends");
  }

  // Lifestyle recommendations
  if (answers.stress_levels === 'high' || answers.stress_levels === 'overwhelming') {
    recommendations.push("Implement stress reduction techniques like meditation or journaling");
  }

  if (answers.exercise_frequency === 'rarely' || answers.exercise_frequency === 'weekly') {
    recommendations.push("Add regular exercise, but avoid intense workouts 3 hours before bed");
  }

  // Substance recommendations
  if (answers.last_caffeine_time === 'evening' || answers.last_caffeine_time === 'late_afternoon') {
    recommendations.push("Avoid caffeine after 2 PM");
  }

  if (answers.alcohol_consumption === 'regularly') {
    recommendations.push("Limit alcohol intake, especially within 3 hours of bedtime");
  }

  // Routine recommendations
  if (answers.bedtime_routine === 'none' || answers.bedtime_routine === 'minimal') {
    recommendations.push("Create a calming 30-60 minute bedtime routine");
  }

  return recommendations.slice(0, 4); // Return top 4 recommendations
}

function generatePersonalizedSummary(score: number, answers: AssessmentAnswers, qualityFactors: string[], energyFactors: string[]): string {
  const mainIssues = [];

  if (answers.sleep_hours === '4-5' || answers.sleep_hours === '5-6') {
    mainIssues.push("insufficient sleep duration");
  }

  if (answers.fall_asleep_time === '30-60' || answers.fall_asleep_time === '60+') {
    mainIssues.push("difficulty falling asleep");
  }

  if (answers.wake_up_frequency === 'twice' || answers.wake_up_frequency === 'multiple') {
    mainIssues.push("frequent night wakings");
  }

  if (answers.stress_levels === 'high' || answers.stress_levels === 'overwhelming') {
    mainIssues.push("high stress levels");
  }

  if (answers.screen_before_bed === 'extensive' || answers.screen_before_bed === 'moderate') {
    mainIssues.push("excessive screen time before bed");
  }

  let summary = "";

  if (score >= 85) {
    summary = "Excellent work! Your sleep habits are supporting optimal health and performance. You're getting quality rest with " +
              (mainIssues.length > 0 ? `just minor areas to optimize: ${mainIssues.slice(0, 2).join(' and ')}.` : "very few areas for improvement.");
  } else if (score >= 70) {
    summary = "Your sleep foundation is solid, but there are key opportunities to enhance your rest quality. " +
              (mainIssues.length > 0 ? `Focus on addressing: ${mainIssues.slice(0, 2).join(' and ')}.` : "Small optimizations could significantly boost your energy.");
  } else if (score >= 50) {
    summary = "Your sleep patterns are impacting your daily performance and wellbeing. " +
              (mainIssues.length > 0 ? `Priority areas include: ${mainIssues.slice(0, 3).join(', ')}.` : "Multiple factors are disrupting your sleep quality.") +
              " Targeted improvements could transform how you feel every day.";
  } else {
    summary = "Your sleep is significantly affecting your health, productivity, and quality of life. " +
              (mainIssues.length > 0 ? `Critical issues include: ${mainIssues.slice(0, 3).join(', ')}.` : "Multiple serious sleep disruptors need immediate attention.") +
              " A comprehensive sleep optimization plan is essential for your wellbeing.";
  }

  return summary;
}

export function ResultsSummary({ answers, onUpgrade }: ResultsSummaryProps) {
  const analysis = analyzeSleep(answers);

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-purple-50 to-teal-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {/* Header */}
          <div className="text-center mb-12">
            <motion.h1
              className="text-4xl md:text-5xl font-bold text-gray-900 mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              Your Sleep Score & Analysis
            </motion.h1>
            
            <motion.div
              className="inline-flex items-center gap-2 bg-white/60 backdrop-blur-sm rounded-full px-6 py-3 border border-purple-200"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <span className="text-2xl font-bold text-purple-600">{analysis.score}</span>
              <span className="text-gray-600">/100</span>
            </motion.div>
          </div>

          {/* Main Analysis Card */}
          <motion.div
            className="bg-white/80 backdrop-blur-sm rounded-2xl border border-purple-200 p-8 mb-8 shadow-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            {/* AI Summary */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Brain className="w-6 h-6 text-purple-600" />
                AI Analysis
              </h2>
              <p className="text-lg text-gray-700 leading-relaxed">
                {analysis.summary}
              </p>
            </div>

            {/* Score Breakdown */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <motion.div
                className="text-center p-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <div className="mb-3">
                  <Heart className="w-8 h-8 text-red-500 mx-auto mb-2" />
                  <h3 className="font-semibold text-gray-900">Sleep Quality</h3>
                </div>
                <div className="relative">
                  <Progress value={analysis.quality} className="h-3 mb-2" />
                  <span className="text-sm font-medium text-gray-600">{analysis.quality}%</span>
                </div>
              </motion.div>

              <motion.div
                className="text-center p-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
              >
                <div className="mb-3">
                  <Zap className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
                  <h3 className="font-semibold text-gray-900">Energy</h3>
                </div>
                <div className="relative">
                  <Progress value={analysis.energy} className="h-3 mb-2" />
                  <span className="text-sm font-medium text-gray-600">{analysis.energy}%</span>
                </div>
              </motion.div>

              <motion.div
                className="text-center p-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
              >
                <div className="mb-3">
                  <Clock className="w-8 h-8 text-green-500 mx-auto mb-2" />
                  <h3 className="font-semibold text-gray-900">Recovery</h3>
                </div>
                <div className="relative">
                  <Progress value={analysis.recovery} className="h-3 mb-2" />
                  <span className="text-sm font-medium text-gray-600">{analysis.recovery}%</span>
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* Upgrade Section */}
          <motion.div
            className="bg-gradient-to-br from-purple-600 to-teal-600 rounded-2xl p-8 text-white text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Unlock Your Full AI-Personalized Sleep Schedule
            </h2>
            
            <p className="text-xl mb-6 text-purple-100">
              Get your complete optimization plan with personalized recommendations, 
              sleep tracking, and ongoing AI coaching.
            </p>

            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                onClick={onUpgrade}
                size="lg"
                className="bg-white text-purple-600 hover:bg-purple-50 font-bold px-12 py-4 text-lg rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Upgrade & Get My Plan
              </Button>
            </motion.div>

            {/* Trust Signals */}
            <div className="flex justify-center items-center gap-8 mt-8 text-sm text-purple-100">
              <div className="flex items-center gap-2">
                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                <span>4.9/5 avg rating</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                <span>12,847 routines created</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4" />
                <span>30-day guarantee</span>
              </div>
            </div>

            <p className="text-purple-200 text-sm mt-4">
              Join today and start sleeping better tonight.
            </p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
