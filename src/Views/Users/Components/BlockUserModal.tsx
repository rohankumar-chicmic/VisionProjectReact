import React from 'react';
import { Slash, ChevronDown } from 'lucide-react';
import Modal from '../../../Components/Atom/Modal/Modal';
import './UserModals.scss';

interface BlockUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  userName: string;
}

const BlockUserModal: React.FC<BlockUserModalProps> = ({ isOpen, onClose, userName }) => {
  const footer = (
    <>
      <button className="modal-btn secondary" onClick={onClose}>Cancel</button>
      <button className="modal-btn danger">
        <Slash size={18} strokeWidth={2.5} />
        <span>Block User</span>
      </button>
    </>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="" // Custom title area
      width="550px"
      footer={footer}
    >
      <div className="block-user-content">
        <div className="warning-icon-container">
          <div className="icon-circle">
            <Slash size={32} />
          </div>
        </div>

        <div className="block-text-header">
          <h3>Block this user?</h3>
          <p>{userName} will no longer be able to access the platform. You can unblock them at any time.</p>
        </div>

        <div className="form-group no-margin">
          <label>Message to send to user</label>
          <p className="field-hint">This message will be sent by email and SMS to the user</p>
          <textarea 
            placeholder="Your account has been temporarily suspended..."
            defaultValue="Your account has been temporarily suspended. Please contact our support team at support@visionpme.com if you believe this is a mistake."
          />
        </div>

        <div className="form-group">
          <label>Reason for block</label>
          <div className="select-wrapper">
            <select>
              <option>Select a reason...</option>
              <option>Spam behavior</option>
              <option>Policy violation</option>
              <option>Payment failure</option>
            </select>
            <ChevronDown size={18} className="select-icon" />
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default BlockUserModal;
