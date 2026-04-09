import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  Download,
  Mail,
  Phone,
  Calendar,
  Slash,
  Edit,
  MessageSquare,
  Bell,
  Send,
} from 'lucide-react';
import { useHeader, HeaderActions } from '../../Shared/Context/HeaderContext';
import { useGetAdminUserByIdQuery } from '../../Services/Api/module/Admin/User';
import Skeleton from '../../Components/Shared/Skeleton';
import BlockUserModal from './Components/BlockUserModal';
import EditUserModal from './Components/EditUserModal';
import './UserProfile.scss';

interface HistoryItem {
  title: string;
  subtitle: string;
  type: string;
  date: string;
  status: string;
  color?: string;
  id?: string;
}

interface ActivityItem {
  title: string;
  time: string;
  meta: string;
  status: string;
  id?: string;
}

function UserProfile() {
  const { setTitle, setSubtitle } = useHeader();
  const { id } = useParams<{ id: string }>();
  const [isBlockModalOpen, setIsBlockModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('All');

  const {
    data: userResponse,
    isLoading,
    error,
  } = useGetAdminUserByIdQuery(id || '');
  const user = userResponse?.data;

  useEffect(() => {
    setTitle('User Profile');
    setSubtitle('Complete profile and account information');
  }, [setTitle, setSubtitle]);

  const handleExportJSON = () => {
    if (!user) return;
    const blob = new Blob([JSON.stringify(user, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `user_profile_${id || 'user'}_${Date.now()}.json`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  };

  if (isLoading) {
    return (
      <div className="user-profile-page">
        <div className="profile-grid">
          <div className="profile-left">
            <Skeleton height={400} />
            <div style={{ marginTop: '20px' }}>
              <Skeleton height={400} />
            </div>
          </div>
          <div className="profile-right">
            <Skeleton height={400} />
            <div style={{ marginTop: '20px' }}>
              <Skeleton height={400} />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="user-profile-page">
        <div className="error-state">
          <h3>User not found</h3>
          <p>
            The user you are looking for does not exist or has been removed.
          </p>
        </div>
      </div>
    );
  }

  const getSubscriptionLabel = () => {
    if (user.subscriptionPlan === 1) return 'Monthly';
    if (user.subscriptionPlan === 2) return 'Yearly';
    return 'Regular Member';
  };

  return (
    <div className="user-profile-page">
      <HeaderActions>
        <button
          type="button"
          className="header-btn btn-outline"
          onClick={handleExportJSON}
        >
          <Download size={18} />
          <span>Export Profile Details</span>
        </button>
      </HeaderActions>

      <div className="profile-grid">
        <div className="profile-left">
          {/* User Profile Details Card */}
          <div className="card profile-details-card">
            <div className="card-header">
              <h3>User Profile Details</h3>
              <p>Complete information and account status</p>
            </div>

            <div className="user-hero">
              <div className="hero-avatar">{user.fullName.charAt(0)}</div>
              <div className="hero-info">
                <div className="name-row">
                  <h2>{user.fullName}</h2>
                  <span
                    className={`status-pill ${
                      user.isBlocked ? 'blocked' : 'active'
                    }`}
                  >
                    {user.isBlocked ? 'Blocked' : 'Active'}
                  </span>
                </div>
                <span className="user-id">
                  #{user.id.substring(0, 8).toUpperCase()}
                </span>

                <div className="contact-info">
                  <div className="info-item">
                    <Phone size={16} />
                    <span>N/A</span>
                  </div>
                  <div className="info-item">
                    <Mail size={16} />
                    <span>{user.email}</span>
                    <button type="button" className="copy-btn">
                      <Download size={12} />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="details-grid">
              <div className="detail-row">
                <span className="label">Business Name</span>
                <span className="value">{user.companyName || 'N/A'}</span>
              </div>
              <div className="detail-row">
                <span className="label">Subscription</span>
                <span className="value">{getSubscriptionLabel()} Plan</span>
              </div>
              <div className="detail-row">
                <span className="label">Joined Date</span>
                <span className="value">
                  {new Date(user.createdAt).toLocaleDateString('en-US', {
                    month: 'short',
                    day: '2-digit',
                    year: 'numeric',
                  })}
                </span>
              </div>
              <div className="detail-row">
                <span className="label">Account Status</span>
                <div className="value-with-badge">
                  <span
                    className={`badge-${
                      user.isEmailVerified ? 'green' : 'red'
                    }`}
                  >
                    {user.isEmailVerified ? 'Verified' : 'Unverified'}
                  </span>
                  <span className="value-text">
                    Email address{' '}
                    {user.isEmailVerified
                      ? 'has been confirmed'
                      : 'is pending verification'}
                  </span>
                </div>
              </div>
            </div>

            <div className="card-actions">
              <button
                type="button"
                className="btn-action block-btn"
                onClick={() => setIsBlockModalOpen(true)}
              >
                <Slash size={18} />
                <span>{user.isBlocked ? 'Unblock User' : 'Block User'}</span>
              </button>
              <button
                type="button"
                className="btn-action edit-btn"
                onClick={() => setIsEditModalOpen(true)}
              >
                <Edit size={18} />
                <span>Edit User Profile</span>
              </button>
            </div>
          </div>

          <BlockUserModal
            isOpen={isBlockModalOpen}
            onClose={() => setIsBlockModalOpen(false)}
            userId={user.id}
            userName={user.fullName}
            isBlocked={user.isBlocked}
          />

          <EditUserModal
            isOpen={isEditModalOpen}
            onClose={() => setIsEditModalOpen(false)}
            onConfirm={() => {
              setIsEditModalOpen(false);
              // In the future this would trigger a refetch
            }}
            userData={{
              fullName: user.fullName,
              email: user.email,
              companyName: user.companyName,
            }}
          />

          {/* User Historic Card */}
          <div className="card user-historic-card">
            <div className="card-header">
              <div className="header-text">
                <h3>User Historic</h3>
                <p>Past activity across grants & galas</p>
              </div>
              <div className="header-filters">
                {['All', 'Grants', 'Galas'].map((tab) => (
                  <button
                    key={tab}
                    type="button"
                    className={`filter-pill ${activeTab === tab ? 'active' : ''}`}
                    onClick={() => setActiveTab(tab)}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            <div className="historic-list">
              {user.history.length > 0 ? (
                (user.history as HistoryItem[])
                  .filter((item) => {
                    if (activeTab === 'All') return true;
                    const itemType = item.type?.toLowerCase();
                    const targetTab = activeTab.toLowerCase();
                    // Match "Grant" to "Grants" and "Gala" to "Galas"
                    return (
                      itemType === targetTab ||
                      itemType === targetTab.slice(0, -1)
                    );
                  })
                  .map((item, idx) => (
                    <div key={item.id || idx} className="historic-item">
                      <div
                        className="item-icon"
                        style={{ backgroundColor: item.color || '#f0f3ff' }}
                      >
                        <Calendar size={18} />
                      </div>
                      <div className="item-info">
                        <span className="name">{item.title}</span>
                        <span className="meta">
                          {item.subtitle} ·{' '}
                          {new Date(item.date).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })}
                        </span>
                      </div>
                      <span
                        className={`status-tag ${
                          item.status ? item.status.toLowerCase() : ''
                        }`}
                      >
                        {item.status}
                      </span>
                    </div>
                  ))
              ) : (
                <div className="empty-state">No historic records found</div>
              )}
            </div>

            <button type="button" className="see-history-btn">
              See full history
            </button>
          </div>
        </div>

        <div className="profile-right">
          {/* Application Timeline Card */}
          <div className="card timeline-card">
            <div className="card-header">
              <h3>Application Timeline</h3>
              <p>History and activity log</p>
            </div>

            <div className="timeline-list">
              {user.recentActivity.length > 0 ? (
                (user.recentActivity as ActivityItem[]).map((step, idx) => (
                  <div
                    key={step.id || idx}
                    className={`timeline-item ${step.status}`}
                  >
                    <div className="timeline-marker" />
                    <div className="timeline-content">
                      <div className="item-header">
                        <span className="title">{step.title}</span>
                        <span className="time">{step.time}</span>
                      </div>
                      <p className="meta">{step.meta}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="empty-state">No recent activity</div>
              )}
            </div>
          </div>

          {/* Activity Feed Card */}
          <div className="card activity-feed-card">
            <div className="card-header">
              <h3>Activity Feed</h3>
              <p>Emails, SMS, notifications</p>
            </div>

            <div className="feed-list">
              {[
                {
                  id: 'feed-welcome',
                  type: 'Email',
                  title: 'Welcome email sent',
                  meta: 'Login credentials sent to john.doe@example.com',
                  time: '2h ago',
                  icon: <Mail size={16} />,
                  color: '#dcfce7',
                },
                {
                  id: 'feed-sms',
                  type: 'SMS',
                  title: 'SMS reminder sent',
                  meta: 'Interview reminder for Feb 25 sent via SMS',
                  time: '5h ago',
                  icon: <MessageSquare size={16} />,
                  color: '#eff6ff',
                },
                {
                  id: 'feed-push',
                  type: 'Notification',
                  title: 'Push notification',
                  meta: 'Application status update sent via app notification',
                  time: '1d ago',
                  icon: <Bell size={16} />,
                  color: '#fff7ed',
                },
                {
                  id: 'feed-grant',
                  type: 'Email',
                  title: 'Grant deadline reminder',
                  meta: 'Email sent: Innovation Grant closes Mar 31',
                  time: '3d ago',
                  icon: <Send size={16} />,
                  color: '#fdf2f8',
                },
              ].map((activity) => (
                <div key={activity.id} className="activity-item">
                  <div
                    className="activity-icon"
                    style={{ backgroundColor: activity.color }}
                  >
                    {activity.icon}
                  </div>
                  <div className="activity-info">
                    <div className="item-title-row">
                      <span className="title">{activity.title}</span>
                      <span className="time">{activity.time}</span>
                    </div>
                    <p className="meta">{activity.meta}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserProfile;
