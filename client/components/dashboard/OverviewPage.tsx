import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import {
  Calendar,
  Clock,
  TrendingUp,
  Star,
  BarChart3,
  Flame,
  Trophy,
  Crown,
  Target,
  Zap,
  Home,
  ArrowRight,
  Settings
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useSleepData } from '@/hooks/useSleepData';

interface OverviewPageProps {
  onNavigate: (page: string) => void;
  onGoHome?: () => void;
}

export function OverviewPage({ onNavigate, onGoHome }: OverviewPageProps) {
  const { user } = useAuth();
  const { 
    schedules, 
    entries, 
    getActiveSchedule,
    getSleepStats 
  } = useSleepData();

  const stats = getSleepStats();
  const activeSchedule = getActiveSchedule();

  // Calculate user level based on total entries and quality
  const calculateUserLevel = () => {
    const totalPoints = entries.length * 10 + (stats.averageSleepQuality * entries.length);
    return Math.floor(totalPoints / 100) + 1;
  };

  // Calculate streak bonus
  const getStreakBonus = () => {
    if (stats.streakDays >= 30) return { icon: <Crown className="h-4 w-4" />, text: "Legend", color: "text-yellow-600" };
    if (stats.streakDays >= 14) return { icon: <Trophy className="h-4 w-4" />, text: "Master", color: "text-purple-600" };
    if (stats.streakDays >= 7) return { icon: <Star className="h-4 w-4" />, text: "Expert", color: "text-blue-600" };
    if (stats.streakDays >= 3) return { icon: <Zap className="h-4 w-4" />, text: "Rising", color: "text-green-600" };
    return { icon: <Target className="h-4 w-4" />, text: "Beginner", color: "text-gray-600" };
  };

  const userLevel = calculateUserLevel();
  const streakBonus = getStreakBonus();

  // Check if user is new and needs onboarding
  const isNewUser = entries.length === 0 && schedules.length === 0;

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">��� Sleep Overview</h1>
          <p className="text-gray-600 text-lg">
            {isNewUser
              ? `Welcome to SleepVision, ${user?.name.split(' ')[0]}! Let's get you started.`
              : `Your complete sleep journey at a glance, ${user?.name.split(' ')[0]}`
            }
          </p>
        </div>
        {onGoHome && (
          <Button
            onClick={onGoHome}
            variant="outline"
            className="flex items-center gap-2"
          >
            <Home className="h-4 w-4" />
            Home
          </Button>
        )}
      </div>

      {/* New User Welcome */}
      {isNewUser && (
        <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200">
          <CardContent className="p-8 text-center">
            <div className="mb-6">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="h-8 w-8 text-blue-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Ready to Transform Your Sleep?</h2>
              <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                You're just one step away from your personalized sleep schedule. Our AI coach Luna will create
                a complete daily routine tailored specifically to your needs and lifestyle.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={onGoHome}
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg"
                size="lg"
              >
                <Clock className="h-5 w-5 mr-2" />
                Create My Sleep Schedule
              </Button>
              <Button
                onClick={() => onNavigate('tracker')}
                variant="outline"
                className="px-8 py-3 text-lg"
                size="lg"
              >
                <BarChart3 className="h-5 w-5 mr-2" />
                Explore Dashboard
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Main Stats Cards */}
      <div className="grid md:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200 hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-purple-600 rounded-full">
                <Crown className="h-8 w-8 text-white" />
              </div>
              <div>
                <p className="text-sm text-purple-700 font-medium">Sleep Level</p>
                <p className="text-3xl font-bold text-purple-900">{userLevel}</p>
                <p className="text-xs text-purple-600">Next: {((userLevel + 1) * 100) - (entries.length * 10 + (stats.averageSleepQuality * entries.length))} pts</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200 hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-orange-600 rounded-full">
                <Flame className="h-8 w-8 text-white" />
              </div>
              <div>
                <p className="text-sm text-orange-700 font-medium">Current Streak</p>
                <p className="text-3xl font-bold text-orange-900">{stats.streakDays}</p>
                <p className="text-xs text-orange-600">days consecutive</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-600 rounded-full">
                <Star className="h-8 w-8 text-white" />
              </div>
              <div>
                <p className="text-sm text-blue-700 font-medium">Avg Quality</p>
                <p className="text-3xl font-bold text-blue-900">{stats.averageSleepQuality}</p>
                <p className="text-xs text-blue-600">out of 10</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200 hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className={`p-3 rounded-full ${streakBonus.color.replace('text-', 'bg-')}`}>
                <div className="text-white">
                  {streakBonus.icon}
                </div>
              </div>
              <div>
                <p className="text-sm text-green-700 font-medium">Current Rank</p>
                <p className={`text-2xl font-bold ${streakBonus.color}`}>{streakBonus.text}</p>
                <p className="text-xs text-green-600">sleep master</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Progress Section */}
      <div className="grid md:grid-cols-2 gap-8">
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-blue-600" />
              Weekly Progress Dashboard
            </CardTitle>
            <CardDescription>Track your consistency and quality improvements</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="font-medium">Sleep Quality Goal</span>
                <span className="text-blue-600 font-bold">{Math.round((stats.averageSleepQuality / 10) * 100)}%</span>
              </div>
              <Progress value={(stats.averageSleepQuality / 10) * 100} className="h-3" />
              <p className="text-xs text-gray-500 mt-1">Target: 8.0+ average quality</p>
            </div>
            
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="font-medium">Consistency Streak</span>
                <span className="text-orange-600 font-bold">{stats.streakDays} days</span>
              </div>
              <Progress value={Math.min(stats.streakDays * 10, 100)} className="h-3" />
              <p className="text-xs text-gray-500 mt-1">Goal: Maintain 7+ day streaks</p>
            </div>

            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="font-medium">Total Sleep Hours</span>
                <span className="text-green-600 font-bold">{stats.averageSleepDuration}h avg</span>
              </div>
              <Progress value={(stats.averageSleepDuration / 9) * 100} className="h-3" />
              <p className="text-xs text-gray-500 mt-1">Optimal range: 7-9 hours</p>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-green-600" />
              Active Schedule Status
            </CardTitle>
            <CardDescription>Your current sleep optimization plan</CardDescription>
          </CardHeader>
          <CardContent>
            {activeSchedule ? (
              <div className="space-y-4">
                <div>
                  <p className="font-semibold text-lg">{activeSchedule.title}</p>
                  <p className="text-sm text-gray-600 mb-3">
                    Created: {activeSchedule.createdAt?.toDate?.()?.toLocaleDateString() || 'Recently'}
                  </p>
                </div>
                
                <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge className="bg-green-500 text-white">Active</Badge>
                    <span className="text-sm text-green-700 font-medium">{activeSchedule.schedule.length} activities</span>
                  </div>
                  <p className="text-sm text-green-700">
                    Your personalized routine is running smoothly
                  </p>
                </div>

                <Button
                  onClick={() => onNavigate('dashboard-tracker')}
                  className="w-full bg-green-600 hover:bg-green-700"
                >
                  Log Today's Sleep
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            ) : (
              <div className="text-center py-8">
                <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-4">No active schedule found</p>
                <Button
                  onClick={() => onNavigate('home')}
                  variant="outline"
                >
                  Create Schedule
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-5 gap-4">
        <Card className="hover:shadow-lg transition-all cursor-pointer group" onClick={() => onNavigate('tracker')}>
          <CardContent className="p-6 text-center">
            <BarChart3 className="h-12 w-12 text-blue-600 mx-auto mb-3 group-hover:scale-110 transition-transform" />
            <h3 className="font-semibold text-gray-900 mb-1">Sleep Log</h3>
            <p className="text-sm text-gray-600">Track today's sleep</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-all cursor-pointer group" onClick={() => onNavigate('rewards')}>
          <CardContent className="p-6 text-center">
            <Trophy className="h-12 w-12 text-yellow-600 mx-auto mb-3 group-hover:scale-110 transition-transform" />
            <h3 className="font-semibold text-gray-900 mb-1">Rewards</h3>
            <p className="text-sm text-gray-600">Earn daily prizes</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-all cursor-pointer group" onClick={() => onNavigate('habits')}>
          <CardContent className="p-6 text-center">
            <Target className="h-12 w-12 text-purple-600 mx-auto mb-3 group-hover:scale-110 transition-transform" />
            <h3 className="font-semibold text-gray-900 mb-1">Habits</h3>
            <p className="text-sm text-gray-600">Build routines</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-all cursor-pointer group" onClick={() => onNavigate('mornings')}>
          <CardContent className="p-6 text-center">
            <TrendingUp className="h-12 w-12 text-green-600 mx-auto mb-3 group-hover:scale-110 transition-transform" />
            <h3 className="font-semibold text-gray-900 mb-1">Mornings</h3>
            <p className="text-sm text-gray-600">Start days right</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-all cursor-pointer group" onClick={() => onNavigate('account')}>
          <CardContent className="p-6 text-center">
            <Settings className="h-12 w-12 text-gray-600 mx-auto mb-3 group-hover:scale-110 transition-transform" />
            <h3 className="font-semibold text-gray-900 mb-1">Account</h3>
            <p className="text-sm text-gray-600">Manage subscription</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      {entries.length > 0 && (
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle>Recent Sleep Activity</CardTitle>
            <CardDescription>Your latest sleep entries and improvements</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {entries.slice(0, 5).map((entry, index) => (
                <div key={entry.id || index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="text-center">
                      <p className="text-sm font-medium">{new Date(entry.date).toLocaleDateString()}</p>
                      <p className="text-xs text-gray-500">{entry.bedtime} - {entry.wakeTime}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Star className="h-4 w-4 text-yellow-500" />
                      <span className="text-sm font-medium">{entry.sleepQuality}/10</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {entry.mood && (
                      <Badge variant="outline" className="text-xs">
                        {entry.mood}
                      </Badge>
                    )}
                    {index === 0 && (
                      <Badge className="bg-green-500 text-white text-xs">Latest</Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-6 text-center">
              <Button
                onClick={() => onNavigate('dashboard-tracker')}
                variant="outline"
                className="w-full"
              >
                View All Sleep Logs
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
