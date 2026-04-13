import { useEffect, useMemo, useState } from 'react';
import { Search, ArrowRight, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import {
  useHeader,
} from '../../../Shared/Context/HeaderContext';
import { useGetAssignedApplicationsQuery } from '../../../Services/Api/module/JuryApi';
import './JuryWorkspace.scss';

function JuryWorkspace() {
  const { setTitle, setSubtitle, resetHeader } = useHeader();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('Pending');

  const { data: appsResponse, isLoading } = useGetAssignedApplicationsQuery({
    searchTerm: searchTerm || undefined,
    pageSize: 100,
  });

  useEffect(() => {
    setTitle('My Jury Workspace');
    setSubtitle('Assigned applications for your expert evaluation');
    return () => resetHeader();
  }, [setTitle, setSubtitle, resetHeader]);

  useEffect(() => {
    if (appsResponse?.data) {
      console.log('[JuryWorkspace] API Response:', appsResponse.data);
    }
  }, [appsResponse]);

  const assignments = useMemo(() => appsResponse?.data ?? [], [appsResponse]);



  const filteredAssignments = useMemo(() => {
    return assignments.filter((item) => {
      const isReviewed = item.hasCurrentJuryEvaluated;
      if (activeTab === 'Pending' && isReviewed) return false;
      if (activeTab === 'Reviewed' && !isReviewed) return false;

      const searchLower = searchTerm.toLowerCase();
      return (
        item.applicantName.toLowerCase().includes(searchLower) ||
        item.applicationId.toLowerCase().includes(searchLower) ||
        item.grantName.toLowerCase().includes(searchLower)
      );
    });
  }, [assignments, activeTab, searchTerm]);

  if (isLoading) {
    return (
      <div className="jury-workspace-page loading">
        <Loader2 className="spin" size={32} />
      </div>
    );
  }

  return (
    <div className="jury-workspace-page">


      <div className="workspace-container">
        <div className="workspace-filters">
          <div className="search-box">
            <Search size={18} />
            <input
              type="text"
              placeholder="Search by applicant or ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="tab-group">
            <button
              type="button"
              className={`tab-btn ${activeTab === 'Pending' ? 'active' : ''}`}
              onClick={() => setActiveTab('Pending')}
            >
              Pending Reviews
            </button>
            <button
              type="button"
              className={`tab-btn ${activeTab === 'Reviewed' ? 'active' : ''}`}
              onClick={() => setActiveTab('Reviewed')}
            >
              Completed
            </button>
          </div>

        </div>

        <div className="assignments-grid">
          {filteredAssignments.map((item) => {
            const isReviewed = item.hasCurrentJuryEvaluated;
            const isRejected = item.juryReviewStatus === 5;
            const dueLabel = item.interviewDate
              ? `Interview on ${new Date(item.interviewDate).toLocaleDateString()}`
              : 'Date not set';
            const isUrgent =
              item.interviewDate &&
              new Date(item.interviewDate).getTime() < Date.now();

            const getShortStatus = () => {
              if (isReviewed) return 'Reviewed';
              if (isRejected) return 'Rejected';
              return 'Pending';
            };

            const shortStatus = getShortStatus();

            return (
              <div
                key={item.id}
                className={`assignment-card ${isUrgent ? 'urgent' : ''} ${isRejected ? 'rejected' : ''}`}
              >
                <div className="card-top">
                  <div className="status-indicator">
                    <span
                      className={`status-badge ${shortStatus.toLowerCase().replace(/ /g, '-')}`}
                    >
                      {shortStatus}
                    </span>
                  </div>
                  <div
                    className={`deadline ${isUrgent ? 'high-priority' : ''}`}
                  >
                    Schedule: <strong>{dueLabel}</strong>
                  </div>
                </div>

                <div className="card-main">
                  <div className="applicant-info">
                    <div className="avatar">{item.applicantName.charAt(0)}</div>
                    <div className="details">
                      <h4>{item.applicantName}</h4>
                      <span>{item.applicantEmail}</span>
                    </div>
                  </div>
                  <div className="grant-info">
                    <span className="id">{item.applicationId}</span>
                    <p className="grant-name">{item.grantName}</p>
                  </div>
                </div>

                <div className="card-footer">
                  {isReviewed || isRejected ? (
                    <div className="score-display">
                      <span className="lbl">
                        {isRejected
                          ? 'Application Rejected'
                          : 'Evaluation Complete'}
                      </span>
                      {isReviewed && item.totalJuryScore !== null && (
                        <span className="score">{item.totalJuryScore}/10</span>
                      )}
                    </div>
                  ) : (
                    <div className="progress-hint">
                      <div className="progress-bar">
                        <div
                          className="fill"
                          style={{
                            width: '0%',
                          }}
                        />
                      </div>
                      <span>Not started</span>
                    </div>
                  )}
                  <button
                    type="button"
                    className="action-btn"
                    onClick={() => navigate(`/jury/review/${item.id}`)}
                    disabled={isRejected}
                  >
                    {isReviewed
                      ? 'View Evaluation'
                      : isRejected
                        ? 'Rejected'
                        : 'Start Scoring'}
                    <ArrowRight size={18} />
                  </button>
                </div>
              </div>
            );
          })}
          {filteredAssignments.length === 0 && (
            <div className="empty-workspace">
              <h3>No assignments found</h3>
              <p>Try adjusting your search term or active tab.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default JuryWorkspace;
