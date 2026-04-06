function EvaluationQueue() {
  const queue = [
    {
      applicant: 'Northwind Labs',
      grant: 'Innovation Technology Grant',
      due: 'Due today',
    },
    {
      applicant: 'Blue Cedar Studio',
      grant: 'Community Impact Grant',
      due: 'Due tomorrow',
    },
    {
      applicant: 'Solar Bridge Co.',
      grant: 'Sustainability Excellence Grant',
      due: 'Due in 2 days',
    },
  ];

  return (
    <section className="dashboard-section">
      <div className="dashboard-section-header">
        <div>
          <h3>Evaluation Queue</h3>
          <p>Next applications that need scoring or final comments.</p>
        </div>
      </div>

      <ul className="metric-list">
        {queue.map((item) => (
          <li key={`${item.applicant}-${item.grant}`}>
            <div className="metric-copy">
              <strong>{item.applicant}</strong>
              <span>{item.grant}</span>
            </div>
            <span className="dashboard-tag">{item.due}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default EvaluationQueue;
