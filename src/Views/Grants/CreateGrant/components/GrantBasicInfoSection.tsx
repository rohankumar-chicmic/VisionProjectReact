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
}: GrantBasicInfoSectionProps) {
  const selectedGala = galas.find((gala) => gala.id === galaEventId);

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
              >
                <option value="">Select a Gala</option>
                {galas.map((gala) => (
                  <option key={gala.id} value={gala.id}>
                    {gala.name}
                  </option>
                ))}
              </select>
              <ChevronDown className="select-arrow" size={18} />
              {selectedGala && (
                <span className="info-text">
                  {selectedGala.city} •{' '}
                  {new Date(selectedGala.eventDate || '').toLocaleDateString()}
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
