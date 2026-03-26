import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users,
  Calendar,
  DollarSign,
  FileText,
  Smartphone,
  Award,
  Circle,
  Settings
} from 'lucide-react';
import { useHeader, HeaderActions } from '../../Shared/Context/HeaderContext';
import './Dashboard.scss';
import KpiCard, { KpiCardProps } from '../../Components/Shared/KpiCard';
import BarChart from './Components/BarChart';

const Dashboard: React.FC = () => {
  const { setTitle, setSubtitle } = useHeader();
  const navigate = useNavigate();

  useEffect(() => {
    setTitle('Dashboard Overview');
    setSubtitle("Welcome back! Here's what's happening today");
  }, [setTitle, setSubtitle]);

  const kpis: KpiCardProps[] = [
    { icon: <Users size={22} />, label: 'Total Users', value: '12,543', trend: '+12%', trendType: 'up', color: '#1DB954' },
    { icon: <Calendar size={22} />, label: 'Active Galas', value: '24', trend: '+8%', trendType: 'up', color: '#3B82F6' },
    { icon: <DollarSign size={22} />, label: 'Monthly Revenue', value: '$45,231', trend: '+23%', trendType: 'up', color: '#F59E0B' },
    { icon: <FileText size={22} />, label: 'Applications', value: '187', trend: '+5%', trendType: 'up', color: '#8B5CF6' },
    { icon: <Smartphone size={22} />, label: 'App Downloads', value: '38,421', trend: '+9%', trendType: 'up', color: '#EC4899' },
    { icon: <Award size={22} />, label: 'Active Grants', value: '124', trend: '+15%', trendType: 'up', color: '#06B6D4' },
    {
      icon: <Circle size={22} />,
      label: 'Passport KPI',
      subLabel: 'Active passports this month',
      value: '1,284',
      trend: '+18%',
      trendType: 'up',
      color: '#ef4444',
      period: 'Monthly',
    },
    {
      icon: <Circle size={22} />,
      label: 'Passport KPI',
      subLabel: 'Total passports this year',
      value: '9,870',
      trend: '+34%',
      trendType: 'up',
      color: '#6366f1',
      period: 'Yearly',
    },
  ];

  const chartData = [
    { month: 'JAN', users: 300, unsubs: 500 },
    { month: 'FEB', users: 500, unsubs: 700 },
    { month: 'MAR', users: 400, unsubs: 600 },
    { month: 'APR', users: 450, unsubs: 800 },
    { month: 'MAY', users: 550, unsubs: 900 },
    { month: 'JUN', users: 700, unsubs: 750 },
    { month: 'JUL', users: 800, unsubs: 600 },
    { month: 'AUG', users: 400, unsubs: 550 },
    { month: 'SEP', users: 600, unsubs: 400 },
    { month: 'OCT', users: 550, unsubs: 800 },
    { month: 'NOV', users: 850, unsubs: 600 },
    { month: 'DEC', users: 950, unsubs: 900 },
  ];
  const labels = chartData.map(d => d.month);
  const userData = chartData.map(d => d.users);
  const unsubData = chartData.map(d => d.unsubs);
  return (
    <div className="dashboard-view">
      <HeaderActions>
        <button
          className="action-btn settings-btn"
          onClick={() => navigate('/settings')}
        >
          <Settings size={20} />
          <span>Settings</span>
        </button>
      </HeaderActions>

      <div className="kpi-grid">
        {kpis.map((kpi, index) => (
          <KpiCard key={index} {...kpi} />
        ))}
      </div>

      <div className="charts-grid">
        {/* ... Chart code remains the same ... */}
        <div className="chart-container">
          <div className="chart-header">
            <h4 className="chart-title">Monthly New Users</h4>
            <p className="chart-subtitle">New user registrations per month</p>
          </div>
          {/* <div className="chart-body">
            <div className="bar-chart">
              {chartData.map((data, index) => (
                <div key={index} className="bar-wrapper">
                  <div className="bar" style={{ height: `${(data.users / 1000) * 100}%` }}></div>
                  <span className="bar-label">{data.month}</span>
                </div>
              ))}
            </div>
          </div> */}
          <div className="chart-body">
            <BarChart
              labels={labels}
              data={userData}
              label="Users"
              color="#00CE86"
            />
          </div>
        </div>

        <div className="chart-container">
          <div className="chart-header">
            <h4 className="chart-title">Monthly Unsubscriptions</h4>
            <p className="chart-subtitle">Users who cancelled their subscription</p>
          </div>
          {/* <div className="chart-body">
            <div className="bar-chart unsubs">
              {chartData.map((data, index) => (
                <div key={index} className="bar-wrapper">
                  <div className="bar" style={{ height: `${(data.unsubs / 1000) * 100}%` }}></div>
                  <span className="bar-label">{data.month}</span>
                </div>
              ))}
            </div>
          </div> */}


          <div className="chart-body">
            <BarChart
              labels={labels}
              data={unsubData}
              label="Unsubscriptions"
              color="#EF4444"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;