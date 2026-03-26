import React from 'react';
import './JuryPage.scss';

const JuryPage: React.FC = () => {
  const applications = [
    { id: 1, name: 'Jerome Bell', grant: 'Innovative Startup Grant', score: 85 },
    { id: 2, name: 'Eleanor Pena', grant: 'Young Entrepreneur Award', score: 92 },
    { id: 3, name: 'Arlene McCoy', grant: 'Sustainability Impact Fund', score: 78 },
  ];

  const criteria = [
    { name: 'Innovation', weight: '30%' },
    { name: 'Feasibility', weight: '25%' },
    { name: 'Impact', weight: '25%' },
    { name: 'Pitch Quality', weight: '20%' },
  ];

  return (
    <div className="jury-page-view">
      <div className="jury-header">
        <div className="header-info">
          <h2>Jury Scoring Dashboard</h2>
          <p>Review and score assigned applications based on criteria</p>
        </div>
        <div className="jury-stats">
          <div className="stat">
            <span>Assigned</span>
            <strong>12</strong>
          </div>
          <div className="stat">
            <span>Completed</span>
            <strong>8</strong>
          </div>
        </div>
      </div>

      <div className="jury-content">
        <div className="applications-sidebar">
          <h3>Applications</h3>
          <div className="app-list">
            {applications.map(app => (
              <div key={app.id} className={`app-item ${app.id === 2 ? 'active' : ''}`}>
                <div className="app-info">
                  <strong>{app.name}</strong>
                  <span>{app.grant}</span>
                </div>
                <div className="app-score">{app.score}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="scoring-panel">
          <div className="panel-header">
            <div className="applicant-profile">
              <div className="avatar">EP</div>
              <div className="details">
                <h4>Eleanor Pena</h4>
                <p>Applied for: Young Entrepreneur Award</p>
              </div>
            </div>
            <button className="view-doc-btn">View Application PDF</button>
          </div>

          <div className="criteria-scoring">
            <h3>Scoring Criteria</h3>
            {criteria.map((c, i) => (
              <div key={i} className="criterion-row">
                <div className="criterion-info">
                  <strong>{c.name}</strong>
                  <span>Weight: {c.weight}</span>
                </div>
                <div className="score-input">
                  <input type="range" min="0" max="100" defaultValue="80" />
                  <span className="score-display">80/100</span>
                </div>
              </div>
            ))}
          </div>

          <div className="panel-footer">
            <textarea placeholder="Add internal jury comments..."></textarea>
            <div className="actions">
              <button className="save-draft-btn">Save Draft</button>
              <button className="submit-score-btn">Submit Final Score</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JuryPage;
