import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { 
  Bot, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Sparkles,
  Moon,
  Sun,
  Target,
  MessageCircle
} from "lucide-react";

interface CheckInResponse {
  id: string;
  date: string;
  type: "sleep" | "morning" | "general";
  question: string;
  response: "yes" | "no" | null;
  timestamp: string;
}

interface AICheckInProps {
  onResponse?: (response: CheckInResponse) => void;
}

export function AICheckIn({ onResponse }: AICheckInProps) {
  const { user } = useAuth();
  const [currentCheckIn, setCurrentCheckIn] = useState<CheckInResponse | null>(null);
  const [hasRespondedToday, setHasRespondedToday] = useState(false);
  const [showMotivation, setShowMotivation] = useState(false);

  useEffect(() => {
    generateDailyCheckIn();
  }, []);

  const generateDailyCheckIn = () => {
    const today = new Date().toISOString().split('T')[0];
    const hour = new Date().getHours();
    
    // Check if user already responded today
    const storedResponses = JSON.parse(localStorage.getItem('aiCheckInResponses') || '[]');
    const todayResponse = storedResponses.find((r: CheckInResponse) => r.date === today);
    
    if (todayResponse) {
      setHasRespondedToday(true);
      return;
    }

    // Generate different check-ins based on time of day
    let checkInData: Partial<CheckInResponse>;
    
    if (hour >= 6 && hour < 12) {
      // Morning check-ins
      const morningQuestions = [
        "Did you follow your morning routine today? 🌅",
        "How was your wake-up time this morning? ⏰",
        "Did you feel rested when you woke up? 😴",
        "Did you complete your morning activities? ☀️",
        "Are you starting the day feeling energized? ⚡"
      ];
      
      checkInData = {
        type: "morning",
        question: morningQuestions[Math.floor(Math.random() * morningQuestions.length)]
      };
    } else if (hour >= 12 && hour < 18) {
      // Afternoon check-ins
      const afternoonQuestions = [
        "How are you feeling about tonight's sleep schedule? 🌙",
        "Are you prepared to follow your bedtime routine? 🛏️",
        "Did you avoid caffeine after 2 PM today? ☕",
        "Are you planning to wind down early tonight? 🧘",
        "How has your energy been today? 🔋"
      ];
      
      checkInData = {
        type: "general",
        question: afternoonQuestions[Math.floor(Math.random() * afternoonQuestions.length)]
      };
    } else {
      // Evening check-ins
      const eveningQuestions = [
        "Did you stick to your sleep schedule last night? 🌙",
        "Did you follow your bedtime routine yesterday? ✅",
        "How well did you sleep last night? 😴",
        "Did you avoid screens before bed? 📱",
        "Are you ready for another great night's sleep? 🌟"
      ];
      
      checkInData = {
        type: "sleep",
        question: eveningQuestions[Math.floor(Math.random() * eveningQuestions.length)]
      };
    }

    const checkIn: CheckInResponse = {
      id: `checkin-${Date.now()}`,
      date: today,
      question: checkInData.question!,
      type: checkInData.type!,
      response: null,
      timestamp: new Date().toISOString()
    };

    setCurrentCheckIn(checkIn);
  };

  const handleResponse = (response: "yes" | "no") => {
    if (!currentCheckIn) return;

    const updatedCheckIn = { ...currentCheckIn, response };
    setCurrentCheckIn(updatedCheckIn);
    setHasRespondedToday(true);

    // Store response locally
    const storedResponses = JSON.parse(localStorage.getItem('aiCheckInResponses') || '[]');
    storedResponses.push(updatedCheckIn);
    localStorage.setItem('aiCheckInResponses', JSON.stringify(storedResponses));

    // Show motivation message
    setShowMotivation(true);
    setTimeout(() => setShowMotivation(false), 3000);

    // Callback for parent component
    onResponse?.(updatedCheckIn);
  };

  const getMotivationMessage = (response: "yes" | "no", type: string) => {
    if (response === "yes") {
      const positiveMessages = [
        "Amazing! You're building incredible habits! 🎉",
        "Keep up the fantastic work! 🌟",
        "You're absolutely crushing your goals! 💪",
        "Luna is so proud of your consistency! 🤖✨",
        "Your dedication is truly inspiring! 🔥"
      ];
      return positiveMessages[Math.floor(Math.random() * positiveMessages.length)];
    } else {
      const encouragingMessages = [
        "That's okay! Tomorrow is a fresh start! 🌅",
        "Every expert was once a beginner. Keep going! 💪",
        "Small setbacks lead to bigger comebacks! 🚀",
        "Luna believes in you! Let's get back on track! 🤖💙",
        "Progress isn't always perfect, and that's perfectly fine! ✨"
      ];
      return encouragingMessages[Math.floor(Math.random() * encouragingMessages.length)];
    }
  };

  const getIconForType = (type: string) => {
    switch (type) {
      case "sleep": return <Moon className="h-5 w-5 text-blue-500" />;
      case "morning": return <Sun className="h-5 w-5 text-orange-500" />;
      default: return <Target className="h-5 w-5 text-purple-500" />;
    }
  };

  if (hasRespondedToday && !showMotivation) {
    return (
      <Card className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-full">
              <CheckCircle className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="font-medium text-green-800">Daily check-in complete!</p>
              <p className="text-sm text-green-600">See you tomorrow for another check-in! 🌟</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (showMotivation && currentCheckIn?.response) {
    return (
      <Card className="bg-gradient-to-r from-indigo-500 to-purple-600 border border-indigo-300 animate-pulse shadow-lg">
        <CardContent className="p-6 text-center">
          <div className="p-3 bg-white/20 rounded-full inline-block mb-3">
            <Sparkles className="h-6 w-6 text-white" />
          </div>
          <p className="text-lg font-semibold text-white mb-2">
            {getMotivationMessage(currentCheckIn.response, currentCheckIn.type)}
          </p>
          <Badge className="bg-white/20 text-white border-white/30">
            Luna AI Response
          </Badge>
        </CardContent>
      </Card>
    );
  }

  if (!currentCheckIn) {
    return (
      <Card className="bg-gray-50 border border-gray-200">
        <CardContent className="p-4 text-center">
          <Clock className="h-8 w-8 text-gray-400 mx-auto mb-2" />
          <p className="text-gray-600">Loading your daily check-in...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-gradient-to-br from-blue-50 to-purple-50 border border-blue-200 shadow-lg">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 rounded-full">
            <Bot className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <CardTitle className="text-lg text-blue-900 flex items-center gap-2">
              Daily Luna Check-in {getIconForType(currentCheckIn.type)}
            </CardTitle>
            <p className="text-sm text-blue-600">Your AI companion is here to support you</p>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="bg-white p-4 rounded-lg border border-blue-100">
          <div className="flex items-start gap-3">
            <MessageCircle className="h-5 w-5 text-blue-500 mt-1" />
            <p className="text-gray-800 font-medium">
              {currentCheckIn.question}
            </p>
          </div>
        </div>

        <div className="flex gap-3">
          <Button
            onClick={() => handleResponse("yes")}
            className="flex-1 bg-green-600 hover:bg-green-700 text-white"
            size="lg"
          >
            <CheckCircle className="h-5 w-5 mr-2" />
            Yes! ✅
          </Button>
          
          <Button
            onClick={() => handleResponse("no")}
            variant="outline"
            className="flex-1 border-red-200 text-red-600 hover:bg-red-50"
            size="lg"
          >
            <XCircle className="h-5 w-5 mr-2" />
            Not today ❌
          </Button>
        </div>

        <div className="text-center">
          <p className="text-xs text-gray-500">
            💡 Daily check-ins help Luna provide better personalized support
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
