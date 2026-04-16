import { Plus } from 'lucide-react';
import type { RequiredFieldsState } from '../types';

interface GrantApplicationSettingsSectionProps {
  requireInterview: boolean;
  requiredFields: RequiredFieldsState;
  onToggleInterview: () => void;
  onToggleField: (field: keyof RequiredFieldsState) => void;
}

function GrantApplicationSettingsSection({
  requireInterview,
  requiredFields,
  onToggleInterview,
  onToggleField,
}: GrantApplicationSettingsSectionProps) {
  return (
    <section className="form-card">
      <div className="card-header">
        <h3>Application Settings</h3>
        <p>Configure application process</p>
      </div>
      <div className="card-body">
        <div className="setting-toggle-item">
          <div className="setting-info">
            <h4>Require Interview</h4>
            <p>Applicants must schedule an interview</p>
          </div>
          <button
            type="button"
            className={`toggle-switch ${requireInterview ? 'active' : ''}`}
            onClick={onToggleInterview}
            role="switch"
            aria-checked={requireInterview}
            aria-label="Require Interview"
          >
            <div className="switch-handle" />
          </button>
        </div>

        <div className="required-fields-section">
          <h4>Required Application Fields</h4>
          <div className="checkbox-grid">
            <button
              type="button"
              className="checkbox-item"
              onClick={() => onToggleField('companyName')}
              role="checkbox"
              aria-checked={requiredFields.companyName}
            >
              <div
                className={`checkbox ${requiredFields.companyName ? 'checked' : ''}`}
              >
                {requiredFields.companyName && (
                  <Plus size={12} className="check-icon" />
                )}
              </div>
              <span>Company Name</span>
            </button>
            <button
              type="button"
              className="checkbox-item"
              onClick={() => onToggleField('industrySelection')}
              role="checkbox"
              aria-checked={requiredFields.industrySelection}
            >
              <div
                className={`checkbox ${requiredFields.industrySelection ? 'checked' : ''}`}
              >
                {requiredFields.industrySelection && (
                  <Plus size={12} className="check-icon" />
                )}
              </div>
              <span>Industry Selection</span>
            </button>
            <button
              type="button"
              className="checkbox-item"
              onClick={() => onToggleField('motivationStatement')}
              role="checkbox"
              aria-checked={requiredFields.motivationStatement}
            >
              <div
                className={`checkbox ${requiredFields.motivationStatement ? 'checked' : ''}`}
              >
                {requiredFields.motivationStatement && (
                  <Plus size={12} className="check-icon" />
                )}
              </div>
              <span>Motivation Statement</span>
            </button>
            <button
              type="button"
              className="checkbox-item"
              onClick={() => onToggleField('businessPlan')}
              role="checkbox"
              aria-checked={requiredFields.businessPlan}
            >
              <div
                className={`checkbox ${requiredFields.businessPlan ? 'checked' : ''}`}
              >
                {requiredFields.businessPlan && (
                  <Plus size={12} className="check-icon" />
                )}
              </div>
              <span>Business Plan Document</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default GrantApplicationSettingsSection;
