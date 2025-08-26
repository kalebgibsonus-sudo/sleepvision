import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Clock, 
  Moon, 
  Sun, 
  TrendingUp, 
  Calendar,
  Star,
  BarChart3,
  Database,
  Wifi,
  WifiOff
} from 'lucide-react';
import { useSleepData } from '@/hooks/useSleepData';
import { useAuth } from '@/contexts/AuthContext';

export function SleepDashboard() {
  const { user } = useAuth();
  const { 
    schedules, 
    entries, 
    isLoading, 
    error,
    addSleepEntry, 
    activateSchedule,
    getActiveSchedule,
    getSleepStats 
  } = useSleepData();

  const [newEntry, setNewEntry] = useState({
    date: new Date().toISOString().split('T')[0],
    bedtime: '',
    wakeTime: '',
    sleepQuality: 5,
    mood: '',
    notes: ''
  });

  const [isSaving, setIsSaving] = useState(false);

  const handleSubmitEntry = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      setIsSaving(true);
      await addSleepEntry(newEntry);
      
      // Reset form
      setNewEntry({
        date: new Date().toISOString().split('T')[0],
        bedtime: '',
        wakeTime: '',
        sleepQuality: 5,
        mood: '',
        notes: ''
      });
      
      alert('Sleep entry saved successfully!');
    } catch (err) {
      alert('Failed to save sleep entry. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const stats = getSleepStats();
  const activeSchedule = getActiveSchedule();

  if (!user) {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardContent className="text-center py-12">
          <Moon className="h-16 w-16 mx-auto mb-4 text-gray-400" />
          <h3 className="text-xl font-semibold mb-2">Sign in to track your sleep</h3>
          <p className="text-gray-600">
            Access your personalized sleep dashboard with Firebase-powered data storage
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Sleep Dashboard</h1>
        <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
          <Database className="h-4 w-4" />
          <span>Powered by Firebase</span>
          {error ? (
            <Badge variant="destructive" className="ml-2">
              <WifiOff className="h-3 w-3 mr-1" />
              Connection Error
            </Badge>
          ) : (
            <Badge variant="secondary" className="ml-2">
              <Wifi className="h-3 w-3 mr-1" />
              Connected
            </Badge>
          )}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <Star className="h-8 w-8 text-yellow-500" />
              <div>
                <p className="text-sm text-gray-600">Avg Quality</p>
                <p className="text-2xl font-bold">{stats.averageSleepQuality}/10</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <Clock className="h-8 w-8 text-blue-500" />
              <div>
                <p className="text-sm text-gray-600">Avg Duration</p>
                <p className="text-2xl font-bold">{stats.averageSleepDuration}h</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <TrendingUp className="h-8 w-8 text-green-500" />
              <div>
                <p className="text-sm text-gray-600">Streak</p>
                <p className="text-2xl font-bold">{stats.streakDays} days</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <BarChart3 className="h-8 w-8 text-purple-500" />
              <div>
                <p className="text-sm text-gray-600">Total Entries</p>
                <p className="text-2xl font-bold">{stats.totalEntries}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Add Sleep Entry */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Moon className="h-5 w-5 text-blue-600" />
              Log Sleep Entry
            </CardTitle>
            <CardDescription>
              Track your sleep patterns and store them in Firebase
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmitEntry} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="date">Date</Label>
                  <Input
                    id="date"
                    type="date"
                    value={newEntry.date}
                    onChange={(e) => setNewEntry({...newEntry, date: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="quality">Sleep Quality (1-10)</Label>
                  <Input
                    id="quality"
                    type="number"
                    min="1"
                    max="10"
                    value={newEntry.sleepQuality}
                    onChange={(e) => setNewEntry({...newEntry, sleepQuality: parseInt(e.target.value)})}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="bedtime">Bedtime</Label>
                  <Input
                    id="bedtime"
                    type="time"
                    value={newEntry.bedtime}
                    onChange={(e) => setNewEntry({...newEntry, bedtime: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="waketime">Wake Time</Label>
                  <Input
                    id="waketime"
                    type="time"
                    value={newEntry.wakeTime}
                    onChange={(e) => setNewEntry({...newEntry, wakeTime: e.target.value})}
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="mood">Mood</Label>
                <Input
                  id="mood"
                  value={newEntry.mood}
                  onChange={(e) => setNewEntry({...newEntry, mood: e.target.value})}
                  placeholder="How did you feel when you woke up?"
                />
              </div>

              <div>
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  value={newEntry.notes}
                  onChange={(e) => setNewEntry({...newEntry, notes: e.target.value})}
                  placeholder="Any additional notes about your sleep..."
                  rows={3}
                />
              </div>

              <Button type="submit" disabled={isSaving} className="w-full">
                {isSaving ? 'Saving to Firebase...' : 'Save Sleep Entry'}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Active Schedule & Recent Entries */}
        <div className="space-y-6">
          {/* Active Schedule */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-green-600" />
                Active Schedule
              </CardTitle>
            </CardHeader>
            <CardContent>
              {activeSchedule ? (
                <div>
                  <p className="font-semibold">{activeSchedule.title}</p>
                  <p className="text-sm text-gray-600 mb-3">
                    Created: {activeSchedule.createdAt?.toDate?.()?.toLocaleDateString() || 'Recently'}
                  </p>
                  <p className="text-sm">
                    {activeSchedule.schedule.length} activities scheduled
                  </p>
                </div>
              ) : (
                <p className="text-gray-600">No active schedule found</p>
              )}
            </CardContent>
          </Card>

          {/* Saved Schedules */}
          <Card>
            <CardHeader>
              <CardTitle>Saved Schedules ({schedules.length})</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <p className="text-gray-600">Loading schedules...</p>
              ) : schedules.length > 0 ? (
                <div className="space-y-2">
                  {schedules.slice(0, 3).map((schedule) => (
                    <div key={schedule.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <div>
                        <p className="font-medium text-sm">{schedule.title}</p>
                        <p className="text-xs text-gray-500">
                          {schedule.createdAt?.toDate?.()?.toLocaleDateString() || 'Recently'}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        {schedule.isActive && (
                          <Badge variant="secondary" className="text-xs">Active</Badge>
                        )}
                        {!schedule.isActive && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => activateSchedule(schedule.id!)}
                            className="text-xs"
                          >
                            Activate
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                  {schedules.length > 3 && (
                    <p className="text-xs text-gray-500 text-center pt-2">
                      +{schedules.length - 3} more schedules
                    </p>
                  )}
                </div>
              ) : (
                <p className="text-gray-600">No schedules saved yet</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Recent Entries */}
      {entries.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Recent Sleep Entries</CardTitle>
            <CardDescription>
              Your latest sleep data stored in Firebase
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {entries.slice(0, 5).map((entry, index) => (
                <div key={entry.id || index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className="text-center">
                      <p className="text-sm font-medium">{new Date(entry.date).toLocaleDateString()}</p>
                      <p className="text-xs text-gray-500">
                        {entry.bedtime} - {entry.wakeTime}
                      </p>
                    </div>
                    <Separator orientation="vertical" className="h-8" />
                    <div>
                      <div className="flex items-center gap-2">
                        <Star className="h-4 w-4 text-yellow-500" />
                        <span className="text-sm font-medium">{entry.sleepQuality}/10</span>
                      </div>
                      {entry.mood && (
                        <p className="text-xs text-gray-600">{entry.mood}</p>
                      )}
                    </div>
                  </div>
                  {entry.notes && (
                    <p className="text-xs text-gray-500 max-w-xs truncate">
                      {entry.notes}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {error && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-4">
            <p className="text-red-800 text-sm">
              <strong>Firebase Error:</strong> {error}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
