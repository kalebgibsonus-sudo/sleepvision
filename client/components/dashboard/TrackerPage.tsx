import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Home, Moon } from 'lucide-react';
import { SleepTracker } from '@/components/SleepTracker';

interface TrackerPageProps {
  onNavigate: (page: string) => void;
  onGoHome?: () => void;
}

export function TrackerPage({ onNavigate, onGoHome }: TrackerPageProps) {
  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2 flex items-center gap-3">
            <Moon className="h-10 w-10 text-blue-600" />
            Sleep Tracker
          </h1>
          <p className="text-gray-600 text-lg">
            Log your daily sleep patterns and track your progress
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
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
        <CardContent className="p-6">
          <div className="text-center">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              🌙 Track Your Sleep Journey
            </h3>
            <p className="text-gray-700 max-w-2xl mx-auto">
              Consistent tracking is the key to better sleep. Log your bedtime, wake time, 
              and how you feel to unlock personalized insights and build lasting habits.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Sleep Tracker Component */}
      <SleepTracker />

      {/* Navigation Footer */}
      <div className="grid md:grid-cols-3 gap-4 mt-8">
        <Card className="hover:shadow-lg transition-all cursor-pointer group" onClick={() => onNavigate('dashboard-rewards')}>
          <CardContent className="p-6 text-center">
            <div className="text-2xl mb-2">🏆</div>
            <h3 className="font-semibold text-gray-900 mb-1">Check Rewards</h3>
            <p className="text-sm text-gray-600">See what you've earned today</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-all cursor-pointer group" onClick={() => onNavigate('dashboard-habits')}>
          <CardContent className="p-6 text-center">
            <div className="text-2xl mb-2">🎯</div>
            <h3 className="font-semibold text-gray-900 mb-1">Build Habits</h3>
            <p className="text-sm text-gray-600">Create lasting routines</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-all cursor-pointer group" onClick={() => onNavigate('dashboard-mornings')}>
          <CardContent className="p-6 text-center">
            <div className="text-2xl mb-2">☀️</div>
            <h3 className="font-semibold text-gray-900 mb-1">Morning Routine</h3>
            <p className="text-sm text-gray-600">Optimize your mornings</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
