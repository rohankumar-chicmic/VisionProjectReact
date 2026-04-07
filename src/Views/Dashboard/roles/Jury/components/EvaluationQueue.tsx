import { AlertCircle, ArrowRight, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

function EvaluationQueue() {
  const navigate = useNavigate();
  const queue = [
    {
      id: 'APP-45230',
      applicant: 'Northwind Labs',
      grant: 'Innovation Technology Grant',
      deadline: 'Due today',
      priority: 'high',
    },
    {
      id: 'APP-45231',
      applicant: 'Blue Cedar Studio',
      grant: 'Community Impact Grant',
      deadline: 'Due tomorrow',
      priority: 'medium',
    },
    {
      id: 'APP-45232',
      applicant: 'Solar Bridge Co.',
      grant: 'Sustainability Excellence Grant',
      deadline: 'Due in 2 days',
      priority: 'low',
    },
  ];

  return (
    <section className="dashboard-section evaluation-queue">
      <div className="dashboard-section-header">
        <div>
          <h3>Evaluation Queue</h3>
          <p>Prioritized applications awaiting your review.</p>
        </div>
      </div>

      <div className="queue-stack">
        {queue.map((item) => (
          <div key={item.id} className="queue-item">
            <div className="item-main">
              <div className="applicant-info">
                <div className="avatar-small">
                  <User size={14} />
                </div>
                <div>
                  <strong>{item.applicant}</strong>
                  <span>
                    {item.id} • {item.grant}
                  </span>
                </div>
              </div>
              <div className="item-meta">
                <span className={`priority-tag ${item.priority}`}>
                  <AlertCircle size={12} /> {item.deadline}
                </span>
              </div>
            </div>
            <button
              type="button"
              className="action-btn"
              onClick={() => navigate(`/jury/review/${item.id}`)}
            >
              Start Review <ArrowRight size={16} />
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}

export default EvaluationQueue;
