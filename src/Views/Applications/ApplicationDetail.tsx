import { useEffect, useState } from 'react';
import {
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

// Avatar color palette — cycles through for each juror index
const AVATAR_COLORS = [
  { bg: '#dcfce7', color: '#16a34a' },
  { bg: '#dbeafe', color: '#2563eb' },
  { bg: '#fef9c3', color: '#ca8a04' },
  { bg: '#fce7f3', color: '#db2777' },
  { bg: '#ede9fe', color: '#7c3aed' },
];

// Returns a color class based on score value (out of 10)
function getScoreColor(score: number): string {
  if (score >= 8) return 'score-high';
  if (score >= 6) return 'score-mid';
  return 'score-low';
}

// Individual Juror Card Component
interface JurorCardProps {
  name: string;
  averageScore: number;
  initials: string;
  jurorRole: string;
  criteriaScores: { criteriaName: string; score: number }[];
  comment: string | null;
  colorIndex: number;
}

function JurorCard({
  name,
  averageScore,
  initials,
  jurorRole,
  criteriaScores,
  comment,
  colorIndex,
}: Readonly<JurorCardProps>) {
  const avatarColor = AVATAR_COLORS[colorIndex % AVATAR_COLORS.length];
  return (
    <div className="juror-card">
      <div className="juror-header">
        <div className="juror-info">
          <div
            className="avatar-initials"
            style={{
              backgroundColor: avatarColor.bg,
              color: avatarColor.color,
            }}
          >
            {initials}
          </div>
          <div className="text">
            <span className="name">{name}</span>
            <span className="role">{jurorRole}</span>
          </div>
        </div>
        <div className={`juror-score-badge ${getScoreColor(averageScore)}`}>
          {averageScore.toFixed(1)} / 10
        </div>
      </div>
      <div className="criteria-list">
        {criteriaScores?.map((c) => (
          <div key={c.criteriaName} className="criteria-row">
            <span className="criteria-label">{c.criteriaName}</span>
            <span className={`criteria-score ${getScoreColor(c.score)}`}>
              {c.score} / 10
            </span>
          </div>
        ))}
      </div>
      {comment && (
        <div className="juror-comment">
          <p>{comment}</p>
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
    setSubtitle('Review and approve grant application');
    setBackAction(true, () => navigate(-1));
    return () => resetHeader();
  }, [setTitle, setSubtitle, setBackAction, resetHeader, navigate]);

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
    setIsRejectOpen(false);
  };

  const handleRescheduleConfirm = () => {
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
    } catch {
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
        <div style={{ padding: '24px' }}>
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
        <div className="not-found-state">
          <h2>Application Not Found</h2>
          <p>
            The application you are looking for does not exist or you do not
            have permission to view it.
          </p>
          <button type="button" onClick={() => navigate(-1)}>
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const statusInfo = getStatusDetails(application.status);
  const applicantInitials =
    application.applicantName
      ?.split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase() || 'U';

  return (
    <div className="application-review-page">
      <RejectApplicationModal
        isOpen={isRejectOpen}
        onClose={() => setIsRejectOpen(false)}
        onConfirm={handleRejectConfirm}
        applicantInitials={applicantInitials}
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

      {/* Header Actions */}
      <HeaderActions>
        {(application.status === '2' ||
          application.status === 'Pending' ||
          application.status === 'Pending Review' ||
          application.status === 'Draft') && (
          <div className="header-action-btns">
            <button
              type="button"
              className="hdr-btn hdr-btn--reject"
              onClick={() => setIsRejectOpen(true)}
            >
              Reject
            </button>
            <button
              type="button"
              className="hdr-btn hdr-btn--approve"
              onClick={handleApprove}
            >
              <Check size={16} />
              Approve
            </button>
          </div>
        )}
        {(application.status === '4' || application.status === 'Approved') && (
          <div className="winner-class-selection">
            <span className="selection-label">
              APPROVED — Assign Winner Class:
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
                  🏆 {wc.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </HeaderActions>

      <div className="review-grid">
        {/* ── LEFT COLUMN ── */}
        <div className="left-col">
          {/* Profile Card */}
          <div className="ar-card">
            <div className="profile-section">
              <div className="profile-avatar">{applicantInitials}</div>
              <div className="profile-meta">
                <div className="profile-name-row">
                  <span className="profile-name">
                    {application.applicantName}
                  </span>
                  <span
                    className={`status-pill status-pill--${statusInfo.class}`}
                  >
                    {statusInfo.label}
                  </span>
                </div>
                <span className="profile-email">
                  {application.applicantEmail}
                </span>
                <span className="profile-id">
                  # {application.applicantDisplayId}
                </span>
              </div>
            </div>

            <div className="profile-stats">
              <div className="stat-col">
                <span className="stat-label">Applications</span>
                <span className="stat-val">
                  {application.applicantGrantApplicationCount ?? 0}
                </span>
              </div>
              <div className="stat-col">
                <span className="stat-label">Approved</span>
                <span className="stat-val">
                  {application.applicantApprovedGrantApplicationCount ?? 0}
                </span>
              </div>
              <div className="stat-col">
                <span className="stat-label">Member Since</span>
                <span className="stat-val">
                  {application.applicantMemberSince
                    ? new Date(
                        application.applicantMemberSince
                      ).toLocaleDateString('en-US', {
                        month: 'short',
                        year: 'numeric',
                      })
                    : 'Jan 2024'}
                </span>
              </div>
              <div className="stat-col">
                <span className="stat-label">Subscription</span>
                <span className="stat-val">
                  {application.applicantSubscriptionPlan === 2
                    ? 'Yearly'
                    : 'Monthly'}
                </span>
              </div>
            </div>

            <div className="profile-actions">
              <button type="button" className="profile-btn profile-btn--blue">
                <User size={15} />
                Open User Profile
              </button>
              <button
                type="button"
                className="profile-btn profile-btn--purple"
                onClick={handleDownloadAvatar}
              >
                <Download size={15} />
                Download Profile Photo
              </button>
            </div>
          </div>

          {/* Grant Details */}
          <div className="ar-card">
            <div className="ar-card-header">
              <div>
                <h3 className="ar-card-title">Grant Details</h3>
                <span className="ar-card-sub">
                  Application ID: {application.applicationId}
                </span>
              </div>
              <span className="submitted-label">
                Submitted on{' '}
                {application.appliedDate
                  ? new Date(application.appliedDate).toLocaleDateString(
                      'en-US',
                      {
                        month: 'numeric',
                        day: 'numeric',
                        year: 'numeric',
                      }
                    )
                  : 'N/A'}
              </span>
            </div>

            <table className="grant-table">
              <tbody>
                <tr>
                  <td className="gt-label">Grant</td>
                  <td className="gt-value">{application.grantName}</td>
                </tr>
                <tr>
                  <td className="gt-label">Gala Event</td>
                  <td className="gt-value">{application.galaName}</td>
                </tr>
                <tr>
                  <td className="gt-label">Prize Amount</td>
                  <td className="gt-value gt-amount">
                    ${application.grantPrizeAmount?.toLocaleString()}
                  </td>
                </tr>
                <tr>
                  <td className="gt-label">Deadline</td>
                  <td className="gt-value">
                    {application.grantApplicationDeadline
                      ? new Date(
                          application.grantApplicationDeadline
                        ).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })
                      : 'N/A'}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Application Information */}
          <div className="ar-card">
            <div className="ar-card-header">
              <div>
                <h3 className="ar-card-title">Application Information</h3>
                <span className="ar-card-sub">
                  Details provided by the applicant
                </span>
              </div>
            </div>

            <div className="info-field">
              <span className="info-field-label">Company Name</span>
              <div className="info-field-box">{application.companyName}</div>
            </div>
            <div className="info-field">
              <span className="info-field-label">Industry</span>
              <div className="info-field-box">{application.industry}</div>
            </div>
            <div className="info-field">
              <span className="info-field-label">Motivation Statement</span>
              <div className="info-field-box info-field-box--text">
                {application.motivationStatement}
              </div>
            </div>

            {application.videoUrl && (
              <div className="info-field">
                <span className="info-field-label">Participation Video</span>
                <a
                  href={application.videoUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="video-link-row"
                >
                  <PlayCircle size={18} className="video-play-icon" />
                  <span className="video-link-url">{application.videoUrl}</span>
                  <ExternalLink size={14} className="video-ext-icon" />
                </a>
              </div>
            )}
          </div>

          {/* Interview Schedule */}
          <div className="ar-card">
            <div className="ar-card-header">
              <div>
                <h3 className="ar-card-title">Interview Schedule</h3>
                <span className="ar-card-sub">
                  {application.grantRequireInterview
                    ? 'Interview required for this grant'
                    : 'No interview required'}
                </span>
              </div>
            </div>

            <div className="schedule-slots">
              <div className="schedule-slot">
                <div className="slot-icon slot-icon--green">
                  <Calendar size={18} />
                </div>
                <div className="slot-text">
                  <span className="slot-text-label">Interview Date</span>
                  <span className="slot-text-value">
                    {application.interviewDate
                      ? new Date(application.interviewDate).toLocaleDateString(
                          'en-US',
                          { month: 'long', day: 'numeric', year: 'numeric' }
                        )
                      : 'Not Scheduled'}
                  </span>
                </div>
              </div>
              <div className="schedule-slot">
                <div className="slot-icon slot-icon--blue">
                  <Clock size={18} />
                </div>
                <div className="slot-text">
                  <span className="slot-text-label">Time Slot</span>
                  <span className="slot-text-value">
                    {application.interviewStartTime &&
                    application.interviewEndTime
                      ? `${application.interviewStartTime} – ${application.interviewEndTime}`
                      : application.interviewStartTime || 'Not Set'}
                  </span>
                </div>
              </div>
            </div>

            <div className="schedule-footer">
              <span
                className={`schedule-status ${application.interviewDate ? 'status-scheduled' : ''}`}
              >
                {application.interviewDate
                  ? 'Interview scheduled'
                  : 'No interview scheduled yet'}
              </span>
              {application.isInterviewCompleted ? (
                <span className="interview-complete-badge">
                  <Check size={14} />
                  Interview Completed
                </span>
              ) : (
                <button
                  type="button"
                  className="btn-reschedule"
                  onClick={() => setIsRescheduleOpen(true)}
                >
                  <Calendar size={14} />
                  Reschedule
                </button>
              )}
            </div>
          </div>
        </div>

        {/* ── RIGHT COLUMN ── */}
        <div className="right-col">
          {/* Jury Panel */}
          <div className="ar-card">
            <div className="ar-card-header">
              <div>
                <h3 className="ar-card-title">Jury Panel</h3>
                <span className="ar-card-sub">
                  {application.juryPanel?.length ?? 0} jurors · criteria-based
                  rating /10
                </span>
              </div>
              <button
                type="button"
                className="btn-open-jury"
                onClick={() => navigate(`/applications/${id}/jury`)}
              >
                <User size={14} />
                Open Jury Page
              </button>
            </div>

            {/* Overall Score */}
            <div className="overall-score-box">
              <div className="overall-score-left">
                <span className="overall-score-title">Overall Jury Score</span>
                <span className="overall-score-sub">
                  Average of {application.juryPanel?.length ?? 0} jurors
                </span>
              </div>
              <div className="overall-score-right">
                <span className="overall-score-num">
                  {application.juryPanelSummary?.overallAverageScore != null
                    ? application.juryPanelSummary.overallAverageScore.toFixed(
                        1
                      )
                    : '—'}
                </span>
                <span className="overall-score-denom">&nbsp;/ 10</span>
              </div>
            </div>

            {/* Juror Cards */}
            <div className="jurors-list">
              {application.juryPanel?.length > 0 ? (
                application.juryPanel.map((juror, idx) => (
                  <JurorCard
                    key={juror.juryMemberId}
                    name={juror.juryMemberName}
                    averageScore={juror.averageScore ?? 0}
                    initials={
                      juror.juryMemberName
                        ? juror.juryMemberName
                            .split(' ')
                            .map((n) => n[0])
                            .join('')
                            .toUpperCase()
                        : 'JM'
                    }
                    jurorRole={`Jury Member ${idx + 1}`}
                    criteriaScores={juror.criteriaScores ?? []}
                    comment={juror.comment}
                    colorIndex={idx}
                  />
                ))
              ) : (
                <p className="no-jury-msg">
                  No jury evaluations submitted yet.
                </p>
              )}
            </div>
          </div>

          {/* Admin Notes */}
          <div className="ar-card">
            <div className="ar-card-header">
              <h3 className="ar-card-title">Admin Notes</h3>
              {isNoteSaved && (
                <span className="notes-saved-badge">
                  <Check size={13} />
                  Saved
                </span>
              )}
            </div>

            {isNoteSaved ? (
              <>
                <div className="saved-note">{adminNote}</div>
                <button
                  type="button"
                  className="btn-edit-notes"
                  onClick={() => setIsNoteSaved(false)}
                >
                  <Edit2 size={14} />
                  Edit Notes
                </button>
              </>
            ) : (
              <>
                <textarea
                  className="notes-textarea"
                  placeholder="Add private notes about this application..."
                  value={adminNote}
                  onChange={(e) => setAdminNote(e.target.value)}
                />
                <button
                  type="button"
                  className="btn-save-notes"
                  onClick={() => setIsNoteSaved(true)}
                >
                  Save Notes
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Winner class selection  */}
      {winnerClass && (
        <div className="winner-class-selection">
          <span className="selection-label">
            APPROVED — Assign Winner Class:
          </span>
          <div className="class-buttons">
            {winnerClasses.map((wc) => (
              <button
                type="button"
                key={wc.id}
                className={`class-btn ${winnerClass === wc.id ? 'selected' : ''}`}
                style={{
                  backgroundColor: winnerClass === wc.id ? wc.bg : '#e2e8f0',
                  color: winnerClass === wc.id ? '#fff' : '#94a3b8',
                }}
                onClick={() => setWinnerClass(wc.id)}
              >
                🏆 {wc.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default ApplicationDetail;
