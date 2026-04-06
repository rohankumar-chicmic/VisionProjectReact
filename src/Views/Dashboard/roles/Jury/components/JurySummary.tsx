function JurySummary() {
  const stats = [
    { label: 'Assigned grants', value: '12' },
    { label: 'Pending evaluations', value: '08' },
    { label: 'Due this week', value: '03' },
  ];

  return (
    <section className="dashboard-highlight-card">
      <div>
        <h3>Evaluation workload at a glance</h3>
        <p>
          Review assignments, stay on top of deadlines, and move shortlisted
          applications forward without leaving the dashboard.
        </p>
      </div>

      <div className="highlight-stat-row">
        {stats.map((stat) => (
          <div key={stat.label} className="highlight-stat">
            <span>{stat.label}</span>
            <strong>{stat.value}</strong>
          </div>
        ))}
      </div>
    </section>
  );
}

export default JurySummary;
