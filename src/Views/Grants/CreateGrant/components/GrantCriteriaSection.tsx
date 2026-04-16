import { Settings2 } from 'lucide-react';

interface GrantCriteriaSectionProps {
  juryCriteria: number[];
  onManageCriteria: () => void;
}

function GrantCriteriaSection({
  juryCriteria,
  onManageCriteria,
}: GrantCriteriaSectionProps) {
  return (
    <section className="form-card">
      <div className="card-header flex-header">
        <div className="header-text">
          <h3>Jury Criteria</h3>
          <p>
            Define evaluation criteria that jury members will use to score
            applicants
          </p>
        </div>
        <button type="button" className="btn-manage" onClick={onManageCriteria}>
          <Settings2 size={16} />
          <span>Manage Criteria</span>
        </button>
      </div>
      <div className="card-body">
        <div className="criteria-summary-box">
          <div className="summary-header">
            <div className="count-badge">{juryCriteria.length}</div>
            <div className="header-text">
              <h4>Criteria selected</h4>
              <p>Will appear on jury scoring form</p>
            </div>
          </div>
          <div className="criteria-chips-list">
            {juryCriteria.map((criterionId) => (
              <span key={criterionId} className="crit-chip">
                Criterion #{criterionId}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default GrantCriteriaSection;
