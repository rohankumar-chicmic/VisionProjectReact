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
          <p>Define the grant lineup and the prize pool driving ticket pricing.</p>
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
              <div className="wizard-field">
                <label htmlFor={`grant-name-${index}`}>Grant name</label>
                <input
                  id={`grant-name-${index}`}
                  type="text"
                  placeholder="Innovation Technology Grant"
                  {...register(`grants.${index}.name`, {
                    required: 'Grant name is required',
                  })}
                />
                {errors.grants?.[index]?.name && (
                  <span className="field-error">
                    {errors.grants[index]?.name?.message}
                  </span>
                )}
              </div>

              <div className="wizard-field">
                <label htmlFor={`grant-prize-${index}`}>Prize amount</label>
                <input
                  id={`grant-prize-${index}`}
                  type="number"
                  min="0"
                  placeholder="10000"
                  {...register(`grants.${index}.prizeAmount`, {
                    valueAsNumber: true,
                    min: { value: 0, message: 'Prize amount cannot be negative' },
                  })}
                />
              </div>

              <div className="wizard-field">
                <label htmlFor={`grant-slots-${index}`}>Number of prizes</label>
                <input
                  id={`grant-slots-${index}`}
                  type="number"
                  min="1"
                  placeholder="2"
                  {...register(`grants.${index}.slots`, {
                    valueAsNumber: true,
                    min: { value: 1, message: 'At least one prize is required' },
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

export default GrantsStep;
