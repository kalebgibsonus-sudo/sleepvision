import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft } from 'lucide-react';
import { AssessmentQuestion } from './SleepAssessment';

interface QuestionScreenProps {
  question: AssessmentQuestion;
  onAnswer: (answer: string) => void;
  progress: number;
  questionNumber: number;
  totalQuestions: number;
}

export function QuestionScreen({ 
  question, 
  onAnswer, 
  progress, 
  questionNumber, 
  totalQuestions 
}: QuestionScreenProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-purple-50 to-teal-50">
      {/* Header with Progress */}
      <div className="sticky top-0 bg-white/80 backdrop-blur-md border-b border-purple-100 z-10">
        <div className="max-w-3xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="sm" className="text-gray-600">
                <ArrowLeft className="w-4 h-4" />
              </Button>
              <span className="text-sm font-medium text-gray-600">
                Question {questionNumber} of {totalQuestions}
              </span>
            </div>
            <div className="text-sm font-medium text-purple-600">
              {Math.round(progress)}% Complete
            </div>
          </div>
          <Progress 
            value={progress} 
            className="h-2 bg-purple-100"
          />
        </div>
      </div>

      {/* Question Content */}
      <div className="flex items-center justify-center min-h-[calc(100vh-120px)] px-4">
        <div className="max-w-2xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Question */}
            <motion.h2
              className="text-3xl md:text-4xl font-bold text-gray-900 mb-8 leading-tight"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              {question.question}
            </motion.h2>

            {/* Answer Options */}
            <motion.div
              className="space-y-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              {question.options.map((option, index) => (
                <motion.div
                  key={option.value}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 0.1 * index }}
                >
                  <Button
                    onClick={() => onAnswer(option.value)}
                    variant="outline"
                    size="lg"
                    className="w-full p-6 text-left justify-start text-lg font-medium 
                             bg-white/60 backdrop-blur-sm border-2 border-purple-200 
                             hover:border-purple-400 hover:bg-purple-50 
                             transition-all duration-300 transform hover:scale-102 
                             hover:shadow-lg group"
                  >
                    <motion.div
                      className="flex items-center w-full"
                      whileHover={{ x: 8 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="w-6 h-6 rounded-full border-2 border-purple-300 
                                    group-hover:border-purple-500 mr-4 flex-shrink-0
                                    group-hover:bg-purple-100 transition-colors duration-200" />
                      <span className="text-gray-700 group-hover:text-purple-700 transition-colors duration-200">
                        {option.label}
                      </span>
                    </motion.div>
                  </Button>
                </motion.div>
              ))}
            </motion.div>

            {/* Helper text */}
            <motion.p
              className="text-sm text-gray-500 mt-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              Choose the option that best describes your situation
            </motion.p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
