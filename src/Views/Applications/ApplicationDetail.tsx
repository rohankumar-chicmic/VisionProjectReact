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
import {
  useGetAdminApplicationByIdQuery,
  AdminApplicationDetail,
  useLazyDownloadAdminApplicationAvatarQuery,
  JuryPanelMember,
} from '../../Services/Api/module/Admin/Application';
import {
  useGetOrganiserApplicationByIdQuery,
  OrganiserApplicationDetail,
  useLazyDownloadOrganiserApplicationAvatarQuery,
} from '../../Services/Api/module/Organiser/Application';
import {
  useGetJuryApplicationByIdQuery,
  JuryApplicationDetail,
} from '../../Services/Api/module/Jury/Application';
import useCurrentUserRole from '../../Shared/Auth/useCurrentUserRole';
import Skeleton from '../../Components/Shared/Skeleton';
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
      <div className="criteria-ratings">
        {criteria.map((c) => (
          <div key={c.label} className="criteria-item">
            <div className="criteria-label">
              <span>{c.label}</span>
              <span className="val">{c.score}/10</span>
            </div>
            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{ width: `${c.score * 10}%` }}
              />
            </div>
          </div>
        ))}
      </div>
      {comment && (
        <div className="juror-comment">
          <p>“{comment}”</p>
        </div>
      )}
    </div>
  );
}

const getStatusDetails = (status: string | number) => {
  const s = typeof status === 'string' ? status.toLowerCase() : status;
  switch (s) {
    case 'draft':
    case 1:
      return { label: 'Draft', class: 'draft' };
    case 'pending review':
    case 'pending':
    case 2:
      return { label: 'Pending Review', class: 'pending-review' };
    case 'in review':
    case 3:
      return { label: 'In Review', class: 'in-review' };
    case 'approved':
    case 4:
      return { label: 'Approved', class: 'approved' };
    case 'rejected':
    case 5:
      return { label: 'Rejected', class: 'rejected' };
    case 'winner':
    case 6:
      return { label: 'Winner', class: 'winner' };
    case 'interview':
    case 7:
      return { label: 'Interview', class: 'interview' };
    default:
      return { label: status?.toString() || 'Unknown', class: '' };
  }
};

function ApplicationDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { role } = useCurrentUserRole();
  const isAdmin = role === 'admin' || role === 'sub_admin';
  const isOrganiser = role === 'organiser';
  const { setTitle, setSubtitle, setBackAction, resetHeader } = useHeader();

  const [isRejectOpen, setIsRejectOpen] = useState(false);
  const [isRescheduleOpen, setIsRescheduleOpen] = useState(false);
  const [winnerClass, setWinnerClass] = useState<string | null>(null);
  const [adminNote, setAdminNote] = useState('');
  const [isNoteSaved, setIsNoteSaved] = useState(false);

  const [triggerDownloadAdminAvatar] =
    useLazyDownloadAdminApplicationAvatarQuery();
  const [triggerDownloadOrganiserAvatar] =
    useLazyDownloadOrganiserApplicationAvatarQuery();

  const { data: adminResponse, isLoading: isAdminLoading } =
    useGetAdminApplicationByIdQuery(id ?? '', { skip: !isAdmin });
  const { data: organiserResponse, isLoading: isOrganiserLoading } =
    useGetOrganiserApplicationByIdQuery(id ?? '', { skip: !isOrganiser });
  const { data: juryResponse, isLoading: isJuryLoading } =
    useGetJuryApplicationByIdQuery(id ?? '', {
      skip: isAdmin || isOrganiser,
    });

  const isLoading = isAdminLoading || isOrganiserLoading || isJuryLoading;

  let applicationData;
  if (isAdmin) {
    applicationData = adminResponse?.data;
  } else if (isOrganiser) {
    applicationData = organiserResponse?.data;
  } else {
    applicationData = juryResponse?.data;
  }

  const application = applicationData as
    | AdminApplicationDetail
    | OrganiserApplicationDetail
    | JuryApplicationDetail
    | undefined;

  useEffect(() => {
    setTitle('Application Review');
    setSubtitle(`Ref: ${id || 'N/A'}`);
    setBackAction(true, () => navigate(-1));
    return () => resetHeader();
  }, [setTitle, setSubtitle, setBackAction, resetHeader, id, navigate]);

  useEffect(() => {
    if (application?.adminNotes) {
      setAdminNote(application.adminNotes);
      setIsNoteSaved(true);
    }
  }, [application?.adminNotes]);

  const handleApprove = () => {
    // API logic for approve
  };

  const handleRejectConfirm = () => {
    // API logic for reject
    setIsRejectOpen(false);
  };

  const handleRescheduleConfirm = () => {
    // API logic for reschedule
    setIsRescheduleOpen(false);
  };

  const handleDownloadAvatar = async () => {
    if (!id || !application) return;

    try {
      const trigger = isAdmin
        ? triggerDownloadAdminAvatar
        : triggerDownloadOrganiserAvatar;
      const blob = await trigger(id).unwrap();

      if (blob) {
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `applicant_${application.applicantDisplayId || id}_avatar.png`;
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);
      }
    } catch (err) {
      // Failed to download avatar
    }
  };

  const winnerClasses = [
    { id: 'excellence', label: 'EXCELLENCE - A', bg: '#16a34a' },
    { id: 'winner', label: 'WINNER - B', bg: '#2563eb' },
    { id: 'mention', label: 'MENTION - C', bg: '#eab308' },
    { id: 'not_selected', label: 'NOT SELECTED', bg: '#ef4444' },
  ];

  if (isLoading) {
    return (
      <div className="application-review-page">
        <div className="skeleton-container" style={{ padding: '24px' }}>
          <Skeleton height={200} />
          <div style={{ marginTop: '24px' }}>
            <Skeleton height={600} />
          </div>
        </div>
      </div>
    );
  }

  if (!application) {
    return (
      <div className="application-review-page">
        <div
          className="error-container"
          style={{ padding: '40px', textAlign: 'center' }}
        >
          <h2>Application Not Found</h2>
          <p>
            The application you are looking for does not exist or you do not
            have permission to view it.
          </p>
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="btn-secondary"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const statusInfo = getStatusDetails(application.status);

  return (
    <div className="application-review-page">
      <RejectApplicationModal
        isOpen={isRejectOpen}
        onClose={() => setIsRejectOpen(false)}
        onConfirm={handleRejectConfirm}
        applicantInitials={application.applicantName?.charAt(0) || ''}
        applicantName={application.applicantName || ''}
        grantName={application.grantName || ''}
        appId={application.applicationId || ''}
      />
      <RescheduleInterviewModal
        isOpen={isRescheduleOpen}
        onClose={() => setIsRescheduleOpen(false)}
        onConfirm={handleRescheduleConfirm}
        currentDate={
          application.interviewDate
            ? `${new Date(application.interviewDate).toLocaleDateString()} at ${application.interviewStartTime || ''}`
            : 'Not set'
        }
        applicantName={application.applicantName}
      />

      <HeaderActions>
        {/* Status Check Refactored for String Safety */}
        {(application.status === '2' ||
          application.status === 'Pending' ||
          application.status === 'Pending Review') && (
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
        {(application.status === '4' || application.status === 'Approved') && (
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
                <div className="avatar-large">
                  {application.applicantName?.charAt(0) || ''}
                </div>
                <div className="info">
                  <h3>{application.applicantName || 'Unknown Applicant'}</h3>
                  <p>{application.applicantEmail || 'No email provided'}</p>
                  <span className="usr-id">
                    {application.applicantDisplayId ||
                      `#USR-${id?.substring(0, 8)}`}
                  </span>
                </div>
                <div className={`status-badge ${statusInfo.class}`}>
                  {statusInfo.label}
                </div>
              </div>
              <div className="stats-grid">
                <div className="stat-item">
                  <span className="label">Applications</span>
                  <span className="value">
                    {application.applicantGrantApplicationCount || 0}
                  </span>
                </div>
                <div className="stat-item">
                  <span className="label">Approved</span>
                  <span className="value">
                    {application.applicantApprovedGrantApplicationCount || 0}
                  </span>
                </div>
                <div className="stat-item">
                  <span className="label">Member Since</span>
                  <span className="value">
                    {application.applicantMemberSince
                      ? new Date(
                          application.applicantMemberSince
                        ).toLocaleDateString('en-US', {
                          month: 'short',
                          year: 'numeric',
                        })
                      : 'N/A'}
                  </span>
                </div>
                <div className="stat-item">
                  <span className="label">Subscription</span>
                  <span className="value">
                    {application.applicantSubscriptionPlan === 2
                      ? 'Premium'
                      : 'Standard'}
                  </span>
                </div>
              </div>
              <div className="profile-actions">
                <button type="button" className="btn-secondary">
                  <User size={16} />
                  <span>Open User Profile</span>
                </button>
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={handleDownloadAvatar}
                >
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
              <span className="submission-date">
                Submitted on{' '}
                {application.appliedDate
                  ? new Date(application.appliedDate).toLocaleDateString()
                  : 'N/A'}
              </span>
            </div>
            <div className="card-body">
              <div className="info-list">
                <div className="info-row">
                  <span className="label">Application ID:</span>
                  <span className="value">
                    {application.applicationId || id}
                  </span>
                </div>
                <div className="info-row">
                  <span className="label">Grant:</span>
                  <span className="value highlight">
                    {application.grantName}
                  </span>
                </div>
                <div className="info-row">
                  <span className="label">Gala Event:</span>
                  <span className="value highlight">
                    {application.galaName}
                  </span>
                </div>
                <div className="info-row">
                  <span className="label">Prize Amount:</span>
                  <span className="value amount">
                    ${application.grantPrizeAmount?.toLocaleString() || '0'}
                  </span>
                </div>
                <div className="info-row">
                  <span className="label">Deadline:</span>
                  <span className="value">
                    {application.grantApplicationDeadline
                      ? new Date(
                          application.grantApplicationDeadline
                        ).toLocaleDateString()
                      : 'N/A'}
                  </span>
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
                <div className="content-box">{application.companyName}</div>
              </div>
              <div className="content-group">
                <span className="label">Industry</span>
                <div className="content-box">{application.industry}</div>
              </div>
              <div className="content-group">
                <span className="label">Motivation Statement</span>
                <div className="content-box text-content">
                  {application.motivationStatement}
                </div>
              </div>
              {application.videoUrl && (
                <div className="content-group">
                  <span className="label">Participation Video</span>
                  <a
                    href={application.videoUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="video-link"
                  >
                    <PlayCircle size={18} />
                    <span>{application.videoUrl}</span>
                    <ExternalLink size={14} />
                  </a>
                </div>
              )}
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
                      <span className="value">
                        {application.interviewDate
                          ? new Date(
                              application.interviewDate
                            ).toLocaleDateString()
                          : 'Not Scheduled'}
                      </span>
                    </div>
                  </div>
                  <div className="slot-item">
                    <div className="icon-circle success">
                      <Clock size={18} />
                    </div>
                    <div className="text">
                      <span className="label">Time Slot</span>
                      <span className="value">
                        {application.interviewStartTime || 'Not Set'}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="schedule-footer">
                  <span className="status-text green">
                    {application.interviewDate
                      ? 'Interview scheduled'
                      : 'No interview scheduled yet'}
                  </span>
                  {application.status === 'Approved' ||
                  application.isInterviewCompleted ? (
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
                    </div>
                  )}
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Right Column: Jury & Notes */}
        <div className="review-column">
          {/* Jury Panel Scores */}
          <section className="review-card jury-panel-card">
            <div className="card-header">
              <div className="header-text">
                <h3>Jury Panel</h3>
                <p>
                  {application.juryPanel?.length || 0} jurors • criteria-based
                  rating /10
                </p>
              </div>
              <button
                type="button"
                className="btn-outline"
                onClick={() => navigate(`/applications/${id}/jury`)}
              >
                <span>View Full Panel</span>
                <ExternalLink size={14} />
              </button>
            </div>
            <div className="card-body">
              <div className="score-summary-box">
                <div className="avg-score">
                  <span className="score-label">OVERALL AVERAGE</span>
                  <p>Average of all jurors</p>
                </div>
                <div className="big-score">
                  {application.juryPanelSummary?.overallAverageScore &&
                  application.juryPanelSummary.overallAverageScore > 0
                    ? application.juryPanelSummary.overallAverageScore.toFixed(
                        1
                      )
                    : '—'}{' '}
                  <span>/ 10</span>
                </div>
              </div>

              <div className="individual-jurors-list">
                {application.juryPanel?.map((juror: JuryPanelMember) => (
                  <JurorCard
                    key={juror.jurorName}
                    name={juror.jurorName}
                    score={juror.score || 0}
                    initials={juror.initials}
                    criteria={juror.criteria}
                    comment={juror.comment || ''}
                  />
                ))}
                {(!application.juryPanel ||
                  application.juryPanel.length === 0) && (
                  <p className="no-scores">
                    No jury evaluations submitted yet.
                  </p>
                )}
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
              {isNoteSaved ? (
                <>
                  <div className="saved-note-display">{adminNote}</div>
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
