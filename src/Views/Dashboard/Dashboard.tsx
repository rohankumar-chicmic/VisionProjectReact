import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users,
  Calendar,
  DollarSign,
  FileText,
  Award,
  Circle,
  Settings,
} from 'lucide-react';
import { useHeader, HeaderActions } from '../../Shared/Context/HeaderContext';
import './Dashboard.scss';
import KpiCard, { KpiCardProps } from '../../Components/Shared/KpiCard';
import BarChart from './Components/BarChart';
import { useGetDashboardDataQuery } from '../../Services/Api/module/CommonApi';
import { KpiSkeleton, ChartSkeleton } from './Components/DashboardSkeletons';

function Dashboard() {
  const { setTitle, setSubtitle } = useHeader();
  const navigate = useNavigate();
  const { data: dashboardResponse, isLoading } = useGetDashboardDataQuery();
  const stats = dashboardResponse?.data;

  useEffect(() => {
    setTitle('Dashboard Overview');
    setSubtitle("Welcome back! Here's what's happening today");
  }, [setTitle, setSubtitle]);

  const formatTrend = (percentage: number | undefined) => {
    const val = percentage || 0;
    return `${val >= 0 ? '+' : ''}${val}%`;
  };

  const getTrendType = (percentage: number | undefined): 'up' | 'down' => {
    return (percentage || 0) >= 0 ? 'up' : 'down';
  };

  const kpis: KpiCardProps[] = [
    {
      icon: <Users size={22} />,
      label: 'Total Users',
      value: stats?.totalUsers.toLocaleString() || '0',
      trend: formatTrend(stats?.usersGrowthPercentage),
      trendType: getTrendType(stats?.usersGrowthPercentage),
      color: '#1DB954',
    },
    {
      icon: <Calendar size={22} />,
      label: 'Active Galas',
      value: stats?.activeGalas.toLocaleString() || '0',
      trend: formatTrend(stats?.galasGrowthPercentage),
      trendType: getTrendType(stats?.galasGrowthPercentage),
      color: '#3B82F6',
    },
    {
      icon: <DollarSign size={22} />,
      label: 'Monthly Revenue',
      value: `$${stats?.monthlyRevenue.toLocaleString() || '0'}`,
      trend: formatTrend(stats?.revenueGrowthPercentage),
      trendType: getTrendType(stats?.revenueGrowthPercentage),
      color: '#F59E0B',
    },
    {
      icon: <FileText size={22} />,
      label: 'Applications',
      value: stats?.totalApplications.toLocaleString() || '0',
      trend: formatTrend(stats?.applicationsGrowthPercentage),
      trendType: getTrendType(stats?.applicationsGrowthPercentage),
      color: '#8B5CF6',
    },
    {
      icon: <Award size={22} />,
      label: 'Active Grants',
      value: stats?.activeGrants.toLocaleString() || '0',
      trend: formatTrend(stats?.grantsGrowthPercentage),
      trendType: getTrendType(stats?.grantsGrowthPercentage),
      color: '#06B6D4',
    },
    {
      icon: <Circle size={22} />,
      label: 'Passport KPI',
      subLabel: 'Active passports this month',
      value: stats?.monthlyActivePasseports.toLocaleString() || '0',
      trend: formatTrend(stats?.monthlyPasseportGrowthPercentage),
      trendType: getTrendType(stats?.monthlyPasseportGrowthPercentage),
      color: '#ef4444',
      period: 'Monthly',
    },
    {
      icon: <Circle size={22} />,
      label: 'Passport KPI',
      subLabel: 'Total passports this year',
      value: stats?.yearlyTotalPasseports.toLocaleString() || '0',
      trend: formatTrend(stats?.yearlyPasseportGrowthPercentage),
      trendType: getTrendType(stats?.yearlyPasseportGrowthPercentage),
      color: '#6366f1',
      period: 'Yearly',
    },
  ];

  const labels = stats?.monthlyNewUsers.map((d) => d.label) || [];
  const userData = stats?.monthlyNewUsers.map((d) => d.value) || [];
  const unsubData = stats?.monthlyUnsubscriptions.map((d) => d.value) || [];

  const isEmpty = !isLoading && (!stats || Object.keys(stats).length === 0);

  if (isEmpty) {
    return (
      <div className="dashboard-empty">
        <div className="empty-content">
          <FileText size={48} />
          <h3>No Data Available</h3>
          <p>We couldn&apos;t find any statistics to display at this time.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-view">
      <HeaderActions>
        <button
          type="button"
          className="action-btn settings-btn"
          onClick={() => navigate('/settings')}
        >
          <Settings size={20} />
          <span>Settings</span>
        </button>
      </HeaderActions>

      <div className="kpi-grid">
        {isLoading
          ? [1, 2, 3, 4, 5, 6, 7].map((id) => (
              <KpiSkeleton key={`skeleton-card-${id}`} />
            ))
          : kpis.map((kpi) => (
              <KpiCard key={`${kpi.label}-${kpi.subLabel || ''}`} {...kpi} />
            ))}
      </div>

      <div className="charts-grid">
        {isLoading ? (
          <>
            <ChartSkeleton />
            <ChartSkeleton />
          </>
        ) : (
          <>
            <div className="chart-container">
              <div className="chart-header">
                <h4 className="chart-title">Monthly New Users</h4>
                <p className="chart-subtitle">
                  New user registrations per month
                </p>
              </div>
              <div className="chart-body">
                <BarChart
                  labels={labels}
                  data={userData}
                  label="Users"
                  color="#1DB954"
                />
              </div>
            </div>

            <div className="chart-container">
              <div className="chart-header">
                <h4 className="chart-title">Monthly Unsubscriptions</h4>
                <p className="chart-subtitle">
                  Users who cancelled their subscription
                </p>
              </div>
              <div className="chart-body">
                <BarChart
                  labels={labels}
                  data={unsubData}
                  label="Unsubscriptions"
                  color="#EF4444"
                />
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
