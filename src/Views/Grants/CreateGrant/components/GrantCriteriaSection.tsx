import { Settings2 } from 'lucide-react';
import { STANDARD_CRITERIA } from '../criteria_data';
import type { Criterion } from '../types';

interface GrantCriteriaSectionProps {
  juryCriteria: (string | number)[];
  customCriteriaDefinitions: Criterion[];
  onManageCriteria: () => void;
}

function GrantCriteriaSection({
  juryCriteria,
  customCriteriaDefinitions,
  onManageCriteria,
}: GrantCriteriaSectionProps) {
  const getCriterionName = (id: string | number) => {
    // Check standard criteria
    const numericId = typeof id === 'number' ? id : parseInt(id, 10);
    if (!isNaN(numericId)) {
      const standard = STANDARD_CRITERIA.find((c) => c.id === numericId);
      if (standard) return standard.name;
    }

    // Check custom criteria (could be UUID or 'c101' format)
    const custom = customCriteriaDefinitions.find((c) => {
      if (!c.id) return false;
      if (c.id === id) return true;

      // Fallback for legacy 'c' prefixed IDs
      const cNumericId = parseInt(c.id.toString().replace('c', ''), 10);
      return !isNaN(cNumericId) && cNumericId.toString() === id.toString();
    });

    if (custom) return custom.name;

    return `Criterion #${id}`;
  };

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
                {getCriterionName(criterionId)}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default GrantCriteriaSection;
