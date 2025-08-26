import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Sparkles, Brain, Clock, TrendingUp } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface AssessmentIntroProps {
  onStart: () => void;
}

export function AssessmentIntro({ onStart }: AssessmentIntroProps) {
  const { user, signIn, loading } = useAuth();

  const handleStartClick = async () => {
    if (!user && !loading) {
      // Force sign-in before starting assessment
      try {
        await signIn();
        // After successful sign-in, start the assessment
        onStart();
      } catch (error) {
        toast.error('Please sign in to start your sleep assessment');
        console.error('Sign-in error:', error);
      }
    } else if (user) {
      // User is already signed in, start assessment
      onStart();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-purple-50 to-teal-50 flex items-center justify-center px-4">
      <div className="max-w-2xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {/* Logo/Icon */}
          <motion.div
            className="mb-8"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="relative inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-purple-600 to-teal-600 rounded-full mb-6">
              <Sparkles className="w-10 h-10 text-white" />
              <motion.div
                className="absolute inset-0 bg-gradient-to-br from-purple-600 to-teal-600 rounded-full"
                animate={{ 
                  boxShadow: [
                    '0 0 0 0 rgba(168, 85, 247, 0.4)',
                    '0 0 0 20px rgba(168, 85, 247, 0)',
                    '0 0 0 0 rgba(168, 85, 247, 0)'
                  ]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  repeatType: "loop"
                }}
              />
            </div>
          </motion.div>

          {/* Headline */}
          <motion.h1
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            Take Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-teal-600">Free Sleep Assessment</span>
          </motion.h1>

          {/* Subtext */}
          <motion.p
            className="text-lg md:text-xl text-gray-600 mb-8 leading-relaxed max-w-xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Answer a few quick questions and let AI reveal how your sleep impacts your health and productivity.
          </motion.p>

          {/* Features */}
          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            <div className="flex flex-col items-center p-4 rounded-lg bg-white/60 backdrop-blur-sm border border-purple-100">
              <Brain className="w-8 h-8 text-purple-600 mb-3" />
              <h3 className="font-semibold text-gray-900 mb-1">AI-Powered</h3>
              <p className="text-sm text-gray-600 text-center">Personalized insights from advanced algorithms</p>
            </div>
            <div className="flex flex-col items-center p-4 rounded-lg bg-white/60 backdrop-blur-sm border border-teal-100">
              <Clock className="w-8 h-8 text-teal-600 mb-3" />
              <h3 className="font-semibold text-gray-900 mb-1">2 Minutes</h3>
              <p className="text-sm text-gray-600 text-center">Quick assessment, maximum impact</p>
            </div>
            <div className="flex flex-col items-center p-4 rounded-lg bg-white/60 backdrop-blur-sm border border-purple-100">
              <TrendingUp className="w-8 h-8 text-purple-600 mb-3" />
              <h3 className="font-semibold text-gray-900 mb-1">Instant Results</h3>
              <p className="text-sm text-gray-600 text-center">Get your sleep score immediately</p>
            </div>
          </motion.div>

          {/* CTA Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <Button
              onClick={handleStartClick}
              size="lg"
              disabled={loading}
              className="bg-gradient-to-r from-purple-600 to-teal-600 hover:from-purple-700 hover:to-teal-700 text-white font-semibold px-12 py-4 text-lg rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
            >
              {loading ? 'Loading...' : user ? 'Start Assessment' : 'Sign In & Start Assessment'}
              {!loading && (
                <motion.div
                  className="ml-2"
                  animate={{ x: [0, 5, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  →
                </motion.div>
              )}
            </Button>
          </motion.div>

          {/* Trust indicators */}
          <motion.div
            className="mt-8 text-sm text-gray-500"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.7 }}
          >
            <p>✓ 100% Free  ✓ Secure Sign-In Required  ✓ Instant Results</p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
