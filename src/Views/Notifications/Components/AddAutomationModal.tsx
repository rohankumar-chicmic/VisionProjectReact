import { useState } from 'react';
import {
  X,
  ChevronRight,
  ArrowLeft,
  FileText,
  CheckCircle,
  XCircle,
  Calendar,
  CreditCard,
  Mail,
  MessageSquare,
  Bell,
  Check,
  Eye,
  Rocket,
  ShieldOff,
} from 'lucide-react';
import './AddAutomationModal.scss';

interface AddAutomationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPreview: (data: AutomationFormData) => void;
}

interface Trigger {
  id: string;
  title: string;
  desc: string;
  category: string;
  icon: JSX.Element;
}

const triggers: Trigger[] = [
  {
    id: 'app_submitted',
    title: 'Application Submitted',
    desc: 'User submits a new scholarship application',
    category: 'APPLICATIONS',
    icon: <FileText size={20} />,
  },
  {
    id: 'app_approved',
    title: 'Application Approved',
    desc: 'Admin approves the application',
    category: 'APPLICATIONS',
    icon: <CheckCircle size={20} />,
  },
  {
    id: 'app_rejected',
    title: 'Application Rejected',
    desc: 'Admin rejects the application',
    category: 'APPLICATIONS',
    icon: <XCircle size={20} />,
  },
  {
    id: 'interview_scheduled',
    title: 'Interview Scheduled',
    desc: 'User schedules an interview slot',
    category: 'INTERVIEWS',
    icon: <Calendar size={20} />,
  },
  {
    id: 'user_subscribed',
    title: 'User Subscribed',
    desc: 'User purchases a subscription plan',
    category: 'SUBSCRIPTIONS & PAYMENTS',
    icon: <CreditCard size={20} />,
  },
];

const galaVariables = [
  '{{user_name}}',
  '{{grant_name}}',
  '{{gala_name}}',
  '{{interview_date}}',
  '{{rejection_reason}}',
  '{{plan_name}}',
];

type EditorTab = 'Email' | 'SMS' | 'In-App';
type ChannelKey = 'email' | 'sms' | 'inApp';

interface ContentItem {
  title?: string;
  body: string;
}

export interface AutomationFormData {
  name: string;
  triggerId: string;
  galaScope: 'All' | 'Specific';
  selectedGala: string;
  channels: Record<ChannelKey, boolean>;
  content: {
    email: Required<ContentItem>;
    sms: ContentItem;
    inApp: Required<ContentItem>;
  };
}

function AddAutomationModal({
  isOpen,
  onClose,
  onPreview,
}: Readonly<AddAutomationModalProps>) {
  const [step, setStep] = useState(1);
  const [activeEditorTab, setActiveEditorTab] = useState<EditorTab>('Email');
  const [formData, setFormData] = useState<AutomationFormData>({
    name: '',
    triggerId: 'app_submitted',
    galaScope: 'All',
    selectedGala: '',
    channels: { email: true, sms: true, inApp: true },
    content: {
      email: {
        title: 'Application Received!',
        body: 'We received your application for {{Grant_name}}. Our team will review it within 2-3 weeks. You can track your status in the app.',
      },
      sms: {
        body: 'Your application for {{Grant_name}} is received. Tracking: visionpme.app/status',
      },
      inApp: {
        title: 'Application Received!',
        body: 'We received your application for Innovation Technology Scholarship.',
      },
    },
  });

  if (!isOpen) return null;

  const nextStep = () => setStep((prev) => Math.min(prev + 1, 5));
  const prevStep = () => setStep((prev) => Math.max(prev - 1, 1));

  const getChannelKey = (tab: EditorTab): ChannelKey => {
    if (tab === 'Email') return 'email';
    if (tab === 'SMS') return 'sms';
    return 'inApp';
  };

  const updateContent = (field: keyof ContentItem, value: string) => {
    const channelKey = getChannelKey(activeEditorTab);
    setFormData((prev) => ({
      ...prev,
      content: {
        ...prev.content,
        [channelKey]: { ...prev.content[channelKey], [field]: value },
      },
    }));
  };

  const addVariable = (variable: string) => {
    const channelKey = getChannelKey(activeEditorTab);
    const content = formData.content[channelKey];
    const currentBody = content.body;
    updateContent('body', `${currentBody} ${variable}`);
  };

  return (
    <div className="modal-overlay">
      <div className="automation-builder-modal">
        <div className="modal-header">
          <div className="header-info">
            <h2>Add New Automation</h2>
            <p>Create an automated message for a specific event trigger</p>
          </div>
          <button className="close-icon-btn" type="button" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="modal-layout">
          <div className="stepper-sidebar">
            {[1, 2, 3, 4, 5].map((s) => (
              <div
                key={s}
                className={`step-item ${step === s ? 'active' : ''} ${step > s ? 'completed' : ''}`}
              >
                <div className="step-number">
                  {step > s ? <Check size={14} /> : s}
                </div>
                <div className="step-label">
                  {s === 1 && 'Automation Name'}
                  {s === 2 && 'Trigger Event'}
                  {s === 3 && 'Gala / Event'}
                  {s === 4 && 'Select Channels'}
                  {s === 5 && 'Write Message'}
                </div>
              </div>
            ))}
          </div>

          <div className="step-content">
            {step === 1 && (
              <div className="step-view">
                <div className="step-header">
                  <span className="step-idx">1</span>
                  <h3>Automation Name</h3>
                </div>
                <p className="step-desc">
                  Give this automation a unique identifier for easy management
                </p>
                <input
                  type="text"
                  className="modal-input"
                  placeholder="e.g., Application Submitted — Welcome Email"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                />
              </div>
            )}

            {step === 2 && (
              <div className="step-view">
                <div className="step-header">
                  <span className="step-idx">2</span>
                  <h3>Select Trigger Event</h3>
                </div>
                <p className="step-desc">
                  Choose which action will fire this notification
                </p>
                <div className="trigger-categories">
                  <span className="cat-label">APPLICATIONS</span>
                  <div className="trigger-grid">
                    {triggers
                      .filter((t) => t.category === 'APPLICATIONS')
                      .map((t) => (
                        <button
                          type="button"
                          key={t.id}
                          className={`trigger-option ${formData.triggerId === t.id ? 'active' : ''}`}
                          onClick={() =>
                            setFormData({ ...formData, triggerId: t.id })
                          }
                        >
                          <div className="t-icon">{t.icon}</div>
                          <div className="t-text">
                            <strong>{t.title}</strong>
                            <span>{t.desc}</span>
                          </div>
                          <div className="t-check">
                            <div className="inner" />
                          </div>
                        </button>
                      ))}
                  </div>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="step-view">
                <div className="step-header">
                  <span className="step-idx">3</span>
                  <h3>Select Gala / Event</h3>
                </div>
                <p className="step-desc">
                  Apply to all galas or a specific one
                </p>
                <div className="scope-options">
                  <button
                    type="button"
                    className={`scope-option ${formData.galaScope === 'All' ? 'active' : ''}`}
                    onClick={() =>
                      setFormData({ ...formData, galaScope: 'All' })
                    }
                  >
                    <div className="scope-radio" />
                    <div className="scope-text">
                      <strong>All Galas</strong>
                      <span>This notification applies to every gala event</span>
                    </div>
                  </button>
                  <button
                    type="button"
                    className={`scope-option ${formData.galaScope === 'Specific' ? 'active' : ''}`}
                    onClick={() =>
                      setFormData({ ...formData, galaScope: 'Specific' })
                    }
                  >
                    <div className="scope-radio" />
                    <div className="scope-text">
                      <strong>Specific Gala</strong>
                      <span>Only send for a selected gala</span>
                    </div>
                  </button>
                </div>
                {formData.galaScope === 'Specific' && (
                  <select
                    className="gala-select"
                    value={formData.selectedGala}
                    onChange={(e) =>
                      setFormData({ ...formData, selectedGala: e.target.value })
                    }
                  >
                    <option value="">Select a gala...</option>
                    <option value="1">Vision Montréal 2026</option>
                  </select>
                )}
              </div>
            )}

            {step === 4 && (
              <div className="step-view">
                <div className="step-header">
                  <span className="step-idx">4</span>
                  <h3>Select Channels</h3>
                </div>
                <p className="step-desc">
                  Choose how to deliver this notification
                </p>
                <div className="channel-switches">
                  <div
                    className={`channel-switch-card ${formData.channels.email ? 'active' : ''}`}
                  >
                    <div className="c-info">
                      <Mail size={20} />
                      <span>Email</span>
                    </div>
                    <button
                      className="toggle"
                      type="button"
                      aria-label="Toggle Email"
                      onClick={() =>
                        setFormData({
                          ...formData,
                          channels: {
                            ...formData.channels,
                            email: !formData.channels.email,
                          },
                        })
                      }
                    >
                      <div className="track" />
                      <div className="thumb" />
                    </button>
                  </div>
                  <div
                    className={`channel-switch-card ${formData.channels.sms ? 'active' : ''}`}
                  >
                    <div className="c-info">
                      <MessageSquare size={20} />
                      <span>SMS</span>
                    </div>
                    <button
                      className="toggle"
                      type="button"
                      aria-label="Toggle SMS"
                      onClick={() =>
                        setFormData({
                          ...formData,
                          channels: {
                            ...formData.channels,
                            sms: !formData.channels.sms,
                          },
                        })
                      }
                    >
                      <div className="track" />
                      <div className="thumb" />
                    </button>
                  </div>
                  <div
                    className={`channel-switch-card ${formData.channels.inApp ? 'active' : ''}`}
                  >
                    <div className="c-info">
                      <Bell size={20} />
                      <span>In-App</span>
                    </div>
                    <button
                      className="toggle"
                      type="button"
                      aria-label="Toggle In-App"
                      onClick={() =>
                        setFormData({
                          ...formData,
                          channels: {
                            ...formData.channels,
                            inApp: !formData.channels.inApp,
                          },
                        })
                      }
                    >
                      <div className="track" />
                      <div className="thumb" />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {step === 5 && (
              <div className="step-view">
                <div className="step-header">
                  <span className="step-idx">5</span>
                  <h3>Write Message</h3>
                </div>
                <p className="step-desc">
                  This message will be sent to the user on trigger
                </p>
                <div className="editor-container">
                  <div className="editor-tabs">
                    <button
                      type="button"
                      className={activeEditorTab === 'Email' ? 'active' : ''}
                      onClick={() => setActiveEditorTab('Email')}
                    >
                      Email
                    </button>
                    <button
                      type="button"
                      className={activeEditorTab === 'SMS' ? 'active' : ''}
                      onClick={() => setActiveEditorTab('SMS')}
                    >
                      SMS
                    </button>
                    <button
                      type="button"
                      className={activeEditorTab === 'In-App' ? 'active' : ''}
                      onClick={() => setActiveEditorTab('In-App')}
                    >
                      In-App
                    </button>
                  </div>
                  <div className="editor-body">
                    {activeEditorTab !== 'SMS' && (
                      <div className="field-group">
                        <label htmlFor="notif-title">
                          <span>Notification Title *</span>
                          <input
                            id="notif-title"
                            type="text"
                            value={
                              formData.content[
                                activeEditorTab === 'Email' ? 'email' : 'inApp'
                              ].title
                            }
                            onChange={(e) =>
                              updateContent('title', e.target.value)
                            }
                          />
                        </label>
                      </div>
                    )}
                    <div className="field-group">
                      <label htmlFor="msg-body">
                        <span>Message Body *</span>
                        <textarea
                          id="msg-body"
                          rows={6}
                          value={
                            formData.content[getChannelKey(activeEditorTab)]
                              .body
                          }
                          onChange={(e) =>
                            updateContent('body', e.target.value)
                          }
                        />
                      </label>
                    </div>
                    <div className="variable-chips">
                      <span className="v-label">Available Variables</span>
                      <div className="chips-list">
                        {galaVariables.map((v) => (
                          <button
                            key={v}
                            type="button"
                            className="v-chip"
                            onClick={() => addVariable(v)}
                          >
                            {v}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="modal-footer">
          <div className="footer-left">
            <button className="btn-cancel" type="button" onClick={onClose}>
              Cancel
            </button>
          </div>
          <div className="footer-right">
            <button
              className="btn-preview"
              type="button"
              onClick={() => onPreview(formData)}
            >
              <Eye size={16} /> Preview
            </button>
            <button className="btn-unpublish" type="button">
              <ShieldOff size={16} /> Unpublish
            </button>
            <button className="btn-publish" type="button" onClick={onClose}>
              <Rocket size={16} /> Publish
            </button>
          </div>
          {step > 1 && (
            <button className="btn-back" type="button" onClick={prevStep}>
              <ArrowLeft size={16} /> Back
            </button>
          )}
          {step < 5 && (
            <button className="btn-next" type="button" onClick={nextStep}>
              Next Step <ChevronRight size={16} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default AddAutomationModal;
