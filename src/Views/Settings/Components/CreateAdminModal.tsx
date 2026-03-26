import React, { useState } from 'react';
import Modal from '../../../Components/Atom/Modal/Modal';
import { Mail, Check, RefreshCw } from 'lucide-react';
import './CreateAdminModal.scss';

interface CreateAdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const CreateAdminModal: React.FC<CreateAdminModalProps> = ({ isOpen, onClose, onConfirm }) => {
  const [role, setRole] = useState<'Sub Admin' | 'Super Admin'>('Sub Admin');
  const [password, setPassword] = useState('');
  const [sendWelcome, setSendWelcome] = useState(true);

  // Permissions state
  const [permissions, setPermissions] = useState({
    manageUsers: true,
    manageGalas: true,
    reviewApps: true,
    manageAdmins: false,
  });

  const generatePassword = () => {
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';
    let newPwd = '';
    for (let i = 0; i < 12; i++) {
        newPwd += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setPassword(newPwd);
  };

  const togglePermission = (key: keyof typeof permissions) => {
    if (key === 'manageAdmins' && role === 'Sub Admin') return;
    setPermissions(prev => ({ ...prev, [key]: !prev[key] }));
  };

  // Ensure Sub Admins cannot manage admins
  if (role === 'Sub Admin' && permissions.manageAdmins) {
    setPermissions(prev => ({ ...prev, manageAdmins: false }));
  }

  const footer = (
    <div className="modal-actions-footer">
      <button className="btn-cancel" onClick={onClose}>Cancel</button>
      <button className="btn-confirm-admin" onClick={onConfirm}>
        <span>Create Admin</span>
      </button>
    </div>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Create New Admin Account"
      subtitle="Add a new administrator to manage the platform"
      width="600px"
      footer={footer}
    >
      <div className="create-admin-form">
        <div className="form-row half-grid">
          <div className="form-group">
            <label>First Name *</label>
            <input type="text" placeholder="Enter first name" />
          </div>
          <div className="form-group">
            <label>Last Name *</label>
            <input type="text" placeholder="Enter last name" />
          </div>
        </div>

        <div className="form-group mb-4">
          <label>Email Address *</label>
          <div className="input-with-icon">
            <Mail size={16} />
            <input type="email" placeholder="admin@example.com" />
          </div>
        </div>

        <div className="form-group mb-4">
          <label>Admin Role *</label>
          <div className="role-toggles">
            <button 
              className={`role-btn ${role === 'Sub Admin' ? 'active-sub' : ''}`}
              onClick={() => setRole('Sub Admin')}
            >
              <span>👤 Sub Admin</span>
            </button>
            <button 
              className={`role-btn ${role === 'Super Admin' ? 'active-super' : ''}`}
              onClick={() => setRole('Super Admin')}
            >
              <span>🛡️ Super Admin</span>
            </button>
          </div>
        </div>

        <div className="form-group mb-4">
          <label>Password *</label>
          <div className="password-generate-wrap">
            <input 
              type="text" 
              placeholder="Auto-generate secure password" 
              value={password}
              readOnly
            />
            <button className="btn-generate" onClick={generatePassword}>
              <RefreshCw size={14} />
              <span>Generate</span>
            </button>
          </div>
        </div>

        <div className="form-group permissions-group mb-4">
          <label>Permissions</label>
          <div className="permission-items">
            <div className="perm-row" onClick={() => togglePermission('manageUsers')}>
              <div className={`checkbox ${permissions.manageUsers ? 'checked' : ''}`}>
                 <Check size={14} className={permissions.manageUsers ? 'block' : 'hidden'} strokeWidth={3} />
              </div>
              <span>Manage Users</span>
            </div>
            <div className="perm-row" onClick={() => togglePermission('manageGalas')}>
              <div className={`checkbox ${permissions.manageGalas ? 'checked' : ''}`}>
                 <Check size={14} className={permissions.manageGalas ? 'block' : 'hidden'} strokeWidth={3} />
              </div>
              <span>Manage Galas & Grants</span>
            </div>
            <div className="perm-row" onClick={() => togglePermission('reviewApps')}>
              <div className={`checkbox ${permissions.reviewApps ? 'checked' : ''}`}>
                 <Check size={14} className={permissions.reviewApps ? 'block' : 'hidden'} strokeWidth={3} />
              </div>
              <span>Review Applications</span>
            </div>
            <div className={`perm-row ${role === 'Sub Admin' ? 'disabled' : ''}`} onClick={() => togglePermission('manageAdmins')}>
              <div className={`checkbox ${permissions.manageAdmins ? 'checked disabled' : ''} ${role === 'Sub Admin' ? 'disabled' : ''}`}>
                 <Check size={14} className={permissions.manageAdmins ? 'block' : 'hidden'} strokeWidth={3} />
              </div>
              <span>Manage Admins <small>(Super Admin only)</small></span>
            </div>
          </div>
        </div>

        <div className="form-group mt-2">
           <div className="perm-row styled" onClick={() => setSendWelcome(!sendWelcome)}>
              <div className={`checkbox styled-check ${sendWelcome ? 'checked' : ''}`}>
                 <Check size={14} className={sendWelcome ? 'block' : 'hidden'} strokeWidth={3} />
              </div>
              <span className="bold-sp">Send welcome email with login credentials</span>
            </div>
        </div>
      </div>
    </Modal>
  );
};

export default CreateAdminModal;
