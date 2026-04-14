import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  Mail,
  Phone,
  Building2,
  Briefcase,
  User,
  Loader2,
  Lock,
  Eye,
  EyeOff,
} from 'lucide-react';
import Modal from '../../../Components/Atom/Modal/Modal';
import type {
  CreateOrganiserJuryRequest,
  OrganiserJuryMember,
} from '../../../Services/Api/module/Organiser/Jury';
import './CreateJuryModal.scss';

export interface JuryFormData {
  id?: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  companyName: string;
  domainOfExpertise: string;
  password?: string;
}

interface CreateJuryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: JuryFormData) => void;
  initialData?: JuryFormData | null;
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
  initialData = null,
}: CreateJuryModalProps) {
  const [showPassword, setShowPassword] = useState(false);

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
      domainOfExpertise: '',
      password: '',
    },
  });

  useEffect(() => {
    if (initialData) {
      reset({
        ...initialData,
        password: '', // Don't pre-fill password when editing
      });
    } else {
      reset({
        fullName: '',
        email: '',
        phoneNumber: '',
        companyName: '',
        domainOfExpertise: '',
        password: '',
      });
    }
    setShowPassword(false);
  }, [initialData, reset, isOpen]);

  const handleModalClose = () => {
    reset();
    onClose();
  };

  const onFormSubmit = (data: JuryFormData) => {
    onSubmit(data);
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
          <span>
            {initialData ? 'Update Jury Member' : 'Invite Jury Member'}
          </span>
        )}
      </button>
    </div>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleModalClose}
      title={initialData ? 'Edit Jury Member' : 'Invite New Jury Member'}
      subtitle={
        initialData
          ? 'Update the details of this jury member'
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
          <label htmlFor="fullName" className="label-text">
            Full Name *
            <div className="input-with-icon">
              <User size={16} className="input-icon" />
              <input
                id="fullName"
                type="text"
                placeholder="Enter full name"
                name={
                  register('fullName', { required: 'Full name is required' })
                    .name
                }
                onBlur={register('fullName').onBlur}
                onChange={register('fullName').onChange}
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
            <label htmlFor="email" className="label-text">
              Email Address *
              <div className="input-with-icon">
                <Mail size={16} className="input-icon" />
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
                  onBlur={register('email').onBlur}
                  onChange={register('email').onChange}
                  ref={register('email').ref}
                />
              </div>
            </label>
            {errors.email && (
              <span className="field-error">{errors.email.message}</span>
            )}
          </div>
          <div className="form-group">
            <label htmlFor="phoneNumber" className="label-text">
              Phone Number *
              <div className="input-with-icon">
                <Phone size={16} className="input-icon" />
                <input
                  id="phoneNumber"
                  type="tel"
                  placeholder="+1 (555) 000-0000"
                  name={
                    register('phoneNumber', {
                      required: 'Phone number is required',
                    }).name
                  }
                  onBlur={register('phoneNumber').onBlur}
                  onChange={register('phoneNumber').onChange}
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
          <label htmlFor="companyName" className="label-text">
            Company Name *
            <div className="input-with-icon">
              <Building2 size={16} className="input-icon" />
              <input
                id="companyName"
                type="text"
                placeholder="Enter company name"
                name={
                  register('companyName', {
                    required: 'Company name is required',
                  }).name
                }
                onBlur={register('companyName').onBlur}
                onChange={register('companyName').onChange}
                ref={register('companyName').ref}
              />
            </div>
          </label>
          {errors.companyName && (
            <span className="field-error">{errors.companyName.message}</span>
          )}
        </div>

        <div className="form-group mb-4">
          <label htmlFor="domainOfExpertise" className="label-text">
            Industry Type *
            <div className="input-with-icon">
              <Briefcase size={16} className="input-icon" />
              <select
                id="domainOfExpertise"
                name={
                  register('domainOfExpertise', {
                    required: 'Please select an industry',
                  }).name
                }
                onBlur={register('domainOfExpertise').onBlur}
                onChange={register('domainOfExpertise').onChange}
                ref={register('domainOfExpertise').ref}
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
          {errors.domainOfExpertise && (
            <span className="field-error">
              {errors.domainOfExpertise.message}
            </span>
          )}
        </div>

        {!initialData && (
          <div className="form-group">
            <label htmlFor="password" className="label-text">
              Password *
              <div className="input-with-icon">
                <Lock size={16} className="input-icon" />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Set account password"
                  name={
                    register('password', {
                      required: 'Password is required',
                      minLength: {
                        value: 6,
                        message: 'Password must be at least 6 characters',
                      },
                    }).name
                  }
                  onBlur={register('password').onBlur}
                  onChange={register('password').onChange}
                  ref={register('password').ref}
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </label>
            {errors.password && (
              <span className="field-error">{errors.password.message}</span>
            )}
          </div>
        )}
      </form>
    </Modal>
  );
}

CreateJuryModal.defaultProps = {
  initialData: null,
};

export default CreateJuryModal;
