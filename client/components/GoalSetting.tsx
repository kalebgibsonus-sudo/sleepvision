import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/contexts/AuthContext";
import { 
  Target, 
  Calendar, 
  Clock, 
  Flame,
  CheckCircle,
  AlertCircle,
  Moon,
  Sun,
  Plus,
  Edit,
  Trash2
} from "lucide-react";

interface Goal {
  id: string;
  type: "bedtime" | "wake-time" | "custom";
  title: string;
  description: string;
  targetValue: string; // Time in HH:MM format for time goals
  currentValue?: string;
  deadline: string; // Date in YYYY-MM-DD format
  createdAt: string;
  isCompleted: boolean;
  streak: number;
  lastUpdated: string;
}

interface GoalSettingProps {
  onGoalUpdate?: (goals: Goal[]) => void;
}

export function GoalSetting({ onGoalUpdate }: GoalSettingProps) {
  const { user } = useAuth();
  const [goals, setGoals] = useState<Goal[]>([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null);
  
  const [newGoal, setNewGoal] = useState({
    type: "bedtime" as Goal["type"],
    title: "",
    description: "",
    targetValue: "",
    deadline: ""
  });

  useEffect(() => {
    loadGoals();
  }, []);

  useEffect(() => {
    // Check daily progress
    checkDailyProgress();
  }, [goals]);

  const loadGoals = () => {
    const storedGoals = JSON.parse(localStorage.getItem('userGoals') || '[]');
    setGoals(storedGoals);
  };

  const saveGoals = (updatedGoals: Goal[]) => {
    setGoals(updatedGoals);
    localStorage.setItem('userGoals', JSON.stringify(updatedGoals));
    onGoalUpdate?.(updatedGoals);
  };

  const createGoal = () => {
    if (!newGoal.title || !newGoal.targetValue || !newGoal.deadline) return;

    const goal: Goal = {
      id: `goal-${Date.now()}`,
      type: newGoal.type,
      title: newGoal.title,
      description: newGoal.description,
      targetValue: newGoal.targetValue,
      deadline: newGoal.deadline,
      createdAt: new Date().toISOString(),
      isCompleted: false,
      streak: 0,
      lastUpdated: new Date().toISOString()
    };

    const updatedGoals = [...goals, goal];
    saveGoals(updatedGoals);
    
    // Reset form
    setNewGoal({
      type: "bedtime",
      title: "",
      description: "",
      targetValue: "",
      deadline: ""
    });
    setShowCreateForm(false);
  };

  const updateGoalProgress = (goalId: string, achieved: boolean) => {
    const today = new Date().toISOString().split('T')[0];
    
    const updatedGoals = goals.map(goal => {
      if (goal.id === goalId) {
        const lastUpdateDate = goal.lastUpdated.split('T')[0];
        const isNewDay = lastUpdateDate !== today;
        
        return {
          ...goal,
          streak: achieved ? (isNewDay ? goal.streak + 1 : goal.streak) : 0,
          lastUpdated: new Date().toISOString()
        };
      }
      return goal;
    });
    
    saveGoals(updatedGoals);
  };

  const deleteGoal = (goalId: string) => {
    const updatedGoals = goals.filter(goal => goal.id !== goalId);
    saveGoals(updatedGoals);
  };

  const checkDailyProgress = () => {
    // This would typically integrate with actual user data
    // For now, we'll simulate checking against user's schedule
    goals.forEach(goal => {
      if (goal.type === "bedtime" || goal.type === "wake-time") {
        // Check if user met their goal based on their schedule
        // This would integrate with actual sleep tracking data
      }
    });
  };

  const getDaysUntilDeadline = (deadline: string) => {
    const today = new Date();
    const deadlineDate = new Date(deadline);
    const diffTime = deadlineDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getDeadlineStatus = (deadline: string) => {
    const daysLeft = getDaysUntilDeadline(deadline);
    if (daysLeft < 0) return { status: "overdue", color: "text-red-600", bg: "bg-red-50" };
    if (daysLeft <= 3) return { status: "urgent", color: "text-orange-600", bg: "bg-orange-50" };
    if (daysLeft <= 7) return { status: "soon", color: "text-yellow-600", bg: "bg-yellow-50" };
    return { status: "upcoming", color: "text-green-600", bg: "bg-green-50" };
  };

  const getGoalIcon = (type: Goal["type"]) => {
    switch (type) {
      case "bedtime": return <Moon className="h-5 w-5 text-blue-500" />;
      case "wake-time": return <Sun className="h-5 w-5 text-orange-500" />;
      default: return <Target className="h-5 w-5 text-purple-500" />;
    }
  };

  const getPresetGoals = () => {
    return [
      {
        type: "bedtime" as const,
        title: "Consistent Bedtime",
        description: "Go to bed at the same time every night",
        placeholder: "22:00"
      },
      {
        type: "wake-time" as const,
        title: "Early Wake-up",
        description: "Wake up at your target time consistently",
        placeholder: "06:30"
      },
      {
        type: "custom" as const,
        title: "Custom Sleep Goal",
        description: "Create your own sleep-related goal",
        placeholder: "e.g., 8 hours of sleep"
      }
    ];
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Target className="h-7 w-7 text-purple-600" />
            Sleep Goals & Deadlines
          </h2>
          <p className="text-gray-600">Set specific, time-bound goals to improve your sleep routine</p>
        </div>
        
        <Button
          onClick={() => setShowCreateForm(true)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white"
        >
          <Plus className="h-4 w-4 mr-2" />
          New Goal
        </Button>
      </div>

      {/* Create Goal Form */}
      {showCreateForm && (
        <Card className="border border-indigo-200 bg-white shadow-lg">
          <CardHeader>
            <CardTitle className="text-lg text-gray-900">Create New Goal</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-3 gap-4">
              {getPresetGoals().map((preset) => (
                <Card 
                  key={preset.type}
                  className={`cursor-pointer transition-all hover:shadow-md ${
                    newGoal.type === preset.type ? 'border-indigo-500 bg-indigo-100' : 'border-gray-200'
                  }`}
                  onClick={() => setNewGoal(prev => ({ 
                    ...prev, 
                    type: preset.type,
                    title: preset.title,
                    description: preset.description 
                  }))}
                >
                  <CardContent className="p-4 text-center">
                    {getGoalIcon(preset.type)}
                    <h3 className="font-semibold mt-2">{preset.title}</h3>
                    <p className="text-sm text-gray-600">{preset.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="title">Goal Title</Label>
                <Input
                  id="title"
                  value={newGoal.title}
                  onChange={(e) => setNewGoal(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Enter your goal title"
                />
              </div>
              
              <div>
                <Label htmlFor="target">Target Value</Label>
                <Input
                  id="target"
                  type={newGoal.type === "custom" ? "text" : "time"}
                  value={newGoal.targetValue}
                  onChange={(e) => setNewGoal(prev => ({ ...prev, targetValue: e.target.value }))}
                  placeholder={newGoal.type === "custom" ? "Describe your target" : "HH:MM"}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="description">Description (Optional)</Label>
              <Input
                id="description"
                value={newGoal.description}
                onChange={(e) => setNewGoal(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Add more details about your goal"
              />
            </div>

            <div>
              <Label htmlFor="deadline">Deadline</Label>
              <Input
                id="deadline"
                type="date"
                value={newGoal.deadline}
                onChange={(e) => setNewGoal(prev => ({ ...prev, deadline: e.target.value }))}
                min={new Date().toISOString().split('T')[0]}
              />
            </div>

            <div className="flex gap-2">
              <Button onClick={createGoal} className="bg-indigo-600 hover:bg-indigo-700">
                Create Goal
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setShowCreateForm(false)}
              >
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Goals List */}
      <div className="grid gap-4">
        {goals.length === 0 ? (
          <Card className="border-2 border-dashed border-gray-300">
            <CardContent className="p-8 text-center">
              <Target className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-600 mb-2">No Goals Set Yet</h3>
              <p className="text-gray-500 mb-4">
                Start by creating your first sleep goal with a specific deadline
              </p>
              <Button
                onClick={() => setShowCreateForm(true)}
                className="bg-indigo-600 hover:bg-indigo-700"
              >
                Create Your First Goal
              </Button>
            </CardContent>
          </Card>
        ) : (
          goals.map((goal) => {
            const deadlineStatus = getDeadlineStatus(goal.deadline);
            const daysLeft = getDaysUntilDeadline(goal.deadline);
            
            return (
              <Card key={goal.id} className={`border ${deadlineStatus.bg}`}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3 flex-1">
                      <div className="p-2 bg-white rounded-full shadow-sm">
                        {getGoalIcon(goal.type)}
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-gray-900">{goal.title}</h3>
                          {goal.streak > 0 && (
                            <Badge className="bg-orange-100 text-orange-800">
                              <Flame className="h-3 w-3 mr-1" />
                              {goal.streak} day streak
                            </Badge>
                          )}
                        </div>
                        
                        {goal.description && (
                          <p className="text-gray-600 text-sm mb-2">{goal.description}</p>
                        )}
                        
                        <div className="flex items-center gap-4 text-sm">
                          <div className="flex items-center gap-1">
                            <Target className="h-4 w-4 text-gray-500" />
                            <span className="text-gray-700">Target: {goal.targetValue}</span>
                          </div>
                          
                          <div className={`flex items-center gap-1 ${deadlineStatus.color}`}>
                            <Calendar className="h-4 w-4" />
                            <span>
                              {daysLeft < 0 
                                ? `${Math.abs(daysLeft)} days overdue`
                                : daysLeft === 0 
                                ? "Due today"
                                : `${daysLeft} days left`
                              }
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => updateGoalProgress(goal.id, true)}
                        className="text-green-600 border-green-200 hover:bg-green-50"
                      >
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Achieved Today
                      </Button>
                      
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => deleteGoal(goal.id)}
                        className="text-red-500 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  
                  {/* Progress towards deadline */}
                  <div className="mt-4">
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span className="text-gray-600">Progress to deadline</span>
                      <span className={deadlineStatus.color}>
                        {daysLeft < 0 ? "Overdue" : `${daysLeft} days remaining`}
                      </span>
                    </div>
                    <Progress 
                      value={daysLeft < 0 ? 100 : Math.max(0, 100 - (daysLeft / 30) * 100)} 
                      className="h-2"
                    />
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>

      {/* Daily Reminder Summary */}
      {goals.length > 0 && (
        <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <AlertCircle className="h-5 w-5 text-blue-600" />
              <div>
                <h3 className="font-semibold text-blue-900">Today's Goal Reminders</h3>
                <p className="text-sm text-blue-700">
                  You have {goals.length} active goal{goals.length !== 1 ? 's' : ''} to work on today. 
                  Stay consistent to build your streaks! 🔥
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
