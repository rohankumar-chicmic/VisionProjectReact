import { useEffect, useState } from 'react';
import {
  Calendar,
  Eye,
  Users,
  Edit2,
  Trash2,
  Send,
  CheckCircle2,
} from 'lucide-react';
import { useHeader } from '../../Shared/Context/HeaderContext';
import './AnnouncementList.scss';

interface Announcement {
  id: string;
  title: string;
  date: string;
  status: 'Published' | 'Draft';
  message: string;
  views?: string;
  audience: string;
  isSystem?: boolean;
}

function AnnouncementList() {
  const { setTitle, setSubtitle, setBackAction, resetHeader } = useHeader();
  const [activeTab, setActiveTab] = useState('All');
  const [isScheduled, setIsScheduled] = useState(false);
  const [sendPush, setSendPush] = useState(true);
  const scheduleInputId = 'announcement-schedule';
  const pushNotificationId = 'announcement-push-notification';

  useEffect(() => {
    setTitle('Announcements & Notifications');
    setSubtitle('Create and manage platform announcements');
    setBackAction(false);
    return () => resetHeader();
  }, [setTitle, setSubtitle, setBackAction, resetHeader]);

  const announcements: Announcement[] = [
    {
      id: '1',
      title: 'New Gala Event Announced',
      date: 'March 15, 2024 at 2:30 PM',
      status: 'Published',
      message:
        'Join us for our annual spring gala celebration. Applications are now open for all members.',
      views: '1,234',
      audience: 'All Users',
    },
    {
      id: '2',
      title: 'System Maintenance Notice',
      date: 'March 14, 2024 at 10:00 AM',
      status: 'Published',
      message:
        'The platform will undergo scheduled maintenance on March 20th from 2:00 AM to 4:00 AM EST.',
      views: '892',
      audience: 'All Users',
      isSystem: true,
    },
    {
      id: '3',
      title: 'Grant Applications Open',
      date: 'Draft • Not published yet',
      status: 'Draft',
      message:
        "We're excited to announce that grant applications for 2024 are now open to all eligible students.",
      audience: 'All Users',
    },
  ];

  return (
    <div className="announcements-page">
      <div className="announcements-grid">
        {/* Left Column: Create Form */}
        <div className="create-column">
          <div className="create-card">
            <div className="card-header">
              <h3>Create Announcement</h3>
              <p>Publish a new announcement or notification</p>
            </div>

            <div className="card-body form-body">
              <div className="form-group">
                <label htmlFor="title">
                  <span>Title</span>
                  <input
                    id="title"
                    type="text"
                    placeholder="Enter announcement title..."
                  />
                </label>
              </div>

              <div className="form-group">
                <label htmlFor="message">
                  <span>Message</span>
                  <textarea
                    id="message"
                    rows={6}
                    placeholder="Write your announcement message here..."
                  />
                </label>
              </div>

              <div className="form-group">
                <label htmlFor="audience">
                  Target Audience
                  <div className="custom-select">
                    <select id="audience">
                      <option>All Users</option>
                      <option>Admins Only</option>
                      <option>Jury Members</option>
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
                    type="text"
                    placeholder="Select date and time"
                    disabled={!isScheduled}
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
                  <CheckCircle2
                    size={16}
                    className={sendPush ? 'block' : 'hidden'}
                  />
                </div>
                <span id={pushNotificationId}>
                  Send push notification to users
                </span>
              </button>

              <div className="form-actions">
                <button type="button" className="btn-publish">
                  Publish Now
                </button>
                <button type="button" className="btn-draft">
                  Save as Draft
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
            {announcements.map((ann) => (
              <div key={ann.id} className="announcement-card">
                <div className="card-top">
                  <div className="title-area">
                    {ann.status === 'Draft' ? (
                      <h4 className="draft-title">
                        <CheckCircle2 size={18} className="draft-icon" />
                        {ann.title}
                      </h4>
                    ) : (
                      <h4>{ann.title}</h4>
                    )}
                    <span
                      className={`date-text ${ann.status === 'Draft' ? 'is-draft' : ''}`}
                    >
                      {ann.date}
                    </span>
                  </div>
                  <div className={`status-pill ${ann.status.toLowerCase()}`}>
                    {ann.status}
                  </div>
                </div>

                <div className="card-msg">
                  <p>{ann.message}</p>
                </div>

                <div className="card-footer">
                  <div className="meta-stats">
                    {ann.views && (
                      <div className="stat">
                        <Eye size={14} />
                        <span>{ann.views} views</span>
                      </div>
                    )}
                    <div className="stat">
                      <Users size={14} />
                      <span>{ann.audience}</span>
                    </div>
                  </div>

                  <div className="actions">
                    <button type="button" className="btn-edit">
                      <Edit2 size={14} />
                      <span>Edit</span>
                    </button>
                    {ann.status === 'Draft' ? (
                      <button type="button" className="btn-action-primary">
                        <Send size={14} />
                        <span>Publish</span>
                      </button>
                    ) : (
                      <button type="button" className="btn-delete">
                        <Trash2 size={14} />
                        <span>Delete</span>
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
