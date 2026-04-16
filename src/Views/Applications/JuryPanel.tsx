import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { CheckCircle2, Check, Edit2, Send } from 'lucide-react';
import { useHeader, HeaderActions } from '../../Shared/Context/HeaderContext';
import { useGetAdminApplicationByIdQuery } from '../../Services/Api/module/Admin/Application';
import { useGetOrganiserApplicationByIdQuery } from '../../Services/Api/module/Organiser/Application';
import useCurrentUserRole from '../../Shared/Auth/useCurrentUserRole';
import Skeleton from '../../Components/Shared/Skeleton';
import './JuryPanel.scss';

// Reusable individual rating card
interface JuryRatingCardProps {
  initials: string;
  name: string;
  role: string;
  overallScore: number;
  highlightColor: string;
  criteria: { label: string; score: number }[];
  privateNotes: string;
  status: 'submitted' | 'editing' | 'pending';
}

function JuryRatingCard({
  initials,
  name,
  role,
  overallScore,
  highlightColor,
  criteria,
  privateNotes,
  status,
}: Readonly<JuryRatingCardProps>) {
  return (
    <div className="jury-rating-card">
      <div className="judging-header">
        <div className="avatar-info">
          <div
            className="avatar"
            style={{
              color: highlightColor,
              backgroundColor: `${highlightColor}15`,
            }}
          >
            {initials}
          </div>
          <div className="text-info">
            <span className="judge-name">{name}</span>
            <span className="judge-role">{role}</span>
          </div>
        </div>
        <div className="overall-score" style={{ color: highlightColor }}>
          {overallScore.toFixed(1)} <span className="max-score">/ 10</span>
        </div>
      </div>

      <div className="criteria-section">
        <span className="section-label">CRITERIA RATINGS</span>
        <div className="criteria-items">
          {criteria.map((c) => (
            <div key={c.label} className="criteria-row">
              <div className="label-row">
                <span className="criteria-title">{c.label}</span>
                <span
                  className="criteria-value"
                  style={{ color: highlightColor }}
                >
                  {c.score} <span className="max-val">/ 10</span>
                </span>
              </div>
              <div className="track">
                <div
                  className="fill"
                  style={{
                    width: `${c.score * 10}%`,
                    backgroundColor: highlightColor,
                  }}
                >
                  <div className="thumb" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="personal-note-section">
        <span className="section-label">PRIVATE NOTES</span>
        <div className="note-content">
          <p>{privateNotes || 'No notes provided'}</p>
        </div>
      </div>

      <div className="action-footer">
        {status === 'submitted' && (
          <button
            type="button"
            className="btn-action submitted"
            style={{
              color: highlightColor,
              backgroundColor: `${highlightColor}10`,
            }}
          >
            <Check size={16} />
            <span>Rating Submitted</span>
          </button>
        )}
        {status === 'editing' && (
          <button type="button" className="btn-action editing">
            <Edit2 size={16} />
            <span>Edit Rating</span>
          </button>
        )}
        {status === 'pending' && (
          <button type="button" className="btn-action pending bg-primary">
            <Send size={16} />
            <span>Submit My Rating</span>
          </button>
        )}
      </div>
    </div>
  );
}

const HIGHLIGHT_COLORS = [
  '#3b82f6',
  '#8b5cf6',
  '#eab308',
  '#ef4444',
  '#10b981',
];

function JuryPanel() {
  const { setTitle, setSubtitle, setBackAction, resetHeader } = useHeader();
  const navigate = useNavigate();
  const { id } = useParams();
  const { role } = useCurrentUserRole();
  const isAdmin = role === 'admin' || role === 'sub_admin';

  const { data: adminResponse, isLoading: isAdminLoading } =
    useGetAdminApplicationByIdQuery(id ?? '', { skip: !isAdmin });
  const { data: organiserResponse, isLoading: isOrganiserLoading } =
    useGetOrganiserApplicationByIdQuery(id ?? '', { skip: isAdmin });

  const isLoading = isAdminLoading || isOrganiserLoading;
  const application = isAdmin ? adminResponse?.data : organiserResponse?.data;

  useEffect(() => {
    if (application) {
      setTitle(`Jury Panel — ${application.grantName}`);
      setSubtitle(
        `${application.applicantName} • ${application.applicationId} • ${application.juryPanel?.length ?? 0} jurors evaluating`
      );
    } else {
      setTitle('Jury Panel');
      setSubtitle('Loading application consensus...');
    }
    setBackAction(true, () => navigate(`/applications/${id}`));
    return () => resetHeader();
  }, [
    setTitle,
    setSubtitle,
    setBackAction,
    resetHeader,
    navigate,
    id,
    application,
  ]);

  if (isLoading) {
    return (
      <div className="jury-panel-page">
        <Skeleton height={200} />
        <div style={{ marginTop: '24px' }}>
          <Skeleton height={400} />
        </div>
      </div>
    );
  }

  if (!application) {
    return (
      <div className="jury-panel-page">
        <div className="not-found-state">
          <h2>Evaluation Not Found</h2>
          <p>
            We couldn&apos;t retrieve the jury panel details for this
            application.
          </p>
          <button type="button" onClick={() => navigate(-1)}>
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const judgesData = (application.juryPanel ?? []).map((juror, index) => ({
    initials:
      juror.juryMemberName
        ?.split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase() || 'JM',
    name: juror.juryMemberName,
    role: `Jury Member ${index + 1}`,
    overallScore: juror.averageScore ?? 0,
    highlightColor: HIGHLIGHT_COLORS[index % HIGHLIGHT_COLORS.length],
    status: (juror.evaluatedAt ? 'submitted' : 'pending') as
      | 'submitted'
      | 'pending'
      | 'editing',
    criteria: (juror.criteriaScores ?? []).map((c) => ({
      label: c.criteriaName,
      score: c.score,
    })),
    privateNotes: juror.comment || '',
  }));

  const summary = application.juryPanelSummary;

  return (
    <div className="jury-panel-page">
      <HeaderActions>
        <button
          type="button"
          className="header-btn btn-outline"
          onClick={() => navigate(`/applications/${id}`)}
        >
          <span>Cancel</span>
        </button>
        <button type="button" className="header-btn btn-primary">
          <CheckCircle2 size={18} />
          <span>Finalize & Submit</span>
        </button>
      </HeaderActions>

      <div className="jury-executive-summary">
        <div className="score-block">
          <span className="kpi-label">OVERALL SCORE</span>
          <div className="big-value green">
            {(summary?.overallAverageScore ?? 0).toFixed(1)} <span>/ 10</span>
          </div>
        </div>

        <div className="divider" />

        <div className="averages-block">
          <span className="kpi-label">JURY AVERAGES</span>
          <div className="jury-dots">
            {judgesData.map((j) => (
              <div key={j.name} className="dot-item">
                <div
                  className="dot"
                  style={{ backgroundColor: j.highlightColor }}
                />
                <span className="name">
                  {j.name.split(' ')[0]} {j.initials.charAt(1)}.
                </span>
                <span className="score">{j.overallScore.toFixed(1)}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="divider" />

        <div className="averages-block">
          <span className="kpi-label">CRITERIA AVERAGES</span>
          <div className="criteria-stats">
            {(summary?.criteriaAverages ?? []).map((ca) => (
              <div key={ca.criteriaKey} className="stat">
                <span className="lbl">{ca.criteriaName}</span>
                <span className="val">{ca.averageScore.toFixed(1)}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="suggested-class-badge">
          <div className="icon">🏆</div>
          <div className="text">
            <span>Suggested Class</span>
            <strong>{summary?.suggestedClass || 'Not Calculated'}</strong>
          </div>
        </div>
      </div>

      <div className="jury-cards-grid">
        {judgesData.map((judge) => (
          <JuryRatingCard
            key={judge.name}
            initials={judge.initials}
            name={judge.name}
            role={judge.role}
            overallScore={judge.overallScore}
            highlightColor={judge.highlightColor}
            status={judge.status}
            criteria={judge.criteria}
            privateNotes={judge.privateNotes}
          />
        ))}
      </div>
    </div>
  );
}

export default JuryPanel;
