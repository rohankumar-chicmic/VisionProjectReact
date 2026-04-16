import { useEffect, useState } from 'react';
import {
  LayoutGrid,
  List,
  Filter,
  Star,
  ChevronDown,
  Search,
  Eye,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useHeader, HeaderActions } from '../../Shared/Context/HeaderContext';
import useCurrentUserRole from '../../Shared/Auth/useCurrentUserRole';
import { useGetAdminApplicationsQuery } from '../../Services/Api/module/Admin/Application';
import { useGetOrganiserApplicationsQuery } from '../../Services/Api/module/Organiser/Application';
import { useGetAdminGalasQuery } from '../../Services/Api/module/Admin/Gala';
import { useGetOrganiserGalasQuery } from '../../Services/Api/module/Organiser/Gala';
import { useGetAdminGrantsQuery } from '../../Services/Api/module/Admin/Grant';
import { useGetOrganiserGrantsQuery } from '../../Services/Api/module/Organiser/Grant';
import { useGetAssignedApplicationsQuery } from '../../Services/Api/module/JuryApi/index';
import Skeleton from '../../Components/Shared/Skeleton';
import EmptyState from '../../Components/Shared/EmptyState';
import { getAssetUrl } from '../../Shared/Utils/url';
import { formatDateTimeShort } from '../../Shared/Utils/dateUtils';
import './ApplicationList.scss';

const getStatusDetails = (status: string | number) => {
  const s = typeof status === 'string' ? status.toLowerCase() : status;
  switch (s) {
    case 'draft':
    case 1:
      return { label: 'Draft', class: 'draft' };
    case 'pending':
    case 'pending review':
    case 2:
      return { label: 'Pending Review', class: 'pending' };
    case 'in review':
    case 'reviewed':
    case 3:
      return { label: 'Reviewed', class: 'in-review' };
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
    case 8:
      return { label: 'Evaluated', class: 'evaluated' };
    case 9:
      return { label: 'Interview Completed', class: 'interview-completed' };
    default:
      return { label: status?.toString() || 'Unknown', class: '' };
  }
};

interface ApplicationListItem {
  id: string;
  applicationId?: string;
  status: number | string;
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
  const [selectedGalaId, setSelectedGalaId] = useState<string>('');
  const [selectedGrantId, setSelectedGrantId] = useState<string>('');
  const [sortByRating, setSortByRating] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>(() => {
    return (
      (localStorage.getItem('applicationListViewMode') as 'grid' | 'list') ||
      'list'
    );
  });
  const pageSize = 10;

  useEffect(() => {
    localStorage.setItem('applicationListViewMode', viewMode);
  }, [viewMode]);

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

  let response;
  if (isAdmin) response = adminResponse;
  else if (isOrganiser) response = organiserResponse;

  let isAppsLoading = false;
  if (isAdmin) {
    isAppsLoading = isAdminLoading;
  } else if (isOrganiser) {
    isAppsLoading = isOrganiserLoading;
  } else {
    isAppsLoading = isJuryAppsLoading;
  }

  const applications = isJury
    ? juryAppResponse?.data || []
    : response?.data?.items || [];
  const totalCount = isJury
    ? juryAppResponse?.data?.length || 0
    : response?.data?.totalCount || 0;
  const totalPages = isJury
    ? Math.ceil(totalCount / pageSize)
    : response?.data?.totalPages || 0;

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
    if (isOrganiser) {
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
    }
    return 0;
  };

  useEffect(() => {
    setTitle('Application Management');
    setSubtitle('Review and manage all submitted applications');
    setBackAction(false);
    return () => resetHeader();
  }, [setTitle, setSubtitle, setBackAction, resetHeader]);

  const tabs = [
    {
      label: 'All',
      count: (() => {
        if (isJury) return applications.length;
        if (activeTab === 'All') return totalCount;
        return '...';
      })(),
    },
    { label: 'Pending', count: isJury ? 0 : getStatusCount(2) },
    { label: 'In Review', count: isJury ? 0 : getStatusCount(3) },
    { label: 'Approved', count: isJury ? 0 : getStatusCount(4) },
    { label: 'Rejected', count: isJury ? 0 : getStatusCount(5) },
    { label: 'Interview', count: isJury ? 0 : getStatusCount(7) },
    { label: 'Winners', count: isJury ? 0 : getStatusCount(6) },
  ];

  const getScoreClass = (score: number) => {
    if (score >= 8) return 'high';
    if (score >= 5) return 'medium';
    if (score > 0) return 'low';
    return 'none';
  };

  const renderGridView = () => (
    <div className="applications-grid">
      {applications.map((app: ApplicationListItem) => {
        const statusInfo = getStatusDetails(app.status);
        const displayScore = isJury ? app.totalJuryScore : app.juryScore;
        const avatarUrl = app.applicantAvatarUrl;

        return (
          <div
            key={app.id}
            className="application-card"
            role="button"
            tabIndex={0}
            onClick={() =>
              navigate(
                isJury ? `/jury/review/${app.id}` : `/applications/${app.id}`
              )
            }
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                navigate(
                  isJury ? `/jury/review/${app.id}` : `/applications/${app.id}`
                );
              }
            }}
          >
            <div className="card-header">
              <div className="applicant-info">
                <div className="avatar">
                  {avatarUrl ? (
                    <img src={getAssetUrl(avatarUrl)} alt="Applicant" />
                  ) : (
                    <span>
                      {app.applicantName
                        ? app.applicantName.charAt(0).toUpperCase()
                        : 'U'}
                    </span>
                  )}
                </div>
                <div className="text">
                  <span className="name">{app.applicantName}</span>
                  <span className="app-id">#{app.applicationId}</span>
                </div>
              </div>
              <span className={`status-badge ${statusInfo.class}`}>
                {statusInfo.label}
              </span>
            </div>

            <div className="card-body">
              <div className="meta-row">
                <span className="label">Gala Event</span>
                <span className="value">{app.galaName}</span>
              </div>
              <div className="meta-row">
                <span className="label">Grant Program</span>
                <span className="value">{app.grantName}</span>
              </div>
              <div className="meta-row">
                <span className="label">Applied On</span>
                <span className="value">
                  {app.appliedDate ? formatDateTimeShort(app.appliedDate) : '—'}
                </span>
              </div>
            </div>

            <div className="card-footer">
              <div className="score-box">
                <span className="label">Jury Score</span>
                <span
                  className={`score-val ${getScoreClass(displayScore ?? 0)}`}
                >
                  {(displayScore ?? 0) > 0
                    ? `${(displayScore ?? 0).toFixed(1)} / 10`
                    : 'Not Scored'}
                </span>
              </div>
              <div className="view-cta">
                <span>View Details</span>
                <Eye size={14} />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );

  const renderListView = () => (
    <div className="applications-list">
      <div className="list-header">
        <div className="col-id">App ID</div>
        <div className="col-applicant">Applicant</div>
        <div className="col-gala">Gala Event</div>
        <div className="col-grant">Grant Program</div>
        <div className="col-date">Applied Date</div>
        <div className="col-score">Score</div>
        <div className="col-status">Status</div>
      </div>
      {applications.map((app: ApplicationListItem) => {
        const statusInfo = getStatusDetails(app.status);
        const displayScore = isJury ? app.totalJuryScore : app.juryScore;
        const avatarUrl = app.applicantAvatarUrl;

        return (
          <div
            key={app.id}
            className="application-list-item"
            role="button"
            tabIndex={0}
            onClick={() =>
              navigate(
                isJury ? `/jury/review/${app.id}` : `/applications/${app.id}`
              )
            }
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                navigate(
                  isJury ? `/jury/review/${app.id}` : `/applications/${app.id}`
                );
              }
            }}
          >
            <div className="col-id">#{app.applicationId}</div>
            <div className="col-applicant">
              <div className="applicant-box">
                <div className="avatar">
                  {avatarUrl ? (
                    <img src={getAssetUrl(avatarUrl)} alt="Applicant" />
                  ) : (
                    <span>{app.applicantName?.charAt(0).toUpperCase()}</span>
                  )}
                </div>
                <div className="info">
                  <span className="name">{app.applicantName}</span>
                  <span className="email">{app.applicantEmail}</span>
                </div>
              </div>
            </div>
            <div className="col-gala">{app.galaName}</div>
            <div className="col-grant">{app.grantName}</div>
            <div className="col-date">
              {app.appliedDate ? formatDateTimeShort(app.appliedDate) : '—'}
            </div>
            <div className="col-score">
              <span
                className={`score-badge ${getScoreClass(displayScore ?? 0)}`}
              >
                {(displayScore ?? 0) > 0
                  ? `${(displayScore ?? 0).toFixed(1)} / 10`
                  : '—'}
              </span>
            </div>
            <div className="col-status">
              <span className={`status-pill ${statusInfo.class}`}>
                {statusInfo.label}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );

  const renderContentSections = () => {
    if (isAppsLoading || isJuryAppsLoading) {
      if (viewMode === 'grid') {
        return (
          <div className="applications-grid">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="application-card skeleton-card"
                style={{ cursor: 'default' }}
              >
                <div className="card-header">
                  <div className="applicant-info">
                    <Skeleton width={44} height={44} borderRadius={12} />
                    <div className="text" style={{ gap: 6 }}>
                      <Skeleton width={120} height={15} />
                      <Skeleton width={80} height={12} />
                    </div>
                  </div>
                  <Skeleton width={70} height={24} borderRadius={8} />
                </div>

                <div className="card-body">
                  <div className="meta-row">
                    <Skeleton width={80} height={13} />
                    <Skeleton width={140} height={13} />
                  </div>
                  <div className="meta-row">
                    <Skeleton width={100} height={13} />
                    <Skeleton width={120} height={13} />
                  </div>
                  <div className="meta-row">
                    <Skeleton width={90} height={13} />
                    <Skeleton width={110} height={13} />
                  </div>
                </div>

                <div className="card-footer">
                  <div className="score-box" style={{ gap: 6 }}>
                    <Skeleton width={40} height={11} />
                    <Skeleton width={50} height={14} />
                  </div>
                  <Skeleton width={90} height={14} />
                </div>
              </div>
            ))}
          </div>
        );
      }

      return (
        <div className="applications-list">
          <div className="list-header">
            <div className="col-id">App ID</div>
            <div className="col-applicant">Applicant</div>
            <div className="col-gala">Gala Event</div>
            <div className="col-grant">Grant Program</div>
            <div className="col-date">Applied Date</div>
            <div className="col-score">Score</div>
            <div className="col-status">Status</div>
          </div>
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className="application-list-item"
              style={{ cursor: 'default' }}
            >
              <div className="col-id">
                <Skeleton height={14} width="60%" />
              </div>
              <div className="col-applicant">
                <div className="applicant-box" style={{ width: '100%' }}>
                  <Skeleton height={36} width={36} borderRadius={10} />
                  <div className="info" style={{ flex: 1, gap: 6 }}>
                    <Skeleton height={14} width="70%" />
                    <Skeleton height={12} width="50%" />
                  </div>
                </div>
              </div>
              <div className="col-gala">
                <Skeleton height={14} width="80%" />
              </div>
              <div className="col-grant">
                <Skeleton height={14} width="80%" />
              </div>
              <div className="col-date">
                <Skeleton height={14} width="70%" />
              </div>
              <div className="col-score">
                <Skeleton height={14} width="40%" />
              </div>
              <div className="col-status">
                <Skeleton height={24} width="60%" borderRadius={10} />
              </div>
            </div>
          ))}
        </div>
      );
    }

    if (applications.length === 0) {
      return (
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
      );
    }

    return viewMode === 'grid' ? renderGridView() : renderListView();
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
            <div className="view-toggle">
              <button
                type="button"
                className={`toggle-btn ${viewMode === 'list' ? 'active' : ''}`}
                onClick={() => setViewMode('list')}
                title="List View"
              >
                <List size={20} />
              </button>
              <button
                type="button"
                className={`toggle-btn ${viewMode === 'grid' ? 'active' : ''}`}
                onClick={() => setViewMode('grid')}
                title="Grid View"
              >
                <LayoutGrid size={20} />
              </button>
            </div>
          </div>
          {!isJury && (
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
                    {galas.map((g: { id: string; name: string }) => (
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
                    {grants.map((g: { id: string; name: string }) => (
                      <option key={g.id} value={g.id}>
                        {g.name}
                      </option>
                    ))}
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
          )}
        </div>

        {renderContentSections()}

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
