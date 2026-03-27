import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { CheckCircle2, Check, Edit2, Send } from 'lucide-react';
import { useHeader, HeaderActions } from '../../Shared/Context/HeaderContext';
import './JuryPanel.scss';

// Reusable individual rating card
interface JuryRatingCardProps {
  initials: string;
  name: string;
  role: string;
  overallScore: number;
  highlightColor: string;
  criteria: { label: string; score: number }[];
  personalNote: string;
  status: 'submitted' | 'editing' | 'pending';
}

function JuryRatingCard({
  initials,
  name,
  role,
  overallScore,
  highlightColor,
  criteria,
  personalNote,
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
          {criteria.map((c, i) => (
            <div key={i} className="criteria-row">
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
        <span className="section-label">PERSONAL NOTE</span>
        <div className="note-content">
          <p>{personalNote}</p>
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

function JuryPanel() {
  const { setTitle, setSubtitle, setBackAction, resetHeader } = useHeader();
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    setTitle('Jury Panel — Innovation Technology Grant');
    setSubtitle(`John Doe • ${id || 'APP-45230'} • 3 jurors evaluating`);
    setBackAction(true, () => navigate(`/applications/${id || 'APP-45230'}`));
    return () => resetHeader();
  }, [setTitle, setSubtitle, setBackAction, resetHeader, navigate, id]);

  const judgesData = [
    {
      initials: 'ML',
      name: 'Marie Lefebvre',
      role: 'Jury Member 1',
      overallScore: 8.2,
      highlightColor: '#3b82f6', // blue
      status: 'editing' as const,
      criteria: [
        { label: 'Business Viability', score: 8 },
        { label: 'Innovation Level', score: 9 },
        { label: 'Team Experience', score: 7 },
      ],
      personalNote:
        "Very strong pitch, team needs more industry experience. The innovation angle is compelling and I'd recommend Excellence class if team credentials are verified.",
    },
    {
      initials: 'PD',
      name: 'Paul Dubois',
      role: 'Jury Member 2',
      overallScore: 7.5,
      highlightColor: '#8b5cf6', // purple
      status: 'pending' as const,
      criteria: [
        { label: 'Business Viability', score: 7 },
        { label: 'Innovation Level', score: 8 },
        { label: 'Team Experience', score: 7 },
      ],
      personalNote:
        'Solid concept but market validation could be stronger. The team presents well but lacks references from the sector. Worth monitoring for next cycle.',
    },
    {
      initials: 'SC',
      name: 'Sophie Caron',
      role: 'Jury Member 3',
      overallScore: 7.8,
      highlightColor: '#eab308', // yellow
      status: 'submitted' as const,
      criteria: [
        { label: 'Business Viability', score: 8 },
        { label: 'Innovation Level', score: 7 },
        { label: 'Team Experience', score: 9 },
      ],
      personalNote:
        'Excellent team synergy. Would strongly recommend for Excellence class. The business model is scalable and the innovation approach is truly unique in the sector.',
    },
  ];

  return (
    <div className="jury-panel-page">
      <HeaderActions>
        <button
          type="button"
          className="header-btn btn-outline"
          onClick={() => navigate(`/applications/${id || 'APP-45230'}`)}
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
            7.8 <span>/ 10</span>
          </div>
        </div>

        <div className="divider" />

        <div className="averages-block">
          <span className="kpi-label">JURY AVERAGES</span>
          <div className="jury-dots">
            {judgesData.map((j, i) => (
              <div key={i} className="dot-item">
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
            <div className="stat">
              <span className="lbl">Business Viability</span>
              <span className="val">7.7</span>
            </div>
            <div className="stat">
              <span className="lbl">Innovation Level</span>
              <span className="val">8.0</span>
            </div>
            <div className="stat">
              <span className="lbl">Team Experience</span>
              <span className="val">7.7</span>
            </div>
          </div>
        </div>

        <div className="suggested-class-badge">
          <div className="icon">🏆</div>
          <div className="text">
            <span>Suggested Class</span>
            <strong>B - Lauréat</strong>
          </div>
        </div>
      </div>

      <div className="jury-cards-grid">
        {judgesData.map((judge, index) => (
          <JuryRatingCard key={index} {...judge} />
        ))}
      </div>
    </div>
  );
}

export default JuryPanel;
