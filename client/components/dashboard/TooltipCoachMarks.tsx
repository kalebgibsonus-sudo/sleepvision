import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  X,
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  Lightbulb,
  Sparkles,
  Target,
  Play,
  Eye,
  CheckCircle,
  SkipForward,
} from "lucide-react";
import { Portal } from "@/components/ui/portal";

interface TooltipConfig {
  id: string;
  targetSelector: string; // CSS selector for the element to highlight
  title: string;
  content: string;
  position: "top" | "bottom" | "left" | "right" | "auto";
  arrowPosition?: "top" | "bottom" | "left" | "right";
  trigger: "hover" | "click" | "auto" | "programmatic";
  priority: number; // Higher priority tooltips show first
  category: "feature" | "action" | "navigation" | "insight";
  lunaMessage?: string;
  actionButton?: {
    text: string;
    action: () => void;
    variant?: "default" | "outline" | "secondary";
  };
  dismissible: boolean;
  autoHide?: number; // Auto-hide after X milliseconds
  showOnce?: boolean; // Only show once per user
  conditions?: {
    userLevel?: "beginner" | "intermediate" | "advanced";
    featureUnlocked?: boolean;
    daysSinceSignup?: number;
    hasCompletedAction?: string; // Action ID that must be completed first
  };
}

interface TooltipPosition {
  top: number;
  left: number;
  width: number;
  height: number;
}

interface CoachMarkProps {
  tooltips: TooltipConfig[];
  isActive: boolean;
  onComplete?: () => void;
  onSkip?: () => void;
  autoProgress?: boolean;
  showSequentially?: boolean;
}

interface TooltipOverlayProps {
  tooltip: TooltipConfig;
  position: TooltipPosition;
  onDismiss: () => void;
  onNext?: () => void;
  onPrevious?: () => void;
  currentIndex?: number;
  totalCount?: number;
  isSequential?: boolean;
}

// Portal component for rendering outside React tree
const Portal = ({ children }: { children: React.ReactNode }) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  if (!mounted) return null;

  return React.createPortal(children, document.body);
};

const TooltipOverlay: React.FC<TooltipOverlayProps> = ({
  tooltip,
  position,
  onDismiss,
  onNext,
  onPrevious,
  currentIndex,
  totalCount,
  isSequential,
}) => {
  const [tooltipPosition, setTooltipPosition] = useState<{
    top: number;
    left: number;
    arrow: string;
  }>({ top: 0, left: 0, arrow: "top" });

  useEffect(() => {
    calculateTooltipPosition();
  }, [position, tooltip.position]);

  const calculateTooltipPosition = () => {
    const tooltipWidth = 320;
    const tooltipHeight = 200; // Estimated
    const margin = 16;
    const arrowSize = 8;

    let top = position.top;
    let left = position.left;
    let arrow = tooltip.arrowPosition || "bottom";

    // Calculate position based on preferred position
    switch (tooltip.position) {
      case "top":
        top = position.top - tooltipHeight - arrowSize - margin;
        left = position.left + position.width / 2 - tooltipWidth / 2;
        arrow = "bottom";
        break;
      case "bottom":
        top = position.top + position.height + arrowSize + margin;
        left = position.left + position.width / 2 - tooltipWidth / 2;
        arrow = "top";
        break;
      case "left":
        top = position.top + position.height / 2 - tooltipHeight / 2;
        left = position.left - tooltipWidth - arrowSize - margin;
        arrow = "right";
        break;
      case "right":
        top = position.top + position.height / 2 - tooltipHeight / 2;
        left = position.left + position.width + arrowSize + margin;
        arrow = "left";
        break;
      case "auto":
      default:
        // Auto-position logic
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;

        // Try bottom first
        if (position.top + position.height + tooltipHeight + margin < viewportHeight) {
          top = position.top + position.height + arrowSize + margin;
          arrow = "top";
        }
        // Try top
        else if (position.top - tooltipHeight - margin > 0) {
          top = position.top - tooltipHeight - arrowSize - margin;
          arrow = "bottom";
        }
        // Try right
        else if (position.left + position.width + tooltipWidth + margin < viewportWidth) {
          top = position.top + position.height / 2 - tooltipHeight / 2;
          left = position.left + position.width + arrowSize + margin;
          arrow = "left";
        }
        // Default to left
        else {
          top = position.top + position.height / 2 - tooltipHeight / 2;
          left = position.left - tooltipWidth - arrowSize - margin;
          arrow = "right";
        }

        left = position.left + position.width / 2 - tooltipWidth / 2;
        break;
    }

    // Adjust for viewport boundaries
    if (left < margin) left = margin;
    if (left + tooltipWidth > window.innerWidth - margin) {
      left = window.innerWidth - tooltipWidth - margin;
    }
    if (top < margin) top = margin;
    if (top + tooltipHeight > window.innerHeight - margin) {
      top = window.innerHeight - tooltipHeight - margin;
    }

    setTooltipPosition({ top, left, arrow });
  };

  const getCategoryIcon = () => {
    switch (tooltip.category) {
      case "feature": return <Sparkles className="h-4 w-4" />;
      case "action": return <Target className="h-4 w-4" />;
      case "navigation": return <Eye className="h-4 w-4" />;
      case "insight": return <Lightbulb className="h-4 w-4" />;
      default: return <Sparkles className="h-4 w-4" />;
    }
  };

  const getCategoryColor = () => {
    switch (tooltip.category) {
      case "feature": return "bg-blue-500";
      case "action": return "bg-green-500";
      case "navigation": return "bg-purple-500";
      case "insight": return "bg-yellow-500";
      default: return "bg-blue-500";
    }
  };

  const getArrowClasses = () => {
    const baseClasses = "absolute w-0 h-0 border-solid";
    const arrowSize = "border-8";
    
    switch (tooltipPosition.arrow) {
      case "top":
        return `${baseClasses} ${arrowSize} border-b-white border-t-transparent border-l-transparent border-r-transparent top-[-8px] left-1/2 transform -translate-x-1/2`;
      case "bottom":
        return `${baseClasses} ${arrowSize} border-t-white border-b-transparent border-l-transparent border-r-transparent bottom-[-8px] left-1/2 transform -translate-x-1/2`;
      case "left":
        return `${baseClasses} ${arrowSize} border-r-white border-l-transparent border-t-transparent border-b-transparent left-[-8px] top-1/2 transform -translate-y-1/2`;
      case "right":
        return `${baseClasses} ${arrowSize} border-l-white border-r-transparent border-t-transparent border-b-transparent right-[-8px] top-1/2 transform -translate-y-1/2`;
      default:
        return "";
    }
  };

  return (
    <div
      className="fixed bg-white rounded-lg shadow-xl border border-gray-200 p-4 z-[9999] max-w-xs"
      style={{
        top: tooltipPosition.top,
        left: tooltipPosition.left,
      }}
    >
      {/* Arrow */}
      <div className={getArrowClasses()} />

      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className={`w-6 h-6 rounded-full ${getCategoryColor()} flex items-center justify-center text-white`}>
            {getCategoryIcon()}
          </div>
          <h3 className="font-semibold text-gray-900 text-sm">{tooltip.title}</h3>
        </div>
        
        {tooltip.dismissible && (
          <Button
            onClick={onDismiss}
            variant="ghost"
            size="sm"
            className="p-1 h-6 w-6 text-gray-400 hover:text-gray-600"
          >
            <X className="h-3 w-3" />
          </Button>
        )}
      </div>

      {/* Content */}
      <div className="space-y-3">
        <p className="text-sm text-gray-700 leading-relaxed">{tooltip.content}</p>

        {/* Luna Message */}
        {tooltip.lunaMessage && (
          <div className="bg-purple-50 border border-purple-200 rounded-md p-2">
            <div className="flex items-start gap-2">
              <span className="text-purple-500 text-xs">🌙</span>
              <div>
                <p className="text-xs font-medium text-purple-700">Luna says:</p>
                <p className="text-xs text-purple-600">{tooltip.lunaMessage}</p>
              </div>
            </div>
          </div>
        )}

        {/* Action Button */}
        {tooltip.actionButton && (
          <Button
            onClick={tooltip.actionButton.action}
            variant={tooltip.actionButton.variant || "default"}
            size="sm"
            className="w-full"
          >
            <Play className="h-3 w-3 mr-1" />
            {tooltip.actionButton.text}
          </Button>
        )}

        {/* Sequential Navigation */}
        {isSequential && (
          <div className="flex items-center justify-between pt-2 border-t border-gray-100">
            <div className="flex items-center gap-2">
              {onPrevious && (
                <Button onClick={onPrevious} variant="outline" size="sm">
                  <ArrowLeft className="h-3 w-3 mr-1" />
                  Previous
                </Button>
              )}
            </div>

            <div className="flex items-center gap-2">
              {currentIndex !== undefined && totalCount !== undefined && (
                <span className="text-xs text-gray-500">
                  {currentIndex + 1} of {totalCount}
                </span>
              )}
              
              {onNext ? (
                <Button onClick={onNext} size="sm">
                  Next
                  <ArrowRight className="h-3 w-3 ml-1" />
                </Button>
              ) : (
                <Button onClick={onDismiss} size="sm" variant="outline">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Done
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export const TooltipCoachMarks: React.FC<CoachMarkProps> = ({
  tooltips,
  isActive,
  onComplete,
  onSkip,
  autoProgress = false,
  showSequentially = false,
}) => {
  const [currentTooltipIndex, setCurrentTooltipIndex] = useState(0);
  const [visibleTooltips, setVisibleTooltips] = useState<string[]>([]);
  const [elementPositions, setElementPositions] = useState<Map<string, TooltipPosition>>(new Map());
  const [shownOnceTooltips, setShownOnceTooltips] = useState<string[]>([]);

  useEffect(() => {
    if (isActive) {
      // Load previously shown tooltips from localStorage
      const shown = JSON.parse(localStorage.getItem("shownOnceTooltips") || "[]");
      setShownOnceTooltips(shown);
      
      calculateElementPositions();
      
      if (showSequentially) {
        showNextSequentialTooltip();
      } else {
        showApplicableTooltips();
      }
    }
  }, [isActive, tooltips]);

  useEffect(() => {
    if (isActive) {
      const handleResize = () => calculateElementPositions();
      const handleScroll = () => calculateElementPositions();
      
      window.addEventListener("resize", handleResize);
      window.addEventListener("scroll", handleScroll);
      
      return () => {
        window.removeEventListener("resize", handleResize);
        window.removeEventListener("scroll", handleScroll);
      };
    }
  }, [isActive]);

  const calculateElementPositions = () => {
    const positions = new Map<string, TooltipPosition>();
    
    tooltips.forEach((tooltip) => {
      const element = document.querySelector(tooltip.targetSelector);
      if (element) {
        const rect = element.getBoundingClientRect();
        positions.set(tooltip.id, {
          top: rect.top + window.scrollY,
          left: rect.left + window.scrollX,
          width: rect.width,
          height: rect.height,
        });
      }
    });
    
    setElementPositions(positions);
  };

  const showApplicableTooltips = () => {
    const applicable = tooltips.filter((tooltip) => {
      // Check if tooltip should only be shown once
      if (tooltip.showOnce && shownOnceTooltips.includes(tooltip.id)) {
        return false;
      }
      
      // Check conditions
      if (tooltip.conditions) {
        // Add condition checking logic here based on user state
        // For now, show all applicable tooltips
      }
      
      // Check if element exists
      const element = document.querySelector(tooltip.targetSelector);
      return element !== null;
    });
    
    // Sort by priority
    applicable.sort((a, b) => b.priority - a.priority);
    
    setVisibleTooltips(applicable.map(t => t.id));
  };

  const showNextSequentialTooltip = () => {
    if (currentTooltipIndex < tooltips.length) {
      const tooltip = tooltips[currentTooltipIndex];
      const element = document.querySelector(tooltip.targetSelector);
      
      if (element) {
        setVisibleTooltips([tooltip.id]);
        
        // Scroll element into view if needed
        element.scrollIntoView({
          behavior: "smooth",
          block: "center",
          inline: "center",
        });
        
        // Add highlight effect
        element.classList.add("tooltip-highlight");
        
        if (autoProgress && tooltip.autoHide) {
          setTimeout(() => {
            handleNext();
          }, tooltip.autoHide);
        }
      } else {
        // Skip this tooltip if element doesn't exist
        handleNext();
      }
    } else {
      // All tooltips shown
      handleComplete();
    }
  };

  const handleNext = () => {
    const currentTooltip = tooltips[currentTooltipIndex];
    
    // Mark as shown once if needed
    if (currentTooltip?.showOnce) {
      const newShownOnce = [...shownOnceTooltips, currentTooltip.id];
      setShownOnceTooltips(newShownOnce);
      localStorage.setItem("shownOnceTooltips", JSON.stringify(newShownOnce));
    }
    
    // Remove highlight from current element
    const currentElement = document.querySelector(currentTooltip?.targetSelector || "");
    if (currentElement) {
      currentElement.classList.remove("tooltip-highlight");
    }
    
    setCurrentTooltipIndex(currentTooltipIndex + 1);
    setVisibleTooltips([]);
    
    setTimeout(() => {
      showNextSequentialTooltip();
    }, 100);
  };

  const handlePrevious = () => {
    if (currentTooltipIndex > 0) {
      setCurrentTooltipIndex(currentTooltipIndex - 1);
      setVisibleTooltips([]);
      
      setTimeout(() => {
        showNextSequentialTooltip();
      }, 100);
    }
  };

  const handleDismissTooltip = (tooltipId: string) => {
    setVisibleTooltips(visibleTooltips.filter(id => id !== tooltipId));
    
    const tooltip = tooltips.find(t => t.id === tooltipId);
    if (tooltip?.showOnce) {
      const newShownOnce = [...shownOnceTooltips, tooltipId];
      setShownOnceTooltips(newShownOnce);
      localStorage.setItem("shownOnceTooltips", JSON.stringify(newShownOnce));
    }
    
    // Remove highlight
    const element = document.querySelector(tooltip?.targetSelector || "");
    if (element) {
      element.classList.remove("tooltip-highlight");
    }
    
    if (showSequentially) {
      handleNext();
    }
  };

  const handleComplete = () => {
    setVisibleTooltips([]);
    setCurrentTooltipIndex(0);
    
    // Remove all highlights
    document.querySelectorAll(".tooltip-highlight").forEach(el => {
      el.classList.remove("tooltip-highlight");
    });
    
    onComplete?.();
  };

  const handleSkip = () => {
    setVisibleTooltips([]);
    setCurrentTooltipIndex(0);
    
    // Remove all highlights
    document.querySelectorAll(".tooltip-highlight").forEach(el => {
      el.classList.remove("tooltip-highlight");
    });
    
    onSkip?.();
  };

  if (!isActive || visibleTooltips.length === 0) {
    return null;
  }

  return (
    <Portal>
      {/* Overlay for sequential mode */}
      {showSequentially && (
        <div className="fixed inset-0 bg-black bg-opacity-20 z-[9998]" />
      )}
      
      {/* Skip button for sequential mode */}
      {showSequentially && (
        <div className="fixed top-4 right-4 z-[9999]">
          <Button onClick={handleSkip} variant="outline" size="sm">
            <SkipForward className="h-4 w-4 mr-1" />
            Skip Tour
          </Button>
        </div>
      )}

      {/* Tooltip Overlays */}
      {visibleTooltips.map((tooltipId) => {
        const tooltip = tooltips.find(t => t.id === tooltipId);
        const position = elementPositions.get(tooltipId);
        
        if (!tooltip || !position) return null;
        
        return (
          <TooltipOverlay
            key={tooltipId}
            tooltip={tooltip}
            position={position}
            onDismiss={() => handleDismissTooltip(tooltipId)}
            onNext={showSequentially ? handleNext : undefined}
            onPrevious={showSequentially && currentTooltipIndex > 0 ? handlePrevious : undefined}
            currentIndex={showSequentially ? currentTooltipIndex : undefined}
            totalCount={showSequentially ? tooltips.length : undefined}
            isSequential={showSequentially}
          />
        );
      })}
      
      {/* Highlight Styles */}
      <style jsx global>{`
        .tooltip-highlight {
          position: relative;
          z-index: 9997 !important;
          box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.5), 0 0 0 8px rgba(59, 130, 246, 0.2) !important;
          border-radius: 8px !important;
          animation: pulse-highlight 2s infinite;
        }
        
        @keyframes pulse-highlight {
          0%, 100% {
            box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.5), 0 0 0 8px rgba(59, 130, 246, 0.2);
          }
          50% {
            box-shadow: 0 0 0 6px rgba(59, 130, 246, 0.7), 0 0 0 12px rgba(59, 130, 246, 0.3);
          }
        }
      `}</style>
    </Portal>
  );
};

// Predefined tooltip configurations for common dashboard elements
export const DASHBOARD_TOOLTIPS: TooltipConfig[] = [
  {
    id: "first-checkin",
    targetSelector: "[data-testid='ai-checkin']",
    title: "Daily Check-in with Luna",
    content: "Start each day by telling Luna how you slept. Your responses help improve your personalized recommendations!",
    lunaMessage: "Good morning! I'm excited to hear how you slept. Honest feedback helps me give you better advice! 😊",
    position: "auto",
    trigger: "programmatic",
    priority: 10,
    category: "action",
    dismissible: true,
    showOnce: true,
    actionButton: {
      text: "Start Check-in",
      action: () => {
        const checkinButton = document.querySelector("[data-testid='ai-checkin'] button");
        if (checkinButton) (checkinButton as HTMLElement).click();
      },
    },
  },
  {
    id: "sleep-schedule-guidance",
    targetSelector: ".bg-gradient-to-r.from-blue-300.to-blue-400",
    title: "Your Personalized Sleep Schedule",
    content: "This is your AI-generated routine! Click any activity for detailed guidance, videos, and tips.",
    lunaMessage: "Each activity is carefully chosen for you. Tap them to see my detailed guidance! 🌙",
    position: "bottom",
    trigger: "programmatic",
    priority: 9,
    category: "feature",
    dismissible: true,
    showOnce: true,
  },
  {
    id: "stats-explanation",
    targetSelector: ".grid.grid-cols-1.sm\\:grid-cols-2.lg\\:grid-cols-4.gap-4",
    title: "Your Sleep Performance Metrics",
    content: "Track your progress with real-time stats: streaks, sleep scores, and goal achievement.",
    lunaMessage: "These numbers tell your sleep story! I'll help you understand what they mean. 📊",
    position: "bottom",
    trigger: "programmatic",
    priority: 8,
    category: "insight",
    dismissible: true,
    showOnce: true,
  },
  {
    id: "navigation-tour",
    targetSelector: ".navigation-sidebar, nav",
    title: "Explore All Features",
    content: "Access breathing exercises, community support, progress tracking, and more from the navigation menu.",
    lunaMessage: "So many tools to explore! Start with breathing techniques - they're amazing for quick relaxation! 🧭",
    position: "right",
    trigger: "programmatic",
    priority: 7,
    category: "navigation",
    dismissible: true,
    showOnce: true,
  },
  {
    id: "breathing-reminder",
    targetSelector: "[data-feature='breathing-exercises']",
    title: "Try the 4-7-8 Breathing Technique",
    content: "This powerful technique can help you fall asleep in minutes. Perfect for tonight's bedtime routine!",
    lunaMessage: "This is my favorite technique! It works like magic for most people. Give it a try tonight! 🫁",
    position: "auto",
    trigger: "programmatic",
    priority: 6,
    category: "action",
    dismissible: true,
    actionButton: {
      text: "Try Now",
      action: () => {
        // Navigate to breathing page
        window.location.hash = "#breathing";
      },
    },
  },
];

export default TooltipCoachMarks;
