import { useEffect, useState } from 'react';
import {
  Search,
  ChevronDown,
  Download,
  CheckCircle2,
  XCircle,
  Eye,
  Filter,
  Star,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useHeader, HeaderActions } from '../../Shared/Context/HeaderContext';
import { useGetAdminApplicationsQuery } from '../../Services/Api/module/Admin/Application';
import { useGetOrganiserApplicationsQuery } from '../../Services/Api/module/Organiser/Application';
import { useGetAdminGalasQuery } from '../../Services/Api/module/Admin/Gala';
import { useGetOrganiserGalasQuery } from '../../Services/Api/module/Organiser/Gala';
import { useGetAdminGrantsQuery } from '../../Services/Api/module/Admin/Grant';
import { useGetOrganiserGrantsQuery } from '../../Services/Api/module/Organiser/Grant';
import useCurrentUserRole from '../../Shared/Auth/useCurrentUserRole';
import Skeleton from '../../Components/Shared/Skeleton';
import EmptyState from '../../Components/Shared/EmptyState';
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
    default:
      return { label: 'Unknown', class: '' };
  }
};

function ApplicationList() {
  const { setTitle, setSubtitle, setBackAction, resetHeader } = useHeader();
  const navigate = useNavigate();

  // State for filters and pagination
  const [activeTab, setActiveTab] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [pageNumber, setPageNumber] = useState(1);
  const [selectedGalaId, setSelectedGalaId] = useState<string>('');
  const [selectedGrantId, setSelectedGrantId] = useState<string>('');
  const [sortByRating, setSortByRating] = useState<boolean>(false);
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
      default:
        return undefined;
    }
  };

  const { role } = useCurrentUserRole();
  const isAdmin = role === 'admin' || role === 'sub_admin';
  const isOrganiser = role === 'organiser';

  const queryParams = {
    searchTerm: debouncedSearch || undefined,
    status: getStatusFromTab(activeTab),
    galaId: selectedGalaId || undefined,
    grantId: selectedGrantId || undefined,
    sortBy: sortByRating ? 'juryScore' : undefined,
    sortOrder: sortByRating ? 'desc' : undefined,
    pageNumber,
    pageSize,
  };

  const { data: adminResponse, isLoading: isAdminLoading } =
    useGetAdminApplicationsQuery(queryParams, { skip: !isAdmin });

  const { data: organiserResponse, isLoading: isOrganiserLoading } =
    useGetOrganiserApplicationsQuery(queryParams, { skip: !isOrganiser });

  // Parallel queries for status counts
  const countParams = (status: number) => ({
    status,
    pageSize: 1,
    galaId: selectedGalaId || undefined,
    grantId: selectedGrantId || undefined,
  });

  const { data: pendingCountRes } = useGetAdminApplicationsQuery(
    countParams(2),
    { skip: !isAdmin }
  );
  const { data: inReviewCountRes } = useGetAdminApplicationsQuery(
    countParams(3),
    { skip: !isAdmin }
  );
  const { data: approvedCountRes } = useGetAdminApplicationsQuery(
    countParams(4),
    { skip: !isAdmin }
  );
  const { data: rejectedCountRes } = useGetAdminApplicationsQuery(
    countParams(5),
    { skip: !isAdmin }
  );
  const { data: winnerCountRes } = useGetAdminApplicationsQuery(
    countParams(6),
    { skip: !isAdmin }
  );
  const { data: interviewCountRes } = useGetAdminApplicationsQuery(
    countParams(7),
    { skip: !isAdmin }
  );

  const { data: orgPendingCountRes } = useGetOrganiserApplicationsQuery(
    countParams(2),
    { skip: !isOrganiser }
  );
  const { data: orgInReviewCountRes } = useGetOrganiserApplicationsQuery(
    countParams(3),
    { skip: !isOrganiser }
  );
  const { data: orgApprovedCountRes } = useGetOrganiserApplicationsQuery(
    countParams(4),
    { skip: !isOrganiser }
  );
  const { data: orgRejectedCountRes } = useGetOrganiserApplicationsQuery(
    countParams(5),
    { skip: !isOrganiser }
  );
  const { data: orgWinnerCountRes } = useGetOrganiserApplicationsQuery(
    countParams(6),
    { skip: !isOrganiser }
  );
  const { data: orgInterviewCountRes } = useGetOrganiserApplicationsQuery(
    countParams(7),
    { skip: !isOrganiser }
  );

  // Filter Data Queries
  const { data: adminGalas } = useGetAdminGalasQuery(
    { pageSize: 100 },
    { skip: !isAdmin }
  );
  const { data: adminGrants } = useGetAdminGrantsQuery(
    { pageSize: 100, galaEventId: selectedGalaId || undefined },
    { skip: !isAdmin }
  );
  const { data: orgGalas } = useGetOrganiserGalasQuery(
    { pageSize: 100 },
    { skip: !isOrganiser }
  );
  const { data: orgGrants } = useGetOrganiserGrantsQuery(
    { pageSize: 100, galaEventId: selectedGalaId || undefined },
    { skip: !isOrganiser }
  );

  const response = isAdmin ? adminResponse : organiserResponse;
  const isAppsLoading = isAdmin ? isAdminLoading : isOrganiserLoading;

  const applications = response?.data?.items || [];
  const totalCount = response?.data?.totalCount || 0;
  const totalPages = response?.data?.totalPages || 0;

  const galas =
    (isAdmin ? adminGalas?.data?.items : orgGalas?.data?.items) || [];
  const grants = (isAdmin ? adminGrants?.data : orgGrants?.data) || [];

  const getStatusCount = (status: number) => {
    if (isAdmin) {
      switch (status) {
        case 2:
          return pendingCountRes?.data?.totalCount || 0;
        case 3:
          return inReviewCountRes?.data?.totalCount || 0;
        case 4:
          return approvedCountRes?.data?.totalCount || 0;
        case 5:
          return rejectedCountRes?.data?.totalCount || 0;
        case 6:
          return winnerCountRes?.data?.totalCount || 0;
        case 7:
          return interviewCountRes?.data?.totalCount || 0;
        default:
          return 0;
      }
    }
    switch (status) {
      case 2:
        return orgPendingCountRes?.data?.totalCount || 0;
      case 3:
        return orgInReviewCountRes?.data?.totalCount || 0;
      case 4:
        return orgApprovedCountRes?.data?.totalCount || 0;
      case 5:
        return orgRejectedCountRes?.data?.totalCount || 0;
      case 6:
        return orgWinnerCountRes?.data?.totalCount || 0;
      case 7:
        return orgInterviewCountRes?.data?.totalCount || 0;
      default:
        return 0;
    }
  };

  useEffect(() => {
    setTitle('Application Management');
    setSubtitle('Review and manage all submitted applications');
    setBackAction(false);
    return () => resetHeader();
  }, [setTitle, setSubtitle, setBackAction, resetHeader]);

  const tabs = [
    { label: 'All', count: activeTab === 'All' ? totalCount : '...' },
    { label: 'Pending', count: getStatusCount(2) },
    { label: 'In Review', count: getStatusCount(3) },
    { label: 'Approved', count: getStatusCount(4) },
    { label: 'Rejected', count: getStatusCount(5) },
    { label: 'Interview', count: getStatusCount(7) },
    { label: 'Winners', count: getStatusCount(6) },
  ];

  const getScoreClass = (score: number) => {
    if (score >= 8) return 'high';
    if (score >= 5) return 'medium';
    if (score > 0) return 'low';
    return 'none';
  };

  return (
    <div className="application-list-page">
      <HeaderActions>
        <button type="button" className="header-btn btn-outline">
          <Download size={18} />
          <span>Export CSV</span>
        </button>
      </HeaderActions>

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
                  {tab.label} ({tab.count})
                </button>
              ))}
            </div>
          </div>

          <div className="bottom-row">
            <div className="filter-label">
              <Filter size={16} />
              <span>Filter by:</span>
            </div>
            <div className="filter-dropdowns">
              <div className="filter-select">
                <select
                  aria-label="Filter by Gala"
                  value={selectedGalaId}
                  onChange={(e) => {
                    setSelectedGalaId(e.target.value);
                    setSelectedGrantId('');
                    setPageNumber(1);
                  }}
                >
                  <option value="">All Galas</option>
                  {galas.map((g) => (
                    <option key={g.id} value={g.id}>
                      {g.name}
                    </option>
                  ))}
                </select>
                <ChevronDown size={14} />
              </div>
              <div className="filter-select">
                <select
                  aria-label="Filter by Grant"
                  value={selectedGrantId}
                  onChange={(e) => {
                    setSelectedGrantId(e.target.value);
                    setPageNumber(1);
                  }}
                >
                  <option value="">All Grants</option>
                  {grants.map((g) => (
                    <option key={g.id} value={g.id}>
                      {g.name}
                    </option>
                  ))}
                </select>
                <ChevronDown size={14} />
              </div>
              <div className="filter-select">
                <select aria-label="Filter by Class">
                  <option>All Classes</option>
                </select>
                <ChevronDown size={14} />
              </div>
              <button
                type="button"
                className={`filter-select rating ${sortByRating ? 'active' : ''}`}
                onClick={() => {
                  setSortByRating(!sortByRating);
                  setPageNumber(1);
                }}
              >
                <Star size={14} />
                <span>
                  {sortByRating ? 'Rating: Best First' : 'Default Sort'}
                </span>
                <ChevronDown size={14} />
              </button>
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
                applications.length > 0 &&
                applications.map((app) => {
                  const statusInfo = getStatusDetails(app.status);
                  return (
                    <tr key={app.id}>
                      <td>
                        <div className="applicant-cell">
                          <div className="avatar">
                            {app.applicantAvatarUrl ? (
                              <img
                                src={app.applicantAvatarUrl}
                                alt="Applicant"
                              />
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
                        {new Date(app.appliedDate).toLocaleDateString('en-US', {
                          month: 'short',
                          day: '2-digit',
                          year: 'numeric',
                        })}
                      </td>
                      <td>
                        <div className="score-cell">
                          <span
                            className={`score-value ${getScoreClass(app.juryScore)}`}
                          >
                            {app.juryScore > 0
                              ? `${app.juryScore.toFixed(1)} / 10`
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
                          {app.status === 2 && (
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
                            onClick={() => navigate(`/applications/${app.id}`)}
                          >
                            <Eye size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}

              {!isAppsLoading && applications.length === 0 && (
                <tr>
                  <td colSpan={7}>
                    <EmptyState
                      icon={Filter}
                      title="No applications found"
                      description={
                        debouncedSearch
                          ? `We couldn't find any applications matching "${debouncedSearch}". Try a different term.`
                          : "It looks like there aren't any applications in this category yet."
                      }
                      action={
                        debouncedSearch ? (
                          <button
                            type="button"
                            className="header-btn btn-outline"
                            onClick={() => setSearchTerm('')}
                          >
                            Clear Search
                          </button>
                        ) : undefined
                      }
                    />
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
