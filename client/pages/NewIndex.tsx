import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Moon,
  Sun,
  Sparkles,
  User,
  LogOut,
  Crown,
  Lock,
  BarChart3,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { SleepScheduleGenerator } from "@/components/SleepScheduleGenerator";
import { MorningBuilder } from "@/components/MorningBuilder";
import { CombinedAssessmentFlow } from "@/components/CombinedAssessmentFlow";
import { MainDashboard } from "@/components/MainDashboard";
import { NewMainDashboard } from "@/components/NewMainDashboard";
import { RoutineLoadingScreen } from "@/components/RoutineLoadingScreen";
import { MemoryStatusIndicator } from "@/components/MemoryStatusIndicator";
import SleepJourneyOnboarding from "@/components/SleepJourneyOnboarding";
import SubscriptionPage from "@/pages/SubscriptionPage";
import PaymentSuccessPage from "@/pages/PaymentSuccessPage";
import { useSleepData } from "@/hooks/useSleepData";
import { useMemorySystem } from "@/hooks/useMemorySystem";
import { SleepAssessment } from "@/components/assessment/SleepAssessment";

type ViewMode =
  | "home"
  | "sleep-builder"
  | "morning-builder"
  | "dashboard"
  | "dashboard-overview"
  | "dashboard-tracker"
  | "dashboard-rewards"
  | "dashboard-habits"
  | "dashboard-mornings"
  | "loading-routine"
  | "payment-modal"
  | "subscription-page"
  | "payment-success"
  | "sleep-assessment";

export default function NewIndex() {
  const navigate = useNavigate();
  const { user, isLoading, signIn, signOut, hasAccess, creatorBypass, refreshUserData } =
    useAuth();
  const { schedules, isLoading: sleepDataLoading } = useSleepData();
  const {
    canPerformAction,
    getStorageInfo,
    getSessionData,
    updateSessionData,
  } = useMemorySystem();
  const [viewMode, setViewMode] = useState<ViewMode>("home");
  const [hasCheckedDefaultView, setHasCheckedDefaultView] = useState(false);
  const [signInError, setSignInError] = useState<string | null>(null);
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [routineType, setRoutineType] = useState<"sleep" | "morning">("sleep");
  const [pendingAssessmentData, setPendingAssessmentData] = useState<any>(null);
  const [isManualHomeNavigation, setIsManualHomeNavigation] = useState(false);
  const [showWelcomeOnboarding, setShowWelcomeOnboarding] = useState(false);

  const handleSleepScheduleClick = async () => {
    // Navigate directly to the new sleep assessment flow
    // No sign-in required for the assessment
    setViewMode("sleep-assessment");
  };

  const handleMorningRoutineClick = async () => {
    if (!user) {
      // Set routine type first so we can continue after sign-in
      setRoutineType("morning");
      try {
        await handleSignIn();
        // The useEffect will handle navigation after successful sign-in
      } catch (error) {
        // Error is already handled in handleSignIn
        console.log("Sign-in was cancelled or failed");
      }
      return;
    }

    // Check access to morning features
    if (!hasAccess("morning")) {
      setRoutineType("morning");
      navigate('/subscription');
      return;
    }

    // Check if user can save morning routine
    const canSave = canPerformAction("save_morning_routine");
    if (!canSave.allowed) {
      alert(canSave.reason);
      navigate('/subscription');
      return;
    }

    setRoutineType("morning");
    setViewMode("morning-builder");
  };

  // Auto-redirect to dashboard if user has schedules
  useEffect(() => {
    if (
      !isLoading &&
      !sleepDataLoading &&
      user &&
      !hasCheckedDefaultView &&
      schedules.length > 0
    ) {
      setHasCheckedDefaultView(true);
      // SECURITY CHECK: Only auto-redirect to dashboard if user has access
      setTimeout(() => {
        if (user.email === "kalebgibson.us@gmail.com" || hasAccess("dashboard")) {
          setViewMode("dashboard");
        }
        // If no access, stay on home page - don't auto-redirect non-paying users
      }, 1500);
    }
  }, [user, schedules, isLoading, sleepDataLoading, hasCheckedDefaultView]);

  // Continue routine building flow after user signs in
  useEffect(() => {
    // Skip auto-redirect for admin users
    const isAdmin =
      user?.email?.includes("kaleb") || user?.email?.includes("admin");

    if (
      !isLoading &&
      user &&
      (routineType === "sleep" || routineType === "morning") &&
      viewMode === "home" &&
      !isManualHomeNavigation &&
      !isAdmin
    ) {
      // User just signed in, continue with routine building
      console.log("Auto-redirecting based on routine type:", routineType);

      if (routineType === "sleep") {
        // Check if they've completed assessment
        const sessionData = getSessionData();
        const hasCompletedSleepAssessment =
          sessionData.completedAssessments.includes("sleep");

        if (!hasCompletedSleepAssessment) {
          // Need to complete assessment first
          setViewMode("sleep-builder");
        } else if (!hasAccess("sleep")) {
          // Assessment done, need payment
          navigate('/subscription');
        } else {
          // All good, go to dashboard
          setViewMode("dashboard");
        }
      } else {
        setViewMode("morning-builder");
      }
    }
  }, [user, isLoading, routineType, viewMode, isManualHomeNavigation]);

  // Reset manual navigation flag after a delay
  useEffect(() => {
    if (isManualHomeNavigation && viewMode === "home") {
      const timer = setTimeout(() => {
        setIsManualHomeNavigation(false);
      }, 500); // Give enough time for the navigation to complete

      return () => clearTimeout(timer);
    }
  }, [isManualHomeNavigation, viewMode]);

  // Show onboarding for new users
  useEffect(() => {
    if (user && viewMode === "home") {
      const hasSeenOnboarding = localStorage.getItem("hasSeenSleepOnboarding");
      if (!hasSeenOnboarding) {
        setTimeout(() => {
          setShowWelcomeOnboarding(true);
        }, 1000);
      }
    }
  }, [user, viewMode]);

  // Check for Stripe payment success return
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const sessionId = urlParams.get('session_id');
    const success = urlParams.get('success');

    // Detect return from Stripe Checkout
    if (sessionId || success === 'true') {
      console.log("🔄 Detected return from Stripe Checkout");
      setViewMode("payment-success");

      // Refresh user data to get updated subscription
      if (user) {
        refreshUserData();
      }

      // Clean up URL parameters
      const cleanUrl = window.location.pathname;
      window.history.replaceState({}, document.title, cleanUrl);
    }
  }, [user, refreshUserData]);

  // Remove problematic assessment navigation to fix blue screen

  const handleWelcomeOnboardingComplete = () => {
    localStorage.setItem("hasSeenSleepOnboarding", "true");
    setShowWelcomeOnboarding(false);
  };

  const handleWelcomeOnboardingSkip = () => {
    localStorage.setItem("hasSeenSleepOnboarding", "true");
    setShowWelcomeOnboarding(false);
  };

  const handleScheduleCreated = (assessmentData?: any) => {
    // Mark assessment as completed
    updateSessionData("assessment_completed", "sleep");

    // Store assessment data for later use
    setPendingAssessmentData(assessmentData);

    // Always show loading screen first, regardless of subscription status
    setViewMode("loading-routine");
  };

  const handleLoadingComplete = () => {
    // After loading completes, navigate to subscription page instead of modal
    navigate('/subscription');
  };

  const handleSubscriptionPageBack = () => {
    // Sign the user out first to prevent auto-redirect loop
    signOut();
    // Then navigate to home page
    setViewMode("home");
  };

  const handleSubscriptionSuccess = () => {
    // After successful subscription, redirect to dashboard
    console.log("🎉 Subscription successful! Redirecting to dashboard...");

    // Small delay to ensure subscription update is processed
    setTimeout(() => {
      setViewMode("dashboard");
    }, 500);
  };

  const handlePaymentSuccessToDashboard = () => {
    console.log("🚀 Navigating from payment success to dashboard");
    setViewMode("dashboard");
  };

  const handlePaymentSuccessToHome = () => {
    console.log("🏠 Navigating from payment success to home");
    setViewMode("home");
  };

  const handleCreatorBypass = () => {
    // Creator bypass - skip payment and go directly to dashboard
    creatorBypass(); // This updates user to premium
    setShowPaymentModal(false);
    setTimeout(() => {
      setViewMode("dashboard");
    }, 500);
  };

  const handleSignIn = async () => {
    // Prevent concurrent sign-in attempts at the component level too
    if (isSigningIn || user) {
      console.warn("Sign-in already in progress or user already signed in");
      return;
    }

    setIsSigningIn(true);
    setSignInError(null);
    try {
      await signIn();
    } catch (error: any) {
      console.error("Sign-in error:", error);

      // Provide user-friendly error messages for common popup issues
      if (error.code === "auth/popup-blocked") {
        setSignInError(
          "Popup was blocked by your browser. Please allow popups and try again.",
        );
      } else if (
        error.code === "auth/cancelled-popup-request" ||
        error.code === "auth/popup-closed-by-user" ||
        error.message === "Sign-in timeout"
      ) {
        // Don't show error for user-cancelled actions or timeouts
        setSignInError(null);
      } else {
        setSignInError(error.message || "Failed to sign in. Please try again.");
      }
    } finally {
      setIsSigningIn(false);
    }
  };

  const handleDashboardAccess = async () => {
    if (!user) {
      // Sign in first
      await handleSignIn();
      return;
    }

    // Check if user has completed schedule
    if (schedules.length === 0) {
      // Guide them to create schedule first
      setViewMode("sleep-builder");
      return;
    }

    // Check if user has dashboard access
    if (hasAccess("dashboard")) {
      setViewMode("dashboard");
    } else {
      // Non-paying user - send to subscription page
      navigate('/subscription');
    }
  };

  const getSubscriptionBadge = () => {
    if (!user) return null;

    const badges = {
      "sleep-focused": { text: "Sleep Focused", color: "bg-blue-500" },
      "full-transformation": {
        text: "Full Transformation",
        color: "bg-purple-500",
      },
      "elite-performance": {
        text: "Elite Performance",
        color: "bg-yellow-500",
      },
    };

    const badge = badges[user.subscriptionTier] || badges.free;
    return (
      <Badge className={`${badge.color} text-white text-xs`}>
        {badge.text}
      </Badge>
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sleep-primary/20 via-sleep-secondary/20 to-sleep-accent/20">
        <div className="text-center">
          <div className="animate-spin h-12 w-12 border-4 border-sleep-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-sleep-night/70">Loading SleepVision...</p>
        </div>
      </div>
    );
  }

  // Now using dedicated subscription page instead of modals

  if (viewMode === "sleep-builder") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-sleep-primary/20 via-sleep-secondary/20 to-sleep-accent/20">
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setIsManualHomeNavigation(true);
                  setViewMode("home");
                }}
                className="flex items-center gap-2"
              >
                ← Back to Home
              </Button>

              {/* Admin bypass button for direct dashboard access */}
              {user?.email === "kalebgibson.us@gmail.com" && (
                <>
                  <Button
                    type="button"
                    onClick={() => {
                      setViewMode("dashboard");
                    }}
                    className="bg-purple-600 hover:bg-purple-700 text-white flex items-center gap-2"
                  >
                    👑 Dashboard
                  </Button>
                  <Button
                    type="button"
                    onClick={() => {
                      localStorage.removeItem("hasSeenSleepOnboarding");
                      setShowWelcomeOnboarding(true);
                    }}
                    className="bg-green-600 hover:bg-green-700 text-white flex items-center gap-2"
                  >
                    ���� Test Onboarding
                  </Button>
                  <Button
                    type="button"
                    onClick={() => {
                      // Clear assessment data for testing
                      updateSessionData("assessment_completed", "none");
                      console.log("Assessment data cleared for testing");
                    }}
                    className="bg-red-600 hover:bg-red-700 text-white flex items-center gap-2"
                  >
                    🔄 Reset Assessment
                  </Button>
                  <Button
                    type="button"
                    onClick={() => {
                      setShowPaymentModal(true);
                    }}
                    className="bg-yellow-600 hover:bg-yellow-700 text-white flex items-center gap-2"
                  >
                    💳 Test Payment
                  </Button>
                </>
              )}
            </div>
            {user && (
              <div className="flex items-center gap-4">
                {getSubscriptionBadge()}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="relative h-8 w-8 rounded-full"
                    >
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={user.picture} alt={user.name} />
                        <AvatarFallback>No Image</AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end">
                    <DropdownMenuItem
                      onClick={() => navigate('/subscription')}
                    >
                      <Crown className="mr-2 h-4 w-4" />
                      Manage Subscription
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={signOut}>
                      <LogOut className="mr-2 h-4 w-4" />
                      Sign out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            )}
          </div>
          <CombinedAssessmentFlow
            startingAssessment="sleep"
            onComplete={handleScheduleCreated}
          />
        </div>
      </div>
    );
  }

  if (viewMode === "morning-builder") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-sleep-primary/20 via-sleep-secondary/20 to-sleep-accent/20">
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-between items-center mb-8">
            <Button
              variant="outline"
              onClick={() => {
                setIsManualHomeNavigation(true);
                setViewMode("home");
              }}
              className="flex items-center gap-2"
            >
              ← Back to Home
            </Button>
            {user && (
              <div className="flex items-center gap-4">
                {getSubscriptionBadge()}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="relative h-8 w-8 rounded-full"
                    >
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={user.picture} alt={user.name} />
                        <AvatarFallback>No Image</AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end">
                    <DropdownMenuItem
                      onClick={() => navigate('/subscription')}
                    >
                      <Crown className="mr-2 h-4 w-4" />
                      Manage Subscription
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={signOut}>
                      <LogOut className="mr-2 h-4 w-4" />
                      Sign out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            )}
          </div>
          <CombinedAssessmentFlow
            startingAssessment="morning"
            onComplete={handleScheduleCreated}
          />
        </div>
      </div>
    );
  }

  if (viewMode === "loading-routine") {
    return (
      <RoutineLoadingScreen
        routineType={routineType}
        onComplete={handleLoadingComplete}
      />
    );
  }

  if (viewMode === "subscription-page") {
    return (
      <SubscriptionPage
        routineType={routineType}
        onBack={handleSubscriptionPageBack}
        onSuccess={handleSubscriptionSuccess}
        showBackButton={true}
      />
    );
  }

  if (viewMode === "sleep-assessment") {
    return <SleepAssessment />;
  }

  if (viewMode === "payment-success") {
    return (
      <PaymentSuccessPage
        onGoToDashboard={handlePaymentSuccessToDashboard}
        onGoHome={handlePaymentSuccessToHome}
      />
    );
  }

  if (viewMode.startsWith("dashboard")) {
    // Extract the specific dashboard page from viewMode
    const dashboardPage =
      viewMode === "dashboard"
        ? "overview"
        : viewMode.replace("dashboard-", "");

    return (
      <NewMainDashboard
        onGoHome={() => setViewMode("dashboard")}
        initialPage={dashboardPage}
      />
    );
  }

  // Allow signed-in users to access homepage

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="container mx-auto px-4 py-6 relative z-10 border-b border-gray-200/50">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-900 rounded-lg">
              <Sparkles className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-blue-900">SleepVision</h1>
              <p className="text-sm text-gray-600">
                Advanced Sleep Tracking & AI Optimization
              </p>
            </div>
          </div>

          {/* Navigation Menu */}
          <nav className="hidden md:flex items-center gap-8">
            <a
              href="#tracking"
              className="text-gray-700 hover:text-blue-900 font-medium transition-colors"
            >
              Sleep Tracking
            </a>
            <a
              href="#features"
              className="text-gray-700 hover:text-blue-900 font-medium transition-colors"
            >
              Features
            </a>
            <a
              href="#testimonials-section"
              className="text-gray-700 hover:text-blue-900 font-medium transition-colors"
            >
              Reviews
            </a>
            <a
              href="#pricing"
              className="text-gray-700 hover:text-blue-900 font-medium transition-colors"
            >
              Pricing
            </a>
            <a
              href="#about"
              className="text-gray-700 hover:text-blue-900 font-medium transition-colors"
            >
              About
            </a>
          </nav>

          <div className="flex items-center gap-4">
            {user ? (
              <>
                {getSubscriptionBadge()}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="relative h-8 w-8 rounded-full"
                    >
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={user.picture} alt={user.name} />
                        <AvatarFallback>No Image</AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end">
                    <div className="flex items-center justify-start gap-2 p-2">
                      <div className="flex flex-col space-y-1 leading-none">
                        <p className="font-medium">{user.name}</p>
                        <p className="w-[200px] truncate text-sm text-muted-foreground">
                          {user.email}
                        </p>
                      </div>
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => {
                      // SECURITY CHECK: Only allow dashboard access for paying users or admin
                      if (user?.email === "kalebgibson.us@gmail.com" || hasAccess("dashboard")) {
                        setViewMode("dashboard");
                      } else {
                        navigate('/subscription');
                      }
                    }}>
                      <BarChart3 className="mr-2 h-4 w-4" />
                      Sleep Dashboard
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => navigate('/subscription')}
                    >
                      <Crown className="mr-2 h-4 w-4" />
                      Manage Subscription
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={signOut}>
                      <LogOut className="mr-2 h-4 w-4" />
                      Sign out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <div className="flex flex-col items-center gap-3">
                {signInError && (
                  <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-2 rounded-md text-sm">
                    {signInError}
                  </div>
                )}
                <Button
                  onClick={handleSignIn}
                  disabled={isSigningIn}
                  className="bg-blue-900 hover:bg-blue-800 text-white border-0 px-6 py-2 rounded-md font-medium transition-colors duration-200 flex items-center gap-2"
                >
                  <User className="h-4 w-4" />
                  {isSigningIn ? "Signing In..." : "Sign In with Google"}
                </Button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Compact Testimonial */}
      <div className="relative z-10 py-6">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
              <div className="flex items-center gap-4">
                <div className="relative flex-shrink-0">
                  <img
                    src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=60&h=60&fit=crop&crop=face"
                    alt="Sarah Chen"
                    className="w-12 h-12 rounded-full border-2 border-gray-200"
                  />
                  <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
                    <span className="text-white text-xs font-bold">��</span>
                  </div>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1" />
                  <p className="text-sm text-gray-800 font-medium leading-relaxed mb-1">
                    "Sleep tracking showed I was getting only 6 hours! Now I get
                    8.5 hours and feel amazing."
                  </p>
                  <div className="flex items-center gap-2 text-xs text-gray-600">
                    <span className="font-medium">Sarah Chen</span>
                    <span>•</span>
                    <span>Marketing Director, Google</span>
                  </div>
                </div>

                <div className="text-right flex-shrink-0">
                  <div className="text-lg font-bold text-blue-900">
                    6h → 8.5h
                  </div>
                  <div className="text-xs text-gray-500">Sleep Duration</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <main className="container mx-auto px-4 py-12 relative z-10">
        <div className="text-center max-w-4xl mx-auto">
          {/* Dashboard Access for Signed-in Users - Moved to Top */}
          {user && (
            <div className="text-center mb-16">
              <div className="inline-block p-8 bg-white rounded-lg border border-gray-200 shadow-lg max-w-lg">
                <div className="mb-6">
                  <div className="p-3 bg-blue-900 rounded-lg inline-block mb-4">
                    <BarChart3 className="h-8 w-8 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-3">
                    Welcome back, {user.name.split(" ")[0]}
                  </h2>
                  <p className="text-gray-600 text-base mb-6 max-w-md mx-auto">
                    Ready to continue your sleep optimization journey? Access
                    your personalized dashboard with tracking, insights, and AI
                    support.
                  </p>
                </div>
                <Button
                  onClick={() => {
                    // ADMIN BYPASS: Complete access for kalebgibson.us@gmail.com
                    if (user?.email === "kalebgibson.us@gmail.com") {
                      setViewMode("dashboard");
                    }
                    else if (hasAccess("dashboard")) {
                      // Paying user with dashboard access
                      setViewMode("dashboard");
                    } else {
                      // Non-paying user - send to subscription page
                      navigate('/subscription');
                    }
                  }}
                  className="bg-blue-900 hover:bg-blue-800 text-white px-8 py-3 text-base font-semibold rounded-md transition-colors duration-200"
                  size="lg"
                >
                  <BarChart3 className="h-5 w-5 mr-2" />
                  Enter Your Dashboard
                </Button>
                <p className="text-white/70 text-sm mt-4 drop-shadow-sm">
                  ����� Track progress • 🏆 Earn rewards • ���� View insights •
                  🤖 Talk to Luna
                </p>
              </div>
            </div>
          )}

          <div className="mb-16">
            <div className="inline-block mb-8 px-4 py-2 bg-blue-100 rounded-md border border-blue-200">
              <span className="text-blue-900 font-medium text-sm">
                AI-Powered Sleep Solutions
              </span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Track, Optimize &
              <br />
              <span className="text-blue-900">Transform Your Sleep</span>
              <br />
              With AI Intelligence
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Monitor your sleep patterns, get personalized insights, and
              optimize your rest with AI-powered tracking and schedule
              recommendations
            </p>
          </div>

          {/* Main Action Button */}
          <div className="flex justify-center mb-20 max-w-2xl mx-auto px-4">
            <Card
              className="w-full max-w-md group hover:shadow-xl transition-all duration-300 cursor-pointer bg-white border-2 border-purple-200 shadow-lg hover:border-purple-300 hover:scale-105"
              onClick={handleSleepScheduleClick}
            >
              <CardContent className="p-10 text-center">
                <div className="mb-8">
                  <div className="p-5 bg-gradient-to-br from-purple-100 to-blue-100 rounded-2xl inline-block mb-6">
                    <Moon className="h-12 w-12 text-purple-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">
                    Take Your Free Sleep Assessment
                  </h2>
                  <p className="text-gray-600 mb-6 leading-relaxed text-lg">
                    Answer a few quick questions and let AI reveal how your sleep
                    impacts your health and productivity
                  </p>
                  <Badge className="bg-gradient-to-r from-purple-100 to-blue-100 text-purple-800 border-purple-300 mb-6 px-4 py-2 text-sm font-semibold">
                    ✓ 100% Free • ⏱️ 2 Minutes • ⚡ Instant Results
                  </Badge>
                </div>
                <Button
                  className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold py-4 text-lg rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl"
                  size="lg"
                  onClick={handleSleepScheduleClick}
                >
                  Take Free Assessment
                  <span className="ml-2 text-xl">→</span>
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Feature Highlights */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 max-w-5xl mx-auto px-4">
            <div className="text-center p-6 lg:p-8 bg-blue-900 rounded-lg border border-blue-800 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="p-4 bg-blue-100 rounded-lg inline-block mb-4">
                <BarChart3 className="h-8 w-8 text-blue-900" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-white">
                Advanced Sleep Tracking
              </h3>
              <p className="text-blue-100 leading-relaxed">
                Monitor sleep duration, quality, patterns, and get detailed
                analytics to understand your rest like never before
              </p>
            </div>
            <div className="text-center p-6 lg:p-8 bg-blue-900 rounded-lg border border-blue-800 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="p-4 bg-blue-100 rounded-lg inline-block mb-4">
                <Moon className="h-8 w-8 text-blue-900" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-white">
                Personalized Schedules
              </h3>
              <p className="text-blue-100 leading-relaxed">
                Every recommendation is uniquely tailored to your sleep
                patterns, goals, and lifestyle preferences
              </p>
            </div>
            <div className="text-center p-6 lg:p-8 bg-blue-900 rounded-lg border border-blue-800 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="p-4 bg-blue-100 rounded-lg inline-block mb-4">
                <Sun className="h-8 w-8 text-blue-900" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-white">
                Science-Backed
              </h3>
              <p className="text-blue-100 leading-relaxed">
                Built on cutting-edge sleep research, circadian rhythm science,
                and proven wellness methodologies
              </p>
            </div>
          </div>

          {/* Testimonials Section */}
          <div id="testimonials-section" className="mt-16 lg:mt-24 px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl lg:text-4xl font-bold text-blue-900 mb-4">
                What Our Users Say
              </h2>
              <p className="text-gray-600 text-lg lg:text-xl max-w-2xl mx-auto">
                Join thousands who've transformed their sleep and unlocked their
                potential
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 max-w-6xl mx-auto">
              {/* Testimonial 1 */}
              <div className="bg-blue-900 rounded-lg border border-blue-800 p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <div className="flex items-center mb-4">
                  <div className="relative">
                    <img
                      src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=60&h=60&fit=crop&crop=face"
                      alt="Sarah Chen"
                      className="w-12 h-12 rounded-full border-2 border-blue-200"
                    />
                    <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-green-500 rounded-full border-2 border-white shadow-md flex items-center justify-center">
                      <span className="text-white text-xs font-bold">✓</span>
                    </div>
                  </div>
                  <div className="ml-3">
                    <h4 className="text-white font-semibold">Sarah Chen</h4>
                    <p className="text-blue-200 text-sm">
                      Marketing Director, Google
                    </p>
                  </div>
                  <div className="ml-auto flex text-amber-400">
                    {"★".repeat(5)}
                  </div>
                </div>
                <p className="text-blue-100 italic leading-relaxed mb-4">
                  "I went from taking 45 minutes to fall asleep to just 8
                  minutes! The 4-7-8 breathing technique changed everything.
                  I've gained 2 hours of productivity every morning."
                </p>
                <div className="flex justify-between text-blue-200 text-xs">
                  <span>Sleep time: 45min ��� 8min</span>
                  <span>Energy: +85%</span>
                </div>
              </div>

              {/* Testimonial 2 */}
              <div className="bg-blue-900 rounded-lg border border-blue-800 p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <div className="flex items-center mb-4">
                  <img
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=60&h=60&fit=crop&crop=face"
                    alt="Marcus Rodriguez"
                    className="w-12 h-12 rounded-full border-2 border-white/30"
                  />
                  <div className="ml-3">
                    <h4 className="text-white font-semibold">
                      Marcus Rodriguez
                    </h4>
                    <p className="text-white/70 text-sm">Software Engineer</p>
                  </div>
                  <div className="ml-auto flex text-yellow-400">
                    {"★".repeat(5)}
                  </div>
                </div>
                <p className="text-white/85 italic leading-relaxed mb-4">
                  "The AI-personalized routine was spot on. My sleep quality
                  went from 6/10 to 9/10 in just 3 weeks. I wake up naturally at
                  6 AM now without an alarm!"
                </p>
                <div className="flex justify-between text-white/60 text-xs">
                  <span>��� Sleep quality: 6/10 → 9/10</span>
                  <span>⏰ Natural wake-up</span>
                </div>
              </div>

              {/* Testimonial 3 */}
              <div className="bg-blue-900 rounded-lg border border-blue-800 p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <div className="flex items-center mb-4">
                  <img
                    src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=60&h=60&fit=crop&crop=face"
                    alt="Emma Thompson"
                    className="w-12 h-12 rounded-full border-2 border-white/30"
                  />
                  <div className="ml-3">
                    <h4 className="text-white font-semibold">Emma Thompson</h4>
                    <p className="text-white/70 text-sm">Entrepreneur</p>
                  </div>
                  <div className="ml-auto flex text-yellow-400">
                    {"★".repeat(5)}
                  </div>
                </div>
                <p className="text-white/85 italic leading-relaxed mb-4">
                  "Finally achieved my first lucid dream after 2 months! The
                  progressive training and reality checks worked perfectly. This
                  app is life-changing."
                </p>
                <div className="flex justify-between text-white/60 text-xs">
                  <span>🧠 First lucid dream ✓</span>
                  <span>🎯 Dream control: Level 7</span>
                </div>
              </div>

              {/* Testimonial 4 */}
              <div className="bg-blue-900 rounded-lg border border-blue-800 p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <div className="flex items-center mb-4">
                  <img
                    src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=60&h=60&fit=crop&crop=face"
                    alt="David Kim"
                    className="w-12 h-12 rounded-full border-2 border-white/30"
                  />
                  <div className="ml-3">
                    <h4 className="text-white font-semibold">David Kim</h4>
                    <p className="text-white/70 text-sm">Medical Student</p>
                  </div>
                  <div className="ml-auto flex text-yellow-400">
                    {"★".repeat(5)}
                  </div>
                </div>
                <p className="text-white/85 italic leading-relaxed mb-4">
                  "As a med student pulling all-nighters, I needed something
                  that actually worked. My focus improved 300% and I sleep 2
                  hours less but feel more rested."
                </p>
                <div className="flex justify-between text-white/60 text-xs">
                  <span>🎯 Focus: +300%</span>
                  <span>⚡ Sleep efficiency: +40%</span>
                </div>
              </div>

              {/* Testimonial 5 */}
              <div className="bg-blue-900 rounded-lg border border-blue-800 p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <div className="flex items-center mb-4">
                  <img
                    src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=60&h=60&fit=crop&crop=face"
                    alt="Jessica Williams"
                    className="w-12 h-12 rounded-full border-2 border-white/30"
                  />
                  <div className="ml-3">
                    <h4 className="text-white font-semibold">
                      Jessica Williams
                    </h4>
                    <p className="text-white/70 text-sm">Working Mom</p>
                  </div>
                  <div className="ml-auto flex text-yellow-400">
                    {"★".repeat(5)}
                  </div>
                </div>
                <p className="text-white/85 italic leading-relaxed mb-4">
                  "With two kids and a full-time job, I thought good sleep was
                  impossible. Luna's AI coaching helped me optimize my limited
                  sleep time perfectly."
                </p>
                <div className="flex justify-between text-white/60 text-xs">
                  <span>👶 Busy mom routine</span>
                  <span>🌟 Deep sleep: +60%</span>
                </div>
              </div>

              {/* Testimonial 6 */}
              <div className="bg-blue-900 rounded-lg border border-blue-800 p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <div className="flex items-center mb-4">
                  <img
                    src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=60&h=60&fit=crop&crop=face"
                    alt="Michael Chang"
                    className="w-12 h-12 rounded-full border-2 border-white/30"
                  />
                  <div className="ml-3">
                    <h4 className="text-white font-semibold">Michael Chang</h4>
                    <p className="text-white/70 text-sm">Fitness Coach</p>
                  </div>
                  <div className="ml-auto flex text-yellow-400">
                    {"★".repeat(5)}
                  </div>
                </div>
                <p className="text-white/85 italic leading-relaxed mb-4">
                  "The morning routine builder synced perfectly with my training
                  schedule. My clients now ask what changed - it's the
                  consistent 5 AM wake-ups and optimized recovery."
                </p>
                <div className="flex justify-between text-white/60 text-xs">
                  <span>������� 5 AM wake-ups ✓</span>
                  <span>💪 Recovery: +50%</span>
                </div>
              </div>
            </div>

            {/* Social Proof Stats */}
            <div className="mt-12 bg-blue-900 rounded-lg border border-blue-800 p-8 max-w-4xl mx-auto shadow-lg">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 text-center">
                <div>
                  <div className="text-3xl lg:text-4xl font-bold text-white mb-2">
                    12,847
                  </div>
                  <div className="text-white/70 text-sm">
                    Sleep Routines Created
                  </div>
                </div>
                <div>
                  <div className="text-3xl lg:text-4xl font-bold text-white mb-2">
                    4.9★
                  </div>
                  <div className="text-white/70 text-sm">Average Rating</div>
                </div>
                <div>
                  <div className="text-3xl lg:text-4xl font-bold text-white mb-2">
                    89%
                  </div>
                  <div className="text-white/70 text-sm">
                    Sleep Quality Improvement
                  </div>
                </div>
                <div>
                  <div className="text-3xl lg:text-4xl font-bold text-white mb-2">
                    2.3x
                  </div>
                  <div className="text-white/70 text-sm">
                    Faster Sleep Times
                  </div>
                </div>
              </div>
            </div>

            {/* Trust Badges */}
            <div className="mt-8 flex justify-center items-center gap-8 flex-wrap text-gray-600 text-sm">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-blue-900 rounded-full"></span>
                Featured in Sleep Medicine Journal
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-blue-900 rounded-full"></span>
                Recommended by Sleep Specialists
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-blue-900 rounded-full"></span>
                30-Day Money Back Guarantee
              </div>
            </div>
          </div>
        </div>
      </main>


      {/* Welcome Sleep Journey Onboarding */}
      <SleepJourneyOnboarding
        isVisible={showWelcomeOnboarding}
        onComplete={handleWelcomeOnboardingComplete}
        onSkip={handleWelcomeOnboardingSkip}
      />
    </div>
  );
}
