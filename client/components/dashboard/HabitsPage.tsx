import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Home, Target } from 'lucide-react';
import { HabitTracker } from '@/components/HabitTracker';

interface HabitsPageProps {
  onNavigate: (page: string) => void;
  onGoHome?: () => void;
}

export function HabitsPage({ onNavigate, onGoHome }: HabitsPageProps) {
  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2 flex items-center gap-3">
            <Target className="h-10 w-10 text-purple-600" />
            Habit Builder
          </h1>
          <p className="text-gray-600 text-lg">
            Build powerful sleep and wellness habits that transform your life
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            onClick={() => onNavigate('dashboard-overview')}
            variant="outline"
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Overview
          </Button>
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
      </div>

      {/* Enhanced Introduction */}
      <Card className="bg-gradient-to-r from-purple-50 to-indigo-50 border-purple-200">
        <CardContent className="p-6">
          <div className="text-center">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              🎯 Master Your Sleep Habits
            </h3>
            <p className="text-gray-700 max-w-2xl mx-auto">
              Small consistent actions create big changes. Track your sleep-related habits, 
              build powerful routines, and watch as better sleep becomes second nature.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Habit Tracker Component */}
      <HabitTracker />

      {/* Habit Science Section */}
      <Card className="bg-gradient-to-r from-green-50 to-teal-50 border-green-200">
        <CardHeader>
          <CardTitle className="text-center">🧠 The Science of Habits</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-6 text-center">
            <div>
              <div className="text-3xl mb-2">⚡</div>
              <h4 className="font-semibold mb-1">Habit Loop</h4>
              <p className="text-sm text-gray-600">Cue → Routine → Reward creates lasting change</p>
            </div>
            <div>
              <div className="text-3xl mb-2">📈</div>
              <h4 className="font-semibold mb-1">21-Day Rule</h4>
              <p className="text-sm text-gray-600">It takes 21 days to form a new habit</p>
            </div>
            <div>
              <div className="text-3xl mb-2">🎯</div>
              <h4 className="font-semibold mb-1">Consistency</h4>
              <p className="text-sm text-gray-600">Small daily actions compound into big results</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Tips */}
      <Card>
        <CardHeader>
          <CardTitle>💡 Habit Building Tips</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h4 className="font-semibold text-green-600">✅ Do's</h4>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-green-500">•</span>
                  Start small - 2 minutes is better than 0
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500">•</span>
                  Stack habits - attach new habits to existing ones
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500">•</span>
                  Track consistently - what gets measured gets done
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500">•</span>
                  Celebrate wins - acknowledge your progress
                </li>
              </ul>
            </div>
            
            <div className="space-y-3">
              <h4 className="font-semibold text-red-600">❌ Don'ts</h4>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-red-500">•</span>
                  Don't try to change everything at once
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-500">•</span>
                  Don't rely on motivation alone
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-500">•</span>
                  Don't break the chain - consistency is key
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-500">•</span>
                  Don't give up after missing one day
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Navigation Footer */}
      <div className="grid md:grid-cols-3 gap-4 mt-8">
        <Card className="hover:shadow-lg transition-all cursor-pointer group" onClick={() => onNavigate('dashboard-tracker')}>
          <CardContent className="p-6 text-center">
            <div className="text-2xl mb-2">📊</div>
            <h3 className="font-semibold text-gray-900 mb-1">Sleep Tracker</h3>
            <p className="text-sm text-gray-600">Log your sleep patterns</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-all cursor-pointer group" onClick={() => onNavigate('dashboard-rewards')}>
          <CardContent className="p-6 text-center">
            <div className="text-2xl mb-2">🏆</div>
            <h3 className="font-semibold text-gray-900 mb-1">Rewards</h3>
            <p className="text-sm text-gray-600">Earn daily treasures</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-all cursor-pointer group" onClick={() => onNavigate('dashboard-mornings')}>
          <CardContent className="p-6 text-center">
            <div className="text-2xl mb-2">☀️</div>
            <h3 className="font-semibold text-gray-900 mb-1">Morning Routine</h3>
            <p className="text-sm text-gray-600">Start days perfectly</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
