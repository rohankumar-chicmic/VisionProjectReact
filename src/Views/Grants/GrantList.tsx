import { useEffect, useState, useMemo } from 'react';
import {
  Search,
  ArrowUpDown,
  Award,
  DollarSign,
  Calendar,
  Users,
  Plus,
  Edit3,
  Send,
  Trash2,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useHeader, HeaderActions } from '../../Shared/Context/HeaderContext';
import KpiCard from '../../Components/Shared/KpiCard';
import {
  useGetGrantsQuery,
  useGetGrantsSummaryQuery,
  useDeleteGrantMutation,
} from '../../Services/Api/module/GrantsApi';
import { KpiSkeleton } from '../Dashboard/Components/DashboardSkeletons';
import { GrantGridSkeleton } from './Components/GrantSkeletons';
import showToast from '../../Shared/Utils/toast';
import './GrantList.scss';

// Simple EyeOff fallback
function EyeOff({ size }: Readonly<{ size: number }>) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  );
}

function GrantList() {
  const { setTitle, setSubtitle, setBackAction, resetHeader } = useHeader();
  const navigate = useNavigate();

  // Search and Filter State
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<number | undefined>(
    undefined
  );
  const [page] = useState(1);

  const {
    data: grantsResponse,
    isLoading: isGridLoading,
    isError,
    refetch,
  } = useGetGrantsQuery({
    search: searchTerm || undefined,
    status: statusFilter,
    page,
    pageSize: 20,
  });

  const { data: summaryResponse, isLoading: isSummaryLoading } =
    useGetGrantsSummaryQuery();
  const [deleteGrant, { isLoading: isDeleting }] = useDeleteGrantMutation();

  const handleDeleteGrant = async (id: string) => {
    if (
      !globalThis.confirm('Are you sure you want to delete this grant?') ||
      isDeleting
    )
      return;

    try {
      await deleteGrant(id).unwrap();
      showToast.success('Grant deleted successfully');
    } catch (error) {
      showToast.error(
        error instanceof Error ? error.message : 'Failed to delete grant'
      );
    }
  };

  useEffect(() => {
    setTitle('Grant Management');
    setSubtitle('Create and manage grant programs');
    setBackAction(false);
    return () => resetHeader();
  }, [setTitle, setSubtitle, setBackAction, resetHeader]);

  // Status mapping helper
  const getStatusLabel = (status: number) => {
    switch (status) {
      case 1:
        return 'Active';
      case 2:
        return 'Closing Soon';
      case 3:
        return 'Closed';
      case 4:
        return 'Draft';
      case 5:
        return 'Archived';
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

  const renderCardActions = (grant: (typeof grants)[0]) => {
    if (grant.status === 3) {
      return (
        <>
          <button type="button" className="action-btn reopen">
            <Send size={16} />
            <span>Reopen</span>
          </button>
          <button
            type="button"
            className="action-btn delete"
            onClick={() => handleDeleteGrant(grant.id)}
            disabled={isDeleting}
          >
            <Trash2 size={16} />
            <span>Delete</span>
          </button>
        </>
      );
    }

    if (grant.status === 4) {
      return (
        <>
          <button
            type="button"
            className="action-btn edit"
            onClick={() => navigate(`/grants/edit/${grant.id}`)}
          >
            <Edit3 size={16} />
            <span>Edit</span>
          </button>
          <button
            type="button"
            className="action-btn delete"
            onClick={() => handleDeleteGrant(grant.id)}
            disabled={isDeleting}
          >
            <Trash2 size={16} />
            <span>Delete</span>
          </button>
          <button type="button" className="action-btn publish-main">
            <Send size={16} />
            <span>Publish</span>
          </button>
        </>
      );
    }

    return (
      <>
        <button
          type="button"
          className="action-btn edit"
          onClick={() => navigate(`/grants/edit/${grant.id}`)}
        >
          <Edit3 size={16} />
          <span>Edit</span>
        </button>
        <button type="button" className="action-btn unpublish">
          <EyeOff size={16} />
          <span>Unpublish</span>
        </button>
        <button
          type="button"
          className="action-btn delete"
          onClick={() => handleDeleteGrant(grant.id)}
          disabled={isDeleting}
        >
          <Trash2 size={16} />
          <span>Delete</span>
        </button>
      </>
    );
  };

  const renderMainContent = () => {
    if (isError) {
      return (
        <div className="error-state">
          <AlertCircle size={48} />
          <h3>Failed to load grants</h3>
          <p>There was an error connecting to the server.</p>
          <button type="button" className="btn-retry" onClick={() => refetch()}>
            Retry
          </button>
        </div>
      );
    }

    if (isGridLoading) {
      return <GrantGridSkeleton />;
    }

    return (
      <div className="grants-grid">
        {grants.map((grant) => (
          <div key={grant.id} className="grant-card">
            <div className="card-header">
              <h3 className="grant-title">{grant.name}</h3>
              <span className={`status-badge ${getStatusClass(grant.status)}`}>
                {getStatusLabel(grant.status)}
              </span>
            </div>
            <p className="grant-description">{grant.description}</p>

            <div className="grant-meta">
              <div className="meta-item">
                <DollarSign size={16} />
                <span className="label">Award Amount</span>
                <span className="value">
                  ${grant.prizeAmount.toLocaleString()}
                </span>
              </div>
              <div className="meta-item">
                <Calendar size={16} />
                <span className="label">Deadline</span>
                <span className="value">
                  {new Date(grant.applicationDeadline).toLocaleDateString()}
                </span>
              </div>
              <div className="meta-item">
                <Users size={16} />
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

            <div className="card-actions">{renderCardActions(grant)}</div>
          </div>
        ))}

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
      </div>
    );
  };

  return (
    <div className="grant-management-page">
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

      <div className="kpi-grid">
        {isSummaryLoading
          ? [1, 2, 3, 4].map((i) => <KpiSkeleton key={i} />)
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
            <option value="1">Active</option>
            <option value="2">Closing Soon</option>
            <option value="3">Closed</option>
            <option value="4">Draft</option>
            <option value="5">Archived</option>
          </select>
          <button type="button" className="sort-btn">
            <ArrowUpDown size={16} />
            <span>Sort</span>
          </button>
        </div>
      </div>

      {renderMainContent()}
    </div>
  );
}

export default GrantList;
