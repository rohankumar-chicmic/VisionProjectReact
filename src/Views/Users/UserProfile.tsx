import React, { useEffect } from 'react';
import { 
  Download, 
  Mail, 
  Phone, 
  Plus,
  Calendar, 
  Slash, 
  Edit,
  Clock,
  MessageSquare,
  Bell,
  Send
} from 'lucide-react';
import { useHeader, HeaderActions } from '../../Shared/Context/HeaderContext';
import './UserProfile.scss';

const UserProfile: React.FC = () => {
  const { setTitle, setSubtitle } = useHeader();

  useEffect(() => {
    setTitle('User Profile');
    setSubtitle('Complete profile and account information');
  }, [setTitle, setSubtitle]);

  return (
    <div className="user-profile-page">
      <HeaderActions>
        <button className="header-btn btn-outline">
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
              <div className="hero-avatar">JD</div>
              <div className="hero-info">
                <div className="name-row">
                  <h2>John Doe</h2>
                  <span className="status-pill active">Active</span>
                </div>
                <span className="user-id">#USR-10234</span>
                
                <div className="contact-info">
                  <div className="info-item">
                    <Phone size={16} />
                    <span>+1 (514) 555-0123</span>
                  </div>
                  <div className="info-item">
                    <Mail size={16} />
                    <span>john.doe@example.com</span>
                    <button className="copy-btn"><Download size={12} /></button>
                  </div>
                </div>
              </div>
            </div>

            <div className="details-grid">
              <div className="detail-row">
                <span className="label">Business Name</span>
                <span className="value">TechCorp Industries Inc.</span>
              </div>
              <div className="detail-row">
                <span className="label">Subscription</span>
                <span className="value">Yearly Plan</span>
              </div>
              <div className="detail-row">
                <span className="label">Joined Date</span>
                <span className="value">Jan 15, 2024</span>
              </div>
              <div className="detail-row">
                <span className="label">Free Account</span>
                <div className="value-with-badge">
                  <span className="badge-green">Given</span>
                  <span className="value-text"><strong>3 months</strong> · Expires Apr 15, 2026</span>
                </div>
              </div>
            </div>

            <div className="card-actions">
              <button className="btn-action block-btn">
                <Slash size={18} />
                <span>Block User</span>
              </button>
              <button className="btn-action edit-btn">
                <Edit size={18} />
                <span>Edit User Profile</span>
              </button>
            </div>
          </div>

          {/* User Historic Card */}
          <div className="card user-historic-card">
            <div className="card-header">
              <div className="header-text">
                <h3>User Historic</h3>
                <p>Past activity across grants & galas</p>
              </div>
              <div className="header-filters">
                <button className="filter-pill active">All</button>
                <button className="filter-pill">Grants</button>
                <button className="filter-pill">Galas</button>
              </div>
            </div>

            <div className="historic-list">
              {[
                { type: 'Grant', name: 'Innovation Technology Grant', date: 'Feb 24, 2026', status: 'Pending', icon: 'file', color: '#dcfce7' },
                { type: 'Gala', name: 'Gala Vision Montréal 2025', date: 'Nov 12, 2025', status: 'Pending', icon: 'calendar', color: '#fef3c7' },
                { type: 'Grant', name: 'Green Startup Fund 2025', date: 'Sep 5, 2025', status: 'Approved', icon: 'file', color: '#f0f3ff' },
                { type: 'Gala', name: 'Gala Vision Québec 2024', date: 'Oct 3, 2024', status: 'Rejected', icon: 'calendar', color: '#eff6ff' },
              ].map((item, idx) => (
                <div key={idx} className="historic-item">
                  <div className="item-icon" style={{ backgroundColor: item.color }}>
                    {item.icon === 'file' ? <Calendar size={18} /> : <Calendar size={18} />}
                  </div>
                  <div className="item-info">
                    <span className="name">{item.name}</span>
                    <span className="meta">{item.type} Application · {item.date}</span>
                  </div>
                  <span className={`status-tag ${item.status.toLowerCase()}`}>{item.status}</span>
                </div>
              ))}
            </div>
            
            <button className="see-history-btn">See full history</button>
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
              {[
                { title: 'Application Submitted', time: '2 hours ago', meta: 'John Doe submitted application for Innovation Technology Grant', user: 'John Doe', status: 'active' },
                { title: 'Interview Scheduled', time: '2 hours ago', meta: 'Applicant selected interview slot for Feb 25, 2026 at 10:30 AM', details: '10:30 AM - 11:00 AM', status: 'pending' },
                { title: 'Application Opened', time: '3 hours ago', meta: 'Admin team started reviewing this application', user: 'Admin User', status: 'warning' },
                { title: 'Email Notification Sent', time: '5 hours ago', meta: 'Confirmation email sent to applicant', email: 'john.doe@quackpreneur.com', status: 'muted' },
              ].map((step, idx) => (
                <div key={idx} className={`timeline-item ${step.status}`}>
                  <div className="timeline-marker"></div>
                  <div className="timeline-content">
                    <div className="item-header">
                      <span className="title">{step.title}</span>
                      <span className="time">{step.time}</span>
                    </div>
                    <p className="meta">{step.meta}</p>
                    {step.details && <span className="details-badge"><Clock size={12} /> {step.details}</span>}
                    {step.user && <span className="user-ref"><Plus size={12} /> {step.user}</span>}
                    {step.email && <span className="email-ref"><Mail size={12} /> {step.email}</span>}
                  </div>
                </div>
              ))}
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
                { type: 'Email', title: 'Welcome email sent', meta: 'Login credentials sent to john.doe@example.com', time: '2h ago', icon: <Mail size={16} />, color: '#dcfce7' },
                { type: 'SMS', title: 'SMS reminder sent', meta: 'Interview reminder for Feb 25 sent via SMS', time: '5h ago', icon: <MessageSquare size={16} />, color: '#eff6ff' },
                { type: 'Notification', title: 'Push notification', meta: 'Application status update sent via app notification', time: '1d ago', icon: <Bell size={16} />, color: '#fff7ed' },
                { type: 'Email', title: 'Grant deadline reminder', meta: 'Email sent: Innovation Grant closes Mar 31', time: '3d ago', icon: <Send size={16} />, color: '#fdf2f8' },
              ].map((activity, idx) => (
                <div key={idx} className="activity-item">
                  <div className="activity-icon" style={{ backgroundColor: activity.color }}>
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
};

export default UserProfile;
