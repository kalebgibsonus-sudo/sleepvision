import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SleepAssistant } from "@/components/SleepAssistant";
import { SleepScheduleGenerator } from "@/components/SleepScheduleGenerator";
import { SleepTracker } from "@/components/SleepTracker";
import { MorningDashboard } from "@/components/MorningDashboard";
import { StreakLounge } from "@/components/StreakLounge";
import { HabitTracker } from "@/components/HabitTracker";
import { toast } from "@/hooks/use-toast";
import {
  Moon,
  Sun,
  Clock,
  TrendingUp,
  Zap,
  Shield,
  Bot,
  Calculator,
  ChevronDown,
  Lightbulb,
  Sparkles,
  Calendar,
  Trophy,
  Target,
  Flame,
} from "lucide-react";

export default function Index() {
  const [bedtime, setBedtime] = useState("22:30");
  const [wakeup, setWakeup] = useState("06:30");
  const [sleepGoal, setSleepGoal] = useState(8);
      const [activeTab, setActiveTab] = useState("ai-builder");

  const calculateSleepDuration = () => {
    const bedtimeDate = new Date(`2024-01-01 ${bedtime}`);
    let wakeupDate = new Date(`2024-01-01 ${wakeup}`);

    // If wakeup is earlier than bedtime, it's the next day
    if (wakeupDate <= bedtimeDate) {
      wakeupDate = new Date(`2024-01-02 ${wakeup}`);
    }

    const diff = wakeupDate.getTime() - bedtimeDate.getTime();
    return Math.round((diff / (1000 * 60 * 60)) * 10) / 10;
  };

  const sleepDuration = calculateSleepDuration();
  const isOptimalSleep =
    sleepDuration >= sleepGoal - 0.5 && sleepDuration <= sleepGoal + 0.5;

      const scrollToScheduleBuilder = () => {
    setActiveTab("ai-builder");
    const element = document.getElementById("schedule-section");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const scrollToFeatures = () => {
    const element = document.getElementById("features-section");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const saveSchedule = () => {
    toast({
      title: "Schedule Saved! 🌙",
      description: `Your sleep schedule: ${bedtime} - ${wakeup} (${sleepDuration}h) has been saved.`,
    });

    // Here you could also save to localStorage or send to backend
    localStorage.setItem(
      "sleepSchedule",
      JSON.stringify({
        bedtime,
        wakeup,
        sleepGoal,
        sleepDuration,
        savedAt: new Date().toISOString(),
      }),
    );
  };

  return (
    <div className="min-h-screen gradient-mesh relative overflow-hidden">
      {/* Enhanced floating background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/10 rounded-full blur-3xl float-animation"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-white/10 rounded-full blur-3xl float-animation-delayed"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-white/5 rounded-full blur-3xl float-animation-slow"></div>

        {/* Additional decorative elements */}
        <div className="absolute top-20 left-20 w-4 h-4 bg-white/30 rounded-full pulse-glow"></div>
        <div
          className="absolute bottom-32 right-32 w-6 h-6 bg-white/20 rounded-full pulse-glow"
          style={{ animationDelay: "1s" }}
        ></div>
        <div
          className="absolute top-1/3 right-20 w-2 h-2 bg-white/40 rounded-full pulse-glow"
          style={{ animationDelay: "2s" }}
        ></div>

        {/* Geometric shapes */}
        <div className="absolute top-40 left-1/4 w-32 h-32 border border-white/10 rounded-lg rotate-12 float-animation"></div>
        <div className="absolute bottom-40 right-1/4 w-24 h-24 border border-white/10 rounded-full float-animation-delayed"></div>
      </div>

      {/* Hero Section */}
      <section className="relative px-4 pt-24 pb-20 text-center">
        <div className="relative z-10 max-w-5xl mx-auto">
          {/* Professional header with enhanced typography */}
          <div className="animate-fade-in-up">
            <div className="flex items-center justify-center mb-8">
              <div className="relative">
                <Moon className="h-16 w-16 text-white/90 mr-4 drop-shadow-lg" />
                <div className="absolute inset-0 h-16 w-16 mr-4 bg-white/20 rounded-full blur-xl"></div>
              </div>
              <h1 className="text-6xl sm:text-7xl lg:text-8xl font-black text-white tracking-tight text-shimmer bg-clip-text">
                SleepVision
              </h1>
            </div>

            {/* Enhanced tagline */}
            <div className="mb-12 animate-fade-in-up animate-delay-200">
              <p className="text-2xl sm:text-3xl text-white/90 mb-4 max-w-3xl mx-auto leading-relaxed font-light">
                Transform your sleep with personalized schedules and
                science-backed insights
              </p>
              <div className="flex items-center justify-center gap-2 text-white/70 text-lg">
                <Zap className="h-5 w-5" />
                <span>AI-Powered</span>
                <span>•</span>
                <Shield className="h-5 w-5" />
                <span>Science-Backed</span>
                <span>•</span>
                <TrendingUp className="h-5 w-5" />
                <span>Personalized</span>
              </div>
            </div>
          </div>

          {/* Enhanced CTA buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center animate-fade-in-up animate-delay-300">
            <Button
              size="lg"
              onClick={scrollToScheduleBuilder}
              className="btn-gradient text-white font-semibold px-10 py-4 text-lg shadow-2xl hover:shadow-white/20 hover:scale-105 transition-all duration-300"
            >
              <Clock className="h-5 w-5 mr-2" />
              Start Building Your Schedule
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={scrollToFeatures}
              className="glass-card border-white/30 text-white hover:bg-white/10 hover:scale-105 px-10 py-4 text-lg transition-all duration-300"
            >
              <TrendingUp className="h-5 w-5 mr-2" />
              Learn More
            </Button>
          </div>

          {/* Trust indicators */}
          <div className="mt-16 animate-fade-in-up animate-delay-500">
            <div className="flex flex-wrap justify-center items-center gap-8 text-white/60 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full pulse-glow"></div>
                <span>10,000+ Better Sleepers</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-400 rounded-full pulse-glow"></div>
                <span>Science-Based Approach</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-purple-400 rounded-full pulse-glow"></div>
                <span>AI-Powered Coaching</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Sleep Tools Section */}
      <section id="schedule-section" className="px-4 py-20 relative">
        {/* Section background */}
        <div className="absolute inset-0 bg-white/5 backdrop-blur-3xl"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/5 to-transparent"></div>

        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-12 animate-fade-in-up">
            <div className="inline-flex items-center gap-3 mb-6 glass-card px-6 py-3 rounded-full">
              <Zap className="h-5 w-5 text-white/80" />
              <span className="text-white/80 font-medium">
                Sleep Optimization Tools
              </span>
            </div>
            <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6 text-shimmer">
              Your Sleep Optimization Center
            </h2>
            <p className="text-xl text-white/80 max-w-2xl mx-auto leading-relaxed">
              Build your perfect schedule or get personalized guidance from
              Luna, your AI sleep coach
            </p>
          </div>

          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full animate-fade-in-up animate-delay-200"
          >
            <TabsList className="grid w-full grid-cols-6 glass-card p-2 h-auto">
              <TabsTrigger
                value="dashboard"
                className="flex items-center gap-1 px-2 py-3 text-xs font-semibold tab-enhanced data-[state=active]:bg-white data-[state=active]:text-sleep-night data-[state=active]:shadow-lg transition-all duration-300"
              >
                <Sun className="h-3 w-3" />
                Dashboard
              </TabsTrigger>
              <TabsTrigger
                value="tracker"
                className="flex items-center gap-1 px-2 py-3 text-xs font-semibold tab-enhanced data-[state=active]:bg-white data-[state=active]:text-sleep-night data-[state=active]:shadow-lg transition-all duration-300"
              >
                <Calendar className="h-3 w-3" />
                Sleep Log
              </TabsTrigger>
              <TabsTrigger
                value="habits"
                className="flex items-center gap-1 px-2 py-3 text-xs font-semibold tab-enhanced data-[state=active]:bg-white data-[state=active]:text-sleep-night data-[state=active]:shadow-lg transition-all duration-300"
              >
                <Target className="h-3 w-3" />
                Habits
              </TabsTrigger>
              <TabsTrigger
                value="streaks"
                className="flex items-center gap-1 px-2 py-3 text-xs font-semibold tab-enhanced data-[state=active]:bg-white data-[state=active]:text-sleep-night data-[state=active]:shadow-lg transition-all duration-300"
              >
                <Flame className="h-3 w-3" />
                Rewards
              </TabsTrigger>
                            <TabsTrigger
                value="ai-builder"
                className="flex items-center gap-1 px-2 py-3 text-xs font-semibold tab-enhanced data-[state=active]:bg-white data-[state=active]:text-sleep-night data-[state=active]:shadow-lg transition-all duration-300"
              >
                <Sparkles className="h-3 w-3" />
                AI Builder
              </TabsTrigger>
              <TabsTrigger
                value="ai-coach"
                className="flex items-center gap-1 px-2 py-3 text-xs font-semibold tab-enhanced data-[state=active]:bg-white data-[state=active]:text-sleep-night data-[state=active]:shadow-lg transition-all duration-300"
              >
                <Bot className="h-3 w-3" />
                Luna
              </TabsTrigger>
            </TabsList>

                        <TabsContent value="dashboard" className="mt-6">
              <MorningDashboard />
            </TabsContent>

            <TabsContent value="tracker" className="mt-6">
              <SleepTracker />
            </TabsContent>

            <TabsContent value="habits" className="mt-6">
              <HabitTracker />
            </TabsContent>

            <TabsContent value="streaks" className="mt-6">
              <StreakLounge />
            </TabsContent>

            <TabsContent value="old-schedule" className="mt-8">
              <Card className="bg-white/95 backdrop-blur border-0 shadow-2xl card-hover overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-sleep-primary via-sleep-secondary to-sleep-primary"></div>
                <CardHeader className="text-center bg-gradient-to-b from-white/50 to-transparent">
                  <CardTitle className="text-3xl font-bold text-sleep-night flex items-center justify-center gap-3 mb-2">
                    <div className="p-2 bg-sleep-primary/10 rounded-full">
                      <Clock className="h-7 w-7 text-sleep-primary" />
                    </div>
                    Build Your Sleep Schedule
                  </CardTitle>
                  <CardDescription className="text-lg text-sleep-night/70">
                    Set your ideal sleep and wake times to optimize your rest
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-10 p-8">
                  <div className="grid md:grid-cols-2 gap-10">
                    <div className="space-y-4 animate-fade-in-up">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="p-2 bg-sleep-primary/10 rounded-full">
                          <Moon className="h-6 w-6 text-sleep-primary" />
                        </div>
                        <Label
                          htmlFor="bedtime"
                          className="text-xl font-semibold text-sleep-night"
                        >
                          Bedtime
                        </Label>
                      </div>
                      <div className="relative">
                        <Input
                          id="bedtime"
                          type="time"
                          value={bedtime}
                          onChange={(e) => setBedtime(e.target.value)}
                          className="text-2xl p-6 border-2 focus:border-sleep-primary hover:border-sleep-primary/50 transition-all duration-300 bg-white/80 backdrop-blur rounded-xl shadow-lg"
                        />
                        <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-sleep-primary/5 to-transparent pointer-events-none"></div>
                      </div>
                    </div>

                    <div className="space-y-4 animate-fade-in-up animate-delay-100">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="p-2 bg-sleep-secondary/10 rounded-full">
                          <Sun className="h-6 w-6 text-sleep-secondary" />
                        </div>
                        <Label
                          htmlFor="wakeup"
                          className="text-xl font-semibold text-sleep-night"
                        >
                          Wake Up Time
                        </Label>
                      </div>
                      <div className="relative">
                        <Input
                          id="wakeup"
                          type="time"
                          value={wakeup}
                          onChange={(e) => setWakeup(e.target.value)}
                          className="text-2xl p-6 border-2 focus:border-sleep-primary hover:border-sleep-primary/50 transition-all duration-300 bg-white/80 backdrop-blur rounded-xl shadow-lg"
                        />
                        <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-sleep-secondary/5 to-transparent pointer-events-none"></div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6 animate-fade-in-up animate-delay-200">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="p-2 bg-sleep-accent/20 rounded-full">
                        <TrendingUp className="h-6 w-6 text-sleep-accent" />
                      </div>
                      <Label
                        htmlFor="sleep-goal"
                        className="text-xl font-semibold text-sleep-night"
                      >
                        Sleep Goal
                      </Label>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="relative">
                        <Input
                          id="sleep-goal"
                          type="number"
                          min="6"
                          max="12"
                          step="0.5"
                          value={sleepGoal}
                          onChange={(e) => setSleepGoal(Number(e.target.value))}
                          className="text-2xl p-6 border-2 focus:border-sleep-primary hover:border-sleep-primary/50 transition-all duration-300 bg-white/80 backdrop-blur rounded-xl shadow-lg w-40"
                        />
                        <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-sleep-accent/5 to-transparent pointer-events-none"></div>
                      </div>
                      <span className="text-lg text-sleep-night/70 font-medium">
                        hours per night
                      </span>
                    </div>
                  </div>

                  {/* Enhanced Sleep Analysis */}
                  <div className="glass-card-dark rounded-2xl p-8 space-y-6 animate-fade-in-up animate-delay-300">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="p-3 bg-gradient-to-br from-sleep-primary to-sleep-secondary rounded-full">
                        <TrendingUp className="h-7 w-7 text-white" />
                      </div>
                      <h3 className="text-2xl font-bold text-sleep-night">
                        Your Sleep Analysis
                      </h3>
                    </div>

                    <div className="grid sm:grid-cols-3 gap-6">
                      <div className="text-center p-6 bg-white/50 rounded-xl card-hover">
                        <div className="text-4xl font-black text-sleep-primary mb-2">
                          {sleepDuration}h
                        </div>
                        <div className="text-sm font-medium text-sleep-night/70">
                          Total Sleep Duration
                        </div>
                      </div>
                      <div className="text-center p-6 bg-white/50 rounded-xl card-hover">
                        <div className="text-4xl font-black text-sleep-secondary mb-2">
                          {sleepGoal}h
                        </div>
                        <div className="text-sm font-medium text-sleep-night/70">
                          Your Target Goal
                        </div>
                      </div>
                      <div className="text-center p-6 bg-white/50 rounded-xl card-hover">
                        <Badge
                          variant={isOptimalSleep ? "default" : "secondary"}
                          className={`text-base py-2 px-4 ${
                            isOptimalSleep
                              ? "bg-green-500 hover:bg-green-600"
                              : "bg-amber-500 hover:bg-amber-600"
                          }`}
                        >
                          {isOptimalSleep ? "✓ Optimal" : "⚠ Needs Adjustment"}
                        </Badge>
                      </div>
                    </div>

                    {!isOptimalSleep && (
                      <div className="mt-6 p-6 bg-gradient-to-r from-sleep-primary/10 to-sleep-secondary/10 rounded-xl border-l-4 border-sleep-primary">
                        <div className="flex items-start gap-3">
                          <div className="p-2 bg-sleep-primary/20 rounded-full">
                            <Lightbulb className="h-5 w-5 text-sleep-primary" />
                          </div>
                          <div>
                            <p className="font-semibold text-sleep-night mb-1">
                              💡 Personalized Recommendation
                            </p>
                            <p className="text-sleep-night/80">
                              {sleepDuration < sleepGoal
                                ? "Try going to bed earlier to reach your sleep goal. Gradual adjustments of 15-30 minutes work best."
                                : "You're getting more sleep than your goal. Consider if you truly need this much rest or if sleep quality could be improved."}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col sm:flex-row gap-6 animate-fade-in-up animate-delay-500">
                    <Button
                      size="lg"
                      onClick={saveSchedule}
                      className="flex-1 btn-gradient text-white font-bold py-4 px-8 text-lg shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300"
                    >
                      <Moon className="h-5 w-5 mr-2" />
                      Save My Sleep Schedule
                    </Button>
                    <Button
                      size="lg"
                      variant="outline"
                      onClick={() => setActiveTab("ai-coach")}
                      className="flex-1 glass-card border-2 border-sleep-primary text-sleep-primary hover:bg-sleep-primary hover:text-white font-bold py-4 px-8 text-lg transition-all duration-300 hover:scale-105"
                    >
                      <Bot className="h-5 w-5 mr-2" />
                      Get AI Coaching
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

                        <TabsContent value="ai-builder" className="mt-6">
              <SleepScheduleGenerator />
            </TabsContent>

            <TabsContent value="ai-coach" className="mt-6">
              <SleepAssistant
                currentSchedule={{
                  bedtime,
                  wakeup,
                  sleepGoal,
                }}
              />
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Features Section */}
      <section id="features-section" className="px-4 py-20 relative">
        {/* Background effects */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/5 to-transparent"></div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-16 animate-fade-in-up">
            <div className="inline-flex items-center gap-3 mb-6 glass-card px-6 py-3 rounded-full">
              <Shield className="h-5 w-5 text-white/80" />
              <span className="text-white/80 font-medium">Why SleepVision</span>
            </div>
            <h2 className="text-5xl sm:text-6xl font-bold text-white mb-6 text-shimmer">
              Why Choose SleepVision?
            </h2>
            <p className="text-xl text-white/80 max-w-3xl mx-auto leading-relaxed">
              Our science-backed approach helps you achieve better sleep through
              personalized schedules and AI-powered insights
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="glass-card text-white card-hover group animate-fade-in-up">
              <CardHeader className="text-center p-8">
                <div className="mx-auto mb-6 p-4 bg-gradient-to-br from-sleep-primary to-sleep-secondary rounded-2xl w-fit group-hover:scale-110 transition-transform duration-300">
                  <TrendingUp className="h-10 w-10 text-white" />
                </div>
                <CardTitle className="text-2xl font-bold mb-2">
                  Personalized Scheduling
                </CardTitle>
              </CardHeader>
              <CardContent className="px-8 pb-8">
                <p className="text-white/80 text-lg leading-relaxed">
                  Create custom sleep schedules based on your lifestyle, work
                  hours, and personal sleep goals with intelligent
                  recommendations.
                </p>
              </CardContent>
            </Card>

            <Card className="glass-card text-white card-hover group animate-fade-in-up animate-delay-100">
              <CardHeader className="text-center p-8">
                <div className="mx-auto mb-6 p-4 bg-gradient-to-br from-sleep-secondary to-sleep-primary rounded-2xl w-fit group-hover:scale-110 transition-transform duration-300">
                  <Zap className="h-10 w-10 text-white" />
                </div>
                <CardTitle className="text-2xl font-bold mb-2">
                  AI-Powered Coaching
                </CardTitle>
              </CardHeader>
              <CardContent className="px-8 pb-8">
                <p className="text-white/80 text-lg leading-relaxed">
                  Get personalized guidance from Luna, your AI sleep coach, with
                  recommendations tailored to your unique sleep patterns.
                </p>
              </CardContent>
            </Card>

            <Card className="glass-card text-white card-hover group animate-fade-in-up animate-delay-200">
              <CardHeader className="text-center p-8">
                <div className="mx-auto mb-6 p-4 bg-gradient-to-br from-sleep-primary to-sleep-secondary rounded-2xl w-fit group-hover:scale-110 transition-transform duration-300">
                  <Shield className="h-10 w-10 text-white" />
                </div>
                <CardTitle className="text-2xl font-bold mb-2">
                  Science-Backed
                </CardTitle>
              </CardHeader>
              <CardContent className="px-8 pb-8">
                <p className="text-white/80 text-lg leading-relaxed">
                  Based on circadian rhythm research and the latest sleep
                  science to ensure effective, evidence-based results.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Sleep Tips */}
      <section className="px-4 py-20 relative">
        <div className="absolute inset-0 bg-white/5 backdrop-blur-3xl"></div>

        <div className="max-w-6xl mx-auto text-center relative z-10">
          <div className="mb-16 animate-fade-in-up">
            <div className="inline-flex items-center gap-3 mb-6 glass-card px-6 py-3 rounded-full">
              <Lightbulb className="h-5 w-5 text-white/80" />
              <span className="text-white/80 font-medium">
                Sleep Optimization
              </span>
            </div>
            <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6 text-shimmer">
              Expert Sleep Tips
            </h2>
            <p className="text-lg text-white/80 max-w-2xl mx-auto">
              Evidence-based recommendations to enhance your sleep quality
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: "🌙",
                tip: "Keep your bedroom cool",
                detail: "Ideal temperature: 60-67°F (15-19°C)",
                gradient: "from-blue-500/20 to-purple-500/20",
              },
              {
                icon: "📱",
                tip: "Digital sunset routine",
                detail: "No screens 1 hour before bed",
                gradient: "from-purple-500/20 to-pink-500/20",
              },
              {
                icon: "☕",
                tip: "Caffeine curfew",
                detail: "Last coffee before 2 PM",
                gradient: "from-amber-500/20 to-orange-500/20",
              },
              {
                icon: "🧘",
                tip: "Relaxation rituals",
                detail: "Meditation, breathing, or gentle stretches",
                gradient: "from-green-500/20 to-teal-500/20",
              },
            ].map((item, index) => (
              <div
                key={index}
                className={`glass-card p-6 rounded-2xl card-hover group animate-fade-in-up bg-gradient-to-br ${item.gradient}`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">
                  {item.icon}
                </div>
                <h3 className="text-white font-bold text-lg mb-2">
                  {item.tip}
                </h3>
                <p className="text-white/80 text-sm leading-relaxed">
                  {item.detail}
                </p>
              </div>
            ))}
          </div>

          {/* Call-to-action */}
          <div className="mt-16 animate-fade-in-up animate-delay-500">
            <div className="glass-card p-8 rounded-2xl max-w-2xl mx-auto">
              <h3 className="text-2xl font-bold text-white mb-4">
                Ready to Transform Your Sleep?
              </h3>
              <p className="text-white/80 mb-6">
                Start your journey to better sleep with personalized AI coaching
              </p>
              <Button
                size="lg"
                onClick={scrollToScheduleBuilder}
                className="btn-gradient text-white font-bold px-8 py-3 hover:scale-105 transition-all duration-300"
              >
                <Clock className="h-5 w-5 mr-2" />
                Get Started Now
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
