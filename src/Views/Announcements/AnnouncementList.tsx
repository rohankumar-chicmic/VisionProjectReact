/* eslint-disable no-alert */
import { useEffect, useState } from 'react';
import {
  Calendar,
  Users,
  Edit2,
  Trash2,
  Send,
  Bell,
  Megaphone,
  Clock,
  CheckCircle,
  FileText,
  X,
  Plus,
  Loader2,
  BellRing,
  Globe,
  Shield,
  Star,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import { useHeader } from '../../Shared/Context/HeaderContext';
import {
  useGetAnnouncementsQuery,
  useCreateAnnouncementMutation,
  useUpdateAnnouncementMutation,
  useDeleteAnnouncementMutation,
  AnnouncementItem,
} from '../../Services/Api/module/Admin/Announcement';
import Modal from '../../Components/Atom/Modal/Modal';
import showToast from '../../Shared/Utils/toast';
import './AnnouncementList.scss';

const AUDIENCE_MAP = [
  { value: 1, label: 'All Users', icon: Globe, color: '#00ce86' },
  { value: 2, label: 'Admins Only', icon: Shield, color: '#00ce86' },
  { value: 3, label: 'Jury Members', icon: Star, color: '#00ce86' },
];

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function AnnouncementList() {
  const { setTitle, setSubtitle, setBackAction, resetHeader } = useHeader();

  // API Hooks
  const { data: announcementResponse, isLoading: isListLoading } =
    useGetAnnouncementsQuery();
  const [createAnnouncement, { isLoading: isCreating }] =
    useCreateAnnouncementMutation();
  const [updateAnnouncement, { isLoading: isUpdating }] =
    useUpdateAnnouncementMutation();
  const [deleteAnnouncement, { isLoading: isDeleting }] =
    useDeleteAnnouncementMutation();

  // UI State
  const [activeTab, setActiveTab] = useState<'All' | 'Published' | 'Draft'>(
    'All'
  );
  const [showForm, setShowForm] = useState(false);

  // Delete Confirmation State
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [idToDelete, setIdToDelete] = useState<string | null>(null);

  // Form State
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formTitle, setFormTitle] = useState('');
  const [formMessage, setFormMessage] = useState('');
  const [formAudience, setFormAudience] = useState(1);
  const [isScheduled, setIsScheduled] = useState(false);
  const [scheduledAt, setScheduledAt] = useState('');
  const [sendPush, setSendPush] = useState(true);

  useEffect(() => {
    setTitle('Announcements');
    setSubtitle('Create and broadcast messages to your platform users');
    setBackAction(false);
    return () => resetHeader();
  }, [setTitle, setSubtitle, setBackAction, resetHeader]);

  const resetForm = () => {
    setEditingId(null);
    setFormTitle('');
    setFormMessage('');
    setFormAudience(1);
    setIsScheduled(false);
    setScheduledAt('');
    setSendPush(true);
    setShowForm(false);
  };

  const handleCreateOrUpdate = async (publishNow: boolean) => {
    if (!formTitle.trim() || !formMessage.trim()) {
      showToast.error('Please enter both a title and a message');
      return;
    }
    if (isScheduled && !scheduledAt) {
      showToast.error('Please select a schedule date and time');
      return;
    }

    try {
      if (editingId) {
        await updateAnnouncement({
          id: editingId,
          title: formTitle,
          message: formMessage,
          isPublished: publishNow,
          scheduledAt: isScheduled
            ? new Date(scheduledAt).toISOString()
            : new Date().toISOString(),
          targetAudience: formAudience,
          sendPush,
        }).unwrap();
        showToast.success('Announcement updated successfully');
      } else {
        await createAnnouncement({
          title: formTitle,
          message: formMessage,
          publishNow,
          scheduledAt: isScheduled
            ? new Date(scheduledAt).toISOString()
            : new Date().toISOString(),
          targetAudience: formAudience,
          sendPush,
        }).unwrap();
        showToast.success(
          publishNow
            ? 'Announcement published successfully!'
            : 'Announcement saved as draft'
        );
      }
      resetForm();
    } catch (err) {
      showToast.error(
        err instanceof Error ? err.message : 'Failed to save announcement'
      );
    }
  };

  const handleEdit = (ann: AnnouncementItem) => {
    setEditingId(ann.id);
    setFormTitle(ann.title);
    setFormMessage(ann.message);
    setFormAudience(ann.targetAudience);
    setSendPush(ann.sendPush);
    const isAnnScheduled =
      !!ann.scheduledAt && new Date(ann.scheduledAt).getTime() > Date.now();
    setIsScheduled(isAnnScheduled);
    setScheduledAt(ann.scheduledAt ? ann.scheduledAt.slice(0, 16) : '');
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    setIdToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!idToDelete) return;
    try {
      await deleteAnnouncement(idToDelete).unwrap();
      showToast.success('Announcement deleted');
      setIsDeleteModalOpen(false);
      setIdToDelete(null);
      resetForm();
    } catch (err) {
      showToast.error(
        err instanceof Error ? err.message : 'Failed to delete announcement'
      );
    }
  };

  const handlePublishDraft = async (ann: AnnouncementItem) => {
    try {
      await updateAnnouncement({
        id: ann.id,
        title: ann.title,
        message: ann.message,
        isPublished: true,
        scheduledAt: ann.scheduledAt || new Date().toISOString(),
        targetAudience: ann.targetAudience,
        sendPush: ann.sendPush,
      }).unwrap();
      showToast.success('Draft published successfully!');
    } catch (err) {
      showToast.error(
        err instanceof Error ? err.message : 'Failed to publish draft'
      );
    }
  };

  const allAnnouncements = announcementResponse?.data || [];
  const filteredAnnouncements = allAnnouncements.filter((a) => {
    if (activeTab === 'Published') return a.isPublished;
    if (activeTab === 'Draft') return !a.isPublished;
    return true;
  });

  const totalPublished = allAnnouncements.filter((a) => a.isPublished).length;
  const totalDrafts = allAnnouncements.filter((a) => !a.isPublished).length;

  const isSaving = isCreating || isUpdating;

  const selectedAudience = AUDIENCE_MAP.find((a) => a.value === formAudience);

  return (
    <div className="announcements-page">
      {/* Stats Row */}
      <div className="stats-row">
        <div className="stat-card total">
          <div className="stat-icon-wrap">
            <Megaphone size={22} />
          </div>
          <div className="stat-info">
            <span className="stat-val">{allAnnouncements.length}</span>
            <span className="stat-label">Total</span>
          </div>
        </div>
        <div className="stat-card published">
          <div className="stat-icon-wrap">
            <CheckCircle size={22} />
          </div>
          <div className="stat-info">
            <span className="stat-val">{totalPublished}</span>
            <span className="stat-label">Published</span>
          </div>
        </div>
        <div className="stat-card draft">
          <div className="stat-icon-wrap">
            <FileText size={22} />
          </div>
          <div className="stat-info">
            <span className="stat-val">{totalDrafts}</span>
            <span className="stat-label">Drafts</span>
          </div>
        </div>
        <div className="stat-card push">
          <div className="stat-icon-wrap">
            <BellRing size={22} />
          </div>
          <div className="stat-info">
            <span className="stat-val">
              {allAnnouncements.filter((a) => a.sendPush).length}
            </span>
            <span className="stat-label">With Push</span>
          </div>
        </div>
      </div>

      {/* Main Layout */}
      <div className="main-layout">
        {/* Left Panel: List */}
        <div className="list-panel">
          <div className="panel-header">
            <div className="panel-title-group">
              <h2>Announcements</h2>
              <p>Broadcast messages to your community</p>
            </div>
            <button
              type="button"
              className="btn-new"
              onClick={() => {
                resetForm();
                setShowForm(true);
              }}
            >
              <Plus size={18} />
              <span>New</span>
            </button>
          </div>

          <div className="tab-bar">
            {(['All', 'Published', 'Draft'] as const).map((tab) => (
              <button
                type="button"
                key={tab}
                className={`tab ${activeTab === tab ? 'active' : ''}`}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
                <span className="tab-count">
                  {(() => {
                    if (tab === 'All') return allAnnouncements.length;
                    if (tab === 'Published') return totalPublished;
                    return totalDrafts;
                  })()}
                </span>
              </button>
            ))}
          </div>

          <div className="announcements-list">
            {isListLoading && (
              <div className="list-loader">
                <Loader2 size={28} className="spin" />
                <span>Loading announcements...</span>
              </div>
            )}

            {!isListLoading && filteredAnnouncements.length === 0 && (
              <div className="empty-list-state">
                <div className="empty-icon">
                  <Megaphone size={40} />
                </div>
                <h4>No announcements yet</h4>
                <p>Create your first announcement to broadcast to users.</p>
                <button
                  type="button"
                  className="btn-empty-action"
                  onClick={() => {
                    resetForm();
                    setShowForm(true);
                  }}
                >
                  <Plus size={16} />
                  Create Announcement
                </button>
              </div>
            )}

            {!isListLoading &&
              filteredAnnouncements.map((ann) => {
                const audienceInfo = AUDIENCE_MAP.find(
                  (a) => a.value === ann.targetAudience
                );
                const AudienceIcon = audienceInfo?.icon || Globe;

                return (
                  <div
                    key={ann.id}
                    className={`ann-card ${editingId === ann.id ? 'editing' : ''} ${ann.isPublished ? 'is-published' : 'is-draft'}`}
                    role="button"
                    tabIndex={0}
                    onClick={() => handleEdit(ann)}
                    onKeyDown={(e) => e.key === 'Enter' && handleEdit(ann)}
                  >
                    <div className="ann-card-left">
                      <div
                        className={`ann-indicator ${ann.isPublished ? 'pub' : 'draft'}`}
                      />
                    </div>
                    <div className="ann-card-body">
                      <div className="ann-card-top">
                        <div className="ann-title-row">
                          <h4>{ann.title}</h4>
                          <span
                            className={`status-badge ${ann.isPublished ? 'published' : 'draft'}`}
                          >
                            {ann.isPublished ? (
                              <>
                                <CheckCircle size={11} /> Published
                              </>
                            ) : (
                              <>
                                <FileText size={11} /> Draft
                              </>
                            )}
                          </span>
                        </div>
                        <p className="ann-preview">{ann.message}</p>
                      </div>

                      <div className="ann-card-footer">
                        <div className="ann-meta">
                          <span className="meta-chip audience">
                            <AudienceIcon size={12} />
                            {audienceInfo?.label || 'All Users'}
                          </span>
                          {ann.sendPush && (
                            <span className="meta-chip push">
                              <Bell size={12} />
                              Push
                            </span>
                          )}
                          <span className="meta-chip date">
                            <Clock size={12} />
                            {formatDate(ann.createdAt)}
                          </span>
                        </div>

                        <div
                          className="ann-actions"
                          role="none"
                          onClick={(e) => e.stopPropagation()}
                          onKeyDown={(e) => e.stopPropagation()}
                        >
                          {!ann.isPublished && (
                            <button
                              type="button"
                              className="action-btn publish-btn"
                              title="Publish draft"
                              onClick={(e) => {
                                e.stopPropagation();
                                handlePublishDraft(ann);
                              }}
                              disabled={isUpdating}
                            >
                              <Send size={14} />
                              Publish
                            </button>
                          )}
                          <button
                            type="button"
                            className="action-btn edit-btn"
                            title="Edit"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEdit(ann);
                            }}
                          >
                            <Edit2 size={14} />
                          </button>
                          <button
                            type="button"
                            className="action-btn delete-btn"
                            title="Delete"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDelete(ann.id);
                            }}
                            disabled={isDeleting}
                          >
                            {isDeleting ? (
                              <Loader2 size={14} className="spin" />
                            ) : (
                              <Trash2 size={14} />
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                    <div className="ann-card-arrow">
                      <ChevronRight size={16} />
                    </div>
                  </div>
                );
              })}
          </div>
        </div>

        {/* Right Panel: Composer */}
        <div className={`composer-panel ${showForm ? 'visible' : ''}`}>
          {!showForm ? (
            <div className="composer-placeholder">
              <div className="placeholder-icon">
                <Sparkles size={48} />
              </div>
              <h3>Craft an Announcement</h3>
              <p>
                Select an existing announcement to edit it, or create a new one
                to reach your users.
              </p>
              <button
                type="button"
                className="btn-start"
                onClick={() => {
                  resetForm();
                  setShowForm(true);
                }}
              >
                <Plus size={18} />
                Create New Announcement
              </button>
            </div>
          ) : (
            <div className="composer-form">
              <div className="composer-header">
                <div>
                  <h3>
                    {editingId ? 'Edit Announcement' : 'New Announcement'}
                  </h3>
                  <p>
                    {editingId
                      ? 'Update the existing announcement'
                      : 'Compose a message and send it out'}
                  </p>
                </div>
                <button
                  type="button"
                  className="btn-close-composer"
                  onClick={resetForm}
                  aria-label="Close form"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="form-fields">
                {/* Title */}
                <div className="field-group">
                  <label htmlFor="ann-title" className="field-label">
                    Title <span className="required">*</span>
                    <input
                      id="ann-title"
                      type="text"
                      className="field-input"
                      placeholder="e.g. Platform Maintenance Notice"
                      value={formTitle}
                      onChange={(e) => setFormTitle(e.target.value)}
                    />
                  </label>
                </div>

                {/* Message */}
                <div className="field-group">
                  <label htmlFor="ann-message" className="field-label">
                    Message <span className="required">*</span>
                    <textarea
                      id="ann-message"
                      className="field-input field-textarea"
                      rows={4}
                      placeholder="Write your announcement message here..."
                      value={formMessage}
                      onChange={(e) => setFormMessage(e.target.value)}
                    />
                  </label>
                  <span className="field-hint">
                    {formMessage.length} characters
                  </span>
                </div>

                {/* Audience */}
                <div className="field-group">
                  <span className="field-label">Target Audience</span>
                  <div className="audience-selector">
                    {AUDIENCE_MAP.map((opt) => {
                      const Icon = opt.icon;
                      return (
                        <button
                          type="button"
                          key={opt.value}
                          className={`audience-option ${formAudience === opt.value ? 'selected' : ''}`}
                          onClick={() => setFormAudience(opt.value)}
                          style={
                            formAudience === opt.value
                              ? {
                                  borderColor: opt.color,
                                  background: `${opt.color}15`,
                                  color: opt.color,
                                }
                              : {}
                          }
                        >
                          <Icon size={16} />
                          <span>{opt.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Push Notification */}
                <div className="field-group">
                  <div className="toggle-row">
                    <div className="toggle-info">
                      <BellRing size={18} />
                      <div>
                        <span className="toggle-title">Push Notification</span>
                        <span className="toggle-desc">
                          Send a push alert to mobile devices
                        </span>
                      </div>
                    </div>
                    <button
                      type="button"
                      className={`toggle-pill ${sendPush ? 'on' : ''}`}
                      onClick={() => setSendPush(!sendPush)}
                      aria-pressed={sendPush}
                      aria-label="Toggle push notification"
                    >
                      <div className="toggle-thumb" />
                    </button>
                  </div>
                </div>

                {/* Schedule */}
                <div className="field-group">
                  <div className="toggle-row">
                    <div className="toggle-info">
                      <Calendar size={18} />
                      <div>
                        <span className="toggle-title">Schedule for Later</span>
                        <span className="toggle-desc">
                          Pick a date & time to publish automatically
                        </span>
                      </div>
                    </div>
                    <button
                      type="button"
                      className={`toggle-pill ${isScheduled ? 'on' : ''}`}
                      onClick={() => setIsScheduled(!isScheduled)}
                      aria-pressed={isScheduled}
                      aria-label="Toggle schedule"
                    >
                      <div className="toggle-thumb" />
                    </button>
                  </div>

                  {isScheduled && (
                    <div className="date-picker-wrap">
                      <Calendar size={16} />
                      <input
                        id="ann-schedule"
                        type="datetime-local"
                        className="field-input date-input"
                        value={scheduledAt}
                        onChange={(e) => setScheduledAt(e.target.value)}
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Composer Footer */}
              <div className="composer-footer">
                <div className="preview-audience">
                  {selectedAudience && (
                    <>
                      <Users size={14} />
                      <span>
                        Sending to: <strong>{selectedAudience.label}</strong>
                      </span>
                    </>
                  )}
                </div>
                <div className="form-actions">
                  {editingId && (
                    <button
                      type="button"
                      className="btn-delete-composer"
                      onClick={() => handleDelete(editingId)}
                      disabled={isDeleting}
                    >
                      {isDeleting ? (
                        <Loader2 size={16} className="spin" />
                      ) : (
                        <Trash2 size={16} />
                      )}
                      Delete
                    </button>
                  )}
                  <button
                    type="button"
                    className="btn-draft-save"
                    onClick={() => handleCreateOrUpdate(false)}
                    disabled={isSaving}
                  >
                    {isSaving ? (
                      <Loader2 size={16} className="spin" />
                    ) : (
                      <FileText size={16} />
                    )}
                    Save Draft
                  </button>
                  <button
                    type="button"
                    className="btn-publish-now"
                    onClick={() => handleCreateOrUpdate(true)}
                    disabled={isSaving}
                  >
                    {isSaving ? (
                      <Loader2 size={16} className="spin" />
                    ) : (
                      <Send size={16} />
                    )}
                    {editingId ? 'Update & Publish' : 'Publish Now'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setIdToDelete(null);
        }}
        title="Delete Announcement"
        width="400px"
      >
        <div className="delete-modal-content">
          <p>Are you sure you want to permanently delete this announcement?</p>
          <div className="modal-actions">
            <button
              type="button"
              className="cancel-btn"
              onClick={() => {
                setIsDeleteModalOpen(false);
                setIdToDelete(null);
              }}
              disabled={isDeleting}
            >
              Cancel
            </button>
            <button
              type="button"
              className="confirm-btn"
              onClick={confirmDelete}
              disabled={isDeleting}
            >
              {isDeleting ? 'Deleting...' : 'Delete'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default AnnouncementList;
