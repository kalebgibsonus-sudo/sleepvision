import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/hooks/use-toast";
import {
  Bot,
  User,
  Send,
  Loader2,
  Clock,
  Moon,
  Sun,
  Lightbulb,
} from "lucide-react";
import type {
  SleepAssistantRequest,
  SleepAssistantResponse,
} from "@shared/api";

interface Message {
  id: string;
  type: "user" | "assistant";
  content: string;
  recommendations?: SleepAssistantResponse["recommendations"];
  timestamp: Date;
}

interface SleepAssistantProps {
  currentSchedule?: {
    bedtime: string;
    wakeup: string;
    sleepGoal: number;
  };
}

export function SleepAssistant({ currentSchedule }: SleepAssistantProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      type: "assistant",
      content:
        "✨ Hello there! I'm Luna, your friendly sleep coach AI. I'm here to help you create the perfect sleep routine that works for your unique lifestyle. Whether you're struggling to fall asleep, wake up groggy, or just want to optimize your rest, I'm here to support you every step of the way. Tell me about your sleep challenges or what you'd like to improve! 😴",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Auto-scroll to bottom when new messages are added
    if (scrollAreaRef.current) {
      const scrollElement = scrollAreaRef.current.querySelector(
        "[data-radix-scroll-area-viewport]",
      );
      if (scrollElement) {
        scrollElement.scrollTop = scrollElement.scrollHeight;
      }
    }
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: input.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const requestData: SleepAssistantRequest = {
        message: userMessage.content,
        currentSchedule: currentSchedule,
      };

      const response = await fetch("/api/sleep-assistant", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      });

      const data: SleepAssistantResponse = await response.json();

      if (!data.success) {
        toast({
          title: "Error",
          description:
            data.error || "Failed to get response from sleep assistant",
          variant: "destructive",
        });
        return;
      }

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: "assistant",
        content: data.response,
        recommendations: data.recommendations,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Error sending message:", error);
      toast({
        title: "Connection Error",
        description: "Failed to connect to the sleep assistant",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      // Focus back to input
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const formatTime = (time: Date) => {
    return time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <Card className="w-full max-w-4xl mx-auto bg-white/95 backdrop-blur border-0 shadow-2xl">
      <CardHeader className="text-center border-b bg-gradient-to-r from-sleep-primary/10 to-sleep-secondary/10">
        <CardTitle className="text-2xl font-bold text-sleep-night flex items-center justify-center gap-2">
          <Bot className="h-7 w-7 text-sleep-primary" />
          Luna - Your Sleep Coach
        </CardTitle>
        <CardDescription className="text-base">
          Get warm, personalized sleep guidance from your AI friend
        </CardDescription>
      </CardHeader>

      <CardContent className="p-6">
        <div className="space-y-4">
          {/* Chat Messages */}
          <ScrollArea ref={scrollAreaRef} className="h-96 w-full pr-4">
            <div className="space-y-4">
              {messages.map((message) => (
                <div key={message.id} className="space-y-2">
                  <div
                    className={`flex gap-3 ${
                      message.type === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    {message.type === "assistant" && (
                      <div className="flex-shrink-0">
                        <div className="w-8 h-8 rounded-full bg-sleep-primary/20 flex items-center justify-center">
                          <Bot className="h-4 w-4 text-sleep-primary" />
                        </div>
                      </div>
                    )}

                    <div
                      className={`max-w-[80%] rounded-lg p-3 ${
                        message.type === "user"
                          ? "bg-sleep-primary text-white"
                          : "bg-sleep-accent/30 text-sleep-night"
                      }`}
                    >
                      <p className="text-sm leading-relaxed whitespace-pre-wrap">
                        {message.content}
                      </p>
                      <div className="mt-1 opacity-70">
                        <span className="text-xs">
                          {formatTime(message.timestamp)}
                        </span>
                      </div>
                    </div>

                    {message.type === "user" && (
                      <div className="flex-shrink-0">
                        <div className="w-8 h-8 rounded-full bg-sleep-secondary/20 flex items-center justify-center">
                          <User className="h-4 w-4 text-sleep-secondary" />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Recommendations Panel */}
                  {message.type === "assistant" && message.recommendations && (
                    <div className="ml-11 space-y-3">
                      <Separator />
                      <div className="bg-sleep-accent/10 rounded-lg p-4 space-y-3">
                        <h4 className="font-semibold text-sleep-night flex items-center gap-2">
                          <Lightbulb className="h-4 w-4 text-sleep-primary" />
                          Personalized Recommendations
                        </h4>

                        <div className="grid sm:grid-cols-3 gap-4 text-sm">
                          {message.recommendations.bedtime && (
                            <div className="flex items-center gap-2">
                              <Moon className="h-4 w-4 text-sleep-primary" />
                              <div>
                                <div className="font-medium">Bedtime</div>
                                <div className="text-sleep-primary font-semibold">
                                  {message.recommendations.bedtime}
                                </div>
                              </div>
                            </div>
                          )}

                          {message.recommendations.wakeup && (
                            <div className="flex items-center gap-2">
                              <Sun className="h-4 w-4 text-sleep-secondary" />
                              <div>
                                <div className="font-medium">Wake Up</div>
                                <div className="text-sleep-secondary font-semibold">
                                  {message.recommendations.wakeup}
                                </div>
                              </div>
                            </div>
                          )}

                          {message.recommendations.sleepDuration && (
                            <div className="flex items-center gap-2">
                              <Clock className="h-4 w-4 text-sleep-accent" />
                              <div>
                                <div className="font-medium">Duration</div>
                                <div className="text-sleep-accent font-semibold">
                                  {message.recommendations.sleepDuration}h
                                </div>
                              </div>
                            </div>
                          )}
                        </div>

                        {message.recommendations.tips &&
                          message.recommendations.tips.length > 0 && (
                            <div className="space-y-2">
                              <div className="font-medium text-sleep-night">
                                Key Tips:
                              </div>
                              <div className="space-y-1">
                                {message.recommendations.tips.map(
                                  (tip, index) => (
                                    <Badge
                                      key={index}
                                      variant="secondary"
                                      className="text-xs mr-1 mb-1"
                                    >
                                      {tip}
                                    </Badge>
                                  ),
                                )}
                              </div>
                            </div>
                          )}
                      </div>
                    </div>
                  )}
                </div>
              ))}

              {isLoading && (
                <div className="flex gap-3 justify-start">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 rounded-full bg-sleep-primary/20 flex items-center justify-center">
                      <Bot className="h-4 w-4 text-sleep-primary" />
                    </div>
                  </div>
                  <div className="bg-sleep-accent/30 text-sleep-night rounded-lg p-3">
                    <div className="flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span className="text-sm">
                        Luna is crafting your personalized plan...
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>

          {/* Input Area */}
          <div className="flex gap-2">
            <Input
              ref={inputRef}
              placeholder="Ask about your sleep schedule, sleep issues, or get personalized tips..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={isLoading}
              className="flex-1 border-2 focus:border-sleep-primary"
            />
            <Button
              onClick={sendMessage}
              disabled={!input.trim() || isLoading}
              className="bg-sleep-primary hover:bg-sleep-primary/90 text-white"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </div>

          {/* Quick suggestions */}
          <div className="flex flex-wrap gap-2">
            <span className="text-sm text-muted-foreground">
              💡 Try asking Luna:
            </span>
            {[
              "I struggle to fall asleep at night",
              "Help me create a morning routine",
              "I'm always tired even after 8 hours of sleep",
            ].map((suggestion, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                className="text-xs"
                disabled={isLoading}
                onClick={() => setInput(suggestion)}
              >
                {suggestion}
              </Button>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
