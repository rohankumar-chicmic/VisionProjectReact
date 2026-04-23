/* eslint-disable no-alert */
import { useEffect, useState, useMemo } from 'react';
import {
  Search,
  ArrowUpDown,
  Award,
  DollarSign,
  Users,
  Plus,
  CheckCircle2,
  AlertTriangle,
  LayoutGrid,
  List,
} from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import Modal from '../../Components/Atom/Modal/Modal';
import { useHeader, HeaderActions } from '../../Shared/Context/HeaderContext';
import KpiCard from '../../Components/Shared/KpiCard';
import {
  useGetAdminGrantsQuery,
  useGetAdminGrantsSummaryQuery,
  useDeleteAdminGrantMutation,
} from '../../Services/Api/module/Admin/Grant';
import { KpiSkeleton } from '../Dashboard/Components/DashboardSkeletons';
import {
  GrantGridSkeleton,
  GrantListSkeleton,
} from './Components/GrantSkeletons';
import showToast from '../../Shared/Utils/toast';
import { formatDateTimeShort } from '../../Shared/Utils/dateUtils';
import useCurrentUserRole from '../../Shared/Auth/useCurrentUserRole';
import './GrantList.scss';
import {
  useDeleteOrganiserGrantMutation,
  useGetOrganiserGrantsQuery,
  useGetOrganiserGrantSummaryQuery,
} from '../../Services/Api/module/Organiser/Grant';

function GrantList() {
  const { setTitle, setSubtitle, setBackAction, resetHeader } = useHeader();
  const navigate = useNavigate();
  const { role } = useCurrentUserRole();
  const isAdmin = role === 'admin' || role === 'sub_admin';
  const isOrganiser = role === 'organiser';
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Search and Filter State
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<number | undefined>(
    undefined
  );
  const [page] = useState(1);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>(
    (localStorage.getItem('grantListViewMode') as 'grid' | 'list') || 'grid'
  );

  const handleViewModeChange = (mode: 'grid' | 'list') => {
    setViewMode(mode);
    localStorage.setItem('grantListViewMode', mode);
  };

  const queryParams = useMemo(
    () => ({
      search: searchTerm || undefined,
      status: statusFilter,
      page,
      pageSize: 20,
    }),
    [page, searchTerm, statusFilter]
  );

  const {
    data: adminGrantsResponse,
    isLoading: isAdminGridLoading,
    isError: isAdminError,
    refetch: refetchAdminGrants,
  } = useGetAdminGrantsQuery(queryParams, { skip: !isAdmin });

  const {
    data: organiserGrantsResponse,
    isLoading: isOrganiserGridLoading,
    isError: isOrganiserError,
    refetch: refetchOrganiserGrants,
  } = useGetOrganiserGrantsQuery(queryParams, { skip: !isOrganiser });

  const { data: adminSummaryResponse, isLoading: isAdminSummaryLoading } =
    useGetAdminGrantsSummaryQuery(undefined, { skip: !isAdmin });

  const {
    data: organiserSummaryResponse,
    isLoading: isOrganiserSummaryLoading,
  } = useGetOrganiserGrantSummaryQuery(undefined, { skip: !isOrganiser });

  const [deleteGrant, { isLoading: isDeleting }] =
    useDeleteAdminGrantMutation();
  const [deleteOrganiserGrant, { isLoading: isDeletingOrganiserGrant }] =
    useDeleteOrganiserGrantMutation();

  const grantsResponse = isAdmin
    ? adminGrantsResponse
    : organiserGrantsResponse;
  const isGridLoading = isAdmin ? isAdminGridLoading : isOrganiserGridLoading;
  const isError = isAdmin ? isAdminError : isOrganiserError;
  const refetch = isAdmin ? refetchAdminGrants : refetchOrganiserGrants;
  const summaryResponse = isAdmin
    ? adminSummaryResponse
    : organiserSummaryResponse;
  const isSummaryLoading = isAdmin
    ? isAdminSummaryLoading
    : isOrganiserSummaryLoading;
  const isDeletingGrant = isAdmin ? isDeleting : isDeletingOrganiserGrant;

  const handleDeleteGrant = async () => {
    if (!deletingId || isDeletingGrant) return;

    try {
      if (isAdmin) {
        await deleteGrant(deletingId).unwrap();
      } else {
        await deleteOrganiserGrant(deletingId).unwrap();
      }
      showToast.success('Grant deleted successfully');
      setDeletingId(null);
    } catch (error) {
      showToast.error(
        error instanceof Error ? error.message : 'Failed to delete grant'
      );
    }
  };

  useEffect(() => {
    setTitle('Grant Management');
    setSubtitle(
      isOrganiser
        ? 'Create and manage your grant programs'
        : 'Create and manage grant programs'
    );
    setBackAction(false);
    return () => resetHeader();
  }, [isOrganiser, setTitle, setSubtitle, setBackAction, resetHeader]);

  // Status mapping helper
  const getStatusLabel = (status: number) => {
    switch (status) {
      case 1:
        return 'Draft';
      case 2:
        return 'Upcoming';
      case 3:
        return 'Active';
      case 4:
        return 'Completed';
      case 5:
        return 'Closed';
      default:
        return 'Unknown';
    }
  };

  const getStatusClass = (status: number) => {
    return getStatusLabel(status).toLowerCase().replace(' ', '-');
  };

  const grants = useMemo(
    () => grantsResponse?.data || [],
    [grantsResponse?.data]
  );

  const kpis = useMemo(() => {
    const summary = summaryResponse?.data;

    return [
      {
        label: 'Total Grants',
        value: summary?.totalGrants.toString() || '0',
        trend: '+0%',
        trendType: 'up' as const,
        color: '#a855f7',
        icon: <Award size={20} />,
      },
      {
        label: 'Active Programs',
        value: summary?.activePrograms.toString() || '0',
        trend: '+0%',
        trendType: 'up' as const,
        color: '#10b981',
        icon: <CheckCircle2 size={20} />,
      },
      {
        label: 'Total Fund Amount',
        value: summary
          ? `$${(summary.totalFundAmount / 1000).toFixed(0)}k`
          : '0',
        trend: '+0%',
        trendType: 'up' as const,
        color: '#f59e0b',
        icon: <DollarSign size={20} />,
      },
      {
        label: 'Total Applicants',
        value: summary?.totalApplicants.toString() || '0',
        trend: '+0%',
        trendType: 'up' as const,
        color: '#3b82f6',
        icon: <Users size={20} />,
      },
    ];
  }, [summaryResponse]);

  const renderGridView = () => (
    <div className="grants-grid">
      {grants.map((grant) => (
        <div key={grant.id} className="grant-card">
          <Link to={`/grants/${grant.id}`} className="card-clickable-area">
            <div className="card-header">
              <h3 className="grant-title">{grant.name}</h3>
              <div className="status-group">
                <span
                  className={`status-badge ${getStatusClass(grant.status)}`}
                >
                  {getStatusLabel(grant.status)}
                </span>
                {grant.isWinnerDecided && (
                  <span className="status-badge awarded">
                    <Award size={12} /> Awarded
                  </span>
                )}
              </div>
            </div>
            <p className="grant-description">{grant.description}</p>

            <div className="grant-meta">
              <div className="meta-item">
                <span className="label">Award Amount</span>
                <span className="value">
                  ${grant.prizeAmount.toLocaleString()}
                </span>
              </div>
              <div className="meta-item">
                <span className="label">Deadline</span>
                <span className="value">
                  {formatDateTimeShort(grant.applicationDeadline)}
                </span>
              </div>
              <div className="meta-item">
                <span className="label">Applicants</span>
                <span className="value">{grant.applicantCount} applied</span>
              </div>
            </div>

            <div className="eligibility-section">
              <span className="section-title">Eligibility Criteria</span>
              <div className="criteria-chips">
                {grant.eligibilityCriteria.map((chip) => (
                  <span key={chip} className="chip">
                    {chip}
                  </span>
                ))}
              </div>
            </div>
          </Link>
        </div>
      ))}

      {!isAdmin && (
        <button
          type="button"
          className="grant-card add-new-placeholder"
          onClick={() => navigate('/grants/create')}
          aria-label="Add new grant"
        >
          <div className="plus-icon-box">
            <Plus size={32} />
          </div>
          <h3>Add New Grant</h3>
          <p>Create a new Grant program</p>
        </button>
      )}
    </div>
  );

  const renderListView = () => (
    <div className="grants-list">
      <div className="list-header">
        <div className="col-name">Grant Name</div>
        <div className="col-status">Status</div>
        <div className="col-amount">Amount</div>
        <div className="col-deadline">Deadline</div>
        <div className="col-applicants">Applicants</div>
      </div>
      <div className="list-body">
        {grants.map((grant) => (
          <div
            key={grant.id}
            className="grant-list-item"
            role="button"
            tabIndex={0}
            onClick={() => navigate(`/grants/${grant.id}`)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                navigate(`/grants/${grant.id}`);
              }
            }}
          >
            <div className="col-name">
              <h3 className="grant-title">{grant.name}</h3>
              <p className="grant-desc">{grant.description}</p>
            </div>
            <div className="col-status">
              <span className={`status-badge ${getStatusClass(grant.status)}`}>
                {getStatusLabel(grant.status)}
              </span>
              {grant.isWinnerDecided && (
                <span className="status-badge awarded">Awarded</span>
              )}
            </div>
            <div className="col-amount">
              ${grant.prizeAmount.toLocaleString()}
            </div>
            <div className="col-deadline">
              {formatDateTimeShort(grant.applicationDeadline)}
            </div>
            <div className="col-applicants">{grant.applicantCount} applied</div>
          </div>
        ))}
        {!isAdmin && (
          <button
            type="button"
            className="add-inline-btn"
            onClick={() => navigate('/grants/create')}
          >
            <Plus size={18} />
            <span>Create New Grant</span>
          </button>
        )}
      </div>
    </div>
  );

  const renderMainContent = () => {
    if (isError) {
      return (
        <div className="error-state">
          <h3>Failed to load grants</h3>
          <p>
            There was an error connecting to the server. Please check your
            connection and try again.
          </p>
          <button type="button" className="btn-retry" onClick={() => refetch()}>
            Retry Connection
          </button>
        </div>
      );
    }

    if (isGridLoading) {
      return viewMode === 'grid' ? (
        <GrantGridSkeleton />
      ) : (
        <GrantListSkeleton />
      );
    }

    return viewMode === 'grid' ? renderGridView() : renderListView();
  };

  return (
    <div className="grant-management-page">
      {!isAdmin && (
        <HeaderActions>
          <button
            type="button"
            className="header-btn btn-primary"
            onClick={() => navigate('/grants/create')}
          >
            <Plus size={18} />
            <span>Add New Grant</span>
          </button>
        </HeaderActions>
      )}

      <div className="kpi-grid">
        {isSummaryLoading
          ? [1, 2, 3, 4].map((idVal) => (
              <KpiSkeleton key={`skeleton-${idVal}`} />
            ))
          : kpis.map((kpi) => (
              <KpiCard
                key={kpi.label}
                label={kpi.label}
                value={kpi.value}
                trend={kpi.trend}
                trendType={kpi.trendType}
                color={kpi.color}
                icon={kpi.icon}
                period="Snapshot"
              />
            ))}
      </div>

      <div className="view-controls">
        <div className="search-bar">
          <Search size={18} />
          <input
            type="text"
            placeholder="Search grants..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="filters">
          <select
            className="filter-select"
            value={statusFilter || ''}
            onChange={(e) =>
              setStatusFilter(
                e.target.value ? Number(e.target.value) : undefined
              )
            }
          >
            <option value="">All Status</option>
            <option value="1">Draft</option>
            <option value="2">Upcoming</option>
            <option value="3">Active</option>
            <option value="4">Completed</option>
            <option value="5">Closed</option>
          </select>
          <button type="button" className="sort-btn">
            <ArrowUpDown size={16} />
            <span>Sort</span>
          </button>
          <div className="view-toggle">
            <button
              type="button"
              className={`toggle-btn ${viewMode === 'grid' ? 'active' : ''}`}
              onClick={() => handleViewModeChange('grid')}
              title="Grid View"
            >
              <LayoutGrid size={18} />
            </button>
            <button
              type="button"
              className={`toggle-btn ${viewMode === 'list' ? 'active' : ''}`}
              onClick={() => handleViewModeChange('list')}
              title="List View"
            >
              <List size={18} />
            </button>
          </div>
        </div>
      </div>

      {renderMainContent()}

      <Modal
        isOpen={Boolean(deletingId)}
        onClose={() => setDeletingId(null)}
        title="Delete Grant"
        subtitle="Are you sure you want to delete this grant program? This action cannot be undone."
        width="450px"
        footer={
          <div className="modal-actions-footer">
            <button
              type="button"
              className="btn-cancel"
              onClick={() => setDeletingId(null)}
              disabled={isDeletingGrant}
            >
              Cancel
            </button>
            <button
              type="button"
              className="btn-confirm-delete"
              style={{
                backgroundColor: '#ef4444',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                padding: '10px 20px',
                fontWeight: 600,
              }}
              onClick={handleDeleteGrant}
              disabled={isDeletingGrant}
            >
              {isDeletingGrant ? 'Deleting...' : 'Delete Grant'}
            </button>
          </div>
        }
      >
        <div style={{ textAlign: 'center', padding: '24px 0' }}>
          <AlertTriangle
            size={48}
            color="#ef4444"
            style={{ marginBottom: '16px' }}
          />
          <p style={{ color: '#4b5563', fontSize: '15px' }}>
            Warning: This will permanently delete the grant program
            {deletingId && (
              <>
                {' '}
                <strong>{grants.find((g) => g.id === deletingId)?.name}</strong>
              </>
            )}{' '}
            and all associated applications.
          </p>
        </div>
      </Modal>
    </div>
  );
}

export default GrantList;
