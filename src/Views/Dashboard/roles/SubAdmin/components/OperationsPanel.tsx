function OperationsPanel() {
  const tasks = [
    {
      title: 'User imports',
      note: 'Prepare the next onboarding batch before tomorrow morning.',
      badge: 'Pending',
    },
    {
      title: 'Grant publishing QA',
      note: 'Double-check application windows before organisers publish.',
      badge: 'Today',
    },
    {
      title: 'Announcement review',
      note: 'Validate copy and targeting for the next member update.',
      badge: 'Queued',
    },
  ];

  return (
    <section className="dashboard-section">
      <div className="dashboard-section-header">
        <div>
          <h3>Operations Panel</h3>
          <p>Focused workstreams for delegated platform management.</p>
        </div>
      </div>

      <ul className="list-stack">
        {tasks.map((task) => (
          <li key={task.title}>
            <div className="metric-copy">
              <strong>{task.title}</strong>
              <span>{task.note}</span>
            </div>
            <span className="dashboard-tag-muted">{task.badge}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default OperationsPanel;
