import React, { useState } from 'react';
import { Mail, Phone, Briefcase, Lock, RefreshCw, Calendar, Check } from 'lucide-react';
import Modal from '../../../Components/Atom/Modal/Modal';
import './UserModals.scss';

interface CreateUserModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CreateUserModal: React.FC<CreateUserModalProps> = ({ isOpen, onClose }) => {
  const [duration, setDuration] = useState('1 month');

  const footer = (
    <>
      <button className="modal-btn secondary" onClick={onClose}>Cancel</button>
      <button className="modal-btn primary">
        <PlusIcon size={18} />
        <span>Create User</span>
      </button>
    </>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Create New User Account"
      subtitle="Manually create a user account with details"
      width="650px"
      footer={footer}
    >
      <div className="create-user-form">
        <div className="form-row">
          <div className="form-group">
            <label>First Name *</label>
            <input type="text" placeholder="Enter first name" />
          </div>
          <div className="form-group">
            <label>Last Name *</label>
            <input type="text" placeholder="Enter last name" />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Email Address *</label>
            <div className="input-with-icon">
              <Mail size={18} />
              <input type="email" placeholder="user@example.com" />
            </div>
          </div>
          <div className="form-group">
            <label>Phone Number</label>
            <div className="input-with-icon">
              <Phone size={18} />
              <input type="text" placeholder="+1 (555) 000-0000" />
            </div>
          </div>
        </div>

        <div className="form-group">
          <label>Business Name</label>
          <div className="input-with-icon">
            <Briefcase size={18} />
            <input type="text" placeholder="Enter business name" />
          </div>
        </div>

        <div className="form-group">
          <label>Temporary Password *</label>
          <div className="input-with-action">
            <div className="input-with-icon">
              <Lock size={18} />
              <input type="password" placeholder="Auto-generate password" />
            </div>
            <button className="generate-btn">
              <RefreshCw size={16} />
              <span>Generate</span>
            </button>
          </div>
        </div>

        <div className="duration-selector-section">
          <div className="section-header">
            <div className="icon-badge">
              <Calendar size={18} />
            </div>
            <div className="text">
              <span className="title">Free Account Duration</span>
              <span className="subtitle">Choose how long this account will remain free</span>
            </div>
          </div>
          
          <div className="duration-options">
            {['1 month', '2 months', '3 months', '4 months', '5 months', '6 months'].map(opt => (
              <button 
                key={opt}
                className={`opt-btn ${duration === opt ? 'active' : ''}`}
                onClick={() => setDuration(opt)}
              >
                {opt}
              </button>
            ))}
          </div>

          <div className="duration-preview">
            <Calendar size={16} />
            <span>Free until: <strong>February 1, 2026</strong></span>
          </div>
        </div>

        <label className="checkbox-label">
          <input type="checkbox" defaultChecked />
          <span className="checkmark"><Check size={12} /></span>
          <span className="text">Send welcome email with login credentials</span>
        </label>
      </div>
    </Modal>
  );
};

const PlusIcon = ({ size }: { size: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 5V19M5 12H19" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export default CreateUserModal;
