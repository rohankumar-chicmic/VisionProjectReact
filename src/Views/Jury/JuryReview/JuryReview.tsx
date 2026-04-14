import { useEffect, useState, useMemo } from 'react';
import {
  CheckCircle2,
  Clock,
  PlayCircle,
  ExternalLink,
  Loader2,
  Calendar,
  XCircle,
} from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import {
  useHeader,
  HeaderActions,
} from '../../../Shared/Context/HeaderContext';
import {
  useGetApplicationReviewQuery,
  useStartApplicationReviewMutation,
  useSubmitEvaluationMutation,
  useMarkInterviewCompleteMutation,
  useApproveApplicationMutation,
  useRejectApplicationMutation,
  CriteriaScore,
} from '../../../Services/Api/module/JuryApi';
import RejectApplicationModal from '../../Applications/Components/RejectApplicationModal';
import Modal from '../../../Components/Atom/Modal/Modal';
import './JuryReview.scss';

function JuryReview() {
  const { setTitle, setSubtitle, setBackAction, resetHeader } = useHeader();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const {
    data: reviewResponse,
    isLoading,
    isError,
  } = useGetApplicationReviewQuery(id || '');
  const [startReview] = useStartApplicationReviewMutation();
  const [submitEvaluation, { isLoading: isSubmitting }] =
    useSubmitEvaluationMutation();
  const [markInterview] = useMarkInterviewCompleteMutation();
  const [approveApp, { isLoading: isApproving }] =
    useApproveApplicationMutation();
  const [rejectApp, { isLoading: isRejecting }] =
    useRejectApplicationMutation();

  const application = useMemo(() => reviewResponse?.data, [reviewResponse]);

  // Modals & Local State
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [scores, setScores] = useState<Record<string, number>>({});
  const [qualitativeFeedback, setQualitativeFeedback] = useState('');
  const [privateNotes, setPrivateNotes] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Workflow Checks Modals
  const [workflowModal, setWorkflowModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
  }>({
    isOpen: false,
    title: '',
    message: '',
  });

  const isApproved = application?.juryReviewStatus === 7;
  const isRejected = application?.juryReviewStatus === 5;
  const isFinalized = application?.juryReviewStatus === 8;
  const isInterviewCompleted = application?.juryReviewStatus === 9;
  const isWinner = application?.juryReviewStatus === 6;

  useEffect(() => {
    if (id) {
      startReview(id)
        .unwrap()
        .catch(() => {});
    }
  }, [id, startReview]);

  useEffect(() => {
    if (application) {
      setTitle('Application Review');
      setSubtitle('Evaluate and score grant application');
      setBackAction(true, () => navigate('/jury/workspace'));

      // Initialize scores from criteria if empty
      if (Object.keys(scores).length === 0 && application.criteria) {
        const initialScores: Record<string, number> = {};
        application.criteria.forEach((c) => {
          initialScores[c.criteriaKey] = c.existingScore || 0;
        });
        setScores(initialScores);
      }

      // Initialize qualitative feedback and private notes if empty and application has them
      if (!qualitativeFeedback && application.qualitativeFeedback) {
        setQualitativeFeedback(application.qualitativeFeedback);
      }
      if (!privateNotes && application.privateNotes) {
        setPrivateNotes(application.privateNotes);
      }
    }
    return () => resetHeader();
  }, [
    setTitle,
    setSubtitle,
    setBackAction,
    resetHeader,
    navigate,
    application,
    scores,
    qualitativeFeedback,
    privateNotes,
  ]);

  const handleScoreChange = (criteriaKey: string, value: number) => {
    setScores((prev) => ({ ...prev, [criteriaKey]: value }));
  };

  const totalScore = Object.values(scores).reduce(
    (a: number, b: number) => a + b,
    0
  );
  const averageScore = application?.criteria?.length
    ? (totalScore as number) / application.criteria.length
    : 0;

  const handleApprove = async () => {
    if (!id) return;
    try {
      await approveApp(id).unwrap();
      toast.success('Application approved for interview phase');
    } catch (error) {
      toast.error(
        'Failed to approve application. Please check your connection.'
      );
    }
  };

  const handleRejectConfirm = async (
    reason: string,
    feedback: string,
    allowReapply: boolean
  ) => {
    if (!id) return;
    try {
      await rejectApp({
        id,
        reason,
        feedback,
        allowReapply,
      }).unwrap();
      toast.success('Application rejected successfully');
      setIsRejectModalOpen(false);
    } catch (error) {
      toast.error('Failed to reject application. Please try again.');
    }
  };

  const handleSubmit = async () => {
    if (!application || !id) return;

    if (!isApproved && !isInterviewCompleted) {
      setWorkflowModal({
        isOpen: true,
        title: '🔒 Evaluation Required',
        message:
          'A final evaluation can only be submitted for applications that have been approved for the interview phase and have completed the interview. Please ensure the interview is marked as done first.',
      });
      return;
    }

    const payloadScores: CriteriaScore[] = application.criteria.map((c) => ({
      criteriaKey: c.criteriaKey,
      criteriaName: c.criteriaName,
      criteriaCategory: c.criteriaCategory,
      score: scores[c.criteriaKey] || 0,
    }));

    try {
      await submitEvaluation({
        applicationId: id,
        scores: payloadScores,
        overallScore: averageScore,
        qualitativeFeedback,
        privateNotes,
      }).unwrap();

      setIsSubmitted(true);
      toast.success('Evaluation submitted! Moving back to workspace...');
      setTimeout(() => navigate('/jury/workspace'), 2000);
    } catch (error) {
      toast.error(
        'Failed to submit evaluation. Please review your scores and try again.'
      );
    }
  };

  const handleToggleInterview = async () => {
    if (!application || !id) return;

    if (!isApproved) {
      setWorkflowModal({
        isOpen: true,
        title: '⚠️ Workflow Restriction',
        message:
          'This application must be approved for an interview session before you can mark the interview as complete.',
      });
      return;
    }

    const newStatus = !application.interviewCompleted;
    try {
      await markInterview({ id, markCompleted: newStatus }).unwrap();
      toast.success(
        `Interview successfully marked as ${newStatus ? 'completed' : 'pending'}`
      );
    } catch (err) {
      toast.error('Failed to update interview status. Please try again.');
    }
  };

  if (isLoading) {
    return (
      <div className="jury-loading-state">
        <Loader2 className="animate-spin" size={48} />
        <p>Loading application data...</p>
      </div>
    );
  }

  if (isError || !application) {
    return (
      <div className="jury-error-state">
        <h3>Oops! Application not found.</h3>
        <button type="button" onClick={() => navigate('/jury/workspace')}>
          Return to Workspace
        </button>
      </div>
    );
  }

  const initials = application.applicantName
    ? application.applicantName
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
    : 'A';

  const getStatusLabel = (status: number) => {
    switch (status) {
      case 2:
        return 'Pending Review';
      case 3:
        return 'In Review';
      case 4:
        return 'Approved';
      case 5:
        return 'Rejected';
      case 6:
        return 'Winner';
      case 7:
        return 'Approved for Interview';
      case 8:
        return 'Evaluated';
      case 9:
        return 'Interview Completed';
      default:
        return 'Unknown';
    }
  };

  return (
    <div className="jury-review-page">
      <HeaderActions>
        {!isApproved &&
          !isRejected &&
          !isFinalized &&
          !isInterviewCompleted &&
          !isWinner && (
            <>
              <button
                type="button"
                className="header-btn btn-outline-red"
                onClick={() => setIsRejectModalOpen(true)}
                disabled={isSubmitting || isRejecting || isApproving}
              >
                {isRejecting ? (
                  <Loader2 className="animate-spin" size={18} />
                ) : (
                  <XCircle size={18} />
                )}
                <span>Reject</span>
              </button>
              <button
                type="button"
                className="header-btn btn-outline-green"
                onClick={handleApprove}
                disabled={isSubmitting || isRejecting || isApproving}
              >
                {isApproving ? (
                  <Loader2 className="animate-spin" size={18} />
                ) : (
                  <CheckCircle2 size={18} />
                )}
                <span>Approve for Interview</span>
              </button>
            </>
          )}
        {isApproved && (
          <div className="header-status-badge approved">
            <CheckCircle2 size={18} />
            <span>Approved for Interview</span>
          </div>
        )}
        {(isFinalized || isWinner) && (
          <div className="header-status-badge evaluated">
            <CheckCircle2 size={18} />
            <span>Evaluated</span>
          </div>
        )}
        {!isRejected &&
          !isFinalized &&
          !isWinner &&
          (application.interviewCompleted || isInterviewCompleted) && (
            <>
              <div className="v-divider" />
              <button
                type="button"
                className="header-btn btn-primary"
                onClick={handleSubmit}
                disabled={
                  isSubmitted || isSubmitting || isRejecting || isApproving
                }
              >
                {isSubmitting ? (
                  <Loader2 className="animate-spin" size={18} />
                ) : (
                  <CheckCircle2 size={18} />
                )}
                <span>{isSubmitted ? 'Submitted' : 'Submit Evaluation'}</span>
              </button>
            </>
          )}
      </HeaderActions>

      {isRejected && (
        <div className="rejection-banner">
          <div className="banner-content">
            <XCircle size={24} />
            <div className="text">
              <h4>Application Rejected</h4>
              <p>
                This application has been declined. No further evaluations or
                interviews are permitted for this submission.
              </p>
            </div>
          </div>
        </div>
      )}

      <RejectApplicationModal
        isOpen={isRejectModalOpen}
        onClose={() => setIsRejectModalOpen(false)}
        onConfirm={handleRejectConfirm}
        applicantInitials={initials}
        applicantName={application.applicantName}
        grantName={application.grantName}
        appId={application.applicationCode}
      />

      <Modal
        isOpen={workflowModal.isOpen}
        onClose={() => setWorkflowModal({ ...workflowModal, isOpen: false })}
        title={workflowModal.title}
        footer={
          <button
            type="button"
            className="btn-primary"
            style={{ padding: '8px 20px', borderRadius: '8px' }}
            onClick={() =>
              setWorkflowModal({ ...workflowModal, isOpen: false })
            }
          >
            Got it
          </button>
        }
      >
        <div
          style={{ color: '#64748b', fontSize: '0.95rem', lineHeight: '1.5' }}
        >
          {workflowModal.message}
        </div>
      </Modal>

      <div className="review-grid">
        {/* Left Column: Application Details */}
        <div className="details-column">
          {/* User Profile Card */}
          <section className="review-card profile-card">
            <div className="card-body">
              <div className="profile-header">
                <div className="avatar-large">{initials}</div>
                <div className="info">
                  <h3>{application.applicantName}</h3>
                  <p>{application.applicantEmail}</p>
                  <span className="usr-id">
                    # {application.applicantId?.split('-')[0] || 'USR-CODE'}
                  </span>
                </div>
                {isInterviewCompleted &&
                !isSubmitted &&
                !isFinalized &&
                !isWinner ? (
                  <button
                    type="button"
                    className="header-btn btn-primary"
                    style={{
                      padding: '8px 16px',
                      fontSize: '0.85rem',
                      borderRadius: '12px',
                    }}
                    onClick={handleSubmit}
                  >
                    Submit Evaluation
                  </button>
                ) : (
                  <div
                    className={`status-badge ${getStatusLabel(application.juryReviewStatus).toLowerCase().replace(/ /g, '-')}`}
                  >
                    {getStatusLabel(application.juryReviewStatus)}
                  </div>
                )}
              </div>
              <div className="stats-grid">
                <div className="stat-item">
                  <span className="label">Applications</span>
                  <span className="value">{application.totalApplications}</span>
                </div>
                <div className="stat-item">
                  <span className="label">Approved</span>
                  <span className="value">{application.totalApproved}</span>
                </div>
                <div className="stat-item">
                  <span className="label">Member Since</span>
                  <span className="value">
                    {application.memberSince
                      ? new Date(application.memberSince).toLocaleDateString(
                          'en-US',
                          { month: 'short', year: 'numeric' }
                        )
                      : 'N/A'}
                  </span>
                </div>
                <div className="stat-item">
                  <span className="label">Subscription</span>
                  <span className="value">
                    {application.subscriptionPlan || 'Free'}
                  </span>
                </div>
              </div>
            </div>
          </section>

          {/* Grant Details Card */}
          <section className="review-card">
            <div className="card-header">
              <h3>Grant Details</h3>
              <span className="submission-date">
                Submitted on{' '}
                {application.submittedAt
                  ? new Date(application.submittedAt).toLocaleDateString()
                  : 'N/A'}
              </span>
            </div>
            <div className="card-body">
              <div className="info-list">
                <div className="info-row">
                  <span className="label">Application ID:</span>
                  <span className="value">{application.applicationCode}</span>
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
                    {application.prizeAmount
                      ? `$${application.prizeAmount.toLocaleString()}`
                      : 'Not Disclosed'}
                  </span>
                </div>
                <div className="info-row">
                  <span className="label">Deadline:</span>
                  <span className="value">
                    {application.applicationDeadline
                      ? new Date(
                          application.applicationDeadline
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
                <div className="content-box">
                  {application.companyName || 'Not Provided'}
                </div>
              </div>
              <div className="content-group">
                <span className="label">Industry</span>
                <div className="content-box">
                  {application.industry || 'Not Provided'}
                </div>
              </div>
              <div className="content-group">
                <span className="label">Motivation Statement</span>
                <div className="content-box text-content">
                  {application.motivationStatement || 'No statement provided.'}
                </div>
              </div>
              <div className="content-group">
                <span className="label">Participation Video</span>
                {application.videoUrl ? (
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
                ) : (
                  <div className="content-box">No video provided</div>
                )}
              </div>
            </div>
          </section>

          {/* Interview Schedule */}
          <section className="review-card">
            <div className="card-header">
              <h3>Interview Schedule</h3>
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
                          : 'TBD'}
                      </span>
                    </div>
                  </div>
                  <div className="slot-item">
                    <div className="icon-circle success">
                      <Clock size={18} />
                    </div>
                    <div className="text">
                      <span className="label">Status</span>
                      <span className="value">
                        {application.interviewCompleted
                          ? 'Completed'
                          : 'Pending'}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="schedule-footer">
                  <button
                    type="button"
                    className={`toggle-btn ${application.interviewCompleted ? 'completed' : ''}`}
                    onClick={handleToggleInterview}
                    disabled={isSubmitting || isRejecting || isApproving}
                  >
                    {application.interviewCompleted ? (
                      <CheckCircle2 size={16} />
                    ) : (
                      <div className="dot" />
                    )}
                    <span>
                      {application.interviewCompleted
                        ? 'Interview Done'
                        : 'Mark Interview Done'}
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Right Column: Scoring Pane */}
        <div className="context-column">
          {/* Scoring Header */}
          <section className="review-card scoring-summary">
            <div className="card-body">
              <div className="overall-score-panel">
                <div className="text">
                  <h4>Overall Evaluation</h4>
                  <p>Weighted average score</p>
                </div>
                <div className="big-score">
                  {averageScore.toFixed(1)} <span>/ 10</span>
                </div>
              </div>
            </div>
          </section>

          {/* Criteria Scoring */}
          <section className="review-card">
            <div className="card-header">
              <h3>Evaluation Criteria</h3>
              <p>{application.criteria?.length || 0} areas to score</p>
            </div>
            <div className="card-body">
              <div className="criteria-list">
                {application.criteria?.map((c) => (
                  <div key={c.criteriaKey} className="criteria-item">
                    <div className="criteria-info">
                      <span className="label">{c.criteriaName}</span>
                      <span className="cat">{c.criteriaCategory}</span>
                      <span className="score-val">
                        {scores[c.criteriaKey] || 0} / 10
                      </span>
                    </div>
                    <div className="slider-wrapper">
                      {isSubmitted || isFinalized || isWinner || isRejected ? (
                        <div className="static-progress-bar">
                          <div
                            className="progress-fill"
                            style={{
                              width: `${((scores[c.criteriaKey] || 0) / 10) * 100}%`,
                            }}
                          />
                        </div>
                      ) : (
                        <input
                          type="range"
                          min="0"
                          max="10"
                          step="0.5"
                          value={scores[c.criteriaKey] || 0}
                          style={
                            {
                              '--val-percent': `${((scores[c.criteriaKey] || 0) / 10) * 100}%`,
                            } as React.CSSProperties
                          }
                          onChange={(e) =>
                            handleScoreChange(
                              c.criteriaKey,
                              parseFloat(e.target.value)
                            )
                          }
                          disabled={
                            isSubmitted ||
                            isSubmitting ||
                            isRejecting ||
                            isApproving ||
                            isRejected
                          }
                        />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Feedback & Notes */}
          <section className="review-card">
            <div className="card-header">
              <h3>Final Assessment</h3>
            </div>
            <div className="card-body">
              <div className="feedback-form">
                <div className="form-group">
                  <label htmlFor="qualitativeFeedback">
                    Qualitative Feedback
                    <textarea
                      id="qualitativeFeedback"
                      placeholder="Provide your professional assessment..."
                      value={qualitativeFeedback}
                      onChange={(e) => setQualitativeFeedback(e.target.value)}
                      disabled={
                        isSubmitted ||
                        isSubmitting ||
                        isRejecting ||
                        isApproving ||
                        isRejected
                      }
                    />
                  </label>
                </div>
                <div className="form-group">
                  <label htmlFor="privateNotes">
                    Private Notes (Internal)
                    <textarea
                      id="privateNotes"
                      placeholder="Reference notes for jury members..."
                      value={privateNotes}
                      onChange={(e) => setPrivateNotes(e.target.value)}
                      disabled={
                        isSubmitted ||
                        isSubmitting ||
                        isRejecting ||
                        isApproving ||
                        isRejected
                      }
                    />
                  </label>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

export default JuryReview;
