import { useEffect, useState } from 'react';
import {
  Search,
  CheckCircle2,
  XCircle,
  Eye,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useHeader, HeaderActions } from '../../Shared/Context/HeaderContext';
import useCurrentUserRole from '../../Shared/Auth/useCurrentUserRole';
import { useGetAdminApplicationsQuery } from '../../Services/Api/module/Admin/Application';
import { useGetAssignedApplicationsQuery } from '../../Services/Api/module/JuryApi/index';
import Skeleton from '../../Components/Shared/Skeleton';
import './ApplicationList.scss';

const getStatusDetails = (status: number) => {
  switch (status) {
    case 1:
      return { label: 'Draft', class: 'draft' };
    case 2:
      return { label: 'Pending', class: 'pending' };
    case 3:
      return { label: 'In Review', class: 'in-review' };
    case 4:
      return { label: 'Approved', class: 'approved' };
    case 5:
      return { label: 'Rejected', class: 'rejected' };
    case 6:
      return { label: 'Winner', class: 'winner' };
    case 7:
      return { label: 'Interview', class: 'interview' };
    case 8:
      return { label: 'Evaluated', class: 'evaluated' };
    case 9:
      return { label: 'Interview Completed', class: 'interview-completed' };
    default:
      return { label: 'Unknown', class: '' };
  }
};

interface ApplicationListItem {
  id: string;
  status: number;
  totalJuryScore?: number | null;
  juryScore?: number | null;
  appliedDate?: string | null;
  submittedAt?: string | null;
  applicantName: string;
  applicantEmail: string;
  applicantAvatarUrl?: string | null;
  galaName: string;
  grantName: string;
}

function ApplicationList() {
  const { setTitle, setSubtitle, setBackAction, resetHeader } = useHeader();
  const navigate = useNavigate();
  const { role } = useCurrentUserRole();
  const isJury = role === 'jury';

  // State for filters and pagination
  const [activeTab, setActiveTab] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [pageNumber, setPageNumber] = useState(1);
  const pageSize = 10;

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setPageNumber(1);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const getStatusFromTab = (tab: string) => {
    switch (tab) {
      case 'Pending':
        return 2;
      case 'In Review':
        return 3;
      case 'Approved':
        return 4;
      case 'Rejected':
        return 5;
      case 'Winners':
        return 6;
      case 'Interview':
        return 7;
      case 'Evaluated':
        return 8;
      case 'Interview Completed':
        return 9;
      default:
        return undefined;
    }
  };

  const { data: appResponse, isLoading: isAppsLoading } =
    useGetAdminApplicationsQuery(
      {
        searchTerm: debouncedSearch || undefined,
        status: getStatusFromTab(activeTab),
        pageNumber,
        pageSize,
      },
      { skip: isJury }
    );

  const { data: juryAppResponse, isLoading: isJuryAppsLoading } =
    useGetAssignedApplicationsQuery(
      {
        searchTerm: debouncedSearch || undefined,
        status: getStatusFromTab(activeTab),
        pageNumber,
        pageSize: 100,
      },
      { skip: !isJury }
    );

  const applications = isJury
    ? juryAppResponse?.data || []
    : appResponse?.data?.items || [];

  const totalCount = isJury
    ? juryAppResponse?.data?.length || 0
    : appResponse?.data?.totalCount || 0;

  const totalPages = isJury
    ? Math.ceil(totalCount / pageSize)
    : appResponse?.data?.totalPages || 0;

  useEffect(() => {
    setTitle('Application Management');
    setSubtitle('Review and manage all submitted applications');
    setBackAction(false);
    return () => resetHeader();
  }, [setTitle, setSubtitle, setBackAction, resetHeader]);

  const tabs = [
    { label: 'All' },
    { label: 'Pending' },
    { label: 'In Review' },
    { label: 'Approved' },
    { label: 'Rejected' },
    { label: 'Interview' },
    { label: 'Evaluated' },
    { label: 'Interview Completed' },
    { label: 'Winners' },
  ];

  const getScoreClass = (score: number) => {
    if (score >= 8) return 'high';
    if (score >= 5) return 'medium';
    if (score > 0) return 'low';
    return 'none';
  };

  return (
    <div className="application-list-page">
      <HeaderActions>{null}</HeaderActions>

      <div className="list-container-card">
        <div className="filters-ecosystem">
          <div className="top-row">
            <div className="search-bar">
              <Search size={18} />
              <input
                type="text"
                placeholder="Search applications..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="status-tabs">
              {tabs.map((tab) => (
                <button
                  type="button"
                  key={tab.label}
                  className={`tab-btn ${activeTab === tab.label ? 'active' : ''}`}
                  onClick={() => {
                    setActiveTab(tab.label);
                    setPageNumber(1);
                  }}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>


        </div>

        <div className="applications-table-wrapper">
          <table className="hi-fi-table">
            <thead>
              <tr>
                <th>Applicant</th>
                <th>Gala Name</th>
                <th>Grant</th>
                <th>Applied Date</th>
                <th>Jury Score</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {isAppsLoading && (
                <>
                  <tr key="skel-1">
                    <td colSpan={7}>
                      <Skeleton height={60} />
                    </td>
                  </tr>
                  <tr key="skel-2">
                    <td colSpan={7}>
                      <Skeleton height={60} />
                    </td>
                  </tr>
                  <tr key="skel-3">
                    <td colSpan={7}>
                      <Skeleton height={60} />
                    </td>
                  </tr>
                </>
              )}

              {!isAppsLoading &&
                !isJuryAppsLoading &&
                applications.length > 0 &&
                applications.map((app: ApplicationListItem) => {
                  const statusInfo = getStatusDetails(app.status);
                  const displayScore = isJury
                    ? app.totalJuryScore
                    : app.juryScore;
                  const appliedDate = isJury
                    ? app.submittedAt
                    : app.appliedDate;
                  const avatarUrl = app.applicantAvatarUrl;

                  return (
                    <tr key={app.id}>
                      <td>
                        <div className="applicant-cell">
                          <div className="avatar">
                            {avatarUrl ? (
                              <img src={avatarUrl} alt="Applicant" />
                            ) : (
                              <span>{app.applicantName.charAt(0)}</span>
                            )}
                          </div>
                          <div className="info">
                            <span className="name">{app.applicantName}</span>
                            <span className="email">{app.applicantEmail}</span>
                          </div>
                        </div>
                      </td>
                      <td>{app.galaName}</td>
                      <td>{app.grantName}</td>
                      <td>
                        {appliedDate
                          ? new Date(appliedDate).toLocaleDateString('en-US', {
                              month: 'short',
                              day: '2-digit',
                              year: 'numeric',
                            })
                          : '—'}
                      </td>
                      <td>
                        <div className="score-cell">
                          <span
                            className={`score-value ${getScoreClass(displayScore ?? 0)}`}
                          >
                            {(displayScore ?? 0) > 0
                              ? `${(displayScore ?? 0).toFixed(1)} / 10`
                              : '—'}
                          </span>
                        </div>
                      </td>
                      <td>
                        <span className={`status-pill ${statusInfo.class}`}>
                          {statusInfo.label}
                        </span>
                      </td>
                      <td>
                        <div className="action-buttons">
                          {app.status === 2 && !isJury && (
                            <>
                              <button type="button" className="btn-approve">
                                <CheckCircle2 size={16} />
                                <span>Approve</span>
                              </button>
                              <button type="button" className="btn-reject">
                                <XCircle size={16} />
                                <span>Reject</span>
                              </button>
                            </>
                          )}
                          <button
                            type="button"
                            className="btn-view"
                            onClick={() =>
                              navigate(
                                isJury
                                  ? `/jury/review/${app.id}`
                                  : `/applications/${app.id}`
                              )
                            }
                          >
                            <Eye size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}

              {!isAppsLoading &&
                !isJuryAppsLoading &&
                applications.length === 0 && (
                  <tr>
                    <td colSpan={7} className="empty-state">
                      No applications found.
                    </td>
                  </tr>
                )}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="table-pagination">
            <span className="pagination-info">
              Showing {(pageNumber - 1) * pageSize + 1} -{' '}
              {Math.min(pageNumber * pageSize, totalCount)} of {totalCount}{' '}
              applications
            </span>
            <div className="pagination-controls">
              <button
                type="button"
                className="page-nav"
                onClick={() => setPageNumber((p) => Math.max(1, p - 1))}
                disabled={pageNumber === 1}
              >
                Previous
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  type="button"
                  key={p}
                  className={`page-num ${pageNumber === p ? 'active' : ''}`}
                  onClick={() => setPageNumber(p)}
                >
                  {p}
                </button>
              ))}
              <button
                type="button"
                className="page-nav"
                onClick={() => {
                  setPageNumber((p) => Math.min(totalPages, p + 1));
                }}
                disabled={pageNumber === totalPages}
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ApplicationList;
