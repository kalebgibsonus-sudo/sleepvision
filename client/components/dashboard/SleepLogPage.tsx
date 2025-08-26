import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useSleepData } from "@/hooks/useSleepData";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  BookOpen,
  Plus,
  Edit3,
  Trash2,
  Save,
  X,
  Calendar,
  Clock,
  Star,
  TrendingUp,
  Moon,
  Sun,
  Home,
  ArrowLeft,
  Filter,
  Download,
  Search
} from "lucide-react";

interface SleepLogPageProps {
  onNavigate: (page: string) => void;
  onGoHome?: () => void;
}

export function SleepLogPage({ onNavigate, onGoHome }: SleepLogPageProps) {
  const { user } = useAuth();
  const { entries, addSleepEntry, getSleepStats } = useSleepData();
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingEntry, setEditingEntry] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  
  const [newEntry, setNewEntry] = useState({
    date: new Date().toISOString().split('T')[0],
    bedtime: "",
    wakeTime: "",
    sleepQuality: 5,
    mood: "good",
    notes: ""
  });

  const stats = getSleepStats();

  const filteredEntries = entries.filter(entry => {
    const entryDate = new Date(entry.date);
    const matchesSearch = entry.notes?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         entry.mood?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesMonth = entryDate.getMonth() === selectedMonth;
    const matchesYear = entryDate.getFullYear() === selectedYear;
    
    return matchesSearch && matchesMonth && matchesYear;
  });

  const getMoodEmoji = (mood: string) => {
    switch (mood.toLowerCase()) {
      case "excellent": return "😴";
      case "good": return "😊";
      case "okay": return "😐";
      case "poor": return "😔";
      case "terrible": return "😫";
      default: return "😊";
    }
  };

  const getQualityColor = (quality: number) => {
    if (quality >= 8) return "text-green-600 bg-green-100";
    if (quality >= 6) return "text-yellow-600 bg-yellow-100";
    if (quality >= 4) return "text-orange-600 bg-orange-100";
    return "text-red-600 bg-red-100";
  };

  const calculateSleepDuration = (bedtime: string, wakeTime: string) => {
    const bed = new Date(`2000-01-01 ${bedtime}`);
    const wake = new Date(`2000-01-01 ${wakeTime}`);
    
    let duration = (wake.getTime() - bed.getTime()) / (1000 * 60 * 60);
    if (duration < 0) duration += 24; // Handle overnight sleep
    
    return duration.toFixed(1);
  };

  const handleAddEntry = async () => {
    if (!newEntry.date || !newEntry.bedtime || !newEntry.wakeTime) return;

    try {
      await addSleepEntry({
        date: newEntry.date,
        bedtime: newEntry.bedtime,
        wakeTime: newEntry.wakeTime,
        sleepQuality: newEntry.sleepQuality,
        mood: newEntry.mood,
        notes: newEntry.notes
      });

      // Reset form
      setNewEntry({
        date: new Date().toISOString().split('T')[0],
        bedtime: "",
        wakeTime: "",
        sleepQuality: 5,
        mood: "good",
        notes: ""
      });
      setShowAddForm(false);
    } catch (error) {
      console.error('Error adding sleep entry:', error);
    }
  };

  const exportData = () => {
    const csvContent = [
      "Date,Bedtime,Wake Time,Duration (hours),Sleep Quality,Mood,Notes",
      ...filteredEntries.map(entry => 
        `${entry.date},${entry.bedtime},${entry.wakeTime},${calculateSleepDuration(entry.bedtime, entry.wakeTime)},${entry.sleepQuality},${entry.mood},"${entry.notes || ""}"`
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sleep-log-${selectedYear}-${selectedMonth + 1}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const getWeeklyStats = () => {
    const lastWeek = entries.slice(0, 7);
    const avgQuality = lastWeek.reduce((sum, entry) => sum + entry.sleepQuality, 0) / lastWeek.length || 0;
    const avgDuration = lastWeek.reduce((sum, entry) => {
      const duration = parseFloat(calculateSleepDuration(entry.bedtime, entry.wakeTime));
      return sum + duration;
    }, 0) / lastWeek.length || 0;

    return {
      averageQuality: avgQuality.toFixed(1),
      averageDuration: avgDuration.toFixed(1),
      entriesCount: lastWeek.length
    };
  };

  const weeklyStats = getWeeklyStats();

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold text-indigo-900 mb-2 flex items-center gap-3">
            <BookOpen className="h-10 w-10 text-indigo-600" />
            Sleep Log & History
          </h1>
          <p className="text-indigo-600 text-lg">
            Track and analyze your sleep patterns over time
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            onClick={() => onNavigate('dashboard')}
            variant="outline"
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
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

      {/* Quick Stats */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <BookOpen className="h-8 w-8 text-blue-600" />
              <div>
                <p className="text-2xl font-bold text-blue-700">{entries.length}</p>
                <p className="text-sm text-blue-600">Total Entries</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Star className="h-8 w-8 text-green-600" />
              <div>
                <p className="text-2xl font-bold text-green-700">{weeklyStats.averageQuality}/10</p>
                <p className="text-sm text-green-600">Avg Quality (7 days)</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Clock className="h-8 w-8 text-purple-600" />
              <div>
                <p className="text-2xl font-bold text-purple-700">{weeklyStats.averageDuration}h</p>
                <p className="text-sm text-purple-600">Avg Duration</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-red-50 border border-orange-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Calendar className="h-8 w-8 text-orange-600" />
              <div>
                <p className="text-2xl font-bold text-orange-700">{stats.streakDays}</p>
                <p className="text-sm text-orange-600">Day Streak</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Search entries..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-64"
            />
          </div>
          
          <select 
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm"
          >
            {Array.from({ length: 12 }, (_, i) => (
              <option key={i} value={i}>
                {new Date(0, i).toLocaleString('default', { month: 'long' })}
              </option>
            ))}
          </select>
          
          <Input
            type="number"
            value={selectedYear}
            onChange={(e) => setSelectedYear(parseInt(e.target.value))}
            className="w-24"
            min="2020"
            max="2030"
          />
        </div>

        <div className="flex items-center gap-2">
          <Button
            onClick={exportData}
            variant="outline"
            className="flex items-center gap-2"
            disabled={filteredEntries.length === 0}
          >
            <Download className="h-4 w-4" />
            Export CSV
          </Button>
          
          <Button
            onClick={() => setShowAddForm(true)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Add Entry
          </Button>
        </div>
      </div>

      {/* Add Entry Form */}
      {showAddForm && (
        <Card className="border border-indigo-200 bg-indigo-50">
          <CardHeader>
            <CardTitle className="text-indigo-900">Add New Sleep Entry</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="date">Date</Label>
                <Input
                  id="date"
                  type="date"
                  value={newEntry.date}
                  onChange={(e) => setNewEntry(prev => ({ ...prev, date: e.target.value }))}
                />
              </div>
              
              <div>
                <Label htmlFor="mood">Mood</Label>
                <select
                  id="mood"
                  value={newEntry.mood}
                  onChange={(e) => setNewEntry(prev => ({ ...prev, mood: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="excellent">Excellent</option>
                  <option value="good">Good</option>
                  <option value="okay">Okay</option>
                  <option value="poor">Poor</option>
                  <option value="terrible">Terrible</option>
                </select>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="bedtime">Bedtime</Label>
                <Input
                  id="bedtime"
                  type="time"
                  value={newEntry.bedtime}
                  onChange={(e) => setNewEntry(prev => ({ ...prev, bedtime: e.target.value }))}
                />
              </div>
              
              <div>
                <Label htmlFor="wakeTime">Wake Time</Label>
                <Input
                  id="wakeTime"
                  type="time"
                  value={newEntry.wakeTime}
                  onChange={(e) => setNewEntry(prev => ({ ...prev, wakeTime: e.target.value }))}
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
                  onChange={(e) => setNewEntry(prev => ({ ...prev, sleepQuality: parseInt(e.target.value) }))}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="notes">Notes (Optional)</Label>
              <Textarea
                id="notes"
                placeholder="How did you sleep? Any observations..."
                value={newEntry.notes}
                onChange={(e) => setNewEntry(prev => ({ ...prev, notes: e.target.value }))}
                rows={3}
              />
            </div>

            <div className="flex gap-2">
              <Button onClick={handleAddEntry} className="bg-indigo-600 hover:bg-indigo-700">
                <Save className="h-4 w-4 mr-2" />
                Save Entry
              </Button>
              <Button onClick={() => setShowAddForm(false)} variant="outline">
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Sleep Entries */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Sleep Entries ({filteredEntries.length})</span>
            {filteredEntries.length > 0 && (
              <Badge className="bg-indigo-100 text-indigo-800">
                {new Date(0, selectedMonth).toLocaleString('default', { month: 'long' })} {selectedYear}
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {filteredEntries.length === 0 ? (
            <div className="text-center py-12">
              <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-600 mb-2">No Sleep Entries Found</h3>
              <p className="text-gray-500 mb-4">
                {searchTerm ? "Try adjusting your search or date filters" : "Start tracking your sleep to see insights here"}
              </p>
              {!searchTerm && (
                <Button
                  onClick={() => setShowAddForm(true)}
                  className="bg-indigo-600 hover:bg-indigo-700"
                >
                  Add Your First Entry
                </Button>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredEntries.map((entry) => (
                <div key={entry.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="text-center">
                    <div className="text-2xl">{getMoodEmoji(entry.mood)}</div>
                    <p className="text-xs text-gray-600 capitalize">{entry.mood}</p>
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-2">
                      <h4 className="font-semibold text-gray-900">
                        {new Date(entry.date).toLocaleDateString('en-US', { 
                          weekday: 'short', 
                          month: 'short', 
                          day: 'numeric' 
                        })}
                      </h4>
                      
                      <Badge className={`${getQualityColor(entry.sleepQuality)} px-2 py-1 text-xs font-semibold`}>
                        {entry.sleepQuality}/10 quality
                      </Badge>
                      
                      <span className="text-sm text-gray-600">
                        {calculateSleepDuration(entry.bedtime, entry.wakeTime)}h sleep
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <span className="flex items-center gap-1">
                        <Moon className="h-4 w-4" />
                        {entry.bedtime}
                      </span>
                      <span className="flex items-center gap-1">
                        <Sun className="h-4 w-4" />
                        {entry.wakeTime}
                      </span>
                    </div>
                    
                    {entry.notes && (
                      <p className="text-sm text-gray-700 mt-2 italic">"{entry.notes}"</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Navigation Cards */}
      <div className="grid md:grid-cols-3 gap-4 mt-8">
        <Card className="hover:shadow-lg transition-all cursor-pointer group" onClick={() => onNavigate('progress-tracker')}>
          <CardContent className="p-6 text-center">
            <div className="p-3 bg-green-100 rounded-full inline-block mb-3 group-hover:bg-green-200 transition-colors">
              <TrendingUp className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="font-semibold text-gray-900">Progress Tracker</h3>
            <p className="text-gray-600 text-sm">Analyze your sleep trends</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-all cursor-pointer group" onClick={() => onNavigate('sleep-routine')}>
          <CardContent className="p-6 text-center">
            <div className="p-3 bg-purple-100 rounded-full inline-block mb-3 group-hover:bg-purple-200 transition-colors">
              <Moon className="h-8 w-8 text-purple-600" />
            </div>
            <h3 className="font-semibold text-gray-900">Sleep Routine</h3>
            <p className="text-gray-600 text-sm">Manage your bedtime schedule</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-all cursor-pointer group" onClick={() => onNavigate('rewards')}>
          <CardContent className="p-6 text-center">
            <div className="p-3 bg-yellow-100 rounded-full inline-block mb-3 group-hover:bg-yellow-200 transition-colors">
              <Star className="h-8 w-8 text-yellow-600" />
            </div>
            <h3 className="font-semibold text-gray-900">Rewards</h3>
            <p className="text-gray-600 text-sm">View your achievements</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
