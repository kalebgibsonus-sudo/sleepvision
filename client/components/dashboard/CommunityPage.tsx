import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRewards } from "@/hooks/useRewards";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Users,
  Heart,
  MessageCircle,
  Share2,
  Star,
  Trophy,
  Flame,
  Moon,
  Sun,
  Wind,
  Target,
  Calendar,
  TrendingUp,
  ArrowLeft,
  Home,
  Send,
  ThumbsUp,
  Award,
  Clock,
  Sparkles,
  CheckCircle,
  Crown,
  Zap,
} from "lucide-react";

interface CommunityPageProps {
  onNavigate: (page: string) => void;
  onGoHome?: () => void;
}

interface CommunityUser {
  id: string;
  name: string;
  avatar: string;
  level: number;
  title: string;
  joinedDays: number;
  streak: number;
  sleepScore: number;
  location: string;
  badges: string[];
}

interface CommunityPost {
  id: string;
  author: CommunityUser;
  content: string;
  timestamp: string;
  likes: number;
  comments: number;
  category: "success" | "tip" | "question" | "milestone" | "challenge";
  hasLiked: boolean;
  image?: string;
  achievement?: string;
}

interface Challenge {
  id: string;
  title: string;
  description: string;
  participants: number;
  daysLeft: number;
  reward: string;
  category: "sleep" | "breathing" | "consistency";
  difficulty: "easy" | "medium" | "hard";
}

export function CommunityPage({ onNavigate, onGoHome }: CommunityPageProps) {
  const { user } = useAuth();
  const { userLevel } = useRewards();
  const [activeTab, setActiveTab] = useState("feed");
  const [newPostContent, setNewPostContent] = useState("");
  const [selectedPostCategory, setSelectedPostCategory] = useState("tip");
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [expandedComments, setExpandedComments] = useState<
    Record<string, boolean>
  >({});
  const [newComments, setNewComments] = useState<Record<string, string>>({});
  const [postComments, setPostComments] = useState<
    Record<
      string,
      Array<{
        id: string;
        author: string;
        content: string;
        timestamp: string;
        likes: number;
      }>
    >
  >({});
  const [liveUpdates, setLiveUpdates] = useState(true);
  const [onlineMembers, setOnlineMembers] = useState(342);
  const [activeChallengeParticipants, setActiveChallengeParticipants] =
    useState(new Set<string>());
  const [communityGoals, setCommunityGoals] = useState({
    weeklyTarget: 10000,
    currentProgress: 7832,
    description: "Community Sleep Hours This Week",
  });

  // Simulate live updates
  useEffect(() => {
    if (!liveUpdates) return;

    const interval = setInterval(() => {
      // Simulate new likes/comments
      setPosts((prev) =>
        prev.map((post) => ({
          ...post,
          likes: post.likes + Math.floor(Math.random() * 3),
          comments: post.comments + Math.floor(Math.random() * 2),
        })),
      );

      // Update online members count
      setOnlineMembers((prev) =>
        Math.max(200, prev + Math.floor(Math.random() * 10) - 5),
      );

      // Update community goals
      setCommunityGoals((prev) => ({
        ...prev,
        currentProgress: Math.min(
          prev.weeklyTarget,
          prev.currentProgress + Math.floor(Math.random() * 50),
        ),
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, [liveUpdates]);

  // Initialize posts with community data after component mounts
  useEffect(() => {
    const communityPosts: CommunityPost[] = [
      {
        id: "1",
        author: {
          id: "1",
          name: "Sarah Chen",
          avatar:
            "https://images.unsplash.com/photo-1494790108755-2616b332b877?w=150&h=150&fit=crop&crop=face",
          level: 8,
          title: "Dream Architect",
          joinedDays: 127,
          streak: 45,
          sleepScore: 92,
          location: "San Francisco, CA",
          badges: ["30-Day Warrior", "Wim Hof Master", "Sleep Sage"],
        },
        content:
          "Just hit my 45-day streak! 🔥 The 4-7-8 breathing technique has been a game-changer for my sleep. I fall asleep within 5 minutes now instead of tossing and turning for hours. Thank you SleepVision community for all the support!",
        timestamp: "2 hours ago",
        likes: 47,
        comments: 12,
        category: "milestone",
        hasLiked: false,
        achievement: "45-Day Sleep Streak",
      },
      {
        id: "2",
        author: {
          id: "2",
          name: "Marcus Rodriguez",
          avatar:
            "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
          level: 6,
          title: "Routine Builder",
          joinedDays: 89,
          streak: 23,
          sleepScore: 87,
          location: "Austin, TX",
          badges: ["Early Bird", "Consistency King"],
        },
        content:
          "PSA: Don't underestimate the power of blackout curtains! 🌚 I was skeptical at first, but my deep sleep increased by 40% according to my tracker. Sometimes the simplest changes make the biggest difference.",
        timestamp: "5 hours ago",
        likes: 31,
        comments: 8,
        category: "tip",
        hasLiked: true,
      },
    ];

    setPosts(communityPosts);
  }, []);

  // Realistic community users with Facebook-style profile pictures
  const communityUsers: CommunityUser[] = [
    {
      id: "1",
      name: "Sarah Chen",
      avatar:
        "https://images.unsplash.com/photo-1494790108755-2616b332b877?w=150&h=150&fit=crop&crop=face",
      level: 8,
      title: "Dream Architect",
      joinedDays: 127,
      streak: 45,
      sleepScore: 92,
      location: "San Francisco, CA",
      badges: ["30-Day Warrior", "Wim Hof Master", "Sleep Sage"],
    },
    {
      id: "2",
      name: "Marcus Johnson",
      avatar:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
      level: 6,
      title: "Rest Master",
      joinedDays: 89,
      streak: 23,
      sleepScore: 87,
      location: "Austin, TX",
      badges: ["Breathing Expert", "Morning Champion"],
    },
    {
      id: "3",
      name: "Emma Rodriguez",
      avatar:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
      level: 9,
      title: "Sleep Shaman",
      joinedDays: 156,
      streak: 78,
      sleepScore: 95,
      location: "Barcelona, Spain",
      badges: ["Century Club", "Luna's Favorite", "Zen Master"],
    },
    {
      id: "4",
      name: "David Kim",
      avatar:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
      level: 4,
      title: "Sleep Warrior",
      joinedDays: 67,
      streak: 15,
      sleepScore: 81,
      location: "Seoul, South Korea",
      badges: ["Tech Optimizer", "Night Owl Transformer"],
    },
    {
      id: "5",
      name: "Priya Patel",
      avatar:
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face",
      level: 7,
      title: "Zen Master",
      joinedDays: 112,
      streak: 34,
      sleepScore: 90,
      location: "Mumbai, India",
      badges: ["Meditation Master", "Breathing Guru", "Wellness Warrior"],
    },
    {
      id: "6",
      name: "Alex Thompson",
      avatar:
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
      level: 5,
      title: "Rest Master",
      joinedDays: 78,
      streak: 21,
      sleepScore: 85,
      location: "London, UK",
      badges: ["Weekend Warrior", "Progress Tracker"],
    },
    {
      id: "7",
      name: "Maria Santos",
      avatar:
        "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face",
      level: 6,
      title: "Rest Master",
      joinedDays: 95,
      streak: 28,
      sleepScore: 88,
      location: "São Paulo, Brazil",
      badges: ["Consistency Queen", "Sleep Optimizer"],
    },
    {
      id: "8",
      name: "Ryan O'Connor",
      avatar:
        "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop&crop=face",
      level: 3,
      title: "Dream Walker",
      joinedDays: 45,
      streak: 12,
      sleepScore: 76,
      location: "Dublin, Ireland",
      badges: ["New Member", "Early Adopter"],
    },
  ];

  const challenges: Challenge[] = [
    {
      id: "1",
      title: "7-Day Sleep Consistency Challenge",
      description:
        "Track your sleep for 7 consecutive days and maintain the same bedtime routine",
      participants: 1247,
      daysLeft: 4,
      reward: "Consistency Champion Badge + 100 XP",
      category: "consistency",
      difficulty: "easy",
    },
    {
      id: "2",
      title: "Master the Wim Hof Method",
      description: "Complete 5 Wim Hof breathing sessions within 2 weeks",
      participants: 643,
      daysLeft: 9,
      reward: "Ice Man Badge + Tummo Breathing Unlock",
      category: "breathing",
      difficulty: "hard",
    },
    {
      id: "3",
      title: "Morning Meditation Marathon",
      description:
        "Practice morning breathing exercises for 10 consecutive days",
      participants: 892,
      daysLeft: 12,
      reward: "Zen Master Badge + Morning Boost Theme",
      category: "breathing",
      difficulty: "medium",
    },
    {
      id: "4",
      title: "Quality Sleep Quest",
      description: "Achieve 8+ sleep quality rating for 5 nights in a row",
      participants: 2156,
      daysLeft: 6,
      reward: "Sleep Expert Badge + Luna Pro Features",
      category: "sleep",
      difficulty: "medium",
    },
  ];

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "success":
        return <Trophy className="h-4 w-4 text-blue-500" />;
      case "tip":
        return <Sparkles className="h-4 w-4 text-blue-500" />;
      case "question":
        return <MessageCircle className="h-4 w-4 text-blue-500" />;
      case "milestone":
        return <Star className="h-4 w-4 text-blue-500" />;
      case "challenge":
        return <Target className="h-4 w-4 text-blue-500" />;
      default:
        return <Heart className="h-4 w-4 text-blue-500" />;
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "easy":
        return "bg-blue-100 text-blue-800";
      case "medium":
        return "bg-blue-200 text-blue-800";
      case "hard":
        return "bg-blue-300 text-blue-900";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatTimeAgo = (timestamp: string) => {
    return timestamp; // Simplified for demo
  };

  const handleLike = (postId: string) => {
    setPosts((prev) =>
      prev.map((post) => {
        if (post.id === postId) {
          return {
            ...post,
            hasLiked: !post.hasLiked,
            likes: post.hasLiked ? post.likes - 1 : post.likes + 1,
          };
        }
        return post;
      }),
    );
  };

  const toggleComments = (postId: string) => {
    setExpandedComments((prev) => ({
      ...prev,
      [postId]: !prev[postId],
    }));
  };

  const handleComment = (postId: string) => {
    const commentContent = newComments[postId]?.trim();
    if (!commentContent) return;

    const newComment = {
      id: Date.now().toString(),
      author: user?.name || "You",
      content: commentContent,
      timestamp: "Just now",
      likes: 0,
    };

    setPostComments((prev) => ({
      ...prev,
      [postId]: [...(prev[postId] || []), newComment],
    }));

    setPosts((prev) =>
      prev.map((post) => {
        if (post.id === postId) {
          return { ...post, comments: post.comments + 1 };
        }
        return post;
      }),
    );

    setNewComments((prev) => ({
      ...prev,
      [postId]: "",
    }));
  };

  const handleCreatePost = () => {
    if (!newPostContent.trim()) return;

    const newPost: CommunityPost = {
      id: Date.now().toString(),
      author: {
        id: "current-user",
        name: user?.name || "You",
        avatar: "", // No auto-generated profile picture
        level: userLevel.level,
        title: "Community Member",
        joinedDays: 1,
        streak: 1,
        sleepScore: 85,
        location: "Your Location",
        badges: ["New Member"],
      },
      content: newPostContent,
      timestamp: "Just now",
      likes: 0,
      comments: 0,
      category: selectedPostCategory as any,
      hasLiked: false,
    };

    setPosts((prev) => [newPost, ...prev]);
    setNewPostContent("");
    setShowCreatePost(false);
  };

  const handleJoinEvent = (eventName: string) => {
    alert(
      `Successfully joined "${eventName}"! You'll receive a confirmation email shortly.`,
    );
  };

  const handleReserveSpot = (eventName: string) => {
    alert(`Spot reserved for "${eventName}"! Check your email for details.`);
  };

  const handleRSVP = (eventName: string) => {
    alert(`RSVP confirmed for "${eventName}"! See you there!`);
  };

  const handleJoinChallenge = (challengeId: string, challengeTitle: string) => {
    setActiveChallengeParticipants((prev) => new Set([...prev, challengeId]));
    alert(`You've joined the "${challengeTitle}" challenge! Good luck! 🎯`);
  };

  const handleConnect = (memberName: string) => {
    alert(`Connection request sent to ${memberName}! They'll be notified.`);
  };

  const handleShare = (postId: string) => {
    alert(
      "Post shared to your social media! Spreading the sleep optimization love!",
    );
  };

  const handleHelpful = (postId: string) => {
    alert("Marked as helpful! This will help other users find useful content.");
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto p-4 lg:p-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4">
        <div>
          <h1 className="text-2xl lg:text-4xl font-bold text-blue-700 mb-2 flex items-center gap-3">
            <Users className="h-8 w-8 lg:h-10 lg:w-10 text-blue-600" />
            SleepVision Community
          </h1>
          <p className="text-blue-600 text-lg">
            Connect with fellow sleep optimizers and share your journey
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            onClick={() => onNavigate("dashboard")}
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

      {/* Community Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-blue-50 border border-blue-200">
          <CardContent className="p-4 text-center">
            <Users className="h-8 w-8 text-blue-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-blue-700">12,847</div>
            <div className="text-sm text-blue-600 font-medium">
              Active Members
            </div>
          </CardContent>
        </Card>
        <Card className="bg-blue-50 border border-blue-200">
          <CardContent className="p-4 text-center">
            <Zap className="h-8 w-8 text-blue-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-blue-700">
              {onlineMembers}
            </div>
            <div className="text-sm text-blue-600 font-medium">Online Now</div>
            <div className="flex justify-center mt-1">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-blue-50 border border-blue-200">
          <CardContent className="p-4 text-center">
            <Target className="h-8 w-8 text-blue-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-blue-700">4</div>
            <div className="text-sm text-blue-600 font-medium">
              Active Challenges
            </div>
          </CardContent>
        </Card>
        <Card className="bg-blue-50 border border-blue-200">
          <CardContent className="p-4 text-center">
            <Trophy className="h-8 w-8 text-blue-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-blue-700">156</div>
            <div className="text-sm text-blue-600 font-medium">
              Success Stories
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Community Goal Progress */}
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl font-bold text-blue-800 flex items-center gap-2">
              <Flame className="h-6 w-6 text-orange-500" />
              {communityGoals.description}
            </CardTitle>
            <div className="flex items-center gap-2">
              {liveUpdates && (
                <div className="flex items-center gap-1 text-sm text-green-600">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  Live Updates
                </div>
              )}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setLiveUpdates(!liveUpdates)}
                className="text-blue-700 border-blue-300"
              >
                {liveUpdates ? "Pause" : "Resume"}
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between text-lg font-medium text-blue-800">
              <span>
                {communityGoals.currentProgress.toLocaleString()} hours
              </span>
              <span>
                {communityGoals.weeklyTarget.toLocaleString()} hours goal
              </span>
            </div>
            <div className="w-full bg-blue-200 rounded-full h-4">
              <div
                className="bg-gradient-to-r from-blue-500 to-indigo-600 h-4 rounded-full transition-all duration-1000 flex items-center justify-end pr-2"
                style={{
                  width: `${Math.min(100, (communityGoals.currentProgress / communityGoals.weeklyTarget) * 100)}%`,
                }}
              >
                <span className="text-white text-xs font-bold">
                  {Math.round(
                    (communityGoals.currentProgress /
                      communityGoals.weeklyTarget) *
                      100,
                  )}
                  %
                </span>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="bg-white/50 rounded-lg p-3">
                <div className="text-xl font-bold text-blue-700">
                  {(
                    communityGoals.weeklyTarget - communityGoals.currentProgress
                  ).toLocaleString()}
                </div>
                <div className="text-sm text-blue-600">Hours to Goal</div>
              </div>
              <div className="bg-white/50 rounded-lg p-3">
                <div className="text-xl font-bold text-blue-700">2.5</div>
                <div className="text-sm text-blue-600">Days Remaining</div>
              </div>
              <div className="bg-white/50 rounded-lg p-3">
                <div className="text-xl font-bold text-blue-700">8.2</div>
                <div className="text-sm text-blue-600">Avg per Member</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Content */}
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-6"
      >
        <TabsList className="grid w-full grid-cols-6 bg-blue-50 border border-blue-200">
          <TabsTrigger
            value="feed"
            className="flex items-center gap-2 data-[state=active]:bg-blue-200 data-[state=active]:text-blue-800 font-medium text-blue-700"
          >
            <MessageCircle className="h-4 w-4" />
            <span className="hidden sm:inline">Feed</span>
          </TabsTrigger>
          <TabsTrigger
            value="challenges"
            className="flex items-center gap-2 data-[state=active]:bg-blue-200 data-[state=active]:text-blue-800 font-medium text-blue-700"
          >
            <Target className="h-4 w-4" />
            <span className="hidden sm:inline">Challenges</span>
          </TabsTrigger>
          <TabsTrigger
            value="events"
            className="flex items-center gap-2 data-[state=active]:bg-blue-200 data-[state=active]:text-blue-800 font-medium text-blue-700"
          >
            <Calendar className="h-4 w-4" />
            <span className="hidden sm:inline">Events</span>
          </TabsTrigger>
          <TabsTrigger
            value="leaderboard"
            className="flex items-center gap-2 data-[state=active]:bg-blue-200 data-[state=active]:text-blue-800 font-medium text-blue-700"
          >
            <Trophy className="h-4 w-4" />
            <span className="hidden sm:inline">Leaderboard</span>
          </TabsTrigger>
          <TabsTrigger
            value="members"
            className="flex items-center gap-2 data-[state=active]:bg-blue-200 data-[state=active]:text-blue-800 font-medium text-blue-700"
          >
            <Users className="h-4 w-4" />
            <span className="hidden sm:inline">Members</span>
          </TabsTrigger>
          <TabsTrigger
            value="chat"
            className="flex items-center gap-2 data-[state=active]:bg-blue-200 data-[state=active]:text-blue-800 font-medium text-blue-700"
          >
            <MessageCircle className="h-4 w-4" />
            <span className="hidden sm:inline">Live Chat</span>
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          </TabsTrigger>
        </TabsList>

        {/* Feed Tab */}
        <TabsContent value="feed" className="space-y-6">
          {/* Create Post */}
          <Card className="bg-white border border-blue-200">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl font-bold text-blue-800 flex items-center gap-2">
                  <Sparkles className="h-6 w-6 text-blue-600" />
                  Share Your Sleep Journey
                </CardTitle>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowCreatePost(!showCreatePost)}
                  className="flex items-center gap-2 border-blue-200 text-blue-700 hover:bg-blue-50"
                >
                  {showCreatePost ? "Cancel" : "Create Post"}
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            {showCreatePost && (
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                      <span className="text-gray-500 text-xs">No Image</span>
                    </div>
                    <div className="flex-1 space-y-4">
                      <div className="space-y-3">
                        <label className="text-sm font-semibold text-blue-800">
                          Post Type
                        </label>
                        <div className="flex flex-wrap gap-2">
                          {[
                            {
                              value: "tip",
                              label: "💡 Tip",
                              color:
                                "bg-blue-100 text-blue-800 border-blue-300",
                            },
                            {
                              value: "success",
                              label: "🎉 Success",
                              color:
                                "bg-blue-100 text-blue-800 border-blue-300",
                            },
                            {
                              value: "question",
                              label: "❓ Question",
                              color:
                                "bg-blue-100 text-blue-800 border-blue-300",
                            },
                            {
                              value: "milestone",
                              label: "🏆 Milestone",
                              color:
                                "bg-blue-100 text-blue-800 border-blue-300",
                            },
                          ].map((type) => (
                            <Badge
                              key={type.value}
                              className={`cursor-pointer transition-all font-medium px-3 py-1 ${
                                selectedPostCategory === type.value
                                  ? type.color +
                                    " ring-2 ring-offset-2 ring-blue-400 shadow-sm"
                                  : "bg-gray-100 text-gray-700 hover:bg-gray-200 border-gray-300"
                              }`}
                              onClick={() =>
                                setSelectedPostCategory(type.value)
                              }
                            >
                              {type.label}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <Textarea
                        placeholder={`Share a ${selectedPostCategory}... Tell the community about your sleep journey!`}
                        value={newPostContent}
                        onChange={(e) => setNewPostContent(e.target.value)}
                        className="min-h-[120px] resize-none border-blue-300 focus:border-blue-500 focus:ring-blue-500"
                      />
                      <div className="flex items-center justify-between bg-blue-50 p-3 rounded-lg border border-blue-200">
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-2 text-sm text-blue-700">
                            <Users className="h-4 w-4 text-blue-600" />
                            <span className="font-medium">
                              Posting as Level {userLevel.level}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-blue-700">
                            <Award className="h-4 w-4 text-blue-600" />
                            <span className="font-medium">
                              +5 XP for sharing
                            </span>
                          </div>
                        </div>
                        <Button
                          size="sm"
                          onClick={handleCreatePost}
                          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium"
                          disabled={!newPostContent.trim()}
                        >
                          <Send className="h-4 w-4" />
                          Share with Community
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            )}
          </Card>

          {/* Posts Feed */}
          <div className="space-y-6">
            {posts.map((post) => (
              <Card
                key={post.id}
                className="hover:shadow-lg transition-shadow bg-white border border-blue-200"
              >
                <CardContent className="p-6">
                  <div className="space-y-4">
                    {/* Post Header */}
                    <div className="flex items-start gap-4">
                      <img
                        src={post.author.avatar}
                        alt={post.author.name}
                        className="w-14 h-14 rounded-full object-cover border-2 border-blue-200"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="font-bold text-blue-800 text-lg">
                            {post.author.name}
                          </h4>
                          <Badge className="bg-blue-100 text-blue-800 text-xs font-semibold">
                            Level {post.author.level}
                          </Badge>
                          <Badge
                            variant="outline"
                            className="text-xs border-blue-300 text-blue-700 font-medium"
                          >
                            {post.author.title}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-blue-600">
                          <span className="font-medium">
                            {post.author.location}
                          </span>
                          <span>•</span>
                          <span className="font-medium">
                            {formatTimeAgo(post.timestamp)}
                          </span>
                          <div className="flex items-center gap-1">
                            {getCategoryIcon(post.category)}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Achievement Badge */}
                    {post.achievement && (
                      <div className="bg-blue-50 border border-blue-300 rounded-lg p-4 flex items-center gap-3">
                        <Trophy className="h-6 w-6 text-blue-600" />
                        <span className="text-blue-800 font-semibold">
                          🏆 Achievement Unlocked: {post.achievement}
                        </span>
                      </div>
                    )}

                    {/* Post Content */}
                    <p className="text-gray-800 leading-relaxed text-base font-medium">
                      {post.content}
                    </p>

                    {/* Post Actions */}
                    <div className="border-t border-blue-200 pt-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => handleLike(post.id)}
                            className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all font-medium ${
                              post.hasLiked
                                ? "bg-blue-100 text-blue-700 shadow-sm border border-blue-200"
                                : "hover:bg-blue-50 text-blue-700 border border-blue-200"
                            }`}
                          >
                            <Heart
                              className={`h-4 w-4 ${post.hasLiked ? "fill-current" : ""}`}
                            />
                            <span className="text-sm">{post.likes}</span>
                          </button>
                          <button
                            onClick={() => toggleComments(post.id)}
                            className="flex items-center gap-2 px-4 py-2 rounded-full hover:bg-blue-100 text-blue-700 hover:text-blue-800 transition-all font-medium border border-blue-200 hover:border-blue-300"
                          >
                            <MessageCircle className="h-4 w-4" />
                            <span className="text-sm">{post.comments}</span>
                          </button>
                          <button
                            className="flex items-center gap-2 px-4 py-2 rounded-full hover:bg-blue-100 text-blue-700 hover:text-blue-800 transition-all font-medium border border-blue-200 hover:border-blue-300"
                            onClick={() => handleHelpful(post.id)}
                          >
                            <ThumbsUp className="h-4 w-4" />
                            <span className="text-sm">Helpful</span>
                          </button>
                          <button
                            className="flex items-center gap-2 px-4 py-2 rounded-full hover:bg-blue-100 text-blue-700 hover:text-blue-800 transition-all font-medium border border-blue-200 hover:border-blue-300"
                            onClick={() => handleShare(post.id)}
                          >
                            <Share2 className="h-4 w-4" />
                            <span className="text-sm">Share</span>
                          </button>
                        </div>
                        <div className="flex items-center gap-2">
                          {post.author.badges
                            .slice(0, 2)
                            .map((badge, index) => (
                              <Badge
                                key={index}
                                variant="outline"
                                className="text-xs hover:bg-blue-50 cursor-pointer transition-colors border-blue-300 text-blue-700 font-medium"
                              >
                                {badge}
                              </Badge>
                            ))}
                        </div>
                      </div>

                      {/* Comments Section */}
                      {expandedComments[post.id] && (
                        <div className="mt-4 space-y-4 bg-blue-50 rounded-lg p-4 border border-blue-200">
                          {/* Add Comment */}
                          <div className="flex gap-3">
                            <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                              <span className="text-gray-500 text-xs">
                                No Image
                              </span>
                            </div>
                            <div className="flex-1 flex gap-2">
                              <Input
                                placeholder="Write a comment..."
                                value={newComments[post.id] || ""}
                                onChange={(e) =>
                                  setNewComments((prev) => ({
                                    ...prev,
                                    [post.id]: e.target.value,
                                  }))
                                }
                                className="flex-1 border-blue-300 focus:border-blue-500 focus:ring-blue-500"
                                onKeyPress={(e) => {
                                  if (e.key === "Enter") {
                                    handleComment(post.id);
                                  }
                                }}
                              />
                              <Button
                                size="sm"
                                onClick={() => handleComment(post.id)}
                                disabled={!newComments[post.id]?.trim()}
                                className="bg-blue-600 hover:bg-blue-700"
                              >
                                <Send className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>

                          {/* Comments List */}
                          <div className="space-y-3">
                            {postComments[post.id]?.map((comment) => (
                              <div
                                key={comment.id}
                                className="bg-white rounded-lg p-3 border border-blue-200"
                              >
                                <div className="flex items-start gap-3">
                                  <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                                    <span className="text-gray-500 text-xs">
                                      No Image
                                    </span>
                                  </div>
                                  <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                      <span className="font-semibold text-blue-800 text-sm">
                                        {comment.author}
                                      </span>
                                      <span className="text-xs text-blue-500">
                                        {comment.timestamp}
                                      </span>
                                    </div>
                                    <p className="text-blue-700 text-sm">
                                      {comment.content}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Events Tab */}
        <TabsContent value="events" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Upcoming Events */}
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-blue-800 flex items-center gap-2">
                <Calendar className="h-6 w-6 text-blue-600" />
                Upcoming Events
              </h3>

              <Card className="bg-blue-50 border border-blue-200">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="bg-blue-200 p-3 rounded-full">
                      <Moon className="h-6 w-6 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-lg text-blue-800">
                        Weekly Sleep Meditation
                      </h4>
                      <p className="text-blue-700 mb-3">
                        Join Luna for a guided group meditation session
                      </p>
                      <div className="flex items-center gap-4 text-sm text-blue-600 mb-4">
                        <span className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          Tonight, 9:00 PM EST
                        </span>
                        <span className="flex items-center gap-1">
                          <Users className="h-4 w-4" />
                          347 attending
                        </span>
                      </div>
                      <Button
                        size="sm"
                        className="bg-blue-600 hover:bg-blue-700"
                        onClick={() =>
                          handleJoinEvent("Weekly Sleep Meditation")
                        }
                      >
                        Join Session
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-blue-50 border border-blue-200">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="bg-blue-200 p-3 rounded-full">
                      <Wind className="h-6 w-6 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-lg text-blue-800">
                        Wim Hof Workshop
                      </h4>
                      <p className="text-blue-700 mb-3">
                        Master advanced breathing techniques with expert
                        guidance
                      </p>
                      <div className="flex items-center gap-4 text-sm text-blue-600 mb-4">
                        <span className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          Saturday, 2:00 PM EST
                        </span>
                        <span className="flex items-center gap-1">
                          <Users className="h-4 w-4" />
                          89 spots left
                        </span>
                      </div>
                      <Button
                        size="sm"
                        className="bg-blue-600 hover:bg-blue-700"
                        onClick={() => handleReserveSpot("Wim Hof Workshop")}
                      >
                        Reserve Spot
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-blue-50 border border-blue-200">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="bg-blue-200 p-3 rounded-full">
                      <Trophy className="h-6 w-6 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-lg text-blue-800">
                        Monthly Challenge Awards
                      </h4>
                      <p className="text-blue-700 mb-3">
                        Celebrate top performers and share success stories
                      </p>
                      <div className="flex items-center gap-4 text-sm text-blue-600 mb-4">
                        <span className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          Next Monday, 7:00 PM EST
                        </span>
                        <span className="flex items-center gap-1">
                          <Crown className="h-4 w-4" />
                          Special rewards
                        </span>
                      </div>
                      <Button
                        size="sm"
                        className="bg-blue-600 hover:bg-blue-700"
                        onClick={() => handleRSVP("Monthly Challenge Awards")}
                      >
                        RSVP
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Community Spotlight */}
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-blue-800 flex items-center gap-2">
                <Star className="h-6 w-6 text-blue-600" />
                Community Spotlight
              </h3>

              <Card className="bg-blue-50 border border-blue-200">
                <CardContent className="p-6">
                  <div className="text-center space-y-4">
                    <div className="flex justify-center">
                      <img
                        src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face"
                        alt="Member of the Month"
                        className="w-20 h-20 rounded-full object-cover border-4 border-blue-400"
                      />
                    </div>
                    <div>
                      <h4 className="font-bold text-xl text-blue-800">
                        Member of the Month
                      </h4>
                      <p className="text-blue-700 font-medium">
                        Emma Rodriguez
                      </p>
                      <p className="text-blue-600 text-sm">
                        78-day streak • Sleep Shaman
                      </p>
                    </div>
                    <div className="bg-white p-4 rounded-lg">
                      <p className="text-blue-700 italic text-sm">
                        "The combination of breathing techniques and community
                        support has transformed my sleep completely. I went from
                        4 hours of restless sleep to 8 hours of deep,
                        rejuvenating rest!"
                      </p>
                    </div>
                    <Badge className="bg-blue-500 text-white">
                      🏆 Champion
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Stats */}
              <Card className="bg-white border border-blue-200">
                <CardHeader>
                  <CardTitle className="text-lg text-blue-800">
                    This Week's Highlights
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-blue-50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">
                        1,247
                      </div>
                      <div className="text-sm text-blue-700">
                        Success Stories
                      </div>
                    </div>
                    <div className="text-center p-3 bg-blue-50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">
                        3.2M
                      </div>
                      <div className="text-sm text-blue-700">Breaths Taken</div>
                    </div>
                    <div className="text-center p-3 bg-blue-50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">
                        89%
                      </div>
                      <div className="text-sm text-blue-700">Sleep Quality</div>
                    </div>
                    <div className="text-center p-3 bg-blue-50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">
                        456
                      </div>
                      <div className="text-sm text-blue-700">New Members</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* Challenges Tab */}
        <TabsContent value="challenges" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {challenges.map((challenge) => (
              <Card
                key={challenge.id}
                className="hover:shadow-lg transition-shadow bg-white border border-blue-200"
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg mb-2 text-blue-800">
                        {challenge.title}
                      </CardTitle>
                      <div className="flex items-center gap-2">
                        <Badge
                          className={getDifficultyColor(challenge.difficulty)}
                        >
                          {challenge.difficulty}
                        </Badge>
                        <Badge
                          variant="outline"
                          className="border-blue-300 text-blue-700"
                        >
                          {challenge.category}
                        </Badge>
                      </div>
                    </div>
                    <Target className="h-6 w-6 text-blue-600" />
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-blue-600 mb-4">{challenge.description}</p>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-blue-600">Participants</span>
                      <span className="font-medium text-blue-700">
                        {challenge.participants.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-blue-600">Days Left</span>
                      <span className="font-medium text-blue-700">
                        {challenge.daysLeft} days
                      </span>
                    </div>
                    <div className="bg-blue-50 p-3 rounded-lg">
                      <p className="text-blue-800 text-sm font-medium">
                        Reward: {challenge.reward}
                      </p>
                    </div>
                    <Button
                      className={`w-full transition-all ${
                        activeChallengeParticipants.has(challenge.id)
                          ? "bg-green-600 hover:bg-green-700"
                          : "bg-blue-600 hover:bg-blue-700"
                      }`}
                      onClick={() =>
                        handleJoinChallenge(challenge.id, challenge.title)
                      }
                      disabled={activeChallengeParticipants.has(challenge.id)}
                    >
                      {activeChallengeParticipants.has(challenge.id) ? (
                        <span className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4" />
                          Joined
                        </span>
                      ) : (
                        "Join Challenge"
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Leaderboard Tab */}
        <TabsContent value="leaderboard" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Top Streaks */}
            <Card className="bg-white border border-blue-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-blue-800">
                  <Flame className="h-6 w-6 text-blue-600" />
                  Top Streaks This Month
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {communityUsers
                    .sort((a, b) => b.streak - a.streak)
                    .slice(0, 5)
                    .map((user, index) => (
                      <div
                        key={user.id}
                        className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg"
                      >
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-white ${
                            index === 0
                              ? "bg-blue-600"
                              : index === 1
                                ? "bg-blue-500"
                                : index === 2
                                  ? "bg-blue-400"
                                  : "bg-blue-300"
                          }`}
                        >
                          {index + 1}
                        </div>
                        <img
                          src={user.avatar}
                          alt={user.name}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                        <div className="flex-1">
                          <p className="font-medium text-blue-800">
                            {user.name}
                          </p>
                          <p className="text-sm text-blue-600">
                            {user.streak} day streak
                          </p>
                        </div>
                        <Badge
                          variant="outline"
                          className="border-blue-300 text-blue-700"
                        >
                          {user.title}
                        </Badge>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>

            {/* Top Sleep Scores */}
            <Card className="bg-white border border-blue-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-blue-800">
                  <Star className="h-6 w-6 text-blue-600" />
                  Highest Sleep Scores
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {communityUsers
                    .sort((a, b) => b.sleepScore - a.sleepScore)
                    .slice(0, 5)
                    .map((user, index) => (
                      <div
                        key={user.id}
                        className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg"
                      >
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-white ${
                            index === 0
                              ? "bg-blue-600"
                              : index === 1
                                ? "bg-blue-500"
                                : index === 2
                                  ? "bg-blue-400"
                                  : "bg-blue-300"
                          }`}
                        >
                          {index + 1}
                        </div>
                        <img
                          src={user.avatar}
                          alt={user.name}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                        <div className="flex-1">
                          <p className="font-medium text-blue-800">
                            {user.name}
                          </p>
                          <p className="text-sm text-blue-600">
                            Avg score: {user.sleepScore}/100
                          </p>
                        </div>
                        <Badge
                          variant="outline"
                          className="border-blue-300 text-blue-700"
                        >
                          Level {user.level}
                        </Badge>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Members Tab */}
        <TabsContent value="members" className="space-y-6">
          {/* Member Filters */}
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="flex-1 max-w-md">
              <Input
                placeholder="Search members by name, location, or title..."
                className="w-full border-blue-300 focus:border-blue-500"
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              <Button
                variant="outline"
                size="sm"
                className="border-blue-300 text-blue-700"
              >
                All Levels
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="border-blue-300 text-blue-700"
              >
                Online Now
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="border-blue-300 text-blue-700"
              >
                High Streaks
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="border-blue-300 text-blue-700"
              >
                Sleep Masters
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {communityUsers.map((member) => (
              <Card
                key={member.id}
                className="hover:shadow-lg transition-shadow bg-white border border-blue-200"
              >
                <CardContent className="p-6">
                  <div className="text-center space-y-4">
                    <div className="relative">
                      <img
                        src={member.avatar}
                        alt={member.name}
                        className="w-20 h-20 rounded-full object-cover mx-auto"
                      />
                      <div className="absolute -bottom-2 -right-2">
                        <Badge className="bg-blue-500 text-white">
                          L{member.level}
                        </Badge>
                      </div>
                    </div>

                    <div>
                      <h3 className="font-semibold text-lg text-blue-800">
                        {member.name}
                      </h3>
                      <p className="text-blue-600 font-medium">
                        {member.title}
                      </p>
                      <p className="text-sm text-blue-500">{member.location}</p>
                    </div>

                    <div className="grid grid-cols-3 gap-2 text-center">
                      <div>
                        <div className="text-lg font-bold text-blue-600">
                          {member.streak}
                        </div>
                        <div className="text-xs text-blue-500">Streak</div>
                      </div>
                      <div>
                        <div className="text-lg font-bold text-blue-600">
                          {member.sleepScore}
                        </div>
                        <div className="text-xs text-blue-500">Score</div>
                      </div>
                      <div>
                        <div className="text-lg font-bold text-blue-600">
                          {member.joinedDays}
                        </div>
                        <div className="text-xs text-blue-500">Days</div>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-1 justify-center">
                      {member.badges.slice(0, 2).map((badge, index) => (
                        <Badge
                          key={index}
                          variant="outline"
                          className="text-xs border-blue-300 text-blue-700"
                        >
                          {badge}
                        </Badge>
                      ))}
                    </div>

                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 border-blue-300 text-blue-700 hover:bg-blue-50"
                        onClick={() => handleConnect(member.name)}
                      >
                        Connect
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="px-3 border-blue-300 text-blue-700 hover:bg-blue-50"
                        onClick={() =>
                          alert(`Starting chat with ${member.name}...`)
                        }
                      >
                        <MessageCircle className="h-4 w-4" />
                      </Button>
                    </div>

                    {/* Member Activity Indicator */}
                    <div className="text-center pt-2 border-t border-blue-200">
                      <div className="flex items-center justify-center gap-1 text-xs text-blue-600">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        Active {Math.floor(Math.random() * 5) + 1}h ago
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Live Chat Tab */}
        <TabsContent value="chat" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Live Chat */}
            <div className="lg:col-span-2">
              <Card className="bg-white border border-blue-200 h-[600px] flex flex-col">
                <CardHeader className="border-b border-blue-200">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-xl font-bold text-blue-800 flex items-center gap-2">
                      <MessageCircle className="h-6 w-6 text-blue-600" />
                      Community Live Chat
                    </CardTitle>
                    <div className="flex items-center gap-2 text-sm text-green-600">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      {onlineMembers} online
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="flex-1 p-6 overflow-y-auto">
                  <div className="space-y-4">
                    {/* Sample Chat Messages */}
                    {[
                      {
                        author: "Sarah Chen",
                        message:
                          "Just finished my morning breathing session! 🌬️ Feeling amazing",
                        time: "2 min ago",
                        level: 8,
                      },
                      {
                        author: "Marcus Rodriguez",
                        message:
                          "Anyone else trying the 4-7-8 technique tonight?",
                        time: "5 min ago",
                        level: 6,
                      },
                      {
                        author: "Emma Rodriguez",
                        message:
                          "Hit my 78-day streak today! 🔥 This community is incredible",
                        time: "8 min ago",
                        level: 9,
                      },
                      {
                        author: "David Kim",
                        message:
                          "Quick question: best time for Wim Hof breathing?",
                        time: "12 min ago",
                        level: 4,
                      },
                      {
                        author: "Priya Patel",
                        message:
                          "Morning everyone! Ready for today's sleep challenge? 💪",
                        time: "15 min ago",
                        level: 7,
                      },
                    ].map((msg, index) => (
                      <div
                        key={index}
                        className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                      >
                        <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                          <span className="text-gray-500 text-xs">
                            No Image
                          </span>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-semibold text-blue-800">
                              {msg.author}
                            </span>
                            <Badge
                              variant="outline"
                              className="text-xs border-blue-300 text-blue-600"
                            >
                              L{msg.level}
                            </Badge>
                            <span className="text-xs text-blue-500">
                              {msg.time}
                            </span>
                          </div>
                          <p className="text-blue-700">{msg.message}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
                <div className="border-t border-blue-200 p-4">
                  <div className="flex gap-3">
                    <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                      <span className="text-gray-500 text-xs">No Image</span>
                    </div>
                    <div className="flex-1 flex gap-2">
                      <Input
                        placeholder="Share your sleep journey..."
                        className="flex-1 border-blue-300 focus:border-blue-500"
                      />
                      <Button className="bg-blue-600 hover:bg-blue-700">
                        <Send className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            </div>

            {/* Chat Sidebar */}
            <div className="space-y-4">
              {/* Online Members */}
              <Card className="bg-white border border-blue-200">
                <CardHeader>
                  <CardTitle className="text-lg text-blue-800 flex items-center gap-2">
                    <Users className="h-5 w-5 text-blue-600" />
                    Online Now ({onlineMembers})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 max-h-48 overflow-y-auto">
                    {communityUsers.slice(0, 8).map((member) => (
                      <div
                        key={member.id}
                        className="flex items-center gap-3 p-2 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        <div className="relative">
                          <img
                            src={member.avatar}
                            alt={member.name}
                            className="w-8 h-8 rounded-full object-cover"
                          />
                          <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-blue-800 truncate">
                            {member.name}
                          </p>
                          <p className="text-xs text-blue-600">
                            {member.title}
                          </p>
                        </div>
                        <Badge
                          variant="outline"
                          className="text-xs border-blue-300 text-blue-600"
                        >
                          L{member.level}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card className="bg-blue-50 border border-blue-200">
                <CardHeader>
                  <CardTitle className="text-lg text-blue-800">
                    Quick Actions
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button
                    variant="outline"
                    className="w-full justify-start text-blue-700 border-blue-300"
                  >
                    <Sparkles className="h-4 w-4 mr-2" />
                    Share Achievement
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-blue-700 border-blue-300"
                  >
                    <Target className="h-4 w-4 mr-2" />
                    Start Challenge
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-blue-700 border-blue-300"
                  >
                    <Heart className="h-4 w-4 mr-2" />
                    Find Sleep Buddy
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-blue-700 border-blue-300"
                  >
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Ask for Tips
                  </Button>
                </CardContent>
              </Card>

              {/* Trending Topics */}
              <Card className="bg-white border border-blue-200">
                <CardHeader>
                  <CardTitle className="text-lg text-blue-800 flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-blue-600" />
                    Trending Now
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {[
                      { topic: "#WimHofChallenge", posts: "47 posts" },
                      { topic: "#SleepQuality", posts: "32 posts" },
                      { topic: "#MorningRoutine", posts: "28 posts" },
                      { topic: "#BreathingTips", posts: "19 posts" },
                    ].map((trend, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-2 hover:bg-blue-50 rounded cursor-pointer"
                      >
                        <span className="font-medium text-blue-700">
                          {trend.topic}
                        </span>
                        <span className="text-xs text-blue-500">
                          {trend.posts}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
