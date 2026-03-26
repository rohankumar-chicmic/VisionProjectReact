import React from 'react';
import { Upload, AlertCircle, CheckCircle2, Download } from 'lucide-react';
import Modal from '../../../Components/Atom/Modal/Modal';
import './UserModals.scss';

interface ImportUserModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ImportUserModal: React.FC<ImportUserModalProps> = ({ isOpen, onClose }) => {
  const footer = (
    <>
      <button className="modal-btn secondary" onClick={onClose}>Cancel</button>
      <button className="modal-btn primary">
        <Upload size={18} />
        <span>Import Users</span>
      </button>
    </>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Import Users from CRM"
      subtitle="Upload a CSV file with user data from your previous CRM"
      width="600px"
      footer={footer}
    >
      <div className="import-user-content">
        <div className="dropzone-area">
          <div className="dropzone-inner">
            <div className="upload-icon-circle">
              <Upload size={32} />
            </div>
            <p className="main-text">Drop CSV file here or click to browse</p>
            <p className="sub-text">Maximum file size: 10MB</p>
          </div>
        </div>

        <div className="requirements-card">
          <div className="req-header">
            <AlertCircle size={18} className="warn-icon" />
            <span>CSV File Requirements</span>
          </div>
          <ul className="req-list">
            <li><CheckCircle2 size={14} className="check-icon" /> Include columns: Name, Email, Phone, Business Name</li>
            <li><CheckCircle2 size={14} className="check-icon" /> First row should contain column headers</li>
            <li><CheckCircle2 size={14} className="check-icon" /> All users will be imported with Trial subscription</li>
          </ul>
        </div>

        <button className="download-template-btn">
          <Download size={16} />
          <span>Download CSV Template</span>
        </button>
      </div>
    </Modal>
  );
};

export default ImportUserModal;
