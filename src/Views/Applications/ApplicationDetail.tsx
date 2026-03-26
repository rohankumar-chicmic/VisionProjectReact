import { useEffect, useState } from 'react';
import {
  CheckCircle2,
  XCircle,
  Download,
  User,
  ExternalLink,
  Calendar,
  Clock,
  PlayCircle,
  Check,
  Edit2,
} from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { useHeader, HeaderActions } from '../../Shared/Context/HeaderContext';
import RejectApplicationModal from './Components/RejectApplicationModal';
import RescheduleInterviewModal from './Components/RescheduleInterviewModal';
import './ApplicationDetail.scss';

// Individual Juror Card Component
interface JurorCardProps {
  name: string;
  score: number;
  initials: string;
  criteria: { label: string; score: number }[];
  comment: string;
}

function JurorCard({
  name,
  score,
  initials,
  criteria,
  comment,
}: Readonly<JurorCardProps>) {
  return (
    <div className="juror-card">
      <div className="juror-header">
        <div className="juror-info">
          <div className="avatar-initials">{initials}</div>
          <div className="text">
            <span className="name">{name}</span>
            <span className="role">Jury Member</span>
          </div>
        </div>
        <div className="juror-score-badge">{score.toFixed(1)} / 10</div>
      </div>
      <div className="criteria-list">
        {criteria.map((criterion) => (
          <div key={criterion.label} className="criteria-item">
            <span className="label">{criterion.label}</span>
            <div className="score-bar-wrapper">
              <div
                className="score-bar"
                style={{ width: `${criterion.score * 10}%` }}
              />
            </div>
            <span className="score">{criterion.score} / 10</span>
          </div>
        ))}
      </div>
      <div className="juror-comment">
        <p>&quot;{comment}&ldquo;</p>
      </div>
    </div>
  );
}

function ApplicationDetail() {
  const { setTitle, setSubtitle, setBackAction, resetHeader } = useHeader();
  const navigate = useNavigate();
  const { id } = useParams();

  // App State
  type AppStatus = 'Pending Review' | 'Rejected' | 'Approved';
  const [status, setStatus] = useState<AppStatus>('Pending Review');
  const [isRejectOpen, setIsRejectOpen] = useState(false);
  const [isRescheduleOpen, setIsRescheduleOpen] = useState(false);

  // Notes state
  const [adminNote, setAdminNote] = useState('');
  const [isNoteSaved, setIsNoteSaved] = useState(false);

  // Winner class state
  const [winnerClass, setWinnerClass] = useState<string | null>(null);

  useEffect(() => {
    setTitle('Application Review');
    setSubtitle('Review and approve grant application');
    setBackAction(true, () => navigate('/applications'));
    return () => resetHeader();
  }, [setTitle, setSubtitle, setBackAction, resetHeader, navigate]);

  const handleApprove = () => {
    setStatus('Approved');
  };

  const handleRejectConfirm = () => {
    setStatus('Rejected');
    setIsRejectOpen(false);
  };

  const handleRescheduleConfirm = () => {
    setIsRescheduleOpen(false);
  };

  const winnerClasses = [
    { id: 'A', label: 'A - Excellence', bg: '#16a34a' },
    { id: 'B', label: 'B - Laureat', bg: '#ea580c' },
    { id: 'C', label: 'C - Mention', bg: '#ca8a04' },
    { id: 'D', label: 'D - Remplacant', bg: '#2563eb' },
    { id: 'E', label: 'E - No Way', bg: '#dc2626' },
  ];

  return (
    <div className="application-review-page">
      <RejectApplicationModal
        isOpen={isRejectOpen}
        onClose={() => setIsRejectOpen(false)}
        onConfirm={handleRejectConfirm}
        applicantInitials="JD"
        applicantName="John Doe"
        grantName="Innovation Technology Grant"
        appId={id || 'APP-45230'}
      />
      <RescheduleInterviewModal
        isOpen={isRescheduleOpen}
        onClose={() => setIsRescheduleOpen(false)}
        onConfirm={handleRescheduleConfirm}
        currentDate="February 25, 2026 10:30 AM"
        applicantName="John Doe"
      />

      <HeaderActions>
        {status === 'Pending Review' && (
          <>
            <button
              type="button"
              className="header-btn btn-outline-red"
              onClick={() => setIsRejectOpen(true)}
            >
              <XCircle size={18} />
              <span>Reject</span>
            </button>
            <button
              type="button"
              className="header-btn btn-primary"
              onClick={handleApprove}
            >
              <CheckCircle2 size={18} />
              <span>Approve</span>
            </button>
          </>
        )}
        {status === 'Approved' && (
          <div className="winner-class-selection">
            <span className="selection-label">
              APPROVED - Assign Winner Class:
            </span>
            <div className="class-buttons">
              {winnerClasses.map((wc) => (
                <button
                  type="button"
                  key={wc.id}
                  className={`class-btn ${winnerClass === wc.id ? 'selected' : ''}`}
                  style={{
                    backgroundColor:
                      winnerClass === wc.id || !winnerClass ? wc.bg : '#e2e8f0',
                    color:
                      winnerClass === wc.id || !winnerClass
                        ? '#fff'
                        : '#94a3b8',
                  }}
                  onClick={() => setWinnerClass(wc.id)}
                >
                  <span className="icon">🏆</span>
                  {wc.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </HeaderActions>

      <div className="review-grid">
        {/* Left Column: Application Details */}
        <div className="details-column">
          {/* User Profile Card */}
          <section className="review-card profile-card">
            <div className="card-body">
              <div className="profile-header">
                <div className="avatar-large">JD</div>
                <div className="info">
                  <h3>John Doe</h3>
                  <p>john.doe@quackpreneur.com</p>
                  <span className="usr-id"># USR-10234</span>
                </div>
                <div
                  className={`status-badge ${status.toLowerCase().replace(' ', '-')}`}
                >
                  {status}
                </div>
              </div>
              <div className="stats-grid">
                <div className="stat-item">
                  <span className="label">Applications</span>
                  <span className="value">3</span>
                </div>
                <div className="stat-item">
                  <span className="label">Approved</span>
                  <span className="value">0</span>
                </div>
                <div className="stat-item">
                  <span className="label">Member Since</span>
                  <span className="value">Jan 2024</span>
                </div>
                <div className="stat-item">
                  <span className="label">Subscription</span>
                  <span className="value">Yearly</span>
                </div>
              </div>
              <div className="profile-actions">
                <button type="button" className="btn-secondary">
                  <User size={16} />
                  <span>Open User Profile</span>
                </button>
                <button type="button" className="btn-secondary">
                  <Download size={16} />
                  <span>Download Profile Photo</span>
                </button>
              </div>
            </div>
          </section>

          {/* Grant Details Card */}
          <section className="review-card">
            <div className="card-header">
              <h3>Grant Details</h3>
              <span className="submission-date">Submitted on 2/24/2026</span>
            </div>
            <div className="card-body">
              <div className="info-list">
                <div className="info-row">
                  <span className="label">Application ID:</span>
                  <span className="value">{id || 'APP-45230'}</span>
                </div>
                <div className="info-row">
                  <span className="label">Grant:</span>
                  <span className="value highlight">
                    Innovation Technology Grant
                  </span>
                </div>
                <div className="info-row">
                  <span className="label">Gala Event:</span>
                  <span className="value highlight">
                    Gala Vision Montreal 2026
                  </span>
                </div>
                <div className="info-row">
                  <span className="label">Prize Amount:</span>
                  <span className="value amount">$5,000</span>
                </div>
                <div className="info-row">
                  <span className="label">Deadline:</span>
                  <span className="value">Mar 31, 2026</span>
                </div>
              </div>
            </div>
          </section>

          {/* Application Information */}
          <section className="review-card">
            <div className="card-header">
              <h3>Application Information</h3>
              <p>Details provided by the applicant</p>
            </div>
            <div className="card-body">
              <div className="content-group">
                <span className="label">Company Name</span>
                <div className="content-box">Quackpreneur</div>
              </div>
              <div className="content-group">
                <span className="label">Industry</span>
                <div className="content-box">
                  Technology / Software Development
                </div>
              </div>
              <div className="content-group">
                <span className="label">Motivation Statement</span>
                <div className="content-box text-content">
                  I believe our innovative approach to solving real-world
                  problems through technology deserves recognition. Our platform
                  has the potential to revolutionize the industry and create
                  meaningful impact for users worldwide. With this grant, we can
                  accelerate our development and bring our vision to life
                  faster.
                </div>
              </div>
              <div className="content-group">
                <span className="label">Participation Video</span>
                <a
                  href="https://vimeo.com/candidate-video-john-doe"
                  target="_blank"
                  rel="noreferrer"
                  className="video-link"
                >
                  <PlayCircle size={18} />
                  <span>https://vimeo.com/candidate-video-john-doe</span>
                  <ExternalLink size={14} />
                </a>
              </div>
            </div>
          </section>

          {/* Interview Schedule */}
          <section className="review-card">
            <div className="card-header">
              <h3>Interview Schedule</h3>
              <p>Applicant has requested an interview slot</p>
            </div>
            <div className="card-body">
              <div className="schedule-box">
                <div className="schedule-info">
                  <div className="slot-item">
                    <div className="icon-circle primary">
                      <Calendar size={18} />
                    </div>
                    <div className="text">
                      <span className="label">Interview Date</span>
                      <span className="value">February 25, 2026</span>
                    </div>
                  </div>
                  <div className="slot-item">
                    <div className="icon-circle success">
                      <Clock size={18} />
                    </div>
                    <div className="text">
                      <span className="label">Time Slot</span>
                      <span className="value">10:30 AM – 11:00 AM</span>
                    </div>
                  </div>
                </div>
                <div className="schedule-footer">
                  <span className="status-text green">
                    Interview scheduled by applicant
                  </span>
                  {status === 'Approved' ? (
                    <div className="completed-badge">
                      <Check size={16} />
                      <span>Interview Completed</span>
                    </div>
                  ) : (
                    <div className="footer-actions">
                      <button
                        type="button"
                        className="btn-reschedule"
                        onClick={() => setIsRescheduleOpen(true)}
                      >
                        <Calendar size={16} />
                        <span>Reschedule</span>
                      </button>
                      <button type="button" className="btn-cancel">
                        <XCircle size={16} />
                        <span>Cancel</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Right Column: Jury & Admin Context */}
        <div className="context-column">
          {/* Jury Panel Selection */}
          <section className="review-card jury-card">
            <div className="card-header flex-header">
              <div className="header-text">
                <h3>Jury Panel</h3>
                <p>3 jurors • criteria-based rating /10</p>
              </div>
              <button
                type="button"
                className="btn-primary-lite"
                onClick={() =>
                  navigate(`/applications/${id || 'APP-45230'}/jury`)
                }
              >
                <CheckCircle2 size={16} />
                <span>Open Jury Page</span>
              </button>
            </div>
            <div className="card-body">
              <div className="overall-score-panel">
                <div className="text">
                  <h4>Overall Jury Score</h4>
                  <p>Average of all 3 jurors</p>
                </div>
                <div className="big-score">
                  7.8 <span>/ 10</span>
                </div>
              </div>

              <div className="individual-jurors-list">
                <JurorCard
                  name="Marie Lefebvre"
                  score={8.2}
                  initials="ML"
                  criteria={[
                    { label: 'Business Viability', score: 8 },
                    { label: 'Innovation Level', score: 9 },
                    { label: 'Team Experience', score: 7 },
                  ]}
                  comment="Very strong pitch, team needs more industry experience."
                />
                <JurorCard
                  name="Paul Dubois"
                  score={7.5}
                  initials="PD"
                  criteria={[
                    { label: 'Business Viability', score: 7 },
                    { label: 'Innovation Level', score: 8 },
                    { label: 'Team Experience', score: 7 },
                  ]}
                  comment="Solid concept but market validation could be stronger."
                />
                <JurorCard
                  name="Sophie Caron"
                  score={7.8}
                  initials="SC"
                  criteria={[
                    { label: 'Business Viability', score: 8 },
                    { label: 'Innovation Level', score: 7 },
                    { label: 'Team Experience', score: 9 },
                  ]}
                  comment="Excellent team synergy. Would strongly recommend for Excellence class."
                />
              </div>
            </div>
          </section>

          {/* Admin Notes */}
          <section className="review-card notes-card">
            <div className="card-header flex-header">
              <h3>Admin Notes</h3>
              {isNoteSaved && (
                <div className="saved-indicator">
                  <CheckCircle2 size={14} color="#16a34a" />
                  <span>Saved</span>
                </div>
              )}
            </div>
            <div className="card-body">
              {isNoteSaved && status === 'Approved' ? (
                <>
                  <div className="saved-note-display">
                    Strong candidate with innovative technology approach.
                    Company shows good traction. Recommend for approval after
                    interview.
                  </div>
                  <button
                    type="button"
                    className="btn-edit-notes"
                    onClick={() => setIsNoteSaved(false)}
                  >
                    <Edit2 size={14} />
                    <span>Edit Notes</span>
                  </button>
                </>
              ) : (
                <>
                  <textarea
                    placeholder="Add private notes about this application..."
                    value={adminNote}
                    onChange={(e) => setAdminNote(e.target.value)}
                  />
                  <button
                    type="button"
                    className="btn-save-notes"
                    onClick={() => setIsNoteSaved(true)}
                  >
                    <span>Save Notes</span>
                  </button>
                </>
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

export default ApplicationDetail;
