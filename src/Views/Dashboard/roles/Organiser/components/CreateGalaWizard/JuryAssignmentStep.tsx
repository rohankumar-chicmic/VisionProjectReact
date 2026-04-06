import { Plus, Trash2 } from 'lucide-react';
import type {
  FieldArrayWithId,
  FieldErrors,
  UseFieldArrayAppend,
  UseFieldArrayRemove,
  UseFormRegister,
} from 'react-hook-form';
import type { CreateGalaWizardValues } from './types';

interface JuryAssignmentStepProps {
  register: UseFormRegister<CreateGalaWizardValues>;
  errors: FieldErrors<CreateGalaWizardValues>;
  fields: FieldArrayWithId<CreateGalaWizardValues, 'juryAssignments', 'id'>[];
  append: UseFieldArrayAppend<CreateGalaWizardValues, 'juryAssignments'>;
  remove: UseFieldArrayRemove;
}

function JuryAssignmentStep({
  register,
  errors,
  fields,
  append,
  remove,
}: Readonly<JuryAssignmentStepProps>) {
  return (
    <div className="wizard-body">
      <div className="dashboard-section-header">
        <div>
          <h3>Jury Assignment</h3>
          <p>Build the review panel before the gala moves into publishing.</p>
        </div>
        <button
          type="button"
          className="dashboard-btn secondary"
          onClick={() => append({ name: '', expertise: '', email: '' })}
        >
          <Plus size={16} />
          <span>Add Jury Member</span>
        </button>
      </div>

      <div className="list-stack">
        {fields.map((field, index) => (
          <div key={field.id} className="array-card">
            <div className="array-card-head">
              <h4>Jury Member #{index + 1}</h4>
              {fields.length > 1 && (
                <button
                  type="button"
                  className="dashboard-btn danger"
                  onClick={() => remove(index)}
                >
                  <Trash2 size={16} />
                  <span>Remove</span>
                </button>
              )}
            </div>

            <div className="array-card-grid">
              <div className="wizard-field">
                <label htmlFor={`jury-name-${index}`}>Name</label>
                <input
                  id={`jury-name-${index}`}
                  type="text"
                  placeholder="Avery Taylor"
                  {...register(`juryAssignments.${index}.name`, {
                    required: 'Name is required',
                  })}
                />
                {errors.juryAssignments?.[index]?.name && (
                  <span className="field-error">
                    {errors.juryAssignments[index]?.name?.message}
                  </span>
                )}
              </div>

              <div className="wizard-field">
                <label htmlFor={`jury-expertise-${index}`}>Expertise</label>
                <input
                  id={`jury-expertise-${index}`}
                  type="text"
                  placeholder="Venture Capital"
                  {...register(`juryAssignments.${index}.expertise`, {
                    required: 'Expertise is required',
                  })}
                />
              </div>

              <div className="wizard-field">
                <label htmlFor={`jury-email-${index}`}>Email</label>
                <input
                  id={`jury-email-${index}`}
                  type="email"
                  placeholder="avery@example.com"
                  {...register(`juryAssignments.${index}.email`, {
                    required: 'Email is required',
                  })}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default JuryAssignmentStep;
