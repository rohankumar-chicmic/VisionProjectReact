import { useForm, Controller } from 'react-hook-form';
import { Mail, Phone, Building2, Briefcase, User, Loader2, Lock } from 'lucide-react';
import Modal from '../../../Components/Atom/Modal/Modal';
import './CreateJuryModal.scss';

interface CreateJuryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
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

function CreateJuryModal({ isOpen, onClose, onSubmit }: CreateJuryModalProps) {
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
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

  const onFormSubmit = (data: any) => {
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
          <label htmlFor="fullName">Full Name *</label>
          <div className="input-with-icon">
            <User size={16} />
            <Controller
              name="fullName"
              control={control}
              rules={{ required: 'Full name is required' }}
              render={({ field }) => (
                <input
                  {...field}
                  id="fullName"
                  type="text"
                  placeholder="Enter full name"
                />
              )}
            />
          </div>
          {errors.fullName && (
            <span className="field-error">{errors.fullName.message}</span>
          )}
        </div>

        <div className="form-row half-grid mb-4">
          <div className="form-group">
            <label htmlFor="email">Email Address *</label>
            <div className="input-with-icon">
              <Mail size={16} />
              <Controller
                name="email"
                control={control}
                rules={{
                  required: 'Email is required',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Invalid email address'
                  }
                }}
                render={({ field }) => (
                  <input
                    {...field}
                    id="email"
                    type="email"
                    placeholder="jury@example.com"
                  />
                )}
              />
            </div>
            {errors.email && (
              <span className="field-error">{errors.email.message}</span>
            )}
          </div>
          <div className="form-group">
            <label htmlFor="phoneNumber">Phone Number *</label>
            <div className="input-with-icon">
              <Phone size={16} />
              <Controller
                name="phoneNumber"
                control={control}
                rules={{ required: 'Phone number is required' }}
                render={({ field }) => (
                  <input
                    {...field}
                    id="phoneNumber"
                    type="tel"
                    placeholder="+1 (555) 000-0000"
                  />
                )}
              />
            </div>
            {errors.phoneNumber && (
              <span className="field-error">{errors.phoneNumber.message}</span>
            )}
          </div>
        </div>

        <div className="form-group mb-4">
          <label htmlFor="companyName">Company Name *</label>
          <div className="input-with-icon">
            <Building2 size={16} />
            <Controller
              name="companyName"
              control={control}
              rules={{ required: 'Company name is required' }}
              render={({ field }) => (
                <input
                  {...field}
                  id="companyName"
                  type="text"
                  placeholder="Enter company name"
                />
              )}
            />
          </div>
          {errors.companyName && (
            <span className="field-error">{errors.companyName.message}</span>
          )}
        </div>

        <div className="form-group mb-4">
          <label htmlFor="industryType">Industry Type *</label>
          <div className="input-with-icon">
            <Briefcase size={16} />
            <Controller
              name="industryType"
              control={control}
              rules={{ required: 'Please select an industry' }}
              render={({ field }) => (
                <select {...field} id="industryType">
                  <option value="">Select Industry</option>
                  {INDUSTRY_OPTIONS.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              )}
            />
          </div>
          {errors.industryType && (
            <span className="field-error">{errors.industryType.message}</span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="password">Password *</label>
          <div className="input-with-icon">
            <Lock size={16} />
            <Controller
              name="password"
              control={control}
              rules={{ 
                required: 'Password is required',
                minLength: { value: 6, message: 'Password must be at least 8 characters' }
              }}
              render={({ field }) => (
                <input
                  {...field}
                  id="password"
                  type="password"
                  placeholder="Set account password"
                />
              )}
            />
          </div>
          {errors.password && (
            <span className="field-error">{errors.password.message}</span>
          )}
        </div>
      </form>
    </Modal>
  );
}

export default CreateJuryModal;
