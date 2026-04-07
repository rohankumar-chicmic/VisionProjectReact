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
              <label className="wizard-field" htmlFor={`jury-name-${index}`}>
                <span>Name</span>
                <input
                  id={`jury-name-${index}`}
                  type="text"
                  placeholder="Avery Taylor"
                  name={
                    register(`juryAssignments.${index}.name`, {
                      required: 'Name is required',
                    }).name
                  }
                  onChange={register(`juryAssignments.${index}.name`).onChange}
                  onBlur={register(`juryAssignments.${index}.name`).onBlur}
                  ref={register(`juryAssignments.${index}.name`).ref}
                />
                {errors.juryAssignments?.[index]?.name && (
                  <span className="field-error">
                    {errors.juryAssignments[index]?.name?.message}
                  </span>
                )}
              </label>

              <label
                className="wizard-field"
                htmlFor={`jury-expertise-${index}`}
              >
                <span>Expertise</span>
                <input
                  id={`jury-expertise-${index}`}
                  type="text"
                  placeholder="Venture Capital"
                  name={
                    register(`juryAssignments.${index}.expertise`, {
                      required: 'Expertise is required',
                    }).name
                  }
                  onChange={
                    register(`juryAssignments.${index}.expertise`).onChange
                  }
                  onBlur={register(`juryAssignments.${index}.expertise`).onBlur}
                  ref={register(`juryAssignments.${index}.expertise`).ref}
                />
              </label>

              <label className="wizard-field" htmlFor={`jury-email-${index}`}>
                <span>Email</span>
                <input
                  id={`jury-email-${index}`}
                  type="email"
                  placeholder="avery@example.com"
                  name={
                    register(`juryAssignments.${index}.email`, {
                      required: 'Email is required',
                    }).name
                  }
                  onChange={register(`juryAssignments.${index}.email`).onChange}
                  onBlur={register(`juryAssignments.${index}.email`).onBlur}
                  ref={register(`juryAssignments.${index}.email`).ref}
                />
              </label>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default JuryAssignmentStep;
