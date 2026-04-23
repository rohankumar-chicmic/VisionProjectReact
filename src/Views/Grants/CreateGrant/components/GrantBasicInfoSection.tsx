import { ChevronDown } from 'lucide-react';
import { GRANT_CATEGORY_OPTIONS } from '../constants';

interface GalaOption {
  id: string;
  name: string;
  city?: string;
  eventDate?: string;
}

interface GrantBasicInfoSectionProps {
  name: string;
  galaEventId: string;
  description: string;
  category: string;
  galas: GalaOption[];
  onNameChange: (value: string) => void;
  onGalaEventChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
  draftGalaName?: string;
  isGalaBuilderMode?: boolean;
}

function GrantBasicInfoSection({
  name,
  galaEventId,
  description,
  category,
  galas,
  onNameChange,
  onGalaEventChange,
  onDescriptionChange,
  onCategoryChange,
  draftGalaName,
  isGalaBuilderMode,
}: GrantBasicInfoSectionProps) {
  const selectedGala = galas.find((gala) => gala.id === galaEventId);

  // If in builder mode and we have a draft gala name, but no gala is selected yet (or it's a new gala)
  const displayGalaName = selectedGala?.name || draftGalaName || '';

  return (
    <section className="form-card">
      <div className="card-header">
        <h3>Basic Information</h3>
        <p>Grant name and description</p>
      </div>
      <div className="card-body">
        <div className="form-group">
          <label htmlFor="grant-name">
            Grant Name *
            <input
              id="grant-name"
              type="text"
              placeholder="e.g., Innovation Technology Grant"
              value={name}
              onChange={(event) => onNameChange(event.target.value)}
            />
          </label>
        </div>

        <div className="form-group">
          <label htmlFor="associated-gala">
            Associated Gala *
            <div className="select-with-info">
              <select
                id="associated-gala"
                value={galaEventId}
                onChange={(event) => onGalaEventChange(event.target.value)}
                disabled={isGalaBuilderMode}
              >
                {!isGalaBuilderMode && <option value="">Select a Gala</option>}
                {isGalaBuilderMode && !selectedGala && displayGalaName && (
                  <option value={galaEventId}>{displayGalaName}</option>
                )}
                {galas.map((gala) => (
                  <option key={gala.id} value={gala.id}>
                    {gala.name}
                  </option>
                ))}
              </select>
              <ChevronDown className="select-arrow" size={18} />
              {(selectedGala || (isGalaBuilderMode && displayGalaName)) && (
                <span className="info-text">
                  {selectedGala?.city || 'Draft Gala'} •{' '}
                  {selectedGala?.eventDate
                    ? new Date(selectedGala.eventDate).toLocaleDateString()
                    : 'Not scheduled'}
                </span>
              )}
            </div>
          </label>
        </div>

        <div className="form-group">
          <label htmlFor="description">
            Description *
            <textarea
              id="description"
              placeholder="For businesses developing innovative technology solutions..."
              rows={4}
              value={description}
              onChange={(event) => onDescriptionChange(event.target.value)}
            />
          </label>
        </div>

        <div className="form-group">
          <label htmlFor="category">
            Category/Industry *
            <div className="custom-select">
              <select
                id="category"
                value={category}
                onChange={(event) => onCategoryChange(event.target.value)}
              >
                {GRANT_CATEGORY_OPTIONS.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
              <ChevronDown className="select-arrow" size={18} />
            </div>
          </label>
        </div>
      </div>
    </section>
  );
}

export default GrantBasicInfoSection;
