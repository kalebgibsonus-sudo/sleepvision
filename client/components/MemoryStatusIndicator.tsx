import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { memoryService } from '@/lib/memoryService';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Cloud, 
  HardDrive, 
  Crown, 
  AlertCircle, 
  Database,
  Zap 
} from 'lucide-react';

interface MemoryStatusIndicatorProps {
  showUpgradePrompt?: boolean;
  compact?: boolean;
}

export const MemoryStatusIndicator: React.FC<MemoryStatusIndicatorProps> = ({ 
  showUpgradePrompt = false,
  compact = false 
}) => {
  const { user } = useAuth();
  
  if (!user) return null;

  const storageInfo = memoryService.getStorageInfo(user.subscriptionTier);
  const sessionData = memoryService.getSessionData();

  const getStorageIcon = () => {
    if (storageInfo.hasCloudAccess) {
      return <Cloud className="w-4 h-4 text-blue-600" />;
    }
    return <HardDrive className="w-4 h-4 text-blue-500" />;
  };

  const getStorageStatus = () => {
    switch (user.subscriptionTier) {
      case 'elite-performance':
        return {
          label: 'Elite Cloud Storage',
          description: 'Unlimited secure cloud storage',
          color: 'bg-blue-600 text-white',
          icon: <Crown className="w-4 h-4" />
        };
      case 'full-transformation':
        return {
          label: 'Cloud Storage Active',
          description: 'Full cloud backup & sync',
          color: 'bg-blue-500 text-white',
          icon: <Database className="w-4 h-4" />
        };
      case 'sleep-focused':
        return {
          label: 'Cloud Storage Active',
          description: 'Sleep data backed up',
          color: 'bg-blue-500 text-white',
          icon: <Zap className="w-4 h-4" />
        };
      default:
        return {
          label: 'Local Storage Only',
          description: 'Limited to 3 sleep entries',
          color: 'bg-blue-400 text-white',
          icon: <AlertCircle className="w-4 h-4" />
        };
    }
  };

  const status = getStorageStatus();

  if (compact) {
    return (
      <div className="flex items-center gap-2">
        {getStorageIcon()}
        <Badge className={status.color}>
          {status.label}
        </Badge>
      </div>
    );
  }

  return (
    <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          {getStorageIcon()}
          <div>
            <div className="flex items-center gap-2">
              <h4 className="font-medium text-blue-800">{status.label}</h4>
              <div className="text-blue-600">{status.icon}</div>
            </div>
            <p className="text-sm text-blue-600">{status.description}</p>
          </div>
        </div>
        
        {!storageInfo.hasCloudAccess && showUpgradePrompt && (
          <Button 
            size="sm" 
            className="bg-blue-600 hover:bg-blue-700 text-white"
            onClick={() => window.location.href = '#upgrade'}
          >
            Upgrade
          </Button>
        )}
      </div>

      <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
        <div>
          <span className="text-blue-600">Sleep Entries:</span>
          <span className="ml-2 text-blue-800 font-medium">
            {storageInfo.limits.sleepEntries === -1 ? '∞' : storageInfo.limits.sleepEntries}
          </span>
        </div>
        <div>
          <span className="text-blue-600">Schedules:</span>
          <span className="ml-2 text-blue-800 font-medium">
            {storageInfo.limits.schedules === -1 ? '∞' : storageInfo.limits.schedules}
          </span>
        </div>
        <div>
          <span className="text-blue-600">Morning Routines:</span>
          <span className="ml-2 text-blue-800 font-medium">
            {storageInfo.limits.morningRoutines === -1 ? '∞' : storageInfo.limits.morningRoutines}
          </span>
        </div>
        <div>
          <span className="text-blue-600">Current Streak:</span>
          <span className="ml-2 text-blue-800 font-medium">
            {sessionData.currentStreak} days
          </span>
        </div>
      </div>

      {!storageInfo.hasCloudAccess && (
        <div className="mt-3 p-3 bg-blue-100 rounded-lg border border-blue-300">
          <div className="flex items-center gap-2 text-blue-700">
            <AlertCircle className="w-4 h-4" />
            <span className="text-sm">
              Data is stored locally only. Upgrade for cloud backup & unlimited storage.
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default MemoryStatusIndicator;
