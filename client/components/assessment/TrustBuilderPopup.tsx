import React from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';

interface TrustBuilderPopupProps {
  message: string;
  icon: string;
  onClose: () => void;
}

export function TrustBuilderPopup({ message, icon, onClose }: TrustBuilderPopupProps) {
  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center px-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Backdrop */}
      <motion.div
        className="absolute inset-0 bg-black/20 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      />

      {/* Popup Card */}
      <motion.div
        className="relative bg-white rounded-2xl shadow-2xl p-8 max-w-md mx-auto"
        initial={{ opacity: 0, scale: 0.8, y: 50 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.8, y: 50 }}
        transition={{ 
          type: "spring",
          duration: 0.5,
          bounce: 0.3
        }}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Content */}
        <div className="text-center">
          {/* Icon */}
          <motion.div
            className="text-4xl mb-4"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", bounce: 0.5 }}
          >
            {icon}
          </motion.div>

          {/* Message */}
          <motion.p
            className="text-lg font-semibold text-gray-900 leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            {message}
          </motion.p>

          {/* Progress indicator */}
          <motion.div
            className="mt-6 flex justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <div className="flex gap-2">
              {[...Array(3)].map((_, i) => (
                <motion.div
                  key={i}
                  className="w-2 h-2 rounded-full bg-purple-300"
                  animate={{
                    scale: [1, 1.5, 1],
                    backgroundColor: ["#d8b4fe", "#a855f7", "#d8b4fe"]
                  }}
                  transition={{
                    duration: 1,
                    repeat: Infinity,
                    delay: i * 0.2
                  }}
                />
              ))}
            </div>
          </motion.div>

          {/* Auto-close indicator */}
          <motion.div
            className="mt-4 text-xs text-gray-500"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            Continuing in 3 seconds...
          </motion.div>
        </div>

        {/* Decorative elements */}
        <motion.div
          className="absolute -top-2 -left-2 w-6 h-6 bg-gradient-to-br from-purple-400 to-teal-400 rounded-full opacity-60"
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360]
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "linear"
          }}
        />
        <motion.div
          className="absolute -bottom-2 -right-2 w-4 h-4 bg-gradient-to-br from-teal-400 to-purple-400 rounded-full opacity-60"
          animate={{
            scale: [1, 1.3, 1],
            rotate: [360, 180, 0]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "linear"
          }}
        />
      </motion.div>
    </motion.div>
  );
}
