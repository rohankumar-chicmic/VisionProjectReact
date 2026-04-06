function AssignedGrantsList() {
  const grants = [
    {
      name: 'Innovation Technology Grant',
      meta: '14 applications • Gala Spring Summit',
      status: 'Scoring open',
    },
    {
      name: 'Community Impact Grant',
      meta: '9 applications • Gala Founders Night',
      status: 'Review briefing',
    },
    {
      name: 'Sustainability Excellence Grant',
      meta: '6 applications • Gala Green Awards',
      status: 'Consensus pending',
    },
  ];

  return (
    <section className="dashboard-section">
      <div className="dashboard-section-header">
        <div>
          <h3>Assigned Grants List</h3>
          <p>All grant programs currently assigned to this jury workspace.</p>
        </div>
      </div>

      <ul className="list-stack">
        {grants.map((grant) => (
          <li key={grant.name}>
            <div className="metric-copy">
              <strong>{grant.name}</strong>
              <span>{grant.meta}</span>
            </div>
            <span className="status-pill">{grant.status}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default AssignedGrantsList;
