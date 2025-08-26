import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useSleepData } from '@/hooks/useSleepData';
import { OverviewPage } from './dashboard/OverviewPage';
import { TrackerPage } from './dashboard/TrackerPage';
import { RewardsPage } from './dashboard/RewardsPage';
import { HabitsPage } from './dashboard/HabitsPage';
import { MorningsPage } from './dashboard/MorningsPage';
import { AccountPage } from './dashboard/AccountPage';

interface MainDashboardProps {
  onGoHome?: () => void;
  initialPage?: string;
}

export function MainDashboard({ onGoHome, initialPage = 'overview' }: MainDashboardProps) {
  const { user } = useAuth();
  const [currentPage, setCurrentPage] = useState(initialPage);

  const handleNavigate = (page: string) => {
    setCurrentPage(page);
  };

  if (!user) {
    return (
      <div className="max-w-2xl mx-auto text-center py-12">
        <div className="text-6xl mb-4">🌙</div>
        <h3 className="text-xl font-semibold mb-2">Welcome to SleepVision</h3>
        <p className="text-gray-600">
          Sign in to access your personalized sleep tracking dashboard
        </p>
      </div>
    );
  }

  // Render the appropriate page based on currentPage
  switch (currentPage) {
    case 'tracker':
      return <TrackerPage onNavigate={handleNavigate} onGoHome={onGoHome} />;
    case 'rewards':
      return <RewardsPage onNavigate={handleNavigate} onGoHome={onGoHome} />;
    case 'habits':
      return <HabitsPage onNavigate={handleNavigate} onGoHome={onGoHome} />;
    case 'mornings':
      return <MorningsPage onNavigate={handleNavigate} onGoHome={onGoHome} />;
    case 'account':
      return <AccountPage onNavigate={handleNavigate} onGoHome={onGoHome} />;
    case 'overview':
    default:
      return <OverviewPage onNavigate={handleNavigate} onGoHome={onGoHome} />;
  }
}
