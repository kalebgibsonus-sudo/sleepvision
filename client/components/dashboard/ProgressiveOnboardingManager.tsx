import React, { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  CheckCircle,
  Sparkles,
  Trophy,
  Target,
  Calendar,
  Star,
  Flame,
  Brain,
  Users,
  Gift,
  Shield,
  Wind,
  Moon,
  Sun,
  BarChart3,
  Clock,
  X,
  ArrowRight,
  Eye,
  Lightbulb,
  Crown,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { TooltipCoachMarks } from "./TooltipCoachMarks";

interface OnboardingMilestone {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  unlockConditions: {
    daysSinceSignup?: number;
    streakLength?: number;
    completedFeatures?: string[];
    subscriptionTier?: string[];
    checkInsCompleted?: number;
    sleepScore?: number;
  };
  features: {
    id: string;
    name: string;
    description: string;
    targetSelector: string;
    lunaMessage: string;
    actionRequired?: boolean;
  }[];
  priority: number;
  category: "feature" | "achievement" | "social" | "advanced";
  celebrationType: "tooltip" | "modal" | "banner";
}

interface ProgressiveOnboardingManagerProps {
  isActive: boolean;
  userStats: {
    daysSinceSignup: number;
    currentStreak: number;
    completedFeatures: string[];
    checkInsCompleted: number;
    averageSleepScore: number;
  };
  onFeatureDiscovered: (featureId: string) => void;
}

export const ProgressiveOnboardingManager: React.FC<ProgressiveOnboardingManagerProps> = ({
  isActive,
  userStats,
  onFeatureDiscovered,
}) => {
  const { user, hasAccess } = useAuth();
  const [currentMilestone, setCurrentMilestone] = useState<OnboardingMilestone | null>(null);
  const [showMilestoneModal, setShowMilestoneModal] = useState(false);
  const [discoveredFeatures, setDiscoveredFeatures] = useState<string[]>([]);
  const [activeMilestones, setActiveMilestones] = useState<OnboardingMilestone[]>([]);

  // Define progressive onboarding milestones
  const milestones: OnboardingMilestone[] = [
    {
      id: "first-week",
      title: "Welcome to Your First Week!",
      description: "You've been using SleepVision for a week. Let's unlock some advanced features!",
      icon: Calendar,
      unlockConditions: {
        daysSinceSignup: 7,
      },
      features: [
        {
          id: "breathing-advanced",
          name: "Advanced Breathing Techniques",
          description: "Discover the Wim Hof method and other powerful breathing exercises",
          targetSelector: "[data-feature='breathing-exercises']",
          lunaMessage: "You're ready for advanced breathing! The Wim Hof method can supercharge your energy and focus! 🌬️",
          actionRequired: true,
        },
        {
          id: "sleep-analytics",
          name: "Detailed Sleep Analytics",
          description: "View comprehensive sleep pattern analysis and trends",
          targetSelector: "[data-feature='analytics']",
          lunaMessage: "Let's dive deeper into your sleep data! These insights will help optimize your routine further. 📊",
        },
      ],
      priority: 10,
      category: "feature",
      celebrationType: "modal",
    },
    {
      id: "streak-master",
      title: "Streak Master Achievement!",
      description: "Amazing! You've maintained a 7-day streak. You're building incredible consistency!",
      icon: Flame,
      unlockConditions: {
        streakLength: 7,
      },
      features: [
        {
          id: "streak-rewards",
          name: "Streak Rewards System",
          description: "Earn rewards and badges for maintaining consistency",
          targetSelector: "[data-feature='rewards']",
          lunaMessage: "Your consistency deserves recognition! Check out the rewards you've unlocked! 🏆",
          actionRequired: true,
        },
        {
          id: "community-access",
          name: "Community Features",
          description: "Connect with other sleep optimizers and share your progress",
          targetSelector: "[data-feature='community']",
          lunaMessage: "You're ready to connect with fellow sleep enthusiasts! Share your success story! 👥",
        },
      ],
      priority: 9,
      category: "achievement",
      celebrationType: "modal",
    },
    {
      id: "sleep-expert",
      title: "Sleep Optimization Expert",
      description: "With consistent high sleep scores, you've mastered the basics. Ready for expert features?",
      icon: Brain,
      unlockConditions: {
        sleepScore: 80,
        checkInsCompleted: 10,
      },
      features: [
        {
          id: "lucid-dreaming",
          name: "Lucid Dreaming Training",
          description: "Advanced consciousness training for lucid dreaming",
          targetSelector: "[data-feature='lucid-dreams']",
          lunaMessage: "Your sleep quality is excellent! Ready to explore the world of lucid dreaming? 🧠✨",
          actionRequired: true,
        },
        {
          id: "advanced-scheduling",
          name: "AI Schedule Optimization",
          description: "Dynamic schedule adjustments based on your lifestyle patterns",
          targetSelector: "[data-feature='advanced-scheduling']",
          lunaMessage: "I can now create even more personalized schedules based on your patterns! 🤖",
        },
      ],
      priority: 8,
      category: "advanced",
      celebrationType: "modal",
    },
    {
      id: "social-butterfly",
      title: "Community Champion",
      description: "You've engaged with the community and are inspiring others!",
      icon: Users,
      unlockConditions: {
        completedFeatures: ["community-interaction", "streak-sharing"],
        daysSinceSignup: 14,
      },
      features: [
        {
          id: "mentor-program",
          name: "Sleep Mentor Program",
          description: "Help guide new users on their sleep optimization journey",
          targetSelector: "[data-feature='mentoring']",
          lunaMessage: "You're inspiring others! Would you like to become a sleep mentor and help guide newcomers? 🌟",
          actionRequired: true,
        },
      ],
      priority: 7,
      category: "social",
      celebrationType: "banner",
    },
    {
      id: "premium-explorer",
      title: "Premium Feature Explorer",
      description: "Unlock the full potential of your subscription with advanced tools!",
      icon: Crown,
      unlockConditions: {
        subscriptionTier: ["full-transformation", "elite-performance"],
        daysSinceSignup: 3,
      },
      features: [
        {
          id: "morning-routines",
          name: "Advanced Morning Routines",
          description: "AI-optimized morning habits for peak performance",
          targetSelector: "[data-feature='morning-routines']",
          lunaMessage: "Ready to supercharge your mornings? Let's build the perfect morning routine! ☀️",
          actionRequired: true,
        },
        {
          id: "biometric-integration",
          name: "Biometric Data Integration",
          description: "Connect wearables for deeper insights",
          targetSelector: "[data-feature='biometric-sync']",
          lunaMessage: "Connect your fitness tracker for even more personalized insights! 📱",
        },
      ],
      priority: 8,
      category: "feature",
      celebrationType: "modal",
    },
  ];

  // Check for unlocked milestones
  useEffect(() => {
    if (!isActive || !user) return;

    const unlockedMilestones = milestones.filter(milestone => {
      return checkMilestoneConditions(milestone.unlockConditions);
    });

    // Sort by priority and find the highest priority unlocked milestone that hasn't been shown
    const newMilestones = unlockedMilestones
      .filter(milestone => !discoveredFeatures.includes(milestone.id))
      .sort((a, b) => b.priority - a.priority);

    if (newMilestones.length > 0 && !currentMilestone) {
      const nextMilestone = newMilestones[0];
      setCurrentMilestone(nextMilestone);
      setActiveMilestones([nextMilestone]);
      
      // Show milestone based on celebration type
      if (nextMilestone.celebrationType === "modal") {
        setTimeout(() => setShowMilestoneModal(true), 1000);
      }
    }
  }, [userStats, isActive, user, discoveredFeatures]);

  const checkMilestoneConditions = (conditions: OnboardingMilestone['unlockConditions']): boolean => {
    if (conditions.daysSinceSignup && userStats.daysSinceSignup < conditions.daysSinceSignup) {
      return false;
    }
    
    if (conditions.streakLength && userStats.currentStreak < conditions.streakLength) {
      return false;
    }
    
    if (conditions.checkInsCompleted && userStats.checkInsCompleted < conditions.checkInsCompleted) {
      return false;
    }
    
    if (conditions.sleepScore && userStats.averageSleepScore < conditions.sleepScore) {
      return false;
    }
    
    if (conditions.subscriptionTier && !conditions.subscriptionTier.includes(user?.subscriptionTier || "sleep-focused")) {
      return false;
    }
    
    if (conditions.completedFeatures) {
      const hasAllFeatures = conditions.completedFeatures.every(feature => 
        userStats.completedFeatures.includes(feature)
      );
      if (!hasAllFeatures) return false;
    }
    
    return true;
  };

  const handleMilestoneComplete = useCallback((milestoneId: string) => {
    setDiscoveredFeatures(prev => [...prev, milestoneId]);
    setCurrentMilestone(null);
    setShowMilestoneModal(false);
    
    // Store in localStorage for persistence
    const discovered = JSON.parse(localStorage.getItem("discoveredMilestones") || "[]");
    localStorage.setItem("discoveredMilestones", JSON.stringify([...discovered, milestoneId]));
    
    // Track milestone completion
    if (typeof window !== 'undefined' && (window as any).fbq) {
      (window as any).fbq('track', 'Achievement', {
        content_name: `Milestone: ${milestoneId}`,
        content_category: 'Progressive Onboarding'
      });
    }
  }, []);

  const handleFeatureExplore = (feature: OnboardingMilestone['features'][0]) => {
    onFeatureDiscovered(feature.id);
    
    // Focus the target element
    const element = document.querySelector(feature.targetSelector);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "center" });
      
      // Add temporary highlight
      element.classList.add("feature-highlight");
      setTimeout(() => {
        element.classList.remove("feature-highlight");
      }, 3000);
    }
  };

  const getCategoryIcon = (category: OnboardingMilestone['category']) => {
    switch (category) {
      case "feature": return <Sparkles className="h-5 w-5" />;
      case "achievement": return <Trophy className="h-5 w-5" />;
      case "social": return <Users className="h-5 w-5" />;
      case "advanced": return <Brain className="h-5 w-5" />;
      default: return <Target className="h-5 w-5" />;
    }
  };

  const getCategoryColor = (category: OnboardingMilestone['category']) => {
    switch (category) {
      case "feature": return "bg-blue-500";
      case "achievement": return "bg-yellow-500";
      case "social": return "bg-green-500";
      case "advanced": return "bg-purple-500";
      default: return "bg-gray-500";
    }
  };

  // Render milestone modal
  if (showMilestoneModal && currentMilestone) {
    const MilestoneIcon = currentMilestone.icon;
    
    return (
      <Dialog open={showMilestoneModal} onOpenChange={setShowMilestoneModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3">
              <div className={`p-3 rounded-full ${getCategoryColor(currentMilestone.category)}`}>
                <MilestoneIcon className="h-6 w-6 text-white" />
              </div>
              <div>
                <span className="text-xl font-bold">{currentMilestone.title}</span>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="outline" className="text-xs">
                    {currentMilestone.category.charAt(0).toUpperCase() + currentMilestone.category.slice(1)}
                  </Badge>
                  {getCategoryIcon(currentMilestone.category)}
                </div>
              </div>
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            <div className="text-center">
              <div className="text-6xl mb-4">🎉</div>
              <p className="text-gray-700 text-lg leading-relaxed">
                {currentMilestone.description}
              </p>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                <Eye className="h-5 w-5" />
                New Features Unlocked:
              </h3>
              
              {currentMilestone.features.map((feature, index) => (
                <Card key={feature.id} className="border border-blue-200 bg-blue-50">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-medium text-blue-900 mb-1">{feature.name}</h4>
                        <p className="text-sm text-blue-700 mb-3">{feature.description}</p>
                        
                        {feature.lunaMessage && (
                          <div className="bg-white rounded-md p-3 border border-blue-200">
                            <div className="flex items-start gap-2">
                              <span className="text-purple-500 text-sm">🌙</span>
                              <div>
                                <p className="text-xs font-medium text-purple-700">Luna says:</p>
                                <p className="text-xs text-purple-600">{feature.lunaMessage}</p>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                      
                      <Button
                        onClick={() => handleFeatureExplore(feature)}
                        size="sm"
                        className="ml-4"
                        variant={feature.actionRequired ? "default" : "outline"}
                      >
                        {feature.actionRequired ? "Try Now" : "Explore"}
                        <ArrowRight className="h-3 w-3 ml-1" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="flex justify-between items-center pt-4 border-t">
              <Button
                onClick={() => setShowMilestoneModal(false)}
                variant="outline"
              >
                Explore Later
              </Button>
              
              <Button
                onClick={() => handleMilestoneComplete(currentMilestone.id)}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Got It!
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  // Inject CSS styles for feature highlighting
  useEffect(() => {
    const styleId = 'progressive-onboarding-styles';

    // Check if styles already exist
    if (document.getElementById(styleId)) {
      return;
    }

    // Create style element
    const style = document.createElement('style');
    style.id = styleId;
    style.textContent = `
      .feature-highlight {
        position: relative;
        z-index: 10 !important;
        box-shadow: 0 0 0 4px rgba(34, 197, 94, 0.5), 0 0 0 8px rgba(34, 197, 94, 0.2) !important;
        border-radius: 12px !important;
        animation: feature-pulse 2s infinite;
      }

      @keyframes feature-pulse {
        0%, 100% {
          box-shadow: 0 0 0 4px rgba(34, 197, 94, 0.5), 0 0 0 8px rgba(34, 197, 94, 0.2);
        }
        50% {
          box-shadow: 0 0 0 6px rgba(34, 197, 94, 0.7), 0 0 0 12px rgba(34, 197, 94, 0.3);
        }
      }
    `;

    // Add to document head
    document.head.appendChild(style);

    // Cleanup function to remove styles when component unmounts
    return () => {
      const existingStyle = document.getElementById(styleId);
      if (existingStyle) {
        existingStyle.remove();
      }
    };
  }, []);

  return null;
};

export default ProgressiveOnboardingManager;
