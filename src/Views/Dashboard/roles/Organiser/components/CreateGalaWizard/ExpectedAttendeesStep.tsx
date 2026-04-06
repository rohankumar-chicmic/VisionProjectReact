import type { FieldErrors, UseFormRegister } from 'react-hook-form';
import type { CreateGalaWizardValues } from './types';

interface ExpectedAttendeesStepProps {
  register: UseFormRegister<CreateGalaWizardValues>;
  errors: FieldErrors<CreateGalaWizardValues>;
}

function ExpectedAttendeesStep({
  register,
  errors,
}: Readonly<ExpectedAttendeesStepProps>) {
  return (
    <div className="wizard-body">
      <div className="dashboard-section-header">
        <div>
          <h3>Expected Attendees</h3>
          <p>Estimate audience size to inform ticket strategy and capacity.</p>
        </div>
      </div>

      <div className="wizard-form-grid">
        <div className="wizard-field">
          <label htmlFor="expected-attendees">Expected attendees</label>
          <input
            id="expected-attendees"
            type="number"
            min="1"
            placeholder="250"
            {...register('expectedAttendees', {
              required: 'Attendee count is required',
              valueAsNumber: true,
              min: { value: 1, message: 'Expected attendees must be at least 1' },
            })}
          />
          {errors.expectedAttendees && (
            <span className="field-error">
              {errors.expectedAttendees.message}
            </span>
          )}
        </div>

        <div className="wizard-field wizard-field-full">
          <label htmlFor="organiser-notes">Attendance notes</label>
          <textarea
            id="organiser-notes"
            placeholder="VIP allocation, partner tables, sponsorship considerations, or audience mix."
            {...register('notes')}
          />
          <span className="field-help">
            These notes stay local to the planning review inside the dashboard.
          </span>
        </div>
      </div>
    </div>
  );
}

export default ExpectedAttendeesStep;
