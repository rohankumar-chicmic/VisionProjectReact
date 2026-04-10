/* eslint-disable no-alert */
import { useEffect, useState } from 'react';
import {
  Calendar,
  Users,
  Edit2,
  Trash2,
  Send,
  CheckCircle2,
  RefreshCw,
} from 'lucide-react';
import { useHeader } from '../../Shared/Context/HeaderContext';
import {
  useGetAnnouncementsQuery,
  useCreateAnnouncementMutation,
  useUpdateAnnouncementMutation,
  useDeleteAnnouncementMutation,
  AnnouncementItem,
} from '../../Services/Api/module/Admin/Announcement';
import './AnnouncementList.scss';

const AUDIENCE_MAP = [
  { value: 1, label: 'All Users' },
  { value: 2, label: 'Admins Only' },
  { value: 3, label: 'Jury Members' },
];

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

  // State for List
  const [activeTab, setActiveTab] = useState('All');

  // State for Form
  const [editingId, setEditingId] = useState<string | null>(null);
  const [title, setFormTitle] = useState('');
  const [message, setFormMessage] = useState('');
  const [audience, setFormAudience] = useState(1);
  const [isScheduled, setIsScheduled] = useState(false);
  const [scheduledAt, setScheduledAt] = useState('');
  const [sendPush, setSendPush] = useState(true);

  const scheduleInputId = 'announcement-schedule';
  const pushNotificationId = 'announcement-push-notification';

  useEffect(() => {
    setTitle('Announcements & Notifications');
    setSubtitle('Create and manage platform announcements');
    setBackAction(false);
    return () => resetHeader();
  }, [setTitle, setSubtitle, setBackAction, resetHeader]);

  const resetForm = () => {
    setEditingId(null);
    setFormTitle('');
    setFormMessage('');
    setFormAudience(0);
    setIsScheduled(false);
    setScheduledAt('');
  };

  const handleCreateOrUpdate = async (publishNow: boolean) => {
    if (!title || !message) return;

    try {
      if (editingId) {
        await updateAnnouncement({
          id: editingId,
          title,
          message,
          isPublished: publishNow,
          scheduledAt: isScheduled ? scheduledAt : new Date().toISOString(),
          targetAudience: audience,
          sendPush,
        }).unwrap();
      } else {
        await createAnnouncement({
          title,
          message,
          publishNow,
          scheduledAt: isScheduled ? scheduledAt : new Date().toISOString(),
          targetAudience: audience,
          sendPush,
        }).unwrap();
      }
      resetForm();
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('Failed to save announcement:', err);
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
  };

  const handleDelete = async (id: string) => {
    if (
      !globalThis.confirm('Are you sure you want to delete this announcement?')
    ) {
      return;
    }
    try {
      await deleteAnnouncement(id).unwrap();
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('Failed to delete announcement:', err);
    }
  };

  const announcements = (announcementResponse?.data || []).filter((a) => {
    if (activeTab === 'Published') {
      return a.isPublished;
    }
    if (activeTab === 'Draft') {
      return a.isPublished === false;
    }
    return true;
  });

  const getSubmitButtonLabel = () => {
    if (isCreating || isUpdating) {
      return <RefreshCw className="animate-spin" size={18} />;
    }
    if (editingId) {
      return 'Update & Publish';
    }
    return 'Publish Now';
  };

  return (
    <div className="announcements-page">
      <div className="announcements-grid">
        {/* Left Column: Create Form */}
        <div className="create-column">
          <div className="create-card">
            <div className="card-header">
              <h3>{editingId ? 'Edit Announcement' : 'Create Announcement'}</h3>
              <p>Publish a new announcement or notification</p>
              {editingId && (
                <button type="button" className="btn-clear" onClick={resetForm}>
                  Clear Form
                </button>
              )}
            </div>

            <div className="card-body form-body">
              <div className="form-group">
                <label htmlFor="title">
                  <span>Title</span>
                  <input
                    id="title"
                    type="text"
                    placeholder="Enter announcement title..."
                    value={title}
                    onChange={(e) => setFormTitle(e.target.value)}
                  />
                </label>
              </div>

              <div className="form-group">
                <label htmlFor="message">
                  <span>Message</span>
                  <textarea
                    id="message"
                    rows={4}
                    placeholder="Write your announcement message here..."
                    value={message}
                    onChange={(e) => setFormMessage(e.target.value)}
                  />
                </label>
              </div>

              <div className="form-group">
                <label htmlFor="audience">
                  Target Audience
                  <div className="custom-select">
                    <select
                      id="audience"
                      value={audience}
                      onChange={(e) => setFormAudience(Number(e.target.value))}
                    >
                      {AUDIENCE_MAP.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </label>
              </div>

              <div className="form-group schedule-group">
                <div className="toggle-header">
                  <span className="label">Schedule</span>{' '}
                  <button
                    type="button"
                    className={`toggle-switch ${isScheduled ? 'on' : 'off'}`}
                    onClick={() => setIsScheduled(!isScheduled)}
                    aria-pressed={isScheduled}
                    aria-controls={scheduleInputId}
                    aria-label="Toggle scheduled announcement"
                  >
                    <div className="knob" />
                  </button>
                </div>
                <div
                  className={`date-input-wrap ${isScheduled ? '' : 'disabled'}`}
                >
                  <Calendar size={18} />
                  <input
                    id={scheduleInputId}
                    type="datetime-local"
                    placeholder="Select date and time"
                    disabled={!isScheduled}
                    value={scheduledAt}
                    onChange={(e) => setScheduledAt(e.target.value)}
                  />
                </div>
              </div>

              <button
                type="button"
                className="checkbox-wrap mt-24"
                onClick={() => setSendPush(!sendPush)}
                aria-pressed={sendPush}
                aria-controls={pushNotificationId}
              >
                <div className={`styled-checkbox ${sendPush ? 'checked' : ''}`}>
                  {sendPush && <CheckCircle2 size={16} />}
                </div>
                <span id={pushNotificationId}>
                  Send push notification to users
                </span>
              </button>

              <div className="form-actions">
                <button
                  type="button"
                  className="btn-publish"
                  onClick={() => handleCreateOrUpdate(true)}
                  disabled={isCreating || isUpdating}
                >
                  {getSubmitButtonLabel()}
                </button>
                <button
                  type="button"
                  className="btn-draft"
                  onClick={() => handleCreateOrUpdate(false)}
                  disabled={isCreating || isUpdating}
                >
                  {editingId ? 'Keep as Draft' : 'Save as Draft'}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: List */}
        <div className="list-column">
          <div className="list-header">
            <h3>Recent Announcements</h3>
            <div className="list-tabs">
              {['All', 'Published', 'Draft'].map((tab) => (
                <button
                  type="button"
                  key={tab}
                  className={`tab-pill ${activeTab === tab ? 'active' : ''}`}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          <div className="announcements-list">
            {isListLoading && (
              <div className="loading-state">
                <RefreshCw className="animate-spin" size={32} />
                <p>Loading announcements...</p>
              </div>
            )}
            {!isListLoading && announcements.length === 0 && (
              <div className="empty-state">
                <p>No announcements yet</p>
              </div>
            )}
            {!isListLoading &&
              announcements.map((ann) => (
                <div key={ann.id} className="announcement-card">
                  <div className="card-top">
                    <div className="title-area">
                      {ann.isPublished ? (
                        <h4>{ann.title}</h4>
                      ) : (
                        <h4 className="draft-title">
                          <CheckCircle2 size={18} className="draft-icon" />
                          {ann.title}
                        </h4>
                      )}
                      <span
                        className={`date-text ${ann.isPublished ? '' : 'is-draft'}`}
                      >
                        {new Date(ann.createdAt).toLocaleString()}
                      </span>
                    </div>
                    <div
                      className={`status-pill ${ann.isPublished ? 'published' : 'draft'}`}
                    >
                      {ann.isPublished ? 'Published' : 'Draft'}
                    </div>
                  </div>

                  <div className="card-msg">
                    <p>{ann.message}</p>
                  </div>

                  <div className="card-footer">
                    <div className="meta-stats">
                      <div className="stat">
                        <Users size={14} />
                        <span>
                          {AUDIENCE_MAP.find(
                            (a) => a.value === ann.targetAudience
                          )?.label || 'All Users'}
                        </span>
                      </div>
                    </div>

                    <div className="actions">
                      <button
                        type="button"
                        className="btn-edit"
                        onClick={() => handleEdit(ann)}
                      >
                        <Edit2 size={14} />
                        <span>Edit</span>
                      </button>
                      {ann.isPublished ? (
                        <button
                          type="button"
                          className="btn-delete"
                          onClick={() => handleDelete(ann.id)}
                          disabled={isDeleting}
                        >
                          {isDeleting ? (
                            <RefreshCw className="animate-spin" size={14} />
                          ) : (
                            <Trash2 size={14} />
                          )}
                          <span>Delete</span>
                        </button>
                      ) : (
                        <button
                          type="button"
                          className="btn-action-primary"
                          onClick={() => {
                            setEditingId(ann.id);
                            // We use handleCreateOrUpdate to publish the draft
                            handleCreateOrUpdate(true);
                          }}
                        >
                          <Send size={14} />
                          <span>Publish</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AnnouncementList;
