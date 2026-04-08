import { ArrowRight, Calendar, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { AssignedGrant } from '../../../../../Services/Api/module/JuryApi';

interface AssignedGrantsListProps {
  data: AssignedGrant[];
}

function AssignedGrantsList({ data }: AssignedGrantsListProps) {
  const navigate = useNavigate();

  return (
    <section className="dashboard-section assigned-grants">
      <div className="dashboard-section-header">
        <div>
          <h3>My Assigned Programs</h3>
          <p>Programs where you are a primary jury member.</p>
        </div>
      </div>

      <div className="grants-stack">
        {data?.map((grant) => (
          <div key={grant.name} className="grant-list-item">
            <div className="grant-info">
              <h4>{grant.name}</h4>
              <div className="grant-meta">
                <span className="meta-item">
                  <Calendar size={14} /> {grant.gala}
                </span>
                <span className="meta-item">
                  <Users size={14} /> {grant.applicants} Applicants
                </span>
              </div>
            </div>
            <div className="grant-actions">
              <span
                className={`status-pill ${grant.status.toLowerCase().replace(' ', '-')}`}
              >
                {grant.status}
              </span>
              <button
                type="button"
                className="view-btn"
                onClick={() => navigate('/jury/workspace')}
              >
                <ArrowRight size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default AssignedGrantsList;
