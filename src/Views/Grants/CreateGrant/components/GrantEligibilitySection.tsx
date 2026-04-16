import { CheckCircle2, Settings2 } from 'lucide-react';
import type { GrantAdditionalRequirement } from '../../../../Services/Api/module/Admin/Grant';

interface GrantEligibilitySectionProps {
  requirements: GrantAdditionalRequirement[];
  onManageRequirements: () => void;
}

function GrantEligibilitySection({
  requirements,
  onManageRequirements,
}: GrantEligibilitySectionProps) {
  return (
    <section className="form-card">
      <div className="card-header flex-header">
        <div className="header-text">
          <h3>Eligibility Criteria</h3>
          <p>Define requirements for applicants</p>
        </div>
      </div>
      <div className="card-body">
        <div className="criteria-sub-section">
          <div className="sub-header">
            <div className="header-info">
              <h4>Additional Requirements</h4>
              <p>Managed separately — click to view and configure</p>
            </div>
            <button
              type="button"
              className="btn-manage"
              onClick={onManageRequirements}
            >
              <Settings2 size={16} />
              <span>Manage</span>
            </button>
          </div>
          <div className="requirements-summary">
            {requirements.map((requirement) => (
              <div key={requirement.text} className="req-summary-item">
                <CheckCircle2 size={16} />
                <span>{requirement.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default GrantEligibilitySection;
