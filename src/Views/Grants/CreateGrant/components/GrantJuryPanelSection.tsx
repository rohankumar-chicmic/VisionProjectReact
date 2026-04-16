import { ChevronDown, Plus, Trash2 } from 'lucide-react';

interface JuryMember {
  id: string;
  fullName: string;
  email: string;
  domainOfExpertise: string;
}

interface GrantJuryPanelSectionProps {
  isLoadingJuries: boolean;
  availableJuries: JuryMember[];
  selectedJuries: JuryMember[];
  juryIdToAdd: string;
  onJuryIdToAddChange: (value: string) => void;
  onAddJury: () => void;
  onRemoveJury: (juryId: string) => void;
}

function GrantJuryPanelSection({
  isLoadingJuries,
  availableJuries,
  selectedJuries,
  juryIdToAdd,
  onJuryIdToAddChange,
  onAddJury,
  onRemoveJury,
}: GrantJuryPanelSectionProps) {
  return (
    <section className="form-card">
      <div className="card-header">
        <h3>Jury Panel</h3>
        <p>Select organiser jury members who can review this grant</p>
      </div>
      <div className="card-body">
        <div className="jury-panel-picker">
          <div className="jury-picker-row">
            <div className="custom-select">
              <label htmlFor="jury-select" className="sr-only">
                Select Jury Member
                <select
                  id="jury-select"
                  value={juryIdToAdd}
                  onChange={(event) => onJuryIdToAddChange(event.target.value)}
                  disabled={isLoadingJuries || availableJuries.length === 0}
                >
                  <option value="">
                    {isLoadingJuries
                      ? 'Loading jury members...'
                      : 'Select a jury member'}
                  </option>
                  {availableJuries.map((jury) => (
                    <option key={jury.id} value={jury.id}>
                      {jury.fullName} - {jury.domainOfExpertise}
                    </option>
                  ))}
                </select>
              </label>
              <ChevronDown className="select-arrow" size={18} />
            </div>
            <button
              type="button"
              className="btn-add-item btn-primary-lite"
              onClick={onAddJury}
              disabled={!juryIdToAdd}
            >
              <Plus size={16} />
              <span>Add Jury</span>
            </button>
          </div>

          {selectedJuries.length > 0 ? (
            <div className="selected-jury-list">
              {selectedJuries.map((jury) => (
                <div key={jury.id} className="selected-jury-card">
                  <div className="jury-copy">
                    <strong>{jury.fullName}</strong>
                    <span>
                      {jury.domainOfExpertise} • {jury.email}
                    </span>
                  </div>
                  <button
                    type="button"
                    className="icon-btn delete"
                    onClick={() => onRemoveJury(jury.id)}
                    aria-label={`Remove ${jury.fullName}`}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="jury-panel-empty">
              No jury members selected yet. Add one from the dropdown.
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export default GrantJuryPanelSection;
