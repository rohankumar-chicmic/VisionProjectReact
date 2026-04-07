import { Plus, Trash2 } from 'lucide-react';
import type {
  FieldArrayWithId,
  FieldErrors,
  UseFieldArrayAppend,
  UseFieldArrayRemove,
  UseFormRegister,
} from 'react-hook-form';
import type { CreateGalaWizardValues } from './types';

interface GrantsStepProps {
  register: UseFormRegister<CreateGalaWizardValues>;
  errors: FieldErrors<CreateGalaWizardValues>;
  fields: FieldArrayWithId<CreateGalaWizardValues, 'grants', 'id'>[];
  append: UseFieldArrayAppend<CreateGalaWizardValues, 'grants'>;
  remove: UseFieldArrayRemove;
  totalPrizePool: number;
}

function GrantsStep({
  register,
  errors,
  fields,
  append,
  remove,
  totalPrizePool,
}: Readonly<GrantsStepProps>) {
  return (
    <div className="wizard-body">
      <div className="dashboard-section-header">
        <div>
          <h3>Grants</h3>
          <p>
            Define the grant lineup and the prize pool driving ticket pricing.
          </p>
        </div>
        <button
          type="button"
          className="dashboard-btn secondary"
          onClick={() => append({ name: '', prizeAmount: 0, slots: 1 })}
        >
          <Plus size={16} />
          <span>Add Grant</span>
        </button>
      </div>

      <div className="warning-banner">
        Total Grant Prize Pool: ${totalPrizePool.toLocaleString()}
      </div>

      <div className="list-stack">
        {fields.map((field, index) => (
          <div key={field.id} className="array-card">
            <div className="array-card-head">
              <h4>Grant #{index + 1}</h4>
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
              <label className="wizard-field" htmlFor={`grant-name-${index}`}>
                <span>Grant name</span>
                <input
                  id={`grant-name-${index}`}
                  type="text"
                  placeholder="Innovation Technology Grant"
                  name={
                    register(`grants.${index}.name`, {
                      required: 'Grant name is required',
                    }).name
                  }
                  onChange={register(`grants.${index}.name`).onChange}
                  onBlur={register(`grants.${index}.name`).onBlur}
                  ref={register(`grants.${index}.name`).ref}
                />
                {errors.grants?.[index]?.name && (
                  <span className="field-error">
                    {errors.grants[index]?.name?.message}
                  </span>
                )}
              </label>

              <label className="wizard-field" htmlFor={`grant-prize-${index}`}>
                <span>Prize amount</span>
                <input
                  id={`grant-prize-${index}`}
                  type="number"
                  min="0"
                  placeholder="10000"
                  name={
                    register(`grants.${index}.prizeAmount`, {
                      valueAsNumber: true,
                      min: {
                        value: 0,
                        message: 'Prize amount cannot be negative',
                      },
                    }).name
                  }
                  onChange={register(`grants.${index}.prizeAmount`).onChange}
                  onBlur={register(`grants.${index}.prizeAmount`).onBlur}
                  ref={register(`grants.${index}.prizeAmount`).ref}
                />
              </label>

              <label className="wizard-field" htmlFor={`grant-slots-${index}`}>
                <span>Number of prizes</span>
                <input
                  id={`grant-slots-${index}`}
                  type="number"
                  min="1"
                  placeholder="2"
                  name={
                    register(`grants.${index}.slots`, {
                      valueAsNumber: true,
                      min: {
                        value: 1,
                        message: 'At least one prize is required',
                      },
                    }).name
                  }
                  onChange={register(`grants.${index}.slots`).onChange}
                  onBlur={register(`grants.${index}.slots`).onBlur}
                  ref={register(`grants.${index}.slots`).ref}
                />
              </label>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default GrantsStep;
