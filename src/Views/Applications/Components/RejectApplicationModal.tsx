import { useState } from 'react';
import { XCircle } from 'lucide-react';
import Modal from '../../../Components/Atom/Modal/Modal';
import './ApplicationModals.scss';

interface RejectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (reason: string, feedback: string, allowReapply: boolean) => void;
  applicantInitials: string;
  applicantName: string;
  grantName: string;
  appId: string;
}

function RejectApplicationModal({
  isOpen,
  onClose,
  onConfirm,
  applicantInitials,
  applicantName,
  grantName,
  appId,
}: Readonly<RejectModalProps>) {
  const [reason, setReason] = useState<string>('Not Eligible');
  const [feedback, setFeedback] = useState('');
  const [allowReapply, setAllowReapply] = useState(true);

  const reasons = [
    'Incomplete Application',
    'Not Eligible',
    'Low Score',
    'Other',
  ];

  const handleConfirm = () => {
    onConfirm(reason, feedback, allowReapply);
  };

  const footer = (
    <div className="modal-actions-footer">
      <button className="btn-cancel" onClick={onClose} type="button">
        Cancel
      </button>
      <button
        className="btn-confirm-reject"
        onClick={handleConfirm}
        type="button"
      >
        <XCircle size={16} />
        <span>Confirm Rejection</span>
      </button>
    </div>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Reject Application"
      subtitle="Provide feedback to help the applicant improve"
      footer={footer}
      width="600px"
    >
      <div className="reject-modal-content">
        <div className="applicant-context">
          <div className="avatar">{applicantInitials}</div>
          <div className="info">
            <h4>
              {applicantName} — {grantName}
            </h4>
            <p>Application ID: {appId}</p>
          </div>
        </div>

        <div className="form-group">
          <label>Reason for Rejection *</label>
          <div className="reason-pills">
            {reasons.map((r) => (
              <button
                type="button"
                key={r}
                className={`pill-btn ${reason === r ? 'active-reject' : ''}`}
                onClick={() => setReason(r)}
              >
                {r}
              </button>
            ))}
          </div>
        </div>

        <div className="form-group">
          <label>Detailed Feedback *</label>
          <textarea
            placeholder="Explain why the application is being rejected and what the applicant can improve for future applications..."
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            rows={4}
          />
          <span className="helper-text">
            This message will be sent to the applicant via email
          </span>
        </div>

        <button
          type="button"
          className="checkbox-wrap"
          onClick={() => setAllowReapply(!allowReapply)}
        >
          <div className={`checkbox ${allowReapply ? 'checked' : ''}`}>
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
              className={allowReapply ? 'block' : 'hidden'}
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
          <span>Allow applicant to reapply after making improvements</span>
        </button>
      </div>
    </Modal>
  );
}

export default RejectApplicationModal;
