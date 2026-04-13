/* eslint-disable import/no-cycle */
import { X, Mail, MessageSquare, Bell, Info, FileText } from 'lucide-react';
import { NotificationItem } from '../NotificationAutomations';
import { AutomationFormData } from './AddAutomationModal';
import useCurrentUserRole from '../../../Shared/Auth/useCurrentUserRole';
import './NotificationPreviewModal.scss';

interface NotificationPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: AutomationFormData | NotificationItem;
}

function NotificationPreviewModal({
  isOpen,
  onClose,
  data,
}: Readonly<NotificationPreviewModalProps>) {
  const { roleLabel } = useCurrentUserRole();
  if (!isOpen || !data) return null;

  const getPreviewContent = () => {
    if ('triggerId' in data) {
      return {
        trigger: data.triggerId.replace('_', ' '),
        emailTitle: data.content.email.title,
        emailBody: data.content.email.body,
        smsBody: data.content.sms.body,
        inAppTitle: data.content.inApp.title,
        inAppBody: data.content.inApp.body,
      };
    }
    return {
      trigger: data.trigger,
      emailTitle: data.previewTitle,
      emailBody: data.previewText,
      smsBody: data.previewText,
      inAppTitle: data.previewTitle,
      inAppBody: data.previewText,
    };
  };

  const preview = getPreviewContent();

  return (
    <div className="modal-overlay preview-overlay">
      <div className="notification-preview-modal">
        <div className="preview-header">
          <div className="header-info">
            <h2>Notification Preview</h2>
            <p>Preview how your message looks across all channels</p>
          </div>
          <button className="close-btn" type="button" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="preview-banner">
          <Info size={16} />
          <span>
            Triggered when: <strong>{preview.trigger}</strong>
          </span>
        </div>

        <div className="preview-grid">
          {/* Email Preview */}
          <div className="preview-card email">
            <div className="card-header">
              <div className="ch-left">
                <Mail size={16} />
                <span>Email</span>
              </div>
              <div className="toggle active" />
            </div>
            <div className="email-mockup">
              <div className="mockup-header">
                <div className="logo-placeholder">
                  <div className="logo-icon" />
                </div>
                <h3>Vision PME {roleLabel}</h3>
              </div>
              <div className="mockup-body">
                <h4>{preview.emailTitle}</h4>
                <p className="greeting">Hi John Doe,</p>
                <p className="message-text">{preview.emailBody}</p>
                <button className="preview-cta" type="button">
                  View Application Status
                </button>
              </div>
            </div>
          </div>

          {/* SMS Preview */}
          <div className="preview-card sms">
            <div className="card-header">
              <div className="ch-left">
                <MessageSquare size={16} />
                <span>SMS</span>
              </div>
              <div className="toggle active" />
            </div>
            <div className="sms-mockup-container">
              <div className="phone-frame">
                <div className="phone-speaker" />
                <div className="sms-bubble">
                  <div className="sender-info">
                    <div className="sender-logo" />
                    <span>Vision PME</span>
                  </div>
                  <p className="sms-text">{preview.smsBody}</p>
                  <span className="sms-time">11:30 AM</span>
                </div>
              </div>
            </div>
          </div>

          {/* In-App Preview */}
          <div className="preview-card in-app">
            <div className="card-header">
              <div className="ch-left">
                <Bell size={16} />
                <span>In-App</span>
              </div>
              <div className="toggle active" />
            </div>
            <div className="in-app-mockup">
              <div className="notif-item">
                <div className="notif-icon">
                  <FileText size={18} />
                </div>
                <div className="notif-content">
                  <strong>{preview.inAppTitle}</strong>
                  <p>{preview.inAppBody}</p>
                  <span className="time">Just now</span>
                </div>
                <div className="dot" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default NotificationPreviewModal;
