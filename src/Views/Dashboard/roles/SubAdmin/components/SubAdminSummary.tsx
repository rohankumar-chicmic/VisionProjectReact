import { CheckCircle2, Shield, Users } from 'lucide-react';
import KpiCard, {
  type KpiCardProps,
} from '../../../../../Components/Shared/KpiCard';
import { KpiSkeleton } from '../../../Components/DashboardSkeletons';
import type { UserDashboardData } from '../../../../../Services/Api/module/AdminApi';

interface SubAdminSummaryProps {
  isLoading: boolean;
  stats?: UserDashboardData;
}

function SubAdminSummary({ isLoading, stats }: Readonly<SubAdminSummaryProps>) {
  const cards: KpiCardProps[] = [
    {
      icon: <Users size={22} />,
      label: 'Total Users',
      value: stats?.totalUsers.toLocaleString() || '0',
      trend: '+12%',
      trendType: 'up',
      color: '#3B82F6',
    },
    {
      icon: <CheckCircle2 size={22} />,
      label: 'Active Subscriptions',
      value: stats?.activeSubscriptions.toLocaleString() || '0',
      trend: '+8%',
      trendType: 'up',
      color: '#00CE86',
    },
    {
      icon: <Shield size={22} />,
      label: 'Blocked Users',
      value: stats?.blockedUsers.toLocaleString() || '0',
      trend: '-3%',
      trendType: 'down',
      color: '#EF4444',
    },
  ];

  return (
    <div className="kpi-grid">
      {isLoading
        ? [1, 2, 3].map((id) => <KpiSkeleton key={`sub-admin-kpi-${id}`} />)
        : cards.map((card) => (
            <KpiCard
              key={`${card.label}-${card.value}`}
              icon={card.icon}
              label={card.label}
              value={card.value}
              trend={card.trend}
              trendType={card.trendType}
              color={card.color}
            />
          ))}
    </div>
  );
}

export default SubAdminSummary;
