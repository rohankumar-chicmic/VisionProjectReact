import { useEffect, useState } from 'react';
import {
  Mail,
  Phone,
  Briefcase,
  Building2,
  Edit2,
  ShieldCheck,
  CheckCircle2,
  ExternalLink,
} from 'lucide-react';
import { useHeader } from '../../../Shared/Context/HeaderContext';
import './JuryProfile.scss';

function JuryProfile() {
  const { setTitle, setSubtitle, resetHeader } = useHeader();
  const [isEditing, setIsEditing] = useState(false);

  // Mock data for Jury Profile
  const [profileData, setProfileData] = useState({
    fullName: 'Marie Lefebvre',
    email: 'm.lefebvre@expert-corp.com',
    phone: '+33 6 12 34 56 78',
    company: 'Innovation Dynamics',
    position: 'Senior Technology Consultant',
    expertise: 'Artificial Intelligence, SaaS, Deep Tech',
    bio: 'Over 15 years of experience in evaluating early-stage technology startups. Specialized in AI and machine learning applications across various industrial sectors.',
    linkedin: 'https://linkedin.com/in/marielefebvre',
  });

  useEffect(() => {
    setTitle('My Jury Profile');
    setSubtitle('Manage your expert information and visibility');
    return () => resetHeader();
  }, [setTitle, setSubtitle, resetHeader]);

  const handleSave = () => {
    setIsEditing(false);
    // In a real app, this would call an API
  };

  return (
    <div className="jury-profile-page">
      <div className="profile-layout">
        <div className="profile-left-col">
          <div className="profile-card hero-card">
            <div className="avatar-section">
              <div className="avatar-ring">
                <div className="avatar-inner">ML</div>
              </div>
              <div className="hero-info">
                <h2>{profileData.fullName}</h2>
                <div className="role-tag">
                  <ShieldCheck size={14} />
                  <span>Expert Jury Member</span>
                </div>
              </div>
            </div>

            <div className="expertise-tags">
              {profileData.expertise.split(',').map((tag) => (
                <span key={tag} className="tag">
                  {tag.trim()}
                </span>
              ))}
            </div>

            <div className="profile-bio">
              <p>{profileData.bio}</p>
            </div>

            <a
              href={profileData.linkedin}
              target="_blank"
              rel="noreferrer"
              className="linkedin-link"
            >
              <ExternalLink size={16} />
              <span>View LinkedIn Profile</span>
            </a>
          </div>

          <div className="profile-card stats-card">
            <h3>Recognition & Activity</h3>
            <div className="stats-grid">
              <div className="stat-item">
                <span className="val">24</span>
                <span className="lbl">Reviews Completed</span>
              </div>
              <div className="stat-item">
                <span className="val">4.8</span>
                <span className="lbl">Avg. Response Time</span>
              </div>
              <div className="stat-item">
                <span className="val">Gold</span>
                <span className="lbl">Expert Level</span>
              </div>
            </div>
          </div>
        </div>

        <div className="profile-right-col">
          <div className="profile-card information-card">
            <div className="card-header">
              <h3>Personal Information</h3>
              <button
                type="button"
                className={`edit-btn ${isEditing ? 'active' : ''}`}
                onClick={() => (isEditing ? handleSave() : setIsEditing(true))}
              >
                {isEditing ? (
                  <>
                    <CheckCircle2 size={16} /> Save Changes
                  </>
                ) : (
                  <>
                    <Edit2 size={16} /> Edit Profile
                  </>
                )}
              </button>
            </div>

            <div className="info-form">
              <div className="form-group">
                <label htmlFor="fullName">
                  <Edit2 size={14} /> Full Name
                  <input
                    id="fullName"
                    type="text"
                    value={profileData.fullName}
                    disabled={!isEditing}
                    onChange={(e) =>
                      setProfileData({
                        ...profileData,
                        fullName: e.target.value,
                      })
                    }
                  />
                </label>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="email">
                    <Mail size={14} /> Email Address
                    <input
                      id="email"
                      type="email"
                      value={profileData.email}
                      disabled={!isEditing}
                      onChange={(e) =>
                        setProfileData({
                          ...profileData,
                          email: e.target.value,
                        })
                      }
                    />
                  </label>
                </div>
                <div className="form-group">
                  <label htmlFor="phone">
                    <Phone size={14} /> Phone Number
                    <input
                      id="phone"
                      type="text"
                      value={profileData.phone}
                      disabled={!isEditing}
                      onChange={(e) =>
                        setProfileData({
                          ...profileData,
                          phone: e.target.value,
                        })
                      }
                    />
                  </label>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="company">
                    <Building2 size={14} /> Company
                    <input
                      id="company"
                      type="text"
                      value={profileData.company}
                      disabled={!isEditing}
                      onChange={(e) =>
                        setProfileData({
                          ...profileData,
                          company: e.target.value,
                        })
                      }
                    />
                  </label>
                </div>
                <div className="form-group">
                  <label htmlFor="position">
                    <Briefcase size={14} /> Position
                    <input
                      id="position"
                      type="text"
                      value={profileData.position}
                      disabled={!isEditing}
                      onChange={(e) =>
                        setProfileData({
                          ...profileData,
                          position: e.target.value,
                        })
                      }
                    />
                  </label>
                </div>
              </div>
            </div>
          </div>

          <div className="profile-card notifications-card">
            <h3>Notification Preferences</h3>
            <div className="pref-list">
              <div className="pref-item">
                <div className="info">
                  <strong>New Assignment Emails</strong>
                  <span>
                    Get notified as soon as a new application is assigned.
                  </span>
                </div>
                <div className="custom-toggle">
                  <label htmlFor="email-notif" aria-label="Toggle notification">
                    <input type="checkbox" id="email-notif" defaultChecked />
                  </label>
                </div>
              </div>
              <div className="pref-item">
                <div className="info">
                  <strong>Deadline Reminders</strong>
                  <span>Receive reminders 48h before a review is due.</span>
                </div>
                <div className="custom-toggle">
                  <label
                    htmlFor="deadline-notif"
                    aria-label="Toggle notification"
                  >
                    <input type="checkbox" id="deadline-notif" defaultChecked />
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default JuryProfile;
