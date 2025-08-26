import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Progress } from '@/components/ui/progress';
import { Brain, Sparkles, Activity } from 'lucide-react';

interface LoadingScreenProps {
  onComplete: () => void;
}

const facts = [
  "Poor sleep increases risk of chronic illness.",
  "People who improve their sleep gain 2+ hours of daily productivity.",
  "89% of SleepVision users report improved rest.",
  "Quality sleep boosts immune system by 300%.",
  "Better sleep improves memory consolidation by 40%.",
  "Optimized sleep schedules reduce stress hormones by 25%."
];

export function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const [progress, setProgress] = useState(0);
  const [currentFactIndex, setCurrentFactIndex] = useState(0);

  useEffect(() => {
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          setTimeout(onComplete, 500);
          return 100;
        }
        return prev + 2;
      });
    }, 120); // Complete in ~6 seconds

    const factInterval = setInterval(() => {
      setCurrentFactIndex(prev => (prev + 1) % facts.length);
    }, 2500); // Change fact every 2.5 seconds

    return () => {
      clearInterval(progressInterval);
      clearInterval(factInterval);
    };
  }, [onComplete]);

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="max-w-2xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {/* AI Brain Animation */}
          <motion.div
            className="relative mb-8"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="relative inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-purple-600 to-teal-600 rounded-full mb-6">
              <Brain className="w-12 h-12 text-white" />
              
              {/* Orbiting particles */}
              {[...Array(3)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-3 h-3 bg-white rounded-full"
                  animate={{
                    rotate: [0, 360],
                    scale: [0.8, 1.2, 0.8]
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    delay: i * 0.5,
                    ease: "linear"
                  }}
                  style={{
                    left: '50%',
                    top: '50%',
                    transformOrigin: `0 ${40 + i * 10}px`
                  }}
                />
              ))}

              {/* Pulsing glow */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-br from-purple-600 to-teal-600 rounded-full"
                animate={{ 
                  boxShadow: [
                    '0 0 0 0 rgba(168, 85, 247, 0.4)',
                    '0 0 0 20px rgba(168, 85, 247, 0.1)',
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

          {/* Loading Text */}
          <motion.h2
            className="text-3xl md:text-4xl font-bold text-gray-900 mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            Our AI is building your{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-teal-600">
              personalized sleep schedule
            </span>
            <motion.span
              animate={{ opacity: [1, 0, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              ...
            </motion.span>
          </motion.h2>

          {/* Rotating Facts */}
          <motion.div
            className="h-16 mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <motion.p
              key={currentFactIndex}
              className="text-lg text-gray-600 leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              💡 {facts[currentFactIndex]}
            </motion.p>
          </motion.div>

          {/* Progress Bar */}
          <motion.div
            className="mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <div className="relative">
              <Progress 
                value={progress} 
                className="h-3 bg-purple-100 rounded-full overflow-hidden"
              />
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-purple-600 to-teal-600 rounded-full"
                style={{ width: `${progress}%` }}
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              />
              
              {/* Progress shimmer effect */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent rounded-full"
                animate={{
                  x: ['-100%', '100%']
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "linear"
                }}
                style={{ clipPath: `inset(0 ${100 - progress}% 0 0)` }}
              />
            </div>
            
            <div className="flex justify-between items-center mt-3">
              <span className="text-sm text-gray-500">Analyzing sleep patterns...</span>
              <span className="text-sm font-semibold text-purple-600">{Math.round(progress)}%</span>
            </div>
          </motion.div>

          {/* Processing Steps */}
          <motion.div
            className="flex justify-center gap-8 text-sm text-gray-500"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <motion.div
              className="flex items-center gap-2"
              animate={{ 
                color: progress > 30 ? '#10b981' : '#6b7280'
              }}
              transition={{ duration: 0.3 }}
            >
              <Sparkles className="w-4 h-4" />
              <span>Analyzing</span>
              {progress > 30 && <span className="text-green-500">✓</span>}
            </motion.div>
            
            <motion.div
              className="flex items-center gap-2"
              animate={{ 
                color: progress > 60 ? '#10b981' : '#6b7280'
              }}
              transition={{ duration: 0.3 }}
            >
              <Brain className="w-4 h-4" />
              <span>Processing</span>
              {progress > 60 && <span className="text-green-500">✓</span>}
            </motion.div>
            
            <motion.div
              className="flex items-center gap-2"
              animate={{ 
                color: progress > 90 ? '#10b981' : '#6b7280'
              }}
              transition={{ duration: 0.3 }}
            >
              <Activity className="w-4 h-4" />
              <span>Optimizing</span>
              {progress > 90 && <span className="text-green-500">✓</span>}
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
