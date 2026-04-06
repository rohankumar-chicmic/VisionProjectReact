import React, { useState } from 'react';
import {
  Plus,
  Search,
  Mail,
  MessageSquare,
  Bell,
  Zap,
  FileText,
  Calendar,
  CreditCard,
  Edit2,
  Trash2,
  Rocket,
  ShieldOff,
  Info,
  Settings,
  ChevronDown,
  Globe,
  X,
} from 'lucide-react';
import NotificationSummaryCard from './Components/NotificationSummaryCard';
import AddAutomationModal, {
  AutomationFormData,
} from './Components/AddAutomationModal';
import NotificationPreviewModal from './Components/NotificationPreviewModal';
import './NotificationAutomations.scss';

const categories = [
  { id: 'all', label: 'All Triggers', icon: <Zap size={16} /> },
  {
    id: 'grants',
    label: 'Grants & Applications',
    icon: <FileText size={16} />,
    count: 8,
  },
  { id: 'galas', label: 'Galas & Events', icon: <Calendar size={16} /> },
  {
    id: 'payments',
    label: 'Payments & Subscriptions',
    icon: <CreditCard size={16} />,
    count: 3,
    countColor: 'red',
  },
  { id: 'account', label: 'Account & Profile', icon: <Bell size={16} /> },
  { id: 'admin', label: 'Admin & Webhooks', icon: <Rocket size={16} /> },
];

export interface NotificationItem {
  id: string;
  categoryId: string;
  trigger: string;
  desc: string;
  previewTitle: string;
  previewText: string;
  channels: {
    email: boolean;
    sms: boolean;
    inApp: boolean;
    webhook: boolean;
  };
  schedule: string;
  status: 'Active' | 'To Setup' | 'Critical';
}

const categoryThemes: Record<
  string,
  { label: string; color: string; bgColor: string }
> = {
  grants: {
    label: 'GRANTS & APPLICATIONS',
    color: '#047857',
    bgColor: '#ecfdf5',
  },
  payments: {
    label: 'PAYMENTS & SUBSCRIPTIONS',
    color: '#b91c1c',
    bgColor: '#fef2f2',
  },
  admin: { label: 'ADMIN & WEBHOOKS', color: '#1d4ed8', bgColor: '#eff6ff' },
};

const mockAutomations: NotificationItem[] = [
  {
    id: '1',
    categoryId: 'grants',
    trigger: 'Application Submitted',
    desc: 'When user submits application',
    previewTitle: 'Application Received!',
    previewText:
      'We received your application for {{scholarship_name}}. Our team will review it within 2-3 weeks.',
    channels: { email: true, sms: true, inApp: true, webhook: false },
    schedule: 'Instant',
    status: 'Active',
  },
  {
    id: '2',
    categoryId: 'grants',
    trigger: 'Application Approved',
    desc: 'When admin approves application',
    previewTitle: "Congratulations! You've been approved! 🎉",
    previewText:
      'Great news! Your application for {{scholarship_name}} has been approved. Welcome to Gala {{gala_name}}!',
    channels: { email: true, sms: true, inApp: true, webhook: false },
    schedule: 'Instant',
    status: 'Active',
  },
  {
    id: '3',
    categoryId: 'grants',
    trigger: 'Application Rejected',
    desc: '7 days before application deadline',
    previewTitle: 'Update on your Application',
    previewText:
      'Thank you for applying to {{scholarship_name}}. After review, we are unable to approve at this time. {{rejection_reason}}',
    channels: { email: true, sms: false, inApp: true, webhook: false },
    schedule: 'D-7 before',
    status: 'To Setup',
  },
  {
    id: '4',
    categoryId: 'grants',
    trigger: 'Interview Scheduled',
    desc: 'Gala Vision Montréal 2026',
    previewTitle: 'Interview Confirmed for {{date}}',
    previewText:
      'Your interview is confirmed for {{interview_date}} at {{interview_time}}. Please be ready 10 minutes before.',
    channels: { email: true, sms: true, inApp: true, webhook: false },
    schedule: 'Instant',
    status: 'Active',
  },
  {
    id: '5',
    categoryId: 'payments',
    trigger: 'Payment Succeeded',
    desc: 'When user pays subscription',
    previewTitle: 'Payment Received',
    previewText:
      'We received your payment of {{amount}} for {{plan_name}}. Your receipt is attached.',
    channels: { email: true, sms: false, inApp: true, webhook: true },
    schedule: 'Instant',
    status: 'Active',
  },
  {
    id: '6',
    categoryId: 'payments',
    trigger: 'Payment Failed',
    desc: 'When card charge fails',
    previewTitle: 'Action Required: Payment Failed',
    previewText:
      'We were unable to process your payment for {{plan_name}}. Please update your payment method to avoid interruption.',
    channels: { email: true, sms: true, inApp: true, webhook: true },
    schedule: 'Retry after 1h',
    status: 'Critical',
  },
];

function NotificationAutomations() {
  const [activeCategoryId, setActiveCategoryId] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [previewData, setPreviewData] = useState<
    NotificationItem | AutomationFormData | null
  >(null);

  const filteredAutomations = mockAutomations.filter((auto) => {
    const matchesCategory =
      activeCategoryId === 'all' || auto.categoryId === activeCategoryId;
    const matchesSearch =
      auto.trigger.toLowerCase().includes(searchTerm.toLowerCase()) ||
      auto.previewTitle.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  /* eslint-disable no-alert, no-console */
  const handlePreview = (data: NotificationItem | AutomationFormData) => {
    setPreviewData(data);
    setIsPreviewModalOpen(true);
  };

  const handleDelete = (id: string) => {
    const item = mockAutomations.find((a) => a.id === id);
    if (
      globalThis.confirm(
        `Are you sure you want to delete the "${item?.trigger}" automation?`
      )
    ) {
      // API call would go here
      console.log('Deleting', id);
    }
  };
  /* eslint-enable no-alert, no-console */

  const renderMessagePreview = (text: string) => {
    if (!text) return null;
    const parts = text.split(/(\{\{[^}]+\}\})/g);
    return (
      <p>
        {parts.map((part, i) => {
          const key = `${part}-${i}`;
          return part.startsWith('{{') ? (
            <span key={key} className="variable-pill">
              {part}
            </span>
          ) : (
            <React.Fragment key={key}>{part}</React.Fragment>
          );
        })}
      </p>
    );
  };

  const groupedAutomations = categories
    .filter((cat) => cat.id !== 'all')
    .map((cat) => ({
      ...cat,
      items: filteredAutomations.filter((auto) => auto.categoryId === cat.id),
    }))
    .filter((group) => group.items.length > 0 || activeCategoryId === group.id);

  return (
    <div className="notifications-view-v3">
      <div className="view-header">
        <div className="header-left">
          <h1 className="view-title">Notification Automations</h1>
          <p className="view-subtitle">
            Manage all notification triggers, channels, and automation flows
          </p>
        </div>
        <button
          className="add-automation-btn"
          type="button"
          onClick={() => setIsAddModalOpen(true)}
        >
          <Plus size={18} />
          <span>Add Automation</span>
        </button>
      </div>

      <div className="summary-cards-section">
        <NotificationSummaryCard
          icon={<Mail />}
          label="Email Automations"
          value="8 Active"
          badgeText="8 Active"
          badgeType="success"
          color="#10b981"
        />
        <NotificationSummaryCard
          icon={<MessageSquare />}
          label="SMS Automations"
          value="7 Active"
          badgeText="7 Active"
          badgeType="success"
          color="#34d399"
        />
        <NotificationSummaryCard
          icon={<Bell />}
          label="In-App Notifications"
          value="9 Active"
          badgeText="9 Active"
          badgeType="success"
          color="#8b5cf6"
        />
        <NotificationSummaryCard
          icon={<Globe />}
          label="Webhooks"
          value="3 Active"
          badgeText="3 Active"
          badgeType="warning"
          color="#f59e0b"
        />
        <NotificationSummaryCard
          icon={<ShieldOff />}
          label="Critical"
          value="3 Missing"
          badgeText="3 Critical"
          badgeType="error"
          color="#ef4444"
        />
      </div>

      <div className="warning-banner">
        <div className="banner-content">
          <Info size={18} />
          <span>
            3 critical automations are missing — these affect payments and
            subscriptions.
          </span>
        </div>
        <div className="banner-actions">
          <button type="button" className="review-btn">
            Review now →
          </button>
          <button type="button" className="close-btn">
            <X size={16} />
          </button>
        </div>
      </div>

      <div className="content-card">
        <div className="table-controls">
          <div className="left-controls">
            <div className="search-box">
              <Search size={18} className="search-icon" />
              <input
                type="text"
                placeholder="Search automations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div className="right-controls">
            <div className="filter-dropdown">
              <Settings size={16} />
              <span>All Status</span>
              <ChevronDown size={14} />
            </div>
            <div className="filter-dropdown">
              <Zap size={16} />
              <span>All Channels</span>
              <ChevronDown size={14} />
            </div>
          </div>
        </div>

        <div className="category-tabs">
          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              className={`category-tab ${activeCategoryId === cat.id ? 'active' : ''}`}
              onClick={() => setActiveCategoryId(cat.id)}
            >
              {cat.icon}
              <span className="label">{cat.label}</span>
              {cat.count && (
                <span className={`count-badge ${cat.countColor || ''}`}>
                  {cat.count}
                </span>
              )}
            </button>
          ))}
        </div>

        <div className="table-wrapper">
          <table className="automation-table">
            <thead>
              <tr>
                <th>Category / Trigger</th>
                <th>Title / Message Preview</th>
                <th>Channels</th>
                <th>Schedule / Delay</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {groupedAutomations.map((group) => (
                <React.Fragment key={group.id}>
                  <tr
                    className="category-separator"
                    style={
                      {
                        '--cat-color': categoryThemes[group.id]?.color,
                        '--cat-bg': categoryThemes[group.id]?.bgColor,
                      } as React.CSSProperties
                    }
                  >
                    <td colSpan={6}>
                      <div className="separator-content">
                        {group.icon}
                        <strong>{categoryThemes[group.id]?.label}</strong>
                        {group.count && (
                          <span className="total-triggers">
                            {group.count} triggers
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                  {group.items.map((auto) => (
                    <tr
                      key={auto.id}
                      className={`row-status-${auto.status.toLowerCase().replace(' ', '-')}`}
                    >
                      <td className="trigger-cell">
                        <div className="trigger-info">
                          <div
                            className={`status-dot ${auto.status.toLowerCase().replace(' ', '-')}`}
                          />
                          <div className="text-info">
                            <strong>{auto.trigger}</strong>
                            <span>{auto.desc}</span>
                          </div>
                        </div>
                      </td>
                      <td className="preview-cell">
                        <div className="preview-info">
                          {auto.previewTitle && (
                            <strong>{auto.previewTitle}</strong>
                          )}
                          {renderMessagePreview(auto.previewText)}
                        </div>
                      </td>
                      <td className="channels-cell">
                        <div className="channel-pills">
                          {auto.channels.email && (
                            <span className="channel-pill email">
                              <Mail size={12} /> Email
                            </span>
                          )}
                          {auto.channels.sms && (
                            <span className="channel-pill sms">
                              <MessageSquare size={12} /> SMS
                            </span>
                          )}
                          {auto.channels.inApp && (
                            <span className="channel-pill in-app">
                              <Bell size={12} /> In-App
                            </span>
                          )}
                          {auto.channels.webhook && (
                            <span className="channel-pill webhook">
                              <Zap size={12} /> Webhook
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="schedule-cell">
                        <div className="schedule-info">
                          <Zap size={14} className="bolt-icon" />
                          <span>{auto.schedule}</span>
                        </div>
                      </td>
                      <td className="status-cell">
                        <span
                          className={`status-chip ${auto.status.toLowerCase().replace(' ', '-')}`}
                        >
                          {auto.status}
                        </span>
                      </td>
                      <td className="actions-cell">
                        <div className="action-buttons">
                          {auto.status === 'Critical' ? (
                            <button className="configure-btn" type="button">
                              Configure
                            </button>
                          ) : (
                            <>
                              <button className="action-btn edit" type="button">
                                <Edit2 size={16} />
                              </button>
                              <button
                                className="action-btn delete"
                                type="button"
                                onClick={() => handleDelete(auto.id)}
                              >
                                <Trash2 size={16} />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <AddAutomationModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onPreview={handlePreview}
      />

      {previewData && (
        <NotificationPreviewModal
          isOpen={isPreviewModalOpen}
          onClose={() => setIsPreviewModalOpen(false)}
          data={previewData}
        />
      )}
    </div>
  );
}

export default NotificationAutomations;
