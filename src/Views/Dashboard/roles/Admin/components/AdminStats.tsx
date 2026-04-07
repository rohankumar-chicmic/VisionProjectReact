import { Award, Calendar, DollarSign, Users } from 'lucide-react';
import KpiCard, {
  type KpiCardProps,
} from '../../../../../Components/Shared/KpiCard';
import type { DashboardData } from '../../../../../Services/Api/module/CommonApi';
import { KpiSkeleton } from '../../../Components/DashboardSkeletons';

interface AdminStatsProps {
  isLoading: boolean;
  stats?: DashboardData;
}

const getTrend = (value?: number) =>
  `${(value || 0) >= 0 ? '+' : ''}${value || 0}%`;

const getTrendType = (value?: number): 'up' | 'down' =>
  (value || 0) >= 0 ? 'up' : 'down';

function AdminStats({ isLoading, stats }: Readonly<AdminStatsProps>) {
  const kpis: KpiCardProps[] = [
    {
      icon: <Users size={22} />,
      label: 'Total Users',
      value: stats?.totalUsers.toLocaleString() || '0',
      trend: getTrend(stats?.usersGrowthPercentage),
      trendType: getTrendType(stats?.usersGrowthPercentage),
      color: '#1DB954',
    },
    {
      icon: <Calendar size={22} />,
      label: 'Active Galas',
      value: stats?.activeGalas.toLocaleString() || '0',
      trend: getTrend(stats?.galasGrowthPercentage),
      trendType: getTrendType(stats?.galasGrowthPercentage),
      color: '#3B82F6',
    },
    {
      icon: <DollarSign size={22} />,
      label: 'Monthly Revenue',
      value: `$${stats?.monthlyRevenue.toLocaleString() || '0'}`,
      trend: getTrend(stats?.revenueGrowthPercentage),
      trendType: getTrendType(stats?.revenueGrowthPercentage),
      color: '#F59E0B',
    },
    {
      icon: <Award size={22} />,
      label: 'Active Grants',
      value: stats?.activeGrants.toLocaleString() || '0',
      trend: getTrend(stats?.grantsGrowthPercentage),
      trendType: getTrendType(stats?.grantsGrowthPercentage),
      color: '#06B6D4',
    },
  ];

  return (
    <div className="kpi-grid">
      {isLoading
        ? [1, 2, 3, 4].map((id) => <KpiSkeleton key={`admin-kpi-${id}`} />)
        : kpis.map((kpi) => (
            <KpiCard
              key={`${kpi.label}-${kpi.value}`}
              icon={kpi.icon}
              label={kpi.label}
              value={kpi.value}
              trend={kpi.trend}
              trendType={kpi.trendType}
              color={kpi.color}
            />
          ))}
    </div>
  );
}

export default AdminStats;
