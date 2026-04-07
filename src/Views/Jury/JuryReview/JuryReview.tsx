import { useEffect, useState } from 'react';
import {
  CheckCircle2,
  Clock,
  PlayCircle,
  ExternalLink,
  ChevronRight,
  MessageSquare,
  Star,
  ArrowLeft,
} from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { useHeader, HeaderActions } from '../../../Shared/Context/HeaderContext';
import './JuryReview.scss';

function JuryReview() {
  const { setTitle, setSubtitle, setBackAction, resetHeader } = useHeader();
  const navigate = useNavigate();
  const { id } = useParams();

  // Scoring State
  const [scores, setScores] = useState({
    businessViability: 0,
    innovationLevel: 0,
    teamExperience: 0,
    pitchQuality: 0,
  });
  const [comment, setComment] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    setTitle('Application Evaluation');
    setSubtitle(`${id || 'APP-45230'} • Innovation Technology Grant`);
    setBackAction(true, () => navigate('/jury/workspace'));
    return () => resetHeader();
  }, [setTitle, setSubtitle, setBackAction, resetHeader, navigate, id]);

  const handleScoreChange = (criteria: string, value: number) => {
    setScores((prev) => ({ ...prev, [criteria]: value }));
  };

  const totalScore = Object.values(scores).reduce((a, b) => a + b, 0);
  const averageScore = totalScore / Object.keys(scores).length;

  const handleSubmit = () => {
    setIsSubmitted(true);
    // Call API here
  };

  return (
    <div className="jury-review-page">
      <HeaderActions>
        <button
          type="button"
          className="header-btn btn-outline"
          onClick={() => navigate('/jury/workspace')}
        >
          <ArrowLeft size={18} />
          <span>Back to Workspace</span>
        </button>
        <button
          type="button"
          className="header-btn btn-primary"
          onClick={handleSubmit}
          disabled={isSubmitted}
        >
          <CheckCircle2 size={18} />
          <span>{isSubmitted ? 'Evaluation Submitted' : 'Submit Evaluation'}</span>
        </button>
      </HeaderActions>

      {!isSubmitted && (
        <div className="deadline-alert-banner">
          <div className="alert-content">
            <Clock size={18} />
            <div className="alert-text">
              <strong>Interview Deadline Approaching</strong>
              <span>
                All evaluations must be submitted by **Feb 24, 2026 (tomorrow)**. 
                Results will be announced on the Gala day (Feb 25).
              </span>
            </div>
          </div>
          <div className="countdown-mini">22:45:12</div>
        </div>
      )}

      <div className="review-split-layout">
        {/* Left Side: Applicant Material */}
        <div className="preview-panel">
          <section className="preview-section">
            <div className="section-header">
              <h3>Applicant Information</h3>
            </div>
            <div className="applicant-id-card">
              <div className="avatar">JD</div>
              <div className="info">
                <h4>John Doe</h4>
                <span>john.doe@quackpreneur.com</span>
                <p># USR-10234 • Member since Jan 2024</p>
              </div>
            </div>
          </section>

          <section className="preview-section">
            <div className="section-header">
              <h3>Pitch & Motivation</h3>
            </div>
            <div className="content-card">
              <div className="content-item">
                <label>Company Name</label>
                <div className="value-box">Quackpreneur</div>
              </div>
              <div className="content-item">
                <label>Motivation Statement</label>
                <div className="value-box text-content">
                  I believe our innovative approach to solving real-world problems
                  through technology deserves recognition. Our platform has the
                  potential to revolutionize the industry and create meaningful
                  impact for users worldwide.
                </div>
              </div>
              <div className="content-item">
                <label>Participation Video</label>
                <a href="#" className="video-player-mock">
                  <PlayCircle size={48} />
                  <span>Click to watch pitch video</span>
                  <ExternalLink size={16} className="ext" />
                </a>
              </div>
            </div>
          </section>

          <section className="preview-section">
            <div className="section-header">
              <h3>Supporting Documents</h3>
            </div>
            <div className="docs-list">
              <div className="doc-item">
                <div className="icon">📄</div>
                <div className="info">
                  <span>Business_Plan_v2.pdf</span>
                  <small>2.4 MB</small>
                </div>
                <ChevronRight size={18} />
              </div>
              <div className="doc-item">
                <div className="icon">📊</div>
                <div className="info">
                  <span>Financial_Projections.xlsx</span>
                  <small>1.1 MB</small>
                </div>
                <ChevronRight size={18} />
              </div>
            </div>
          </section>
        </div>

        {/* Right Side: Scoring Pane */}
        <div className="scoring-pane">
          <div className="pane-header">
            <div className="overall-gauge">
              <span className="lbl">Average Score</span>
              <div className="val">
                {averageScore.toFixed(1)} <span>/ 10</span>
              </div>
            </div>
            <div className="status-hint">
              <Star size={16} />
              <span>4 Criteria to evaluate</span>
            </div>
          </div>

          <div className="criteria-scoring">
            {[
              { id: 'businessViability', label: 'Business Viability', desc: 'Is the business model sustainable?' },
              { id: 'innovationLevel', label: 'Innovation Level', desc: 'Uniqueness of the solution?' },
              { id: 'teamExperience', label: 'Team Experience', desc: 'Relevant skills and background.' },
              { id: 'pitchQuality', label: 'Pitch Quality', desc: 'Clarity and impact of the presentation.' },
            ].map((c) => (
              <div key={c.id} className="scoring-group">
                <div className="group-header">
                  <div className="text">
                    <label>{c.label}</label>
                    <span>{c.desc}</span>
                  </div>
                  <div className="score-badge">
                    {scores[c.id as keyof typeof scores]} <span>/ 10</span>
                  </div>
                </div>
                <div className="slider-wrapper">
                  <input
                    type="range"
                    min="0"
                    max="10"
                    step="0.5"
                    value={scores[c.id as keyof typeof scores]}
                    onChange={(e) => handleScoreChange(c.id, parseFloat(e.target.value))}
                    disabled={isSubmitted}
                  />
                  <div className="slider-ticks">
                    <span>0</span>
                    <span>5</span>
                    <span>10</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="feedback-section">
            <label htmlFor="comments">
              <MessageSquare size={16} /> Qualitative Feedback
            </label>
            <textarea
              id="comments"
              placeholder="Provide your professional assessment of this application..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              disabled={isSubmitted}
            />
          </div>

          {!isSubmitted && (
            <div className="completion-check">
              <p>
                <Clock size={14} /> Please ensure all criteria are scored before submitting.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default JuryReview;
