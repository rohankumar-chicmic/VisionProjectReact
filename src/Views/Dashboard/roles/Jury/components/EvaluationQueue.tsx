import { AlertCircle, ArrowRight, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { EvaluationQueueItem } from '../../../../../Services/Api/module/JuryApi';

interface EvaluationQueueProps {
  data: EvaluationQueueItem[];
}

function EvaluationQueue({ data }: EvaluationQueueProps) {
  const navigate = useNavigate();

  return (
    <section className="dashboard-section evaluation-queue">
      <div className="dashboard-section-header">
        <div>
          <h3>Evaluation Queue</h3>
          <p>Prioritized applications awaiting your review.</p>
        </div>
      </div>

      <div className="queue-stack">
        {data?.map((item) => (
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
