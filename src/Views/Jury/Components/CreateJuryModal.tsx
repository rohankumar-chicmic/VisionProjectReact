import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import {
  Mail,
  Phone,
  Building2,
  Briefcase,
  User,
  Loader2,
  Lock,
} from 'lucide-react';
import Modal from '../../../Components/Atom/Modal/Modal';
import type {
  CreateOrganiserJuryRequest,
  OrganiserJuryMember,
} from '../../../Services/Api/module/Organiser/Jury';
import './CreateJuryModal.scss';

interface CreateJuryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateOrganiserJuryRequest) => void | Promise<void>;
  initialValues?: OrganiserJuryMember | null;
}

const INDUSTRY_OPTIONS = [
  'Technology',
  'Services',
  'Retail',
  'Construction',
  'Health',
  'Education',
  'Other',
];

function CreateJuryModal({
  isOpen,
  onClose,
  onSubmit,
  initialValues = null,
}: Readonly<CreateJuryModalProps>) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<CreateOrganiserJuryRequest>({
    defaultValues: {
      fullName: '',
      email: '',
      phoneNumber: '',
      companyName: '',
      domainOfExpertise: '',
      password: '',
    },
  });

  useEffect(() => {
    if (!isOpen) return;

    reset({
      fullName: initialValues?.fullName ?? '',
      email: initialValues?.email ?? '',
      phoneNumber: initialValues?.phoneNumber ?? '',
      companyName: initialValues?.companyName ?? '',
      domainOfExpertise: initialValues?.domainOfExpertise ?? '',
      password: '',
    });
  }, [initialValues, isOpen, reset]);

  const handleModalClose = () => {
    reset();
    onClose();
  };

  const onFormSubmit = async (data: CreateOrganiserJuryRequest) => {
    await onSubmit(data);
    reset();
  };

  const footer = (
    <div className="modal-actions-footer">
      <button
        type="button"
        className="btn-cancel"
        onClick={handleModalClose}
        disabled={isSubmitting}
      >
        Cancel
      </button>
      <button
        type="submit"
        className="btn-confirm-jury"
        form="create-jury-form"
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <Loader2 className="spinner" size={18} />
        ) : (
          <span>{initialValues ? 'Save Changes' : 'Invite Jury Member'}</span>
        )}
      </button>
    </div>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleModalClose}
      title={initialValues ? 'Edit Jury Member' : 'Invite New Jury Member'}
      subtitle={
        initialValues
          ? 'Update this jury member profile for your programmes'
          : 'Add a jury member to help review and score grant applications'
      }
      width="550px"
      footer={footer}
    >
      <form
        id="create-jury-form"
        className="create-jury-form"
        onSubmit={handleSubmit(onFormSubmit)}
      >
        <div className="form-group mb-4">
          <label htmlFor="fullName" className="form-label">
            Full Name *
            <div className="input-with-icon">
              <User size={16} />
              {(() => {
                const { name, onChange, onBlur, ref } = register('fullName', {
                  required: 'Full name is required',
                });
                return (
                  <input
                    id="fullName"
                    type="text"
                    name={name}
                    onChange={onChange}
                    onBlur={onBlur}
                    ref={ref}
                    placeholder="Enter full name"
                  />
                );
              })()}
            </div>
          </label>
          {errors.fullName && (
            <span className="field-error">{errors.fullName.message}</span>
          )}
        </div>

        <div className="form-row half-grid mb-4">
          <div className="form-group">
            <label htmlFor="email" className="form-label">
              Email Address *
              <div className="input-with-icon">
                <Mail size={16} />
                {(() => {
                  const { name, onChange, onBlur, ref } = register('email', {
                    required: 'Email is required',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Invalid email address',
                    },
                  });
                  return (
                    <input
                      id="email"
                      type="email"
                      name={name}
                      onChange={onChange}
                      onBlur={onBlur}
                      ref={ref}
                      placeholder="jury@example.com"
                    />
                  );
                })()}
              </div>
            </label>
            {errors.email && (
              <span className="field-error">{errors.email.message}</span>
            )}
          </div>
          <div className="form-group">
            <label htmlFor="phoneNumber" className="form-label">
              Phone Number *
              <div className="input-with-icon">
                <Phone size={16} />
                {(() => {
                  const { name, onChange, onBlur, ref } = register(
                    'phoneNumber',
                    { required: 'Phone number is required' }
                  );
                  return (
                    <input
                      id="phoneNumber"
                      type="tel"
                      name={name}
                      onChange={onChange}
                      onBlur={onBlur}
                      ref={ref}
                      placeholder="+1 (555) 000-0000"
                    />
                  );
                })()}
              </div>
            </label>
            {errors.phoneNumber && (
              <span className="field-error">{errors.phoneNumber.message}</span>
            )}
          </div>
        </div>

        <div className="form-group mb-4">
          <label htmlFor="companyName" className="form-label">
            Company Name *
            <div className="input-with-icon">
              <Building2 size={16} />
              {(() => {
                const { name, onChange, onBlur, ref } = register(
                  'companyName',
                  { required: 'Company name is required' }
                );
                return (
                  <input
                    id="companyName"
                    type="text"
                    name={name}
                    onChange={onChange}
                    onBlur={onBlur}
                    ref={ref}
                    placeholder="Enter company name"
                  />
                );
              })()}
            </div>
          </label>
          {errors.companyName && (
            <span className="field-error">{errors.companyName.message}</span>
          )}
        </div>

        <div className="form-group mb-4">
          <label htmlFor="domainOfExpertise" className="form-label">
            Domain Of Expertise *
            <div className="input-with-icon">
              <Briefcase size={16} />
              {(() => {
                const { name, onChange, onBlur, ref } = register(
                  'domainOfExpertise',
                  { required: 'Please select a domain' }
                );
                return (
                  <select
                    id="domainOfExpertise"
                    name={name}
                    onChange={onChange}
                    onBlur={onBlur}
                    ref={ref}
                  >
                    <option value="">Select domain</option>
                    {INDUSTRY_OPTIONS.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                );
              })()}
            </div>
          </label>
          {errors.domainOfExpertise && (
            <span className="field-error">
              {errors.domainOfExpertise.message}
            </span>
          )}
        </div>

        <div className="form-group mb-4">
          <label htmlFor="password" className="form-label">
            Password *
            <div className="input-with-icon">
              <Lock size={16} />
              {(() => {
                const { name, onChange, onBlur, ref } = register('password', {
                  required: !initialValues && 'Password is required',
                  minLength: {
                    value: 8,
                    message: 'Password must be at least 8 characters',
                  },
                });
                return (
                  <input
                    id="password"
                    type="password"
                    name={name}
                    onChange={onChange}
                    onBlur={onBlur}
                    ref={ref}
                    placeholder={
                      initialValues
                        ? 'Leave blank to keep current password'
                        : 'Set account password'
                    }
                  />
                );
              })()}
            </div>
          </label>
          {errors.password && (
            <span className="field-error">{errors.password.message}</span>
          )}
        </div>
      </form>
    </Modal>
  );
}

export default CreateJuryModal;
