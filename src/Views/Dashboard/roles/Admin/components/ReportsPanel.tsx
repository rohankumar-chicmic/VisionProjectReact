import type { DashboardData } from '../../../../../Services/Api/module/Common';

interface ReportsPanelProps {
  stats?: DashboardData;
}

function ReportsPanel({ stats }: Readonly<ReportsPanelProps>) {
  const reportItems = [
    {
      title: 'Applications throughput',
      description: 'Applications currently moving through review workflows.',
      value: stats?.totalApplications.toLocaleString() || '0',
    },
    {
      title: 'Passport engagement',
      description: 'Active passports this month across the platform.',
      value: stats?.monthlyActivePasseports.toLocaleString() || '0',
    },
    {
      title: 'Yearly passport volume',
      description: 'Total passports issued during the current year.',
      value: stats?.yearlyTotalPasseports.toLocaleString() || '0',
    },
  ];

  return (
    <section className="dashboard-section">
      <div className="dashboard-section-header">
        <div>
          <h3>Reports Panel</h3>
          <p>
            Quick signals to guide daily operations and executive reporting.
          </p>
        </div>
      </div>

      <ul className="metric-list">
        {reportItems.map((item) => (
          <li key={item.title}>
            <div className="metric-copy">
              <strong>{item.title}</strong>
              <span>{item.description}</span>
            </div>
            <span className="metric-value">{item.value}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default ReportsPanel;
