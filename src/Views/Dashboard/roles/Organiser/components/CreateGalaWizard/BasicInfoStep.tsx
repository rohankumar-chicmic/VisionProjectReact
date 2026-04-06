import type { FieldErrors, UseFormRegister } from 'react-hook-form';
import type { CreateGalaWizardValues } from './types';

interface BasicInfoStepProps {
  register: UseFormRegister<CreateGalaWizardValues>;
  errors: FieldErrors<CreateGalaWizardValues>;
}

function BasicInfoStep({ register, errors }: Readonly<BasicInfoStepProps>) {
  return (
    <div className="wizard-body">
      <div className="dashboard-section-header">
        <div>
          <h3>Basic Info</h3>
          <p>Set the core event details before pricing and jury planning.</p>
        </div>
      </div>

      <div className="wizard-form-grid">
        <div className="wizard-field">
          <label htmlFor="gala-name">Gala name</label>
          <input
            id="gala-name"
            type="text"
            placeholder="Vision PME Awards 2026"
            {...register('name', { required: 'Gala name is required' })}
          />
          {errors.name && <span className="field-error">{errors.name.message}</span>}
        </div>

        <div className="wizard-field">
          <label htmlFor="event-date">Event date</label>
          <input
            id="event-date"
            type="date"
            {...register('eventDate', { required: 'Event date is required' })}
          />
          {errors.eventDate && (
            <span className="field-error">{errors.eventDate.message}</span>
          )}
        </div>

        <div className="wizard-field">
          <label htmlFor="venue">Venue</label>
          <input
            id="venue"
            type="text"
            placeholder="Grand Hall"
            {...register('venue', { required: 'Venue is required' })}
          />
          {errors.venue && (
            <span className="field-error">{errors.venue.message}</span>
          )}
        </div>

        <div className="wizard-field">
          <label htmlFor="city">City</label>
          <input
            id="city"
            type="text"
            placeholder="Montreal"
            {...register('city', { required: 'City is required' })}
          />
          {errors.city && <span className="field-error">{errors.city.message}</span>}
        </div>
      </div>
    </div>
  );
}

export default BasicInfoStep;
