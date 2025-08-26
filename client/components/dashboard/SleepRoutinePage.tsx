import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useSleepData } from "@/hooks/useSleepData";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
  Moon,
  Clock,
  Edit3,
  Save,
  X,
  CheckCircle,
  AlertCircle,
  Target,
  Lightbulb,
  Bed,
  Coffee,
  Smartphone,
  Book,
  Bath,
  Music,
  Home,
  ArrowLeft,
  Calendar,
  TrendingUp,
  PlayCircle,
  BookOpen
} from "lucide-react";

interface SleepRoutinePageProps {
  onNavigate: (page: string) => void;
  onGoHome?: () => void;
}

export function SleepRoutinePage({ onNavigate, onGoHome }: SleepRoutinePageProps) {
  const { user } = useAuth();
  const { schedules, entries, getActiveSchedule, getSleepStats } = useSleepData();
  const [isEditing, setIsEditing] = useState(false);
  const [editedSchedule, setEditedSchedule] = useState<any>(null);
  const [selectedScheduleItem, setSelectedScheduleItem] = useState<any>(null);
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  
  const activeSchedule = getActiveSchedule();
  const stats = getSleepStats();

  useEffect(() => {
    if (activeSchedule) {
      setEditedSchedule(activeSchedule);
    }
  }, [activeSchedule]);

  const getActivityIcon = (activity: string) => {
    const activityLower = activity.toLowerCase();
    if (activityLower.includes("coffee") || activityLower.includes("caffeine"))
      return <Coffee className="h-5 w-5 text-blue-500" />;
    if (activityLower.includes("screen") || activityLower.includes("phone"))
      return <Smartphone className="h-5 w-5 text-blue-500" />;
    if (activityLower.includes("read") || activityLower.includes("book"))
      return <Book className="h-5 w-5 text-blue-500" />;
    if (activityLower.includes("bath") || activityLower.includes("shower"))
      return <Bath className="h-5 w-5 text-blue-500" />;
    if (activityLower.includes("music") || activityLower.includes("meditation"))
      return <Music className="h-5 w-5 text-blue-500" />;
    if (activityLower.includes("bed") || activityLower.includes("sleep"))
      return <Bed className="h-5 w-5 text-blue-500" />;
    return <Clock className="h-5 w-5 text-blue-500" />;
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "evening": return "bg-blue-100 text-blue-700 border-blue-200";
      case "night": return "bg-blue-200 text-blue-800 border-blue-300";
      case "morning": return "bg-blue-50 text-blue-600 border-blue-100";
      default: return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const getAIInsights = () => {
    if (!activeSchedule || entries.length === 0) return [];
    
    const insights = [];
    
    // Analyze sleep quality trends
    if (stats.averageSleepQuality < 7) {
      insights.push({
        type: "improvement",
        title: "Sleep Quality Opportunity",
        message: `Your average sleep quality is ${stats.averageSleepQuality.toFixed(1)}/10. Consider adjusting your bedtime routine for better rest.`,
        icon: <TrendingUp className="h-5 w-5 text-blue-500" />
      });
    }

    // Check consistency
    if (stats.streakDays < 7) {
      insights.push({
        type: "consistency",
        title: "Build Consistency",
        message: "Try to follow your sleep schedule for 7 consecutive days to build a strong routine.",
        icon: <Target className="h-5 w-5 text-blue-500" />
      });
    }

    // Bedtime suggestions based on entries
    if (entries.length >= 3) {
      insights.push({
        type: "optimization",
        title: "Bedtime Optimization",
        message: "Based on your sleep data, consider going to bed 15 minutes earlier for optimal rest.",
        icon: <Lightbulb className="h-5 w-5 text-blue-500" />
      });
    }

    return insights;
  };

  const saveScheduleChanges = () => {
    // In a real app, this would save to Firebase
    console.log("Saving schedule changes:", editedSchedule);
    setIsEditing(false);
    // Show success message
  };

  const getScheduleItemContent = (activity: string) => {
    const activityLower = activity.toLowerCase();

    if (activityLower.includes("meditation") || activityLower.includes("mindful") || activityLower.includes("relaxation")) {
      return {
        videos: [
          { id: "1vx8iUvfyCY", title: "10 Minute Meditation for Sleep" },
          { id: "aAVlU80H3Rg", title: "Bedtime Body Scan Meditation" }
        ],
        tips: [
          "Find a quiet, comfortable space",
          "Focus on your breath and body sensations",
          "Let thoughts pass without judgment",
          "Start with just 5 minutes if you're new to meditation"
        ],
        description: "Meditation helps calm your mind and prepare your body for rest by reducing stress hormones and activating the relaxation response."
      };
    } else if (activityLower.includes("breath") || activityLower.includes("4-7-8")) {
      return {
        videos: [
          { id: "YRPh_GaiL8s", title: "Dr. Andrew Weil's 4-7-8 Breathing Technique" },
          { id: "tybOi4hjZFQ", title: "4-7-8 Breathing for Better Sleep" }
        ],
        tips: [
          "Sit or lie comfortably with your back straight",
          "Exhale completely through your mouth",
          "Inhale through nose for 4 counts",
          "Hold for 7 counts, exhale through mouth for 8 counts"
        ],
        description: "The 4-7-8 breathing technique activates your parasympathetic nervous system, naturally slowing your heart rate and promoting relaxation."
      };
    } else if (activityLower.includes("shower") || activityLower.includes("bath") || activityLower.includes("prepare for bed")) {
      return {
        videos: [
          { id: "8BFcueoGGq8", title: "Perfect Evening Shower Routine" },
          { id: "E8D6_2UEAHY", title: "Relaxing Bath for Better Sleep" }
        ],
        tips: [
          "Keep water temperature warm, not hot (around 104°F)",
          "Shower 90 minutes before bedtime for optimal effect",
          "Use calming scents like lavender or chamomile",
          "Keep the bathroom lighting dim"
        ],
        description: "A warm shower or bath raises your body temperature. When you get out, your temperature drops rapidly, signaling to your brain that it's time to sleep."
      };
    } else if (activityLower.includes("reading") || activityLower.includes("book") || activityLower.includes("wind-down")) {
      return {
        videos: [
          { id: "7fm6j8J1fts", title: "How Reading Improves Sleep" },
          { id: "WJkmwjI56tY", title: "Best Books for Bedtime" }
        ],
        tips: [
          "Choose physical books over e-readers to avoid blue light",
          "Read something calming, not exciting or work-related",
          "Use soft, warm lighting",
          "Read for 15-30 minutes"
        ],
        description: "Reading helps your mind transition from the day's activities to a more relaxed state, making it easier to fall asleep."
      };
    } else if (activityLower.includes("stretch") || activityLower.includes("yoga") || activityLower.includes("exercise")) {
      return {
        videos: [
          { id: "BiWDsfZ3I2w", title: "20 Min Bedtime Yoga for Better Sleep" },
          { id: "v7AYKMP6rOE", title: "Gentle Bedtime Stretches" }
        ],
        tips: [
          "Focus on gentle, slow movements",
          "Hold each stretch for 30-60 seconds",
          "Breathe deeply during each pose",
          "Avoid intense or energizing poses"
        ],
        description: "Gentle stretching releases physical tension and helps your muscles relax, preparing your body for comfortable sleep."
      };
    } else if (activityLower.includes("tea") || activityLower.includes("drink") || activityLower.includes("herbal")) {
      return {
        videos: [
          { id: "KnAy_p8QSzs", title: "Best Herbal Teas for Sleep" },
          { id: "3yQFebRcznA", title: "Evening Tea Ritual" }
        ],
        tips: [
          "Choose caffeine-free herbal teas",
          "Chamomile, valerian, and passionflower are great options",
          "Drink 30-60 minutes before bed",
          "Create a calming ritual around tea preparation"
        ],
        description: "Herbal teas contain natural compounds that promote relaxation and can help regulate your sleep cycle."
      };
    } else if (activityLower.includes("screen") || activityLower.includes("digital") || activityLower.includes("phone") || activityLower.includes("limit screen")) {
      return {
        videos: [
          { id: "NAYT3hrIUec", title: "How Blue Light Affects Your Sleep" },
          { id: "BqUk0OybtQs", title: "Digital Sunset Routine for Better Sleep" }
        ],
        tips: [
          "Turn off all screens 1-2 hours before bed",
          "Use night mode or blue light filters if necessary",
          "Charge devices outside your bedroom",
          "Replace screen time with calming activities"
        ],
        description: "Blue light from screens suppresses melatonin production, making it harder to fall asleep. A digital sunset improves sleep quality."
      };
    } else if (activityLower.includes("environment") || activityLower.includes("room") || activityLower.includes("sleep environment")) {
      return {
        videos: [
          { id: "3tKj0mwEQ-o", title: "Perfect Sleep Environment" },
          { id: "ej_W4fPL9J8", title: "Bedroom Setup for Better Sleep" }
        ],
        tips: [
          "Keep room temperature between 65-68°F (18-20°C)",
          "Use blackout curtains or eye mask",
          "Minimize noise with earplugs or white noise",
          "Ensure your mattress and pillows are comfortable"
        ],
        description: "Your sleep environment plays a crucial role in sleep quality. A cool, dark, and quiet room promotes deeper, more restorative sleep."
      };
    }

    return {
      videos: [
        { id: "A5dE25ANU0k", title: "Sleep Hygiene: The Basics" },
        { id: "EiYm20F9WXU", title: "How to Fall Asleep Fast" }
      ],
      tips: [
        "Create a consistent bedtime routine",
        "Listen to your body's natural signals",
        "Be patient with yourself as you develop new habits",
        "Focus on progress, not perfection"
      ],
      description: "This activity is part of your personalized sleep routine designed to help you wind down and prepare for restful sleep."
    };
  };

  const handleScheduleItemClick = (item: any) => {
    setSelectedScheduleItem(item);
    setIsScheduleModalOpen(true);
  };

  const insights = getAIInsights();

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4">
        <div>
          <h1 className="text-2xl lg:text-4xl font-bold text-blue-700 mb-2 flex items-center gap-3">
            <Moon className="h-10 w-10 text-blue-600" />
            Sleep Routine Management
          </h1>
          <p className="text-blue-600 text-lg">
            Manage and optimize your personalized bedtime routine
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            onClick={() => onNavigate('dashboard')}
            variant="outline"
            className="flex items-center gap-2 border-blue-300 text-blue-700 hover:bg-blue-50"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Button>
          {onGoHome && (
            <Button
              onClick={onGoHome}
              variant="outline"
              className="flex items-center gap-2 border-blue-300 text-blue-700 hover:bg-blue-50"
            >
              <Home className="h-4 w-4" />
              Home
            </Button>
          )}
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-blue-50 border border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Bed className="h-8 w-8 text-blue-600" />
              <div>
                <p className="text-2xl font-bold text-blue-700">{schedules.length}</p>
                <p className="text-sm text-blue-600">Sleep Schedules</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-blue-50 border border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Calendar className="h-8 w-8 text-blue-600" />
              <div>
                <p className="text-2xl font-bold text-blue-700">{entries.length}</p>
                <p className="text-sm text-blue-600">Sleep Entries</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-blue-50 border border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <CheckCircle className="h-8 w-8 text-blue-600" />
              <div>
                <p className="text-2xl font-bold text-blue-700">{stats.averageSleepQuality.toFixed(1)}</p>
                <p className="text-sm text-blue-600">Avg Quality</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-blue-50 border border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Target className="h-8 w-8 text-blue-600" />
              <div>
                <p className="text-2xl font-bold text-blue-700">{stats.streakDays}</p>
                <p className="text-sm text-blue-600">Day Streak</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* AI Insights */}
      {insights.length > 0 && (
        <Card className="bg-blue-50 border border-blue-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-700">
              <Lightbulb className="h-6 w-6" />
              Luna's Insights for You
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {insights.map((insight, index) => (
                <div key={index} className="flex items-start gap-3 p-4 bg-white rounded-lg border border-blue-200">
                  {insight.icon}
                  <div>
                    <h4 className="font-semibold text-blue-800">{insight.title}</h4>
                    <p className="text-blue-700 text-sm">{insight.message}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Current Sleep Routine */}
      {activeSchedule ? (
        <Card className="bg-white border border-gray-200">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-blue-700">
                <Moon className="h-6 w-6 text-blue-600" />
                Your Active Sleep Routine
              </CardTitle>
              <div className="flex items-center gap-2">
                <Badge className="bg-blue-100 text-blue-800">Active</Badge>
                <Button
                  onClick={() => setIsEditing(!isEditing)}
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2 border-blue-300 text-blue-700 hover:bg-blue-50"
                >
                  {isEditing ? <X className="h-4 w-4" /> : <Edit3 className="h-4 w-4" />}
                  {isEditing ? 'Cancel' : 'Edit'}
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {activeSchedule.schedule.map((item: any, index: number) => (
                <div
                  key={index}
                  onClick={() => !isEditing && handleScheduleItemClick(item)}
                  className={`flex items-start gap-4 p-4 bg-blue-50 rounded-lg transition-all duration-200 ${
                    !isEditing
                      ? 'hover:bg-blue-100 hover:border-blue-300 cursor-pointer hover:shadow-md border border-blue-200 group'
                      : 'hover:bg-blue-100 border border-blue-200'
                  }`}
                >
                  <div className={`p-2 bg-white rounded-full shadow-sm ${!isEditing ? 'group-hover:bg-blue-100 transition-colors' : ''}`}>
                    {getActivityIcon(item.activity)}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      {isEditing ? (
                        <Input
                          type="time"
                          value={item.time}
                          className="w-32 border-blue-300"
                          onChange={(e) => {
                            // Update edited schedule
                            const newSchedule = { ...editedSchedule };
                            newSchedule.schedule[index].time = e.target.value;
                            setEditedSchedule(newSchedule);
                          }}
                        />
                      ) : (
                        <span className="text-xl font-bold text-blue-600">{item.time}</span>
                      )}
                      
                      <Badge className={getCategoryColor(item.category)}>
                        {item.category}
                      </Badge>
                    </div>
                    
                    <h4 className={`font-semibold text-gray-800 mb-1 ${!isEditing ? 'group-hover:text-blue-700 transition-colors' : ''}`}>
                      {item.activity}
                    </h4>
                    <p className={`text-gray-700 text-sm ${!isEditing ? 'group-hover:text-gray-800 transition-colors' : ''}`}>
                      {item.description}
                    </p>

                    {!isEditing && (
                      <div className="flex items-center gap-1 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <PlayCircle className="h-3 w-3 text-blue-600" />
                        <span className="text-xs text-blue-600 font-medium">Click for video guidance</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
              
              {isEditing && (
                <div className="flex items-center gap-2 pt-4 border-t border-blue-200">
                  <Button
                    onClick={saveScheduleChanges}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    Save Changes
                  </Button>
                  <Button
                    onClick={() => setIsEditing(false)}
                    variant="outline"
                    className="border-gray-300 text-gray-700"
                  >
                    Cancel
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="border-2 border-dashed border-blue-300 bg-blue-50">
          <CardContent className="p-12 text-center">
            <Moon className="h-16 w-16 text-blue-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-blue-600 mb-2">
              No Active Sleep Routine
            </h3>
            <p className="text-blue-500 mb-6">
              Create your first personalized sleep schedule to get started
            </p>
            <Button
              onClick={onGoHome}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              Create Sleep Schedule
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Navigation Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
        <Card className="hover:shadow-lg transition-all cursor-pointer group bg-blue-50 border border-blue-200" onClick={() => onNavigate('morning-routine')}>
          <CardContent className="p-6 text-center">
            <div className="p-3 bg-blue-200 rounded-full inline-block mb-3 group-hover:bg-blue-300 transition-colors">
              <Clock className="h-8 w-8 text-blue-600" />
            </div>
            <h3 className="font-semibold text-blue-800">Morning Routine</h3>
            <p className="text-blue-600 text-sm">Manage your wake-up activities</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-all cursor-pointer group bg-blue-50 border border-blue-200" onClick={() => onNavigate('progress-tracker')}>
          <CardContent className="p-6 text-center">
            <div className="p-3 bg-blue-200 rounded-full inline-block mb-3 group-hover:bg-blue-300 transition-colors">
              <TrendingUp className="h-8 w-8 text-blue-600" />
            </div>
            <h3 className="font-semibold text-blue-800">Progress Tracker</h3>
            <p className="text-blue-600 text-sm">View your sleep analytics</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-all cursor-pointer group bg-blue-50 border border-blue-200" onClick={() => onNavigate('sleep-log')}>
          <CardContent className="p-6 text-center">
            <div className="p-3 bg-blue-200 rounded-full inline-block mb-3 group-hover:bg-blue-300 transition-colors">
              <Calendar className="h-8 w-8 text-blue-600" />
            </div>
            <h3 className="font-semibold text-blue-800">Sleep Log</h3>
            <p className="text-blue-600 text-sm">Track your daily sleep</p>
          </CardContent>
        </Card>
      </div>

      {/* Schedule Item Modal */}
      <Dialog open={isScheduleModalOpen} onOpenChange={setIsScheduleModalOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          {selectedScheduleItem && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-3 text-2xl text-blue-700">
                  <Clock className="h-6 w-6 text-blue-600" />
                  {selectedScheduleItem.time} - {selectedScheduleItem.activity}
                  <Badge className={getCategoryColor(selectedScheduleItem.category)}>
                    {selectedScheduleItem.category}
                  </Badge>
                </DialogTitle>
              </DialogHeader>

              <div className="space-y-6">
                {/* Description */}
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <h3 className="font-semibold text-blue-800 mb-2 flex items-center gap-2">
                    <BookOpen className="h-5 w-5" />
                    Why This Helps
                  </h3>
                  <p className="text-blue-700 leading-relaxed">
                    {getScheduleItemContent(selectedScheduleItem.activity).description}
                  </p>
                  {selectedScheduleItem.description && (
                    <p className="text-blue-600 mt-2 italic">
                      "{selectedScheduleItem.description}"
                    </p>
                  )}
                </div>

                {/* YouTube Videos */}
                <div>
                  <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <PlayCircle className="h-5 w-5 text-blue-600" />
                    Guided Videos
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {getScheduleItemContent(selectedScheduleItem.activity).videos.map((video, index) => (
                      <div key={index} className="bg-white rounded-lg border border-blue-200 overflow-hidden shadow-sm">
                        <div className="aspect-video">
                          <iframe
                            width="100%"
                            height="100%"
                            src={`https://www.youtube.com/embed/${video.id}?rel=0`}
                            title={video.title}
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                            className="w-full h-full"
                          ></iframe>
                        </div>
                        <div className="p-3">
                          <h4 className="font-medium text-gray-800">{video.title}</h4>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Tips */}
                <div>
                  <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <BookOpen className="h-5 w-5 text-blue-600" />
                    Helpful Tips
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {getScheduleItemContent(selectedScheduleItem.activity).tips.map((tip, index) => (
                      <div key={index} className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                        <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                          <span className="text-white font-bold text-sm">{index + 1}</span>
                        </div>
                        <p className="text-blue-700 text-sm font-medium">{tip}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Action Button */}
                <div className="flex justify-center pt-4 border-t border-gray-200">
                  <Button
                    onClick={() => setIsScheduleModalOpen(false)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-2"
                  >
                    Got it! Close Guide
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
