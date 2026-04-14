import { useState, useMemo } from 'react';
import {
  Mail,
  Phone,
  Briefcase,
  Lock,
  RefreshCw,
  Calendar,
  Check,
  Loader2,
} from 'lucide-react';
import Modal from '../../../Components/Atom/Modal/Modal';
import { useCreateAdminUserMutation } from '../../../Services/Api/module/Admin/User';
import showToast from '../../../Shared/Utils/toast';
import './UserModals.scss';

function PlusIcon({ size }: Readonly<{ size: number }>) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M12 5V19M5 12H19"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

interface CreateUserModalProps {
  isOpen: boolean;
  onClose: () => void;
}

function CreateUserModal({ isOpen, onClose }: CreateUserModalProps) {
  // Form State
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [temporaryPassword, setTemporaryPassword] = useState('');
  const [duration, setDuration] = useState(1); // 1-6 months
  const [sendWelcomeEmail, setSendWelcomeEmail] = useState(true);

  const [createUser, { isLoading }] = useCreateAdminUserMutation();

  const handleGeneratePassword = () => {
    const charset =
      'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';
    let retVal = '';
    for (let i = 0, n = charset.length; i < 12; i += 1) {
      retVal += charset.charAt(Math.floor(Math.random() * n));
    }
    setTemporaryPassword(retVal);
  };

  const freeUntilDate = useMemo(() => {
    const date = new Date();
    date.setMonth(date.getMonth() + duration);
    return date.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  }, [duration]);

  const handleClose = () => {
    setFirstName('');
    setLastName('');
    setEmail('');
    setPhoneNumber('');
    setCompanyName('');
    setTemporaryPassword('');
    setDuration(1);
    setSendWelcomeEmail(true);
    onClose();
  };

  const handleSubmit = async () => {
    if (!firstName || !lastName || !email || !temporaryPassword) {
      showToast.error('Please fill in all required fields');
      return;
    }

    try {
      await createUser({
        firstName,
        lastName,
        email,
        phoneNumber,
        companyName,
        temporaryPassword,
        freeDurationMonths: duration,
        sendWelcomeEmail,
      }).unwrap();

      showToast.success('User account created successfully');
      handleClose();
    } catch (submitError) {
      showToast.error(
        submitError instanceof Error
          ? submitError.message
          : 'Failed to create user'
      );
    }
  };

  const footer = (
    <>
      <button
        type="button"
        className="modal-btn secondary"
        onClick={handleClose}
        disabled={isLoading}
      >
        Cancel
      </button>
      <button
        type="button"
        className="modal-btn primary"
        onClick={handleSubmit}
        disabled={isLoading}
      >
        {isLoading ? (
          <Loader2 size={18} className="animate-spin" />
        ) : (
          <PlusIcon size={18} />
        )}
        <span>{isLoading ? 'Creating...' : 'Create User'}</span>
      </button>
    </>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Create New User Account"
      subtitle="Manually create a user account with details"
      width="650px"
      footer={footer}
    >
      <div className="create-user-form">
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="firstName">
              <span className="label-text">First Name *</span>
              <input
                id="firstName"
                type="text"
                placeholder="Enter first name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
            </label>
          </div>
          <div className="form-group">
            <label htmlFor="lastName">
              <span className="label-text">Last Name *</span>
              <input
                id="lastName"
                type="text"
                placeholder="Enter last name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
            </label>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="email">
              <span className="label-text">Email Address *</span>
              <div className="input-with-icon">
                <Mail size={18} />
                <input
                  id="email"
                  type="email"
                  placeholder="user@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </label>
          </div>
          <div className="form-group">
            <label htmlFor="phoneNumber">
              <span className="label-text">Phone Number</span>
              <div className="input-with-icon">
                <Phone size={18} />
                <input
                  id="phoneNumber"
                  type="text"
                  placeholder="+1 (555) 000-0000"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                />
              </div>
            </label>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="companyName">
            <span className="label-text">Business Name</span>
            <div className="input-with-icon">
              <Briefcase size={18} />
              <input
                id="companyName"
                type="text"
                placeholder="Enter business name"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
              />
            </div>
          </label>
        </div>

        <div className="form-group">
          <label htmlFor="tempPassword">
            <span className="label-text">Temporary Password *</span>
            <div className="input-with-action">
              <div className="input-with-icon">
                <Lock size={18} />
                <input
                  id="tempPassword"
                  type="text"
                  placeholder="Auto-generate password"
                  value={temporaryPassword}
                  onChange={(e) => setTemporaryPassword(e.target.value)}
                />
              </div>
              <button
                type="button"
                className="generate-btn"
                onClick={handleGeneratePassword}
              >
                <RefreshCw size={16} />
                <span>Generate</span>
              </button>
            </div>
          </label>
        </div>

        <div className="duration-selector-section">
          <div className="section-header">
            <div className="icon-badge">
              <Calendar size={18} />
            </div>
            <div className="text">
              <span className="title">Free Account Duration</span>
              <span className="subtitle">
                Choose how long this account will remain free
              </span>
            </div>
          </div>

          <div className="duration-options">
            {[1, 2, 3, 4, 5, 6].map((m) => (
              <button
                type="button"
                key={m}
                className={`opt-btn ${duration === m ? 'active' : ''}`}
                onClick={() => setDuration(m)}
              >
                {m} {m === 1 ? 'month' : 'months'}
              </button>
            ))}
          </div>

          <div className="duration-preview">
            <Calendar size={16} />
            <span>
              Free until: <strong>{freeUntilDate}</strong>
            </span>
          </div>
        </div>

        <label htmlFor="sendWelcomeEmail" className="checkbox-label">
          <input
            id="sendWelcomeEmail"
            type="checkbox"
            checked={sendWelcomeEmail}
            onChange={(e) => setSendWelcomeEmail(e.target.checked)}
          />
          <span className="checkmark">
            <Check size={12} />
          </span>
          <span className="text">
            Send welcome email with login credentials
          </span>
        </label>
      </div>
    </Modal>
  );
}

export default CreateUserModal;
