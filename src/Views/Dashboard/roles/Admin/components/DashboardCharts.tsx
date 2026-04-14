import type { DashboardData } from '../../../../../Services/Api/module/Common';
import BarChart from '../../../Components/BarChart';

interface DashboardChartsProps {
  stats?: DashboardData;
}

function DashboardCharts({ stats }: Readonly<DashboardChartsProps>) {
  const newUsersLabels = stats?.monthlyNewUsers?.map((s) => s.label) || [];
  const newUsersData = stats?.monthlyNewUsers?.map((s) => s.value) || [];

  const unsubsLabels = stats?.monthlyUnsubscriptions?.map((s) => s.label) || [];
  const unsubsData = stats?.monthlyUnsubscriptions?.map((s) => s.value) || [];

  return (
    <div className="charts-grid">
      <div className="chart-container">
        <div className="chart-header">
          <h4 className="chart-title">New User Signups</h4>
          <p className="chart-subtitle">
            Monthly growth of platform participants
          </p>
        </div>
        <div className="chart-body">
          <BarChart
            labels={newUsersLabels}
            data={newUsersData}
            label="New Users"
            color="#1DB954"
          />
        </div>
      </div>

      <div className="chart-container">
        <div className="chart-header">
          <h4 className="chart-title">Unsubscriptions</h4>
          <p className="chart-subtitle">
            Users who opted out during the period
          </p>
        </div>
        <div className="chart-body">
          <BarChart
            labels={unsubsLabels}
            data={unsubsData}
            label="Unsubscriptions"
            color="#EF4444"
          />
        </div>
      </div>
    </div>
  );
}

export default DashboardCharts;
