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
          <div key={item.applicationId} className="queue-item">
            <div className="item-main">
              <div className="applicant-info">
                <div className="avatar-small">
                  <User size={14} />
                </div>
                <div>
                  <strong>{item.applicantName || 'Unknown Applicant'}</strong>
                  <span>
                    {item.applicationCode} •{' '}
                    {item.grantName || 'Unknown Program'}
                  </span>
                </div>
              </div>
              <div className="item-meta">
                <span
                  className={`priority-tag ${item.dueLabel?.toLowerCase() || 'medium'}`}
                >
                  <AlertCircle size={12} /> {item.dueLabel || 'No Deadline'}
                </span>
              </div>
            </div>
            <button
              type="button"
              className="action-btn"
              onClick={() => navigate(`/jury/review/${item.applicationId}`)}
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
