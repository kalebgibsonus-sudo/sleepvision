import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Slider } from "@/components/ui/slider";
import {
  Bot,
  Brain,
  Heart,
  Smile,
  Meh,
  Frown,
  MessageSquare,
  Send,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Eye,
  TrendingUp,
  TrendingDown,
  BarChart3,
  Activity,
  Zap,
  Target,
  Clock,
  Calendar,
  Star,
  Award,
  Lightbulb,
  AlertCircle,
  CheckCircle,
  RefreshCw,
  Settings,
  User,
  Moon,
  Sun,
  Coffee,
  Bed,
  Utensils,
  Dumbbell,
  Book,
  Music,
  Camera,
  Video,
  FileText,
  PieChart,
  LineChart,
  BarChart,
  Thermometer,
  Gauge,
  Sparkles,
  Wand2,
} from "lucide-react";

interface Message {
  id: string;
  sender: "user" | "ai";
  content: string;
  timestamp: Date;
  type: "text" | "mood" | "insight" | "suggestion" | "analysis";
  metadata?: {
    moodScore?: number;
    emotions?: string[];
    insights?: string[];
    recommendations?: string[];
  };
}

interface MoodData {
  overall: number;
  energy: number;
  stress: number;
  motivation: number;
  focus: number;
  satisfaction: number;
  anxiety: number;
  optimism: number;
}

interface AIPersonality {
  name: string;
  avatar: string;
  style:
    | "supportive"
    | "analytical"
    | "motivational"
    | "casual"
    | "professional";
  specialization: string[];
}

interface InsightData {
  patterns: {
    bestPerformanceTime: string;
    commonStressors: string[];
    successFactors: string[];
    improvementAreas: string[];
  };
  trends: {
    moodTrend: "improving" | "declining" | "stable";
    sleepQuality: number;
    productivityScore: number;
    streakMaintenance: number;
  };
  predictions: {
    tomorrowMood: number;
    weeklyGoalSuccess: number;
    burnoutRisk: number;
  };
}

export function SmartAICheckIn() {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentMessage, setCurrentMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [currentMood, setCurrentMood] = useState<MoodData>({
    overall: 7,
    energy: 6,
    stress: 4,
    motivation: 8,
    focus: 7,
    satisfaction: 6,
    anxiety: 3,
    optimism: 8,
  });
  const [aiPersonality, setAiPersonality] = useState<AIPersonality>({
    name: "Luna",
    avatar: "🤖",
    style: "supportive",
    specialization: ["sleep", "wellness", "motivation"],
  });
  const [insights, setInsights] = useState<InsightData>({
    patterns: {
      bestPerformanceTime: "09:00 AM",
      commonStressors: ["Work deadlines", "Poor sleep", "Social media"],
      successFactors: ["Consistent routine", "Exercise", "Meditation"],
      improvementAreas: ["Evening routine", "Stress management", "Focus time"],
    },
    trends: {
      moodTrend: "improving",
      sleepQuality: 78,
      productivityScore: 85,
      streakMaintenance: 92,
    },
    predictions: {
      tomorrowMood: 8.2,
      weeklyGoalSuccess: 87,
      burnoutRisk: 15,
    },
  });
  const [activeFeatures, setActiveFeatures] = useState({
    voiceInput: false,
    emotionDetection: true,
    smartSuggestions: true,
    proactiveInsights: true,
    moodTracking: true,
  });
  const [sessionStats, setSessionStats] = useState({
    totalSessions: 47,
    averageMood: 7.2,
    longestStreak: 12,
    improvementScore: 78,
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Initialize conversation
  useEffect(() => {
    const initMessage: Message = {
      id: "1",
      sender: "ai",
      content: `Hello ${user?.name}! I'm Luna, your AI wellness companion. I'm here to help you track your mood, provide insights, and support your journey. How are you feeling today?`,
      timestamp: new Date(),
      type: "text",
    };
    setMessages([initMessage]);
  }, [user]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Simulate AI typing and responses
  const generateAIResponse = async (
    userMessage: string,
    moodData?: MoodData,
  ) => {
    setIsTyping(true);

    // Simulate thinking time
    await new Promise((resolve) =>
      setTimeout(resolve, 1500 + Math.random() * 1000),
    );

    let response = "";
    let type: Message["type"] = "text";
    let metadata = {};

    // Analyze user input and generate contextual response
    const lowerMessage = userMessage.toLowerCase();

    if (lowerMessage.includes("tired") || lowerMessage.includes("exhausted")) {
      response =
        "I notice you're feeling tired. Based on your patterns, your energy tends to be highest around 9 AM. Have you been maintaining your sleep schedule? Let's explore some gentle energy-boosting techniques.";
      type = "insight";
      metadata = {
        insights: ["Energy patterns identified", "Sleep schedule correlation"],
        recommendations: [
          "Review sleep routine",
          "Try 5-minute energizing breathing",
          "Consider a 10-minute walk",
        ],
      };
    } else if (
      lowerMessage.includes("stressed") ||
      lowerMessage.includes("anxious")
    ) {
      response =
        "I can sense the stress in your message. You've successfully managed stress before using breathing exercises and brief meditation. Would you like me to guide you through a quick stress-relief technique?";
      type = "suggestion";
      metadata = {
        insights: [
          "Stress detection activated",
          "Previous coping strategies noted",
        ],
        recommendations: [
          "4-7-8 breathing technique",
          "5-minute mindfulness",
          "Progressive muscle relaxation",
        ],
      };
    } else if (
      lowerMessage.includes("great") ||
      lowerMessage.includes("amazing") ||
      lowerMessage.includes("excellent")
    ) {
      response =
        "That's wonderful to hear! Your positive energy is contagious. These peak moments often correlate with your consistent routines. What do you think contributed most to this great feeling today?";
      type = "analysis";
      metadata = {
        emotions: ["joy", "satisfaction", "energy"],
        insights: [
          "Peak performance state detected",
          "Routine correlation analysis",
        ],
      };
    } else if (
      lowerMessage.includes("sleep") ||
      lowerMessage.includes("dream")
    ) {
      response =
        "Sleep is such a crucial part of your wellness journey! Your sleep quality has improved by 23% over the past month. I'd love to help optimize your sleep even further. What aspect of your sleep would you like to focus on?";
      type = "insight";
      metadata = {
        insights: [
          "Sleep quality improvement trend",
          "Monthly progress tracking",
        ],
        recommendations: [
          "Optimize bedtime routine",
          "Track sleep patterns",
          "Environment adjustments",
        ],
      };
    } else {
      // General supportive response
      const responses = [
        "Thank you for sharing that with me. I'm analyzing your emotional patterns and I see some interesting trends. Your resilience has been steadily improving!",
        "I appreciate your openness. Based on our previous conversations, you respond well to structured approaches. Would you like me to suggest a personalized action plan?",
        "Your self-awareness is impressive. I've noticed you're most successful when you break challenges into smaller steps. How can we apply that here?",
        "I'm here to support you through this. Your data shows you're particularly good at bouncing back from challenges. What's worked for you before?",
      ];
      response = responses[Math.floor(Math.random() * responses.length)];
      type = "text";
    }

    // If mood data is provided, add mood-specific insights
    if (moodData) {
      const moodInsights = generateMoodInsights(moodData);
      response += `\n\n${moodInsights}`;
      type = "mood";
      metadata = { ...metadata, moodScore: moodData.overall };
    }

    const aiMessage: Message = {
      id: Date.now().toString(),
      sender: "ai",
      content: response,
      timestamp: new Date(),
      type,
      metadata,
    };

    setMessages((prev) => [...prev, aiMessage]);
    setIsTyping(false);
  };

  const generateMoodInsights = (mood: MoodData) => {
    const insights = [];

    if (mood.energy < 5) {
      insights.push(
        "��� Your energy levels seem low. Consider a brief walk or some deep breathing.",
      );
    }
    if (mood.stress > 6) {
      insights.push(
        "🧘 I notice elevated stress. Your best stress-relief sessions happen around 2 PM.",
      );
    }
    if (mood.overall > 7) {
      insights.push(
        "✨ You're in a great headspace! This is an optimal time for challenging tasks.",
      );
    }
    if (mood.motivation > 7 && mood.focus > 6) {
      insights.push(
        "🎯 High motivation + focus detected! Perfect time for your priority goals.",
      );
    }

    return insights.length > 0
      ? insights.join(" ")
      : "Your emotional balance looks healthy today. Keep up the great work!";
  };

  const handleSendMessage = async () => {
    if (!currentMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      sender: "user",
      content: currentMessage,
      timestamp: new Date(),
      type: "text",
    };

    setMessages((prev) => [...prev, userMessage]);
    setCurrentMessage("");

    // Generate AI response
    await generateAIResponse(currentMessage);
  };

  const handleMoodSubmit = async () => {
    const moodMessage: Message = {
      id: Date.now().toString(),
      sender: "user",
      content: `Mood Check-in: Overall ${currentMood.overall}/10, Energy ${currentMood.energy}/10, Stress ${currentMood.stress}/10`,
      timestamp: new Date(),
      type: "mood",
      metadata: { moodScore: currentMood.overall },
    };

    setMessages((prev) => [...prev, moodMessage]);
    await generateAIResponse("", currentMood);
  };

  const handleVoiceToggle = () => {
    setIsListening(!isListening);
    // Simulate voice recognition
    if (!isListening) {
      setTimeout(() => {
        setCurrentMessage(
          "I'm feeling pretty good today, just a bit tired from work",
        );
        setIsListening(false);
      }, 3000);
    }
  };

  const getMoodColor = (value: number) => {
    if (value >= 8) return "text-green-500";
    if (value >= 6) return "text-yellow-500";
    if (value >= 4) return "text-orange-500";
    return "text-red-500";
  };

  const getMoodEmoji = (value: number) => {
    if (value >= 8) return "😊";
    if (value >= 6) return "🙂";
    if (value >= 4) return "😐";
    return "😟";
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto p-6">
      {/* AI Header */}
      <Card className="border-2 border-purple-200 shadow-lg bg-gradient-to-r from-white to-purple-50">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="text-3xl">🤖</div>
              <div>
                <CardTitle className="text-purple-700">
                  Luna AI Check-in
                </CardTitle>
                <p className="text-sm text-purple-600">
                  Your intelligent wellness companion
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge
                variant="outline"
                className="border-green-300 text-green-600"
              >
                <div className="w-2 h-2 bg-green-500 rounded-full mr-1 animate-pulse" />
                Online
              </Badge>
              <Button
                variant="outline"
                size="sm"
                className="border-purple-300 text-purple-700"
              >
                <Settings className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-3 bg-white/80 rounded-lg">
              <MessageSquare className="h-5 w-5 text-purple-500 mx-auto mb-1" />
              <div className="text-lg font-bold text-purple-700">
                {sessionStats.totalSessions}
              </div>
              <div className="text-xs text-purple-600">Check-ins</div>
            </div>
            <div className="text-center p-3 bg-white/80 rounded-lg">
              <Heart className="h-5 w-5 text-red-500 mx-auto mb-1" />
              <div className="text-lg font-bold text-red-600">
                {sessionStats.averageMood.toFixed(1)}
              </div>
              <div className="text-xs text-red-500">Avg Mood</div>
            </div>
            <div className="text-center p-3 bg-white/80 rounded-lg">
              <TrendingUp className="h-5 w-5 text-green-500 mx-auto mb-1" />
              <div className="text-lg font-bold text-green-600">
                {sessionStats.longestStreak}
              </div>
              <div className="text-xs text-green-500">Best Streak</div>
            </div>
            <div className="text-center p-3 bg-white/80 rounded-lg">
              <Star className="h-5 w-5 text-yellow-500 mx-auto mb-1" />
              <div className="text-lg font-bold text-yellow-600">
                {sessionStats.improvementScore}%
              </div>
              <div className="text-xs text-yellow-500">Progress</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chat Interface */}
        <div className="lg:col-span-2">
          <Card className="border-2 border-blue-200 shadow-lg h-[600px] flex flex-col">
            <CardHeader className="border-b">
              <CardTitle className="flex items-center gap-2 text-blue-700">
                <Bot className="h-6 w-6" />
                Conversation
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 p-6 overflow-y-auto">
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[80%] p-3 rounded-lg ${
                        message.sender === "user"
                          ? "bg-blue-500 text-white"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      <div className="font-medium text-sm mb-1">
                        {message.sender === "user" ? "You" : "Luna"}
                      </div>
                      <div className="text-sm">{message.content}</div>
                      <div className="text-xs opacity-70 mt-1">
                        {message.timestamp.toLocaleTimeString()}
                      </div>

                      {message.metadata?.recommendations && (
                        <div className="mt-2 space-y-1">
                          <div className="text-xs font-medium">
                            Recommendations:
                          </div>
                          {message.metadata.recommendations.map((rec, i) => (
                            <div
                              key={i}
                              className="text-xs bg-white/20 rounded px-2 py-1"
                            >
                              💡 {rec}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}

                {isTyping && (
                  <div className="flex justify-start">
                    <div className="bg-gray-100 text-gray-800 p-3 rounded-lg">
                      <div className="flex items-center gap-2">
                        <Brain className="h-4 w-4 animate-pulse" />
                        <span className="text-sm">Luna is thinking...</span>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </CardContent>

            {/* Input Area */}
            <div className="border-t p-4 space-y-3">
              <div className="flex gap-2">
                <Input
                  ref={inputRef}
                  value={currentMessage}
                  onChange={(e) => setCurrentMessage(e.target.value)}
                  placeholder="Share how you're feeling or ask Luna anything..."
                  className="flex-1"
                  onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                />
                <Button
                  onClick={handleVoiceToggle}
                  variant="outline"
                  className={isListening ? "bg-red-100 border-red-300" : ""}
                >
                  {isListening ? (
                    <MicOff className="h-4 w-4" />
                  ) : (
                    <Mic className="h-4 w-4" />
                  )}
                </Button>
                <Button
                  onClick={handleSendMessage}
                  disabled={!currentMessage.trim()}
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>

              {isListening && (
                <div className="text-center">
                  <div className="inline-flex items-center gap-2 text-red-600">
                    <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                    <span className="text-sm">Listening...</span>
                  </div>
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* Mood Tracking Panel */}
        <div className="space-y-6">
          {/* Quick Mood */}
          <Card className="border-2 border-green-200 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-700">
                <Heart className="h-6 w-6" />
                Mood Tracker
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {Object.entries(currentMood).map(([key, value]) => (
                <div key={key} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm capitalize font-medium">
                      {key}
                    </span>
                    <span
                      className={`text-lg font-bold ${getMoodColor(value)}`}
                    >
                      {value}/10 {getMoodEmoji(value)}
                    </span>
                  </div>
                  <Slider
                    value={[value]}
                    onValueChange={(val) =>
                      setCurrentMood((prev) => ({ ...prev, [key]: val[0] }))
                    }
                    max={10}
                    min={1}
                    step={1}
                    className="w-full"
                  />
                </div>
              ))}

              <Button
                onClick={handleMoodSubmit}
                className="w-full bg-green-600 hover:bg-green-700"
              >
                <Heart className="h-4 w-4 mr-2" />
                Submit Mood Check-in
              </Button>
            </CardContent>
          </Card>

          {/* AI Insights */}
          <Card className="border-2 border-yellow-200 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-yellow-700">
                <Lightbulb className="h-6 w-6" />
                AI Insights
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="bg-yellow-50 p-3 rounded-lg">
                  <div className="font-medium text-sm text-yellow-800">
                    Trend Analysis
                  </div>
                  <div className="text-xs text-yellow-700">
                    Your mood is {insights.trends.moodTrend}. Sleep quality at{" "}
                    {insights.trends.sleepQuality}%.
                  </div>
                </div>

                <div className="bg-blue-50 p-3 rounded-lg">
                  <div className="font-medium text-sm text-blue-800">
                    Best Performance
                  </div>
                  <div className="text-xs text-blue-700">
                    You typically perform best at{" "}
                    {insights.patterns.bestPerformanceTime}
                  </div>
                </div>

                <div className="bg-green-50 p-3 rounded-lg">
                  <div className="font-medium text-sm text-green-800">
                    Tomorrow Prediction
                  </div>
                  <div className="text-xs text-green-700">
                    Predicted mood:{" "}
                    {insights.predictions.tomorrowMood.toFixed(1)}/10
                  </div>
                </div>

                <div className="bg-purple-50 p-3 rounded-lg">
                  <div className="font-medium text-sm text-purple-800">
                    Quick Tip
                  </div>
                  <div className="text-xs text-purple-700">
                    {insights.patterns.successFactors[0]} has been your top
                    success factor this week.
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="border-2 border-orange-200 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-orange-700">
                <Zap className="h-6 w-6" />
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-2">
                <Button variant="outline" size="sm" className="text-xs">
                  😴 Sleep Tips
                </Button>
                <Button variant="outline" size="sm" className="text-xs">
                  🧘 Stress Relief
                </Button>
                <Button variant="outline" size="sm" className="text-xs">
                  ⚡ Energy Boost
                </Button>
                <Button variant="outline" size="sm" className="text-xs">
                  🎯 Focus Mode
                </Button>
                <Button variant="outline" size="sm" className="text-xs">
                  📊 Weekly Report
                </Button>
                <Button variant="outline" size="sm" className="text-xs">
                  🎉 Celebrate Win
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
