import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useSleepData } from "@/hooks/useSleepData";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
  Sun,
  Clock,
  CheckCircle,
  Circle,
  Target,
  Lightbulb,
  Coffee,
  Dumbbell,
  Droplets,
  Brain,
  Activity,
  Home,
  ArrowLeft,
  Calendar,
  TrendingUp,
  Timer,
  Play,
  Pause,
  RotateCcw,
  PlayCircle,
  BookOpen,
  Sparkles,
  Heart,
  Zap
} from "lucide-react";

interface MorningTask {
  id: string;
  title: string;
  description: string;
  estimatedTime: number; // in minutes
  completed: boolean;
  icon: React.ReactNode;
  category: "hydration" | "movement" | "mindfulness" | "preparation";
}

interface MorningRoutinePageProps {
  onNavigate: (page: string) => void;
  onGoHome?: () => void;
}

export function MorningRoutinePage({ onNavigate, onGoHome }: MorningRoutinePageProps) {
  const { user } = useAuth();
  const { schedules, entries, getSleepStats } = useSleepData();
  const [todaysTasks, setTodaysTasks] = useState<MorningTask[]>([]);
  const [currentTimer, setCurrentTimer] = useState<{ taskId: string; timeLeft: number; isRunning: boolean } | null>(null);
  const [completionStats, setCompletionStats] = useState({ completed: 0, total: 0 });
  const [selectedTask, setSelectedTask] = useState<MorningTask | null>(null);
  const [isGuidanceModalOpen, setIsGuidanceModalOpen] = useState(false);

  const stats = getSleepStats();

  useEffect(() => {
    initializeTodaysTasks();
    loadCompletionStats();
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (currentTimer && currentTimer.isRunning) {
      interval = setInterval(() => {
        setCurrentTimer(prev => {
          if (!prev || prev.timeLeft <= 0) {
            // Timer completed
            handleTaskCompletion(prev?.taskId || '');
            return null;
          }
          return { ...prev, timeLeft: prev.timeLeft - 1 };
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [currentTimer]);

  const initializeTodaysTasks = () => {
    // Get user's morning routine from schedules
    const morningRoutines = JSON.parse(localStorage.getItem('userMorningRoutines') || '[]');
    
    if (morningRoutines.length > 0) {
      const activeRoutine = morningRoutines.find((r: any) => r.isActive) || morningRoutines[0];
      const tasks = activeRoutine.routine.map((item: any, index: number) => ({
        id: `task-${index}`,
        title: item.activity,
        description: item.description,
        estimatedTime: getEstimatedTime(item.activity),
        completed: false,
        icon: getActivityIcon(item.activity),
        category: getCategoryFromActivity(item.activity)
      }));
      setTodaysTasks(tasks);
    } else {
      // Default morning tasks if no routine exists
      setTodaysTasks([
        {
          id: 'hydrate',
          title: 'Morning Hydration',
          description: 'Drink 16-20oz of water to rehydrate after sleep',
          estimatedTime: 2,
          completed: false,
          icon: <Droplets className="h-5 w-5 text-blue-500" />,
          category: 'hydration'
        },
        {
          id: 'stretch',
          title: 'Morning Stretch',
          description: '5-10 minutes of gentle stretching to wake up your body',
          estimatedTime: 8,
          completed: false,
          icon: <Dumbbell className="h-5 w-5 text-blue-500" />,
          category: 'movement'
        },
        {
          id: 'mindfulness',
          title: 'Mindful Moment',
          description: '3-5 minutes of breathing or meditation',
          estimatedTime: 5,
          completed: false,
          icon: <Brain className="h-5 w-5 text-blue-500" />,
          category: 'mindfulness'
        },
        {
          id: 'coffee',
          title: 'Morning Fuel',
          description: 'Prepare and enjoy your morning beverage mindfully',
          estimatedTime: 10,
          completed: false,
          icon: <Coffee className="h-5 w-5 text-blue-500" />,
          category: 'preparation'
        }
      ]);
    }
  };

  const getActivityIcon = (activity: string) => {
    const activityLower = activity.toLowerCase();
    if (activityLower.includes("hydration") || activityLower.includes("water"))
      return <Droplets className="h-5 w-5 text-blue-500" />;
    if (activityLower.includes("coffee") || activityLower.includes("caffeine"))
      return <Coffee className="h-5 w-5 text-blue-500" />;
    if (activityLower.includes("exercise") || activityLower.includes("stretch"))
      return <Dumbbell className="h-5 w-5 text-blue-500" />;
    if (activityLower.includes("meditation") || activityLower.includes("mindful"))
      return <Brain className="h-5 w-5 text-blue-500" />;
    return <Activity className="h-5 w-5 text-blue-500" />;
  };

  const getCategoryFromActivity = (activity: string): MorningTask["category"] => {
    const activityLower = activity.toLowerCase();
    if (activityLower.includes("water") || activityLower.includes("hydrat")) return "hydration";
    if (activityLower.includes("stretch") || activityLower.includes("exercise")) return "movement";
    if (activityLower.includes("meditat") || activityLower.includes("breath")) return "mindfulness";
    return "preparation";
  };

  const getEstimatedTime = (activity: string) => {
    const activityLower = activity.toLowerCase();
    if (activityLower.includes("hydrat")) return 2;
    if (activityLower.includes("stretch")) return 8;
    if (activityLower.includes("meditat")) return 5;
    if (activityLower.includes("coffee")) return 10;
    return 5;
  };

  const getCategoryColor = (category: MorningTask["category"]) => {
    switch (category) {
      case "hydration": return "bg-blue-100 text-blue-800 border-blue-200";
      case "movement": return "bg-blue-200 text-blue-800 border-blue-300";
      case "mindfulness": return "bg-blue-150 text-blue-800 border-blue-250";
      case "preparation": return "bg-blue-50 text-blue-700 border-blue-150";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getTaskGuidance = (taskName: string) => {
    const taskLower = taskName.toLowerCase();

    if (taskLower.includes("water") || taskLower.includes("hydrat")) {
      return {
        videos: [
          { id: "dVCEdibqGxk", title: "Morning Hydration - Why It's Critical" },
          { id: "6jQ8iaP8pqI", title: "How Much Water to Drink Upon Waking" }
        ],
        stepByStep: [
          "Keep water by your bedside the night before",
          "Drink 16-20oz of room temperature water immediately upon waking",
          "Add a pinch of sea salt or lemon for enhanced absorption",
          "Wait 30-45 minutes before eating for optimal benefits"
        ],
        benefits: [
          "Kickstarts metabolism by up to 30%",
          "Flushes out toxins accumulated overnight",
          "Improves cognitive function and alertness",
          "Supports healthy digestion"
        ],
        tips: [
          "Room temperature water is easier to process",
          "Adding electrolytes enhances cellular hydration",
          "Drink before coffee to avoid dehydration",
          "Use a marked water bottle to track intake"
        ],
        science: "After 6-8 hours without water, your body is naturally dehydrated. Morning hydration restores fluid balance and kickstarts metabolism."
      };
    } else if (taskLower.includes("stretch") || taskLower.includes("movement")) {
      return {
        videos: [
          { id: "g_tea8ZNk5A", title: "5-Minute Morning Stretch Routine" },
          { id: "VYV6KC_7_0Q", title: "Morning Mobility for Better Posture" }
        ],
        stepByStep: [
          "Start with gentle neck rolls (5 each direction)",
          "Shoulder shrugs and arm circles (10 each)",
          "Cat-cow stretches (10 repetitions)",
          "Forward fold to wake up your legs"
        ],
        benefits: [
          "Increases blood flow to muscles and brain",
          "Improves posture after hours of lying down",
          "Reduces stiffness and joint pain",
          "Releases endorphins for mood boost"
        ],
        tips: [
          "Hold stretches for 30 seconds minimum",
          "Never force a stretch - it should feel good",
          "Focus on areas that feel tight",
          "Breathe deeply during each stretch"
        ],
        science: "Morning stretching increases blood circulation and activates proprioceptors that improve body awareness."
      };
    }

    return {
      videos: [{ id: "aXflBZXAucQ", title: "Morning Routine Benefits" }],
      stepByStep: ["Follow the task instructions", "Be consistent", "Track your progress"],
      benefits: ["Improved energy", "Better mood", "Enhanced productivity"],
      tips: ["Start small", "Be consistent", "Listen to your body"],
      science: "Morning routines help establish healthy circadian rhythms."
    };
  };

  const handleTaskGuidance = (task: MorningTask) => {
    setSelectedTask(task);
    setIsGuidanceModalOpen(true);
  };

  const loadCompletionStats = () => {
    const today = new Date().toISOString().split('T')[0];
    const completedTasks = JSON.parse(localStorage.getItem(`morningTasks-${today}`) || '[]');
    setCompletionStats({
      completed: completedTasks.length,
      total: todaysTasks.length || 4
    });
  };

  const toggleTaskCompletion = (taskId: string) => {
    const today = new Date().toISOString().split('T')[0];
    const completedTasks = JSON.parse(localStorage.getItem(`morningTasks-${today}`) || '[]');
    
    setTodaysTasks(prev => prev.map(task => {
      if (task.id === taskId) {
        const newCompleted = !task.completed;
        
        // Update localStorage
        if (newCompleted && !completedTasks.includes(taskId)) {
          completedTasks.push(taskId);
        } else if (!newCompleted) {
          const index = completedTasks.indexOf(taskId);
          if (index > -1) completedTasks.splice(index, 1);
        }
        localStorage.setItem(`morningTasks-${today}`, JSON.stringify(completedTasks));
        
        return { ...task, completed: newCompleted };
      }
      return task;
    }));
    
    // Update completion stats
    setCompletionStats({
      completed: completedTasks.length,
      total: todaysTasks.length
    });
  };

  const startTimer = (taskId: string, duration: number) => {
    setCurrentTimer({
      taskId,
      timeLeft: duration * 60, // Convert minutes to seconds
      isRunning: true
    });
  };

  const pauseTimer = () => {
    setCurrentTimer(prev => prev ? { ...prev, isRunning: false } : null);
  };

  const resumeTimer = () => {
    setCurrentTimer(prev => prev ? { ...prev, isRunning: true } : null);
  };

  const resetTimer = () => {
    setCurrentTimer(null);
  };

  const handleTaskCompletion = (taskId: string) => {
    toggleTaskCompletion(taskId);
    setCurrentTimer(null);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getMotivationalMessage = () => {
    const completionRate = (completionStats.completed / completionStats.total) * 100;
    if (completionRate === 100) return "🎉 Perfect morning! You've completed all your tasks!";
    if (completionRate >= 75) return "🌟 Amazing progress! You're almost done!";
    if (completionRate >= 50) return "💪 Great work! Keep the momentum going!";
    if (completionRate >= 25) return "🚀 Good start! You're building great habits!";
    return "☀️ Ready to start your morning routine? Let's go!";
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4">
        <div>
          <h1 className="text-2xl lg:text-4xl font-bold text-blue-700 mb-2 flex items-center gap-3">
            <Sun className="h-10 w-10 text-blue-600" />
            Morning Routine Hub
          </h1>
          <p className="text-blue-600 text-lg">
            Start your day with intention and energy
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

      {/* Progress Overview */}
      <Card className="bg-blue-50 border border-blue-200">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold text-blue-800">Today's Progress</h3>
            <Badge className="bg-blue-200 text-blue-800">
              {completionStats.completed}/{completionStats.total} tasks
            </Badge>
          </div>
          
          <Progress 
            value={(completionStats.completed / completionStats.total) * 100} 
            className="h-3 mb-4" 
          />
          
          <p className="text-blue-700 font-medium">{getMotivationalMessage()}</p>
        </CardContent>
      </Card>

      {/* Active Timer */}
      {currentTimer && (
        <Card className="border border-blue-300 bg-blue-50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Timer className="h-6 w-6 text-blue-600" />
                <div>
                  <h3 className="font-semibold text-blue-800">
                    {todaysTasks.find(t => t.id === currentTimer.taskId)?.title || "Task Timer"}
                  </h3>
                  <p className="text-blue-700 text-sm">Time remaining</p>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="text-3xl font-bold text-blue-700">
                  {formatTime(currentTimer.timeLeft)}
                </div>
                
                <div className="flex items-center gap-2">
                  {currentTimer.isRunning ? (
                    <Button onClick={pauseTimer} size="sm" variant="outline" className="border-blue-300 text-blue-700">
                      <Pause className="h-4 w-4" />
                    </Button>
                  ) : (
                    <Button onClick={resumeTimer} size="sm" className="bg-blue-600 hover:bg-blue-700">
                      <Play className="h-4 w-4" />
                    </Button>
                  )}
                  
                  <Button onClick={resetTimer} size="sm" variant="outline" className="border-blue-300 text-blue-700">
                    <RotateCcw className="h-4 w-4" />
                  </Button>
                  
                  <Button 
                    onClick={() => handleTaskCompletion(currentTimer.taskId)}
                    size="sm"
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    <CheckCircle className="h-4 w-4 mr-1" />
                    Complete
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Morning Tasks */}
      <Card className="bg-white border border-blue-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-800">
            <CheckCircle className="h-6 w-6 text-blue-600" />
            Your Morning Tasks
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {todaysTasks.map((task) => (
              <div 
                key={task.id} 
                className={`flex items-center gap-4 p-4 rounded-lg border transition-all ${
                  task.completed 
                    ? 'bg-blue-100 border-blue-300' 
                    : 'bg-blue-50 border-blue-200 hover:border-blue-400'
                }`}
              >
                <Checkbox
                  checked={task.completed}
                  onCheckedChange={() => toggleTaskCompletion(task.id)}
                />
                
                <div className="p-2 bg-white rounded-full shadow-sm">
                  {task.icon}
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <h4 className={`font-semibold ${task.completed ? 'line-through text-blue-500' : 'text-blue-800'}`}>
                      {task.title}
                    </h4>
                    <Badge className={getCategoryColor(task.category)}>
                      {task.category}
                    </Badge>
                    <span className="text-sm text-blue-600">{task.estimatedTime} min</span>
                  </div>
                  <p className={`text-sm ${task.completed ? 'text-blue-400' : 'text-blue-700'}`}>
                    {task.description}
                  </p>
                </div>
                
                <div className="flex items-center gap-2">
                  <Button
                    onClick={() => handleTaskGuidance(task)}
                    size="sm"
                    variant="outline"
                    className="border-blue-200 text-blue-700 hover:bg-blue-50"
                  >
                    <BookOpen className="h-4 w-4 mr-1" />
                    Guide
                  </Button>
                  {!task.completed && (
                    <Button
                      onClick={() => startTimer(task.id, task.estimatedTime)}
                      size="sm"
                      variant="outline"
                      className="flex items-center gap-2 border-blue-300 text-blue-700 hover:bg-blue-50"
                      disabled={currentTimer !== null}
                    >
                      <Timer className="h-4 w-4" />
                      Start
                    </Button>
                  )}
                </div>
                
                {task.completed && (
                  <CheckCircle className="h-6 w-6 text-blue-600" />
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Navigation Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
        <Card className="hover:shadow-lg transition-all cursor-pointer group bg-blue-50 border border-blue-200" onClick={() => onNavigate('sleep-routine')}>
          <CardContent className="p-6 text-center">
            <div className="p-3 bg-blue-200 rounded-full inline-block mb-3 group-hover:bg-blue-300 transition-colors">
              <Clock className="h-8 w-8 text-blue-600" />
            </div>
            <h3 className="font-semibold text-blue-800">Sleep Routine</h3>
            <p className="text-blue-600 text-sm">Manage your bedtime schedule</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-all cursor-pointer group bg-blue-50 border border-blue-200" onClick={() => onNavigate('progress-tracker')}>
          <CardContent className="p-6 text-center">
            <div className="p-3 bg-blue-200 rounded-full inline-block mb-3 group-hover:bg-blue-300 transition-colors">
              <TrendingUp className="h-8 w-8 text-blue-600" />
            </div>
            <h3 className="font-semibold text-blue-800">Progress Tracker</h3>
            <p className="text-blue-600 text-sm">View your progress and goals</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-all cursor-pointer group bg-blue-50 border border-blue-200" onClick={() => onNavigate('rewards')}>
          <CardContent className="p-6 text-center">
            <div className="p-3 bg-blue-200 rounded-full inline-block mb-3 group-hover:bg-blue-300 transition-colors">
              <Target className="h-8 w-8 text-blue-600" />
            </div>
            <h3 className="font-semibold text-blue-800">Rewards</h3>
            <p className="text-blue-600 text-sm">Earn points and achievements</p>
          </CardContent>
        </Card>
      </div>

      {/* Comprehensive Task Guidance Modal */}
      <Dialog open={isGuidanceModalOpen} onOpenChange={setIsGuidanceModalOpen}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          {selectedTask && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-3 text-2xl text-blue-700">
                  <div className="p-2 bg-blue-500 rounded-full">
                    <div className="text-white">{selectedTask.icon}</div>
                  </div>
                  {selectedTask.title} - Complete Guide
                  <Badge className="bg-blue-100 text-blue-800">
                    {selectedTask.estimatedTime} min
                  </Badge>
                </DialogTitle>
              </DialogHeader>

              <div className="space-y-8">
                {/* Quick Overview */}
                <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
                  <h3 className="font-bold text-xl text-blue-800 mb-3 flex items-center gap-2">
                    <Sparkles className="h-6 w-6" />
                    Why This Morning Task Matters
                  </h3>
                  <p className="text-blue-700 text-lg leading-relaxed">
                    {selectedTask.description}
                  </p>
                </div>

                {/* Video Guides */}
                <div>
                  <h3 className="font-bold text-xl text-gray-800 mb-4 flex items-center gap-2">
                    <PlayCircle className="h-6 w-6 text-blue-600" />
                    Expert Video Guides
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {getTaskGuidance(selectedTask.title).videos.map((video, index) => (
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
                          <h4 className="font-medium text-gray-800 text-sm">{video.title}</h4>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Step-by-Step Instructions */}
                <div>
                  <h3 className="font-bold text-xl text-gray-800 mb-4 flex items-center gap-2">
                    <Target className="h-6 w-6 text-blue-600" />
                    Step-by-Step Instructions
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {getTaskGuidance(selectedTask.title).stepByStep.map((step, index) => (
                      <div key={index} className="flex items-start gap-3 p-4 bg-blue-50 rounded-lg border border-blue-200">
                        <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-white font-bold text-sm">{index + 1}</span>
                        </div>
                        <p className="text-blue-800 font-medium">{step}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Benefits & Tips */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-bold text-xl text-gray-800 mb-4 flex items-center gap-2">
                      <Heart className="h-6 w-6 text-blue-600" />
                      Health Benefits
                    </h3>
                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 mb-4">
                      <p className="text-blue-800 text-sm leading-relaxed">
                        {getTaskGuidance(selectedTask.title).science}
                      </p>
                    </div>
                    <div className="space-y-2">
                      {getTaskGuidance(selectedTask.title).benefits.map((benefit, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-blue-600" />
                          <span className="text-blue-800 text-sm font-medium">{benefit}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="font-bold text-xl text-gray-800 mb-4 flex items-center gap-2">
                      <Zap className="h-6 w-6 text-blue-600" />
                      Pro Tips for Success
                    </h3>
                    <div className="space-y-3">
                      {getTaskGuidance(selectedTask.title).tips.map((tip, index) => (
                        <div key={index} className="flex items-start gap-2 p-3 bg-blue-50 rounded-lg border border-blue-200">
                          <Lightbulb className="h-4 w-4 text-blue-600 mt-0.5" />
                          <span className="text-blue-800 text-sm font-medium">{tip}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-center gap-4 pt-6 border-t border-gray-200">
                  <Button
                    onClick={() => {
                      setIsGuidanceModalOpen(false);
                      startTimer(selectedTask.id, selectedTask.estimatedTime);
                    }}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-2"
                  >
                    <Play className="h-4 w-4 mr-2" />
                    Start Task Now
                  </Button>
                  <Button
                    onClick={() => setIsGuidanceModalOpen(false)}
                    variant="outline"
                    className="px-8 py-2 border-gray-300 text-gray-700"
                  >
                    Close Guide
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
