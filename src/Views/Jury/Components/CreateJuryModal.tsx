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
import './CreateJuryModal.scss';

interface CreateJuryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: JuryFormData) => void;
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

interface JuryFormData {
  fullName: string;
  email: string;
  phoneNumber: string;
  companyName: string;
  industryType: string;
  password: string;
}

function CreateJuryModal({ isOpen, onClose, onSubmit }: CreateJuryModalProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<JuryFormData>({
    defaultValues: {
      fullName: '',
      email: '',
      phoneNumber: '',
      companyName: '',
      industryType: '',
      password: '',
    },
  });

  const handleModalClose = () => {
    reset();
    onClose();
  };

  const onFormSubmit = (data: JuryFormData) => {
    onSubmit(data);
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
          <span>Invite Jury Member</span>
        )}
      </button>
    </div>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleModalClose}
      title="Invite New Jury Member"
      subtitle="Add a jury member to help review and score grant applications"
      width="550px"
      footer={footer}
    >
      <form
        id="create-jury-form"
        className="create-jury-form"
        onSubmit={handleSubmit(onFormSubmit)}
      >
        <div className="form-group mb-4">
          <label htmlFor="fullName">
            <span className="label-text">Full Name *</span>
            <div className="input-with-icon">
              <User size={16} />
              <input
                id="fullName"
                type="text"
                placeholder="Enter full name"
                name={
                  register('fullName', { required: 'Full name is required' })
                    .name
                }
                onChange={register('fullName').onChange}
                onBlur={register('fullName').onBlur}
                ref={register('fullName').ref}
              />
            </div>
          </label>
          {errors.fullName && (
            <span className="field-error">{errors.fullName.message}</span>
          )}
        </div>

        <div className="form-row half-grid mb-4">
          <div className="form-group">
            <label htmlFor="email">
              <span className="label-text">Email Address *</span>
              <div className="input-with-icon">
                <Mail size={16} />
                <input
                  id="email"
                  type="email"
                  placeholder="jury@example.com"
                  name={
                    register('email', {
                      required: 'Email is required',
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: 'Invalid email address',
                      },
                    }).name
                  }
                  onChange={register('email').onChange}
                  onBlur={register('email').onBlur}
                  ref={register('email').ref}
                />
              </div>
            </label>
            {errors.email && (
              <span className="field-error">{errors.email.message}</span>
            )}
          </div>
          <div className="form-group">
            <label htmlFor="phoneNumber">
              <span className="label-text">Phone Number *</span>
              <div className="input-with-icon">
                <Phone size={16} />
                <input
                  id="phoneNumber"
                  type="tel"
                  placeholder="+1 (555) 000-0000"
                  name={
                    register('phoneNumber', {
                      required: 'Phone number is required',
                    }).name
                  }
                  onChange={register('phoneNumber').onChange}
                  onBlur={register('phoneNumber').onBlur}
                  ref={register('phoneNumber').ref}
                />
              </div>
            </label>
            {errors.phoneNumber && (
              <span className="field-error">{errors.phoneNumber.message}</span>
            )}
          </div>
        </div>

        <div className="form-group mb-4">
          <label htmlFor="companyName">
            <span className="label-text">Company Name *</span>
            <div className="input-with-icon">
              <Building2 size={16} />
              <input
                id="companyName"
                type="text"
                placeholder="Enter company name"
                name={
                  register('companyName', {
                    required: 'Company name is required',
                  }).name
                }
                onChange={register('companyName').onChange}
                onBlur={register('companyName').onBlur}
                ref={register('companyName').ref}
              />
            </div>
          </label>
          {errors.companyName && (
            <span className="field-error">{errors.companyName.message}</span>
          )}
        </div>

        <div className="form-group mb-4">
          <label htmlFor="industryType">
            <span className="label-text">Industry Type *</span>
            <div className="input-with-icon">
              <Briefcase size={16} />
              <select
                id="industryType"
                name={
                  register('industryType', {
                    required: 'Please select an industry',
                  }).name
                }
                onChange={register('industryType').onChange}
                onBlur={register('industryType').onBlur}
                ref={register('industryType').ref}
              >
                <option value="">Select Industry</option>
                {INDUSTRY_OPTIONS.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
          </label>
          {errors.industryType && (
            <span className="field-error">{errors.industryType.message}</span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="password">
            <span className="label-text">Password *</span>
            <div className="input-with-icon">
              <Lock size={16} />
              <input
                id="password"
                type="password"
                placeholder="Set account password"
                name={
                  register('password', {
                    required: 'Password is required',
                    minLength: {
                      value: 6,
                      message: 'Password must be at least 8 characters',
                    },
                  }).name
                }
                onChange={register('password').onChange}
                onBlur={register('password').onBlur}
                ref={register('password').ref}
              />
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
