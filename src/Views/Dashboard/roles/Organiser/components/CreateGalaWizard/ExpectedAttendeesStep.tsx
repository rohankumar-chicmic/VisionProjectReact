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
        <label className="wizard-field" htmlFor="expected-attendees">
          <span>Expected attendees</span>
          <input
            id="expected-attendees"
            type="number"
            min="1"
            placeholder="250"
            name={
              register('expectedAttendees', {
                required: 'Attendee count is required',
                valueAsNumber: true,
                min: {
                  value: 1,
                  message: 'Expected attendees must be at least 1',
                },
              }).name
            }
            onChange={register('expectedAttendees').onChange}
            onBlur={register('expectedAttendees').onBlur}
            ref={register('expectedAttendees').ref}
          />
          {errors.expectedAttendees && (
            <span className="field-error">
              {errors.expectedAttendees.message}
            </span>
          )}
        </label>

        <label
          className="wizard-field wizard-field-full"
          htmlFor="organiser-notes"
        >
          <span>Attendance notes</span>
          <textarea
            id="organiser-notes"
            placeholder="VIP allocation, partner tables, sponsorship considerations, or audience mix."
            name={register('notes').name}
            onChange={register('notes').onChange}
            onBlur={register('notes').onBlur}
            ref={register('notes').ref}
          />
          <span className="field-help">
            These notes stay local to the planning review inside the dashboard.
          </span>
        </label>
      </div>
    </div>
  );
}

export default ExpectedAttendeesStep;
