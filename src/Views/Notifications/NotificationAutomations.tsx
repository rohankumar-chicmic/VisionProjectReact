import React, { useState } from 'react';
import { 
  Plus, 
  Mail, 
  MessageSquare, 
  CheckCircle2,
  ChevronRight,
  ArrowLeft,
  Eye,
  FileText,
  Bell
} from 'lucide-react';
import './NotificationAutomations.scss';

const NotificationAutomations: React.FC = () => {
  const [showModal, setShowModal] = useState(false);
  const [step, setStep] = useState(1);
  
  const automations = [
    { id: 1, name: 'Welcome Email', trigger: 'User Registered', channels: ['Email'], status: 'Active' },
    { id: 2, name: 'Gala Reminder', trigger: '24h before Gala', channels: ['Email', 'SMS', 'In-App'], status: 'Active' },
    { id: 3, name: 'Application Received', trigger: 'Form Submitted', channels: ['In-App'], status: 'Draft' },
  ];

  const nextStep = () => setStep(prev => Math.min(prev + 1, 5));
  const prevStep = () => setStep(prev => Math.max(prev - 1, 1));

  return (
    <div className="notifications-view">
      <div className="view-header">
        <div className="header-info">
          <p className="view-subtitle">Manage automated messages for various event triggers</p>
        </div>
        <button className="create-btn" onClick={() => { setShowModal(true); setStep(1); }}>
          <Plus size={18} />
          <span>Add Automation</span>
        </button>
      </div>

      <div className="automations-list">
        {automations.map(auto => (
          <div key={auto.id} className="automation-card">
            <div className="card-left">
              <div className="icon-wrapper">
                <Bell size={20} />
              </div>
              <div className="info">
                <h4 className="name">{auto.name}</h4>
                <p className="trigger">Trigger: {auto.trigger}</p>
              </div>
            </div>
            <div className="card-right">
              <div className="channels">
                {auto.channels.map(ch => (
                  <span key={ch} className="channel-tag">{ch}</span>
                ))}
              </div>
              <div className={`status-tag ${auto.status.toLowerCase()}`}>{auto.status}</div>
              <button className="view-btn"><Eye size={18} /></button>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="automation-modal">
            <div className="modal-header">
              <div className="steps-indicator">
                {[1, 2, 3, 4, 5].map(s => (
                  <div key={s} className={`step-dot ${s <= step ? 'active' : ''} ${s === step ? 'current' : ''}`}>
                    {s < step ? <CheckCircle2 size={16} /> : s}
                  </div>
                ))}
              </div>
              <button className="close-btn" onClick={() => setShowModal(false)}>×</button>
            </div>

            <div className="modal-content">
              {step === 1 && (
                <div className="step-view">
                  <h2>Automation Name</h2>
                  <p>Give this automation a unique identifier for easy management</p>
                  <input type="text" placeholder="e.g., Application Submitted — Welcome Email" className="modal-input" />
                </div>
              )}

              {step === 2 && (
                <div className="step-view">
                  <h2>Select Trigger Event</h2>
                  <p>Choose which action will fire this notification</p>
                  <div className="options-grid">
                    <div className="option-card active">
                      <div className="option-icon"><FileText size={20} /></div>
                      <div className="option-info">
                        <strong>Application Submitted</strong>
                        <span>User submits a new scholarship application</span>
                      </div>
                      <CheckCircle2 className="check" size={20} />
                    </div>
                    {/* More options... */}
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="step-view">
                  <h2>Select Gala / Event</h2>
                  <p>Apply to all galas or a specific one</p>
                  <div className="radio-options">
                    <label className="radio-label active">
                      <input type="radio" name="gala" defaultChecked />
                      <span className="radio-text">
                        <strong>All Galas</strong>
                        <span>This notification applies to every gala event</span>
                      </span>
                    </label>
                    {/* More options... */}
                  </div>
                </div>
              )}

              {step === 4 && (
                <div className="step-view">
                  <h2>Select Channels</h2>
                  <p>Choose how to deliver this notification</p>
                  <div className="channel-switches">
                    <div className="channel-switch">
                      <Mail size={20} />
                      <span>Email</span>
                      <div className="toggle active"></div>
                    </div>
                    <div className="channel-switch">
                      <MessageSquare size={20} />
                      <span>SMS</span>
                      <div className="toggle"></div>
                    </div>
                    <div className="channel-switch">
                      <Bell size={20} />
                      <span>In-App</span>
                      <div className="toggle active"></div>
                    </div>
                  </div>
                </div>
              )}

              {step === 5 && (
                <div className="step-view">
                  <h2>Write Message</h2>
                  <p>This message will be sent to the user on trigger</p>
                  <div className="message-editor">
                    <div className="editor-tabs">
                      <button className="active">Email</button>
                      <button>In-App</button>
                    </div>
                    <div className="editor-fields">
                      <label>Notification Title *</label>
                      <input type="text" placeholder="e.g., Application Received!" />
                      <label>Message Body *</label>
                      <textarea placeholder="Hi {{name}}, we've received your application..."></textarea>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="modal-footer">
              {step > 1 && (
                <button className="back-btn" onClick={prevStep}>
                  <ArrowLeft size={18} /> Back
                </button>
              )}
              <div className="spacer"></div>
              <button className="next-btn" onClick={step === 5 ? () => setShowModal(false) : nextStep}>
                {step === 5 ? 'Finish' : 'Next Step'} <ChevronRight size={18} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationAutomations;
