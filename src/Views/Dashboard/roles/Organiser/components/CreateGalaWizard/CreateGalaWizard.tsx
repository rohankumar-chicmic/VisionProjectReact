import { useState } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import showToast from '../../../../../../Shared/Utils/toast';
import BasicInfoStep from './BasicInfoStep';
import ExpectedAttendeesStep from './ExpectedAttendeesStep';
import GrantsStep from './GrantsStep';
import JuryAssignmentStep from './JuryAssignmentStep';
import ReviewStep from './ReviewStep';
import type { CreateGalaWizardValues } from './types';

interface CreateGalaWizardProps {
  onComplete?: () => void;
}

const steps = [
  { title: 'Basic Info', description: 'Event setup' },
  { title: 'Expected Attendees', description: 'Audience forecast' },
  { title: 'Grants', description: 'Prize pool' },
  { title: 'Jury Assignment', description: 'Review panel' },
  { title: 'Review', description: 'Publish check' },
];

const defaultValues: CreateGalaWizardValues = {
  name: '',
  venue: '',
  city: '',
  eventDate: '',
  expectedAttendees: 250,
  notes: '',
  grants: [{ name: '', prizeAmount: 10000, slots: 1 }],
  juryAssignments: [{ name: '', expertise: '', email: '' }],
};

function CreateGalaWizard({ onComplete }: Readonly<CreateGalaWizardProps>) {
  const [currentStep, setCurrentStep] = useState(0);
  const {
    control,
    handleSubmit,
    register,
    reset,
    watch,
    formState: { errors },
  } = useForm<CreateGalaWizardValues>({ defaultValues });
  const {
    fields: grantFields,
    append: appendGrant,
    remove: removeGrant,
  } = useFieldArray({ control, name: 'grants' });
  const {
    fields: juryFields,
    append: appendJuryMember,
    remove: removeJuryMember,
  } = useFieldArray({ control, name: 'juryAssignments' });
  const values = watch();
  const totalPrizePool = values.grants.reduce(
    (total, grant) =>
      total + (Number(grant.prizeAmount) || 0) * (Number(grant.slots) || 0),
    0
  );
  const expectedAttendees = Number(values.expectedAttendees) || 0;
  const estimatedTicketPrice =
    expectedAttendees > 0 ? totalPrizePool / expectedAttendees : 0;

  const handlePublish = handleSubmit((data) => {
    showToast.success(`"${data.name || 'New gala'}" is ready for publishing.`);
    reset(defaultValues);
    setCurrentStep(0);
    onComplete?.();
  });

  const stepViews = [
    <BasicInfoStep key="basic" register={register} errors={errors} />,
    <ExpectedAttendeesStep
      key="attendees"
      register={register}
      errors={errors}
    />,
    <GrantsStep
      key="grants"
      register={register}
      errors={errors}
      fields={grantFields}
      append={appendGrant}
      remove={removeGrant}
      totalPrizePool={totalPrizePool}
    />,
    <JuryAssignmentStep
      key="jury"
      register={register}
      errors={errors}
      fields={juryFields}
      append={appendJuryMember}
      remove={removeJuryMember}
    />,
    <ReviewStep
      key="review"
      values={values}
      totalPrizePool={totalPrizePool}
      estimatedTicketPrice={estimatedTicketPrice}
    />,
  ];

  return (
    <section className="dashboard-section">
      <div className="wizard-shell">
        <div className="dashboard-section-header">
          <div>
            <h3>Create Gala Wizard</h3>
            <p>
              Plan a gala in five steps without leaving the dashboard shell.
            </p>
          </div>
        </div>

        <div className="wizard-steps">
          {steps.map((step, index) => (
            <div
              key={step.title}
              className={`wizard-step ${currentStep === index ? 'active' : ''}`}
            >
              <div className="step-index">{index + 1}</div>
              <div>
                <strong>{step.title}</strong>
                <span>{step.description}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="price-preview-card">
          <div className="price-preview-copy">
            <h4>Estimated Ticket Price</h4>
            <p>
              Calculated in real time from the total grant prize pool and the
              expected attendee count.
            </p>
            <div className="price-preview-math">
              <span>Prize Pool: ${totalPrizePool.toLocaleString()}</span>
              <span>Expected Attendees: {expectedAttendees || 0}</span>
            </div>
          </div>

          <div className="price-preview-value">
            <span>Live estimate</span>
            <strong>${estimatedTicketPrice.toFixed(2)}</strong>
          </div>
        </div>

        <div className="warning-banner">
          Final price is locked after publishing
        </div>

        {stepViews[currentStep]}

        <div className="wizard-footer">
          <button
            type="button"
            className="dashboard-btn secondary"
            onClick={() => setCurrentStep((step) => Math.max(0, step - 1))}
            disabled={currentStep === 0}
          >
            Back
          </button>

          <div className="wizard-footer-actions">
            {currentStep < steps.length - 1 ? (
              <button
                type="button"
                className="dashboard-btn primary"
                onClick={() =>
                  setCurrentStep((step) => Math.min(steps.length - 1, step + 1))
                }
              >
                Next Step
              </button>
            ) : (
              <button
                type="button"
                className="dashboard-btn primary"
                onClick={handlePublish}
              >
                Publish Gala
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

export default CreateGalaWizard;
