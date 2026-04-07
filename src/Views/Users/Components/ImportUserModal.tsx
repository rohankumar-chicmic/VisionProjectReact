/* eslint-disable no-alert, react/function-component-definition */
import React, { useState, useRef } from 'react';
import {
  Upload,
  AlertCircle,
  CheckCircle2,
  Download,
  FileText,
  X,
  RefreshCw,
} from 'lucide-react';
import Modal from '../../../Components/Atom/Modal/Modal';
import './UserModals.scss';

interface ImportUserModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ImportUserModal: React.FC<ImportUserModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isSuccess, setIsSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (file: File) => {
    if (file.type === 'text/csv' || file.name.endsWith('.csv')) {
      setSelectedFile(file);
      setIsSuccess(false);
    } else {
      alert('Please upload a valid CSV file.');
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFileSelect(file);
  };

  const handleSimulatedUpload = () => {
    if (!selectedFile) return;

    setIsUploading(true);
    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      setUploadProgress(progress);
      if (progress >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          setIsUploading(false);
          setIsSuccess(true);
          setUploadProgress(0);
          setSelectedFile(null);
        }, 500);
      }
    }, 200);
  };

  const resetAndClose = () => {
    setSelectedFile(null);
    setIsUploading(false);
    setUploadProgress(0);
    setIsSuccess(false);
    onClose();
  };

  const footer = (
    <>
      <button
        type="button"
        className="modal-btn secondary"
        onClick={resetAndClose}
      >
        {isSuccess ? 'Close' : 'Cancel'}
      </button>
      {!isSuccess && (
        <button
          type="button"
          className="modal-btn primary"
          disabled={!selectedFile || isUploading}
          onClick={handleSimulatedUpload}
        >
          {isUploading ? (
            <RefreshCw className="animate-spin" size={18} />
          ) : (
            <Upload size={18} />
          )}
          <span>{isUploading ? 'Uploading...' : 'Import Users'}</span>
        </button>
      )}
    </>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={resetAndClose}
      title="Import Users from CRM"
      subtitle="Upload a CSV file with user data from your previous CRM"
      width="600px"
      footer={footer}
    >
      <div className="import-user-content">
        {isSuccess ? (
          <div className="success-state">
            <div className="success-icon-circle">
              <CheckCircle2 size={48} />
            </div>
            <h3>Import Successful!</h3>
            <p>Your users have been queued for processing.</p>
          </div>
        ) : (
          <>
            <div
              className={`dropzone-area ${isDragging ? 'dragging' : ''} ${selectedFile ? 'has-file' : ''}`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  fileInputRef.current?.click();
                }
              }}
              role="button"
              tabIndex={0}
              aria-label="Upload CSV file"
            >
              <input
                type="file"
                ref={fileInputRef}
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleFileSelect(file);
                }}
                accept=".csv"
                style={{ display: 'none' }}
              />
              <div className="dropzone-inner">
                {selectedFile ? (
                  <div className="selected-file-info">
                    <FileText size={48} className="file-icon" />
                    <div className="file-details">
                      <p className="file-name">{selectedFile.name}</p>
                      <p className="file-size">
                        {(selectedFile.size / 1024).toFixed(2)} KB
                      </p>
                    </div>
                    <button
                      type="button"
                      className="remove-file-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedFile(null);
                      }}
                    >
                      <X size={18} />
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="upload-icon-circle">
                      <Upload size={32} />
                    </div>
                    <p className="main-text">
                      Drop CSV file here or click to browse
                    </p>
                    <p className="sub-text">Maximum file size: 10MB</p>
                  </>
                )}
              </div>
              {isUploading && (
                <div className="upload-progress-overlay">
                  <div className="progress-bar-container">
                    <div
                      className="progress-bar-fill"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                  <p>{uploadProgress}% Uploading...</p>
                </div>
              )}
            </div>

            <div className="requirements-card">
              <div className="req-header">
                <AlertCircle size={18} className="warn-icon" />
                <span>CSV File Requirements</span>
              </div>
              <ul className="req-list">
                <li>
                  <CheckCircle2 size={14} className="check-icon" /> Include
                  columns: Name, Email, Phone, Business Name
                </li>
                <li>
                  <CheckCircle2 size={14} className="check-icon" /> First row
                  should contain column headers
                </li>
                <li>
                  <CheckCircle2 size={14} className="check-icon" /> All users
                  will be imported with Trial subscription
                </li>
              </ul>
            </div>

            <button type="button" className="download-template-btn">
              <Download size={16} />
              <span>Download CSV Template</span>
            </button>
          </>
        )}
      </div>
    </Modal>
  );
};

export default ImportUserModal;
