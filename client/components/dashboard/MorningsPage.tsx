import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Home, Sun } from 'lucide-react';
import { MorningDashboard } from '@/components/MorningDashboard';

interface MorningsPageProps {
  onNavigate: (page: string) => void;
  onGoHome?: () => void;
}

export function MorningsPage({ onNavigate, onGoHome }: MorningsPageProps) {
  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2 flex items-center gap-3">
            <Sun className="h-10 w-10 text-orange-600" />
            Morning Optimization
          </h1>
          <p className="text-gray-600 text-lg">
            Transform your mornings and set the tone for incredible days
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
      <Card className="bg-gradient-to-r from-orange-50 to-yellow-50 border-orange-200">
        <CardContent className="p-6">
          <div className="text-center">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              ☀️ Win Your Mornings, Win Your Days
            </h3>
            <p className="text-gray-700 max-w-2xl mx-auto">
              Your morning routine sets the energy, mood, and productivity for your entire day. 
              Optimize your wake-up process and create mornings that energize and inspire you.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Morning Dashboard Component */}
      <MorningDashboard />

      {/* Morning Science Section */}
      <Card className="bg-gradient-to-r from-blue-50 to-cyan-50 border-blue-200">
        <CardHeader>
          <CardTitle className="text-center">🧠 Morning Science & Benefits</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-6 text-center">
            <div>
              <div className="text-3xl mb-2">🌅</div>
              <h4 className="font-semibold mb-1">Circadian Rhythm</h4>
              <p className="text-sm text-gray-600">Light exposure helps regulate your internal clock</p>
            </div>
            <div>
              <div className="text-3xl mb-2">💪</div>
              <h4 className="font-semibold mb-1">Cortisol Peak</h4>
              <p className="text-sm text-gray-600">Natural cortisol rise gives you morning energy</p>
            </div>
            <div>
              <div className="text-3xl mb-2">🎯</div>
              <h4 className="font-semibold mb-1">Peak Performance</h4>
              <p className="text-sm text-gray-600">Morning hours often bring peak cognitive ability</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Morning Routine Ideas */}
      <Card>
        <CardHeader>
          <CardTitle>☀️ Powerful Morning Routine Elements</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h4 className="font-semibold text-orange-600 mb-3">🌊 Mind & Body</h4>
              <div className="space-y-3">
                <div className="flex items-start gap-3 p-3 bg-orange-50 rounded-lg">
                  <div className="text-orange-600 font-bold">💧</div>
                  <div>
                    <h5 className="font-medium">Hydration First</h5>
                    <p className="text-sm text-gray-600">16-20oz of water to rehydrate after sleep</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-orange-50 rounded-lg">
                  <div className="text-orange-600 font-bold">🧘</div>
                  <div>
                    <h5 className="font-medium">Mindfulness Practice</h5>
                    <p className="text-sm text-gray-600">5-10 minutes of meditation or deep breathing</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-orange-50 rounded-lg">
                  <div className="text-orange-600 font-bold">🏃</div>
                  <div>
                    <h5 className="font-medium">Movement & Stretch</h5>
                    <p className="text-sm text-gray-600">Light exercise to activate your body</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <h4 className="font-semibold text-blue-600 mb-3">⚡ Energy & Focus</h4>
              <div className="space-y-3">
                <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                  <div className="text-blue-600 font-bold">☀️</div>
                  <div>
                    <h5 className="font-medium">Natural Light</h5>
                    <p className="text-sm text-gray-600">10-15 minutes outside or by a bright window</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                  <div className="text-blue-600 font-bold">📝</div>
                  <div>
                    <h5 className="font-medium">Intention Setting</h5>
                    <p className="text-sm text-gray-600">Plan your top 3 priorities for the day</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                  <div className="text-blue-600 font-bold">🥗</div>
                  <div>
                    <h5 className="font-medium">Nutritious Fuel</h5>
                    <p className="text-sm text-gray-600">Protein-rich breakfast to sustain energy</p>
                  </div>
                </div>
              </div>
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
            <p className="text-sm text-gray-600">Log your sleep quality</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-all cursor-pointer group" onClick={() => onNavigate('dashboard-rewards')}>
          <CardContent className="p-6 text-center">
            <div className="text-2xl mb-2">🏆</div>
            <h3 className="font-semibold text-gray-900 mb-1">Rewards</h3>
            <p className="text-sm text-gray-600">Collect daily prizes</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-all cursor-pointer group" onClick={() => onNavigate('dashboard-habits')}>
          <CardContent className="p-6 text-center">
            <div className="text-2xl mb-2">🎯</div>
            <h3 className="font-semibold text-gray-900 mb-1">Habit Builder</h3>
            <p className="text-sm text-gray-600">Track morning habits</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
