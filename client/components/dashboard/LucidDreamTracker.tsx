import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Moon, 
  Eye, 
  Brain, 
  CheckCircle, 
  Calendar,
  Clock,
  Star,
  Plus,
  TrendingUp,
  BookOpen,
  Lightbulb,
  Target,
  Award,
  AlertCircle
} from "lucide-react";

interface LucidDreamEntry {
  id: string;
  date: string;
  wasLucid: boolean;
  technique: string;
  vividness: number; // 1-5 scale
  control: number; // 1-5 scale
  duration: string;
  description: string;
  realityChecks: number;
  sleepQuality: number; // 1-5 scale
}

interface LucidDreamTrackerProps {
  onNavigate: (page: string) => void;
  onGoHome?: () => void;
}

export function LucidDreamTracker({ onNavigate, onGoHome }: LucidDreamTrackerProps) {
  const [entries, setEntries] = useState<LucidDreamEntry[]>([]);
  const [showEntryForm, setShowEntryForm] = useState(false);
  const [newEntry, setNewEntry] = useState<Partial<LucidDreamEntry>>({
    date: new Date().toISOString().split('T')[0],
    wasLucid: false,
    technique: '',
    vividness: 3,
    control: 1,
    duration: '',
    description: '',
    realityChecks: 0,
    sleepQuality: 3
  });

  // Load entries from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('lucidDreamEntries');
    if (saved) {
      setEntries(JSON.parse(saved));
    }
  }, []);

  // Save entries to localStorage
  useEffect(() => {
    localStorage.setItem('lucidDreamEntries', JSON.stringify(entries));
  }, [entries]);

  const addEntry = () => {
    if (!newEntry.date) return;
    
    const entry: LucidDreamEntry = {
      id: Date.now().toString(),
      date: newEntry.date!,
      wasLucid: newEntry.wasLucid || false,
      technique: newEntry.technique || '',
      vividness: newEntry.vividness || 3,
      control: newEntry.control || 1,
      duration: newEntry.duration || '',
      description: newEntry.description || '',
      realityChecks: newEntry.realityChecks || 0,
      sleepQuality: newEntry.sleepQuality || 3
    };

    setEntries([entry, ...entries]);
    setNewEntry({
      date: new Date().toISOString().split('T')[0],
      wasLucid: false,
      technique: '',
      vividness: 3,
      control: 1,
      duration: '',
      description: '',
      realityChecks: 0,
      sleepQuality: 3
    });
    setShowEntryForm(false);
  };

  const stats = {
    totalEntries: entries.length,
    lucidCount: entries.filter(e => e.wasLucid).length,
    successRate: entries.length > 0 ? (entries.filter(e => e.wasLucid).length / entries.length * 100) : 0,
    streak: (() => {
      let streak = 0;
      for (const entry of entries.slice().reverse()) {
        if (entry.wasLucid) streak++;
        else break;
      }
      return streak;
    })(),
    avgVividness: entries.length > 0 ? entries.reduce((sum, e) => sum + e.vividness, 0) / entries.length : 0,
    avgControl: entries.filter(e => e.wasLucid).length > 0 ? 
      entries.filter(e => e.wasLucid).reduce((sum, e) => sum + e.control, 0) / entries.filter(e => e.wasLucid).length : 0
  };

  const techniques = [
    'Reality Checks',
    'Wake-Back-to-Bed (WBTB)',
    'Mnemonic Induction (MILD)',
    'Finger Induced Lucid Dreams (FILD)',
    'Wake-Initiated Lucid Dreams (WILD)',
    'Calea Zacatechichi',
    'Galantamine',
    'Meditation',
    'Dream Journal Only',
    'Other'
  ];

  const tips = [
    "Keep a dream journal by your bed and write immediately upon waking",
    "Perform reality checks 10+ times per day consistently",
    "Practice the WBTB technique on weekends when you can sleep in",
    "Set a consistent sleep schedule for better dream recall",
    "Avoid screens 1 hour before bed to improve sleep quality",
    "Practice mindfulness meditation to increase awareness",
    "Use affirmations: 'I will recognize when I'm dreaming'",
    "Look for dream signs - recurring themes in your dreams"
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Moon className="w-8 h-8 text-purple-600" />
            <span style={{ color: "rgba(31, 31, 31, 1)", border: "1px solid rgba(146, 31, 208, 1)" }}>
              Lucid Dream Tracker
            </span>
          </h1>
          <p className="text-gray-600 mt-1">Track your lucid dreaming journey and progress</p>
        </div>
        <Button
          onClick={() => setShowEntryForm(true)}
          className="bg-purple-600 hover:bg-purple-700 text-white flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Dream Entry
        </Button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <Card className="border-blue-200">
          <CardContent className="p-4 text-center">
            <Calendar className="w-6 h-6 text-blue-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-blue-700">{stats.totalEntries}</div>
            <div className="text-sm text-blue-600">Total Dreams</div>
          </CardContent>
        </Card>

        <Card className="border-green-200">
          <CardContent className="p-4 text-center">
            <Eye className="w-6 h-6 text-green-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-green-700">{stats.lucidCount}</div>
            <div className="text-sm text-green-600">Lucid Dreams</div>
          </CardContent>
        </Card>

        <Card className="border-purple-200">
          <CardContent className="p-4 text-center">
            <TrendingUp className="w-6 h-6 text-purple-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-purple-700">{stats.successRate.toFixed(1)}%</div>
            <div className="text-sm text-purple-600">Success Rate</div>
          </CardContent>
        </Card>

        <Card className="border-orange-200">
          <CardContent className="p-4 text-center">
            <Award className="w-6 h-6 text-orange-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-orange-700">{stats.streak}</div>
            <div className="text-sm text-orange-600">Current Streak</div>
          </CardContent>
        </Card>

        <Card className="border-indigo-200">
          <CardContent className="p-4 text-center">
            <Star className="w-6 h-6 text-indigo-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-indigo-700">{stats.avgVividness.toFixed(1)}</div>
            <div className="text-sm text-indigo-600">Avg Vividness</div>
          </CardContent>
        </Card>

        <Card className="border-pink-200">
          <CardContent className="p-4 text-center">
            <Brain className="w-6 h-6 text-pink-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-pink-700">{stats.avgControl.toFixed(1)}</div>
            <div className="text-sm text-pink-600">Avg Control</div>
          </CardContent>
        </Card>
      </div>

      {/* Progress Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-blue-600" />
            Progress Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Success Rate</span>
                <span>{stats.successRate.toFixed(1)}%</span>
              </div>
              <Progress value={stats.successRate} className="h-3" />
            </div>
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Dream Vividness</span>
                <span>{stats.avgVividness.toFixed(1)}/5</span>
              </div>
              <Progress value={stats.avgVividness * 20} className="h-3" />
            </div>
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Lucid Control Level</span>
                <span>{stats.avgControl.toFixed(1)}/5</span>
              </div>
              <Progress value={stats.avgControl * 20} className="h-3" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Tips */}
      <Card className="border-yellow-200 bg-yellow-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-yellow-800">
            <Lightbulb className="w-5 h-5" />
            Daily Lucid Dreaming Tips
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {tips.map((tip, index) => (
              <div key={index} className="flex items-start gap-3 p-3 bg-white rounded-lg border border-yellow-200">
                <div className="w-6 h-6 bg-yellow-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-yellow-600 font-bold text-sm">{index + 1}</span>
                </div>
                <p className="text-yellow-800 text-sm">{tip}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Entries */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-gray-600" />
            Recent Dream Entries
          </CardTitle>
        </CardHeader>
        <CardContent>
          {entries.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Moon className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>No dream entries yet. Start tracking your dreams!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {entries.slice(0, 5).map((entry) => (
                <div key={entry.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <span className="font-medium">{entry.date}</span>
                      {entry.wasLucid ? (
                        <Badge className="bg-green-100 text-green-700">
                          <Eye className="w-3 h-3 mr-1" />
                          Lucid
                        </Badge>
                      ) : (
                        <Badge variant="outline">Regular Dream</Badge>
                      )}
                      {entry.technique && (
                        <Badge variant="secondary">{entry.technique}</Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <span>Vividness: {entry.vividness}/5</span>
                      {entry.wasLucid && <span>Control: {entry.control}/5</span>}
                    </div>
                  </div>
                  
                  {entry.description && (
                    <p className="text-gray-700 text-sm leading-relaxed">{entry.description}</p>
                  )}
                  
                  <div className="flex items-center gap-4 mt-3 text-xs text-gray-500">
                    {entry.realityChecks > 0 && (
                      <span>Reality Checks: {entry.realityChecks}</span>
                    )}
                    {entry.duration && (
                      <span>Duration: {entry.duration}</span>
                    )}
                    <span>Sleep Quality: {entry.sleepQuality}/5</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Entry Form Modal */}
      {showEntryForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="w-5 h-5" />
                Add Dream Entry
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="date">Date</Label>
                  <Input
                    id="date"
                    type="date"
                    value={newEntry.date}
                    onChange={(e) => setNewEntry({ ...newEntry, date: e.target.value })}
                  />
                </div>
                
                <div className="flex items-center gap-3">
                  <Switch
                    checked={newEntry.wasLucid}
                    onCheckedChange={(checked) => setNewEntry({ ...newEntry, wasLucid: checked })}
                  />
                  <Label>This was a lucid dream</Label>
                </div>
              </div>

              <div>
                <Label htmlFor="technique">Technique Used</Label>
                <Select value={newEntry.technique} onValueChange={(value) => setNewEntry({ ...newEntry, technique: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select technique" />
                  </SelectTrigger>
                  <SelectContent>
                    {techniques.map((technique) => (
                      <SelectItem key={technique} value={technique}>
                        {technique}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="vividness">Vividness (1-5)</Label>
                  <Select 
                    value={newEntry.vividness?.toString()} 
                    onValueChange={(value) => setNewEntry({ ...newEntry, vividness: parseInt(value) })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {[1, 2, 3, 4, 5].map((num) => (
                        <SelectItem key={num} value={num.toString()}>
                          {num}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {newEntry.wasLucid && (
                  <div>
                    <Label htmlFor="control">Control Level (1-5)</Label>
                    <Select 
                      value={newEntry.control?.toString()} 
                      onValueChange={(value) => setNewEntry({ ...newEntry, control: parseInt(value) })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {[1, 2, 3, 4, 5].map((num) => (
                          <SelectItem key={num} value={num.toString()}>
                            {num}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                <div>
                  <Label htmlFor="sleepQuality">Sleep Quality (1-5)</Label>
                  <Select 
                    value={newEntry.sleepQuality?.toString()} 
                    onValueChange={(value) => setNewEntry({ ...newEntry, sleepQuality: parseInt(value) })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {[1, 2, 3, 4, 5].map((num) => (
                        <SelectItem key={num} value={num.toString()}>
                          {num}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="realityChecks">Reality Checks Today</Label>
                  <Input
                    id="realityChecks"
                    type="number"
                    min="0"
                    value={newEntry.realityChecks}
                    onChange={(e) => setNewEntry({ ...newEntry, realityChecks: parseInt(e.target.value) || 0 })}
                  />
                </div>

                <div>
                  <Label htmlFor="duration">Dream Duration</Label>
                  <Input
                    id="duration"
                    placeholder="e.g., 5 minutes, 30 minutes"
                    value={newEntry.duration}
                    onChange={(e) => setNewEntry({ ...newEntry, duration: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="description">Dream Description</Label>
                <Textarea
                  id="description"
                  placeholder="Describe your dream experience..."
                  value={newEntry.description}
                  onChange={(e) => setNewEntry({ ...newEntry, description: e.target.value })}
                  rows={4}
                />
              </div>

              <div className="flex justify-end gap-3">
                <Button
                  variant="outline"
                  onClick={() => setShowEntryForm(false)}
                >
                  Cancel
                </Button>
                <Button
                  onClick={addEntry}
                  className="bg-purple-600 hover:bg-purple-700"
                >
                  Save Entry
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
