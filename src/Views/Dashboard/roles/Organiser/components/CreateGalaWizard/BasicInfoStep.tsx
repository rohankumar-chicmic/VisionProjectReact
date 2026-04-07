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
        <label className="wizard-field" htmlFor="gala-name">
          <span>Gala name</span>
          <input
            id="gala-name"
            type="text"
            placeholder="Vision PME Awards 2026"
            name={register('name', { required: 'Gala name is required' }).name}
            onChange={register('name').onChange}
            onBlur={register('name').onBlur}
            ref={register('name').ref}
          />
          {errors.name && (
            <span className="field-error">{errors.name.message}</span>
          )}
        </label>

        <label className="wizard-field" htmlFor="event-date">
          <span>Event date</span>
          <input
            id="event-date"
            type="date"
            name={
              register('eventDate', { required: 'Event date is required' }).name
            }
            onChange={register('eventDate').onChange}
            onBlur={register('eventDate').onBlur}
            ref={register('eventDate').ref}
          />
          {errors.eventDate && (
            <span className="field-error">{errors.eventDate.message}</span>
          )}
        </label>

        <label className="wizard-field" htmlFor="venue">
          <span>Venue</span>
          <input
            id="venue"
            type="text"
            placeholder="Grand Hall"
            name={register('venue', { required: 'Venue is required' }).name}
            onChange={register('venue').onChange}
            onBlur={register('venue').onBlur}
            ref={register('venue').ref}
          />
          {errors.venue && (
            <span className="field-error">{errors.venue.message}</span>
          )}
        </label>

        <label className="wizard-field" htmlFor="city">
          <span>City</span>
          <input
            id="city"
            type="text"
            placeholder="Montreal"
            name={register('city', { required: 'City is required' }).name}
            onChange={register('city').onChange}
            onBlur={register('city').onBlur}
            ref={register('city').ref}
          />
          {errors.city && (
            <span className="field-error">{errors.city.message}</span>
          )}
        </label>
      </div>
    </div>
  );
}

export default BasicInfoStep;
