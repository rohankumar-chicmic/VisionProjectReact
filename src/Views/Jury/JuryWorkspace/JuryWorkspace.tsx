import { useEffect, useState } from 'react';
import {
  Search,
  Filter,
  ArrowRight,
  ChevronDown,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useHeader, HeaderActions } from '../../../Shared/Context/HeaderContext';
import './JuryWorkspace.scss';

function JuryWorkspace() {
  const { setTitle, setSubtitle, resetHeader } = useHeader();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('Pending');

  useEffect(() => {
    setTitle('My Jury Workspace');
    setSubtitle('Assigned applications for your expert evaluation');
    return () => resetHeader();
  }, [setTitle, setSubtitle, resetHeader]);

  const assignments = [
    {
      id: 'APP-45230',
      applicant: 'Northwind Labs',
      email: 'contact@northwind.com',
      grant: 'Innovation Technology Grant',
      gala: 'Gala Vision Montreal 2026',
      status: 'Pending Review',
      deadline: 'Apr 10, 2026',
    },
    {
      id: 'APP-45231',
      applicant: 'Blue Cedar Studio',
      email: 'info@bluecedar.io',
      grant: 'Community Impact Grant',
      gala: 'Gala Vision Montreal 2026',
      status: 'In Progress',
      deadline: 'Apr 12, 2026',
    },
    {
      id: 'APP-45232',
      applicant: 'Solar Bridge Co.',
      email: 'hello@solarbridge.com',
      grant: 'Innovation Technology Grant',
      gala: 'Gala Vision Montreal 2026',
      status: 'Reviewed',
      deadline: 'Apr 10, 2026',
      score: 8.5,
    },
  ];

  const filteredAssignments = assignments.filter((item) => {
    if (activeTab === 'Pending' && item.status === 'Reviewed') return false;
    if (activeTab === 'Reviewed' && item.status !== 'Reviewed') return false;
    return (
      item.applicant.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.id.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  return (
    <div className="jury-workspace-page">
      <HeaderActions>
        <div className="workspace-stats">
          <div className="stat">
            <span className="label">Remaining</span>
            <span className="value">08</span>
          </div>
          <div className="divider" />
          <div className="stat">
            <span className="label">Completed</span>
            <span className="value">04</span>
          </div>
        </div>
      </HeaderActions>

      <div className="workspace-container">
        <div className="workspace-filters">
          <div className="search-box">
            <Search size={18} />
            <input
              type="text"
              placeholder="Search by applicant or ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="tab-group">
            <button
              type="button"
              className={`tab-btn ${activeTab === 'Pending' ? 'active' : ''}`}
              onClick={() => setActiveTab('Pending')}
            >
              Pending Reviews
            </button>
            <button
              type="button"
              className={`tab-btn ${activeTab === 'Reviewed' ? 'active' : ''}`}
              onClick={() => setActiveTab('Reviewed')}
            >
              Completed
            </button>
          </div>
          <div className="filter-select">
            <Filter size={16} />
            <select aria-label="Filter by Gala">
              <option>All Galas</option>
            </select>
            <ChevronDown size={14} />
          </div>
        </div>

        <div className="assignments-grid">
          {filteredAssignments.map((item) => {
            const isUrgent = item.status !== 'Reviewed' && item.deadline.includes('10'); // Simple logic for demo
            return (
              <div key={item.id} className={`assignment-card ${isUrgent ? 'urgent' : ''}`}>
                <div className="card-top">
                  <div className="status-indicator">
                    {item.status === 'Reviewed' ? (
                      <span className="status-badge reviewed">Reviewed</span>
                    ) : (
                      <span className={`status-badge ${item.status === 'In Progress' ? 'in-progress' : 'pending'}`}>
                        {item.status}
                      </span>
                    )}
                  </div>
                  <div className={`deadline ${isUrgent ? 'high-priority' : ''}`}>
                    Interview Deadline: <strong>{item.deadline}</strong>
                  </div>
                </div>

                <div className="card-main">
                  <div className="applicant-info">
                    <div className="avatar">{item.applicant.charAt(0)}</div>
                    <div className="details">
                      <h4>{item.applicant}</h4>
                      <span>{item.email}</span>
                    </div>
                  </div>
                  <div className="grant-info">
                    <span className="id">{item.id}</span>
                    <p className="grant-name">{item.grant}</p>
                    <div className="gala-meta">
                      <p className="gala-name">{item.gala}</p>
                      <span className="announcement-tag">Results: Feb 25, 2026</span>
                    </div>
                  </div>
                </div>

                <div className="card-footer">
                  {item.status === 'Reviewed' ? (
                    <div className="score-display">
                      <span className="lbl">Your Score</span>
                      <strong className="val">{item.score?.toFixed(1)} / 10</strong>
                    </div>
                  ) : (
                    <div className="progress-hint">
                      <div className="progress-bar">
                        <div className="fill" style={{ width: item.status === 'In Progress' ? '40%' : '0%' }} />
                      </div>
                      <span>{item.status === 'In Progress' ? 'Evaluation started' : 'Not started'}</span>
                    </div>
                  )}
                  <button
                    type="button"
                    className="action-btn"
                    onClick={() => navigate(`/jury/review/${item.id}`)}
                  >
                    {item.status === 'Reviewed' ? 'View Evaluation' : 'Start Scoring'}
                    <ArrowRight size={18} />
                  </button>
                </div>
              </div>
            );
          })}
          {filteredAssignments.length === 0 && (
            <div className="empty-workspace">
              <div className="icon">📂</div>
              <h3>No assignments found</h3>
              <p>Try adjusting your search or filters.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default JuryWorkspace;
