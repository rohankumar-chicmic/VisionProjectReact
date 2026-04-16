/* eslint-disable react/jsx-props-no-spreading, react/no-unstable-nested-components */
import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  // Upload,
  Download,
  Plus,
  Eye,
  Slash,
  ChevronLeft,
  ChevronRight,
  Info,
  Loader2,
} from 'lucide-react';
import showToast from '../../Shared/Utils/toast';
import { getAssetUrl } from '../../Shared/Utils/url';
import { useHeader, HeaderActions } from '../../Shared/Context/HeaderContext';
import KpiCard from '../../Components/Shared/KpiCard';
import Table, { Column } from '../../Components/Atom/Table/Table';
import ImportUserModal from './Components/ImportUserModal';
import CreateUserModal from './Components/CreateUserModal';
import BlockUserModal from './Components/BlockUserModal';
import {
  useGetAdminUserDashboardQuery,
  useGetAdminUsersQuery,
  AdminUser,
  useLazyExportAdminUsersQuery,
} from '../../Services/Api/module/Admin/User';
import './UserList.scss';
import Skeleton from '../../Components/Shared/Skeleton';

const getSubscriptionLabel = (plan: number, status: number) => {
  if (status === 3) return 'Trial';
  if (status === 4) return 'Trial expired';
  if (plan === 1) return 'Monthly';
  if (plan === 2) return 'Yearly';
  return 'Member';
};

const getStatusLabel = (isBlocked: boolean) =>
  isBlocked ? 'Blocked' : 'Active';

function UserCell({ user }: Readonly<{ user: AdminUser }>) {
  return (
    <div className="user-info-cell">
      <div className="avatar-small">
        {user.avatarUrl ? (
          <img src={getAssetUrl(user.avatarUrl)} alt={user.fullName} />
        ) : (
          user.fullName.charAt(0)
        )}
      </div>
      <div className="text-info">
        <span className="name">{user.fullName}</span>
        <span className="id">ID: {user.displayId}</span>
      </div>
    </div>
  );
}

function SubscriptionCell({ user }: Readonly<{ user: AdminUser }>) {
  const label = getSubscriptionLabel(
    user.subscriptionPlan,
    user.subscriptionStatus
  );
  return (
    <span className={`sub-badge ${label.toLowerCase().replace(' ', '-')}`}>
      {label}
    </span>
  );
}

function StatusCell({ user }: Readonly<{ user: AdminUser }>) {
  const label = getStatusLabel(user.isBlocked);
  return <span className={`status-pill ${label.toLowerCase()}`}>{label}</span>;
}

function ActionsCell({
  user,
  navigate,
  setSelectedUser,
  setIsBlockModalOpen,
}: Readonly<{
  user: AdminUser;
  navigate: ReturnType<typeof useNavigate>;
  setSelectedUser: (user: AdminUser) => void;
  setIsBlockModalOpen: (open: boolean) => void;
}>) {
  return (
    <div className="table-actions">
      <button
        type="button"
        className="icon-action-btn"
        onClick={(e) => {
          e.stopPropagation();
          navigate(`/users/${user.id}`);
        }}
      >
        <Eye size={18} />
      </button>

      <button
        type="button"
        className={`block-action-btn ${user.isBlocked ? 'unblock' : ''}`}
        onClick={(e) => {
          e.stopPropagation();
          setSelectedUser(user);
          setIsBlockModalOpen(true);
        }}
      >
        <Slash size={18} />
        <span>{user.isBlocked ? 'Unblock' : 'Block'}</span>
      </button>
    </div>
  );
}

function UserList() {
  const { setTitle, setSubtitle, setBackAction, resetHeader } = useHeader();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [pageNumber, setPageNumber] = useState(1);
  const pageSize = 10;

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isBlockModalOpen, setIsBlockModalOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setPageNumber(1);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const { data: dashboardData, isLoading: isDashboardLoading } =
    useGetAdminUserDashboardQuery();

  const [triggerExport, { isFetching: isExporting }] =
    useLazyExportAdminUsersQuery();

  const getParams = (): Record<
    string,
    string | number | boolean | undefined
  > => {
    const params: Record<string, string | number | boolean | undefined> = {
      pageNumber,
      pageSize,
      searchTerm: debouncedSearch || undefined,
    };

    switch (activeTab) {
      case 'Active':
        params.isBlocked = false;
        break;
      case 'Blocked':
        params.isBlocked = true;
        break;
      case 'Passport':
        params.subscriptionPlan = 1;
        break;
      case 'Member':
        params.subscriptionPlan = 0;
        break;
      case 'Trial':
        params.subscriptionStatus = 3;
        break;
      case 'Trial Expired':
        params.subscriptionStatus = 4;
        break;
      default:
        break;
    }

    return params;
  };

  const { data: usersData, isLoading: isUsersLoading } =
    useGetAdminUsersQuery(getParams());

  useEffect(() => {
    setTitle('Users Management');
    setSubtitle('Manage, filter, and monitor platform users');
    setBackAction(false);
    return () => resetHeader();
  }, [setTitle, setSubtitle, setBackAction, resetHeader]);

  const handleExportUsers = async () => {
    try {
      // Get all filters but ignore pagination for export
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const {
        pageNumber: unusedPage,
        pageSize: unusedSize,
        ...filters
      } = getParams();

      const blob = await triggerExport(filters).unwrap();
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `users_export_${Date.now()}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
      showToast.success('Users exported successfully');
    } catch (error) {
      showToast.error('Failed to export users');
    }
  };

  const kpis = [
    {
      id: 'total-users',
      icon: <Plus size={22} />,
      label: 'Total Users',
      value: dashboardData?.data?.totalUsers?.toLocaleString() || '0',
      trend: '+12.5% from last month',
      trendType: 'up' as const,
      color: '#1DB954',
    },
    {
      id: 'active-subs',
      icon: <Plus size={22} />,
      label: 'Active Subscriptions',
      value: dashboardData?.data?.activeSubscriptions?.toLocaleString() || '0',
      trend: '+8.2% from last month',
      trendType: 'up' as const,
      color: '#3B82F6',
    },
    {
      id: 'members-no-passport',
      icon: <Plus size={22} />,
      label: 'Members (No Passport)',
      value:
        dashboardData?.data?.membersWithoutPassport?.toLocaleString() || '0',
      trend: '+5.1% from last month',
      trendType: 'up' as const,
      color: '#6366F1',
    },
    {
      id: 'blocked-users',
      icon: <Slash size={22} />,
      label: 'Blocked Users',
      value: dashboardData?.data?.blockedUsers?.toLocaleString() || '0',
      trend: '-5.3% from last month',
      trendType: 'down' as const,
      color: '#EF4444',
    },
  ];

  const columns: Column<AdminUser>[] = useMemo(
    () => [
      {
        header: 'User',
        accessor: (user) => <UserCell user={user} />,
      },
      { header: 'Email', accessor: 'email' },
      {
        header: (
          <div className="header-with-icon">
            <span>Subscription</span>
            <Info size={14} className="info-icon" />
          </div>
        ),
        accessor: (user) => <SubscriptionCell user={user} />,
      },
      {
        header: 'Joined Date',
        accessor: (user) =>
          new Date(user.createdAt).toLocaleDateString('en-US', {
            month: 'short',
            day: '2-digit',
            year: 'numeric',
          }),
      },
      {
        header: 'Status',
        accessor: (user) => <StatusCell user={user} />,
      },
      {
        header: 'Actions',
        accessor: (user) => (
          <ActionsCell
            user={user}
            navigate={navigate}
            setSelectedUser={setSelectedUser}
            setIsBlockModalOpen={setIsBlockModalOpen}
          />
        ),
      },
    ],
    [navigate]
  );

  return (
    <div className="user-list-page">
      <HeaderActions>
        {/* <button
          type="button"
          className="header-btn btn-outline"
          onClick={() => setIsImportModalOpen(true)}
        >
          <Upload size={18} />
          <span>Import Users</span>
        </button> */}
        <button
          type="button"
          className="header-btn btn-outline"
          onClick={handleExportUsers}
          disabled={isExporting}
        >
          {isExporting ? (
            <Loader2 size={18} className="animate-spin" />
          ) : (
            <Download size={18} />
          )}
          <span>{isExporting ? 'Exporting...' : 'Export Users'}</span>
        </button>
        {/* <button
          type="button"
          className="header-btn btn-primary"
          onClick={() => setIsCreateModalOpen(true)}
        >
          <Plus size={18} />
          <span>Create New User</span>
        </button> */}
      </HeaderActions>

      <div className="kpi-grid">
        {isDashboardLoading ? (
          <>
            <Skeleton height={140} />
            <Skeleton height={140} />
            <Skeleton height={140} />
            <Skeleton height={140} />
          </>
        ) : (
          kpis.map((kpi) => (
            <KpiCard
              key={kpi.id}
              icon={kpi.icon}
              label={kpi.label}
              value={kpi.value}
              trend={kpi.trend}
              trendType={kpi.trendType}
              color={kpi.color}
            />
          ))
        )}
      </div>

      <div className="legend-and-filters">
        <div className="subscription-legend">
          <span className="legend-label">Subscription Types:</span>
          <div className="legend-item monthly">
            Monthly<span>= Passport (Premium)</span>
          </div>
          <div className="legend-item yearly">
            Yearly<span>= Passport (Premium)</span>
          </div>
          <div className="legend-item member">
            Member<span>= Regular paying user</span>
          </div>
          <div className="legend-item trial">
            Trial<span>= Free trial</span>
          </div>
        </div>

        <div className="table-controls">
          <div className="search-bar-inline">
            <Search size={18} />
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="filter-tabs">
            {[
              'All',
              'Active',
              'Passport',
              'Member',
              'Blocked',
              'Trial',
              'Trial Expired',
            ].map((tab) => (
              <button
                type="button"
                key={tab}
                className={`tab-btn ${activeTab === tab ? 'active' : ''}`}
                onClick={() => {
                  setActiveTab(tab);
                  setPageNumber(1);
                }}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="table-container-styled">
        <Table
          columns={columns}
          data={usersData?.data?.items || []}
          onRowClick={(user) => navigate(`/users/${user.id}`)}
          isLoading={isUsersLoading}
        />

        <div className="table-pagination">
          <span className="pagination-info">
            Showing{' '}
            {((usersData?.data?.pageNumber || 1) - 1) * pageSize +
              (usersData?.data?.items?.length ? 1 : 0)}
            -
            {((usersData?.data?.pageNumber || 1) - 1) * pageSize +
              (usersData?.data?.items?.length || 0)}{' '}
            of {usersData?.data?.totalCount || 0} users
          </span>
          <div className="pagination-controls">
            <button
              type="button"
              className="page-nav"
              onClick={() => setPageNumber((p) => Math.max(1, p - 1))}
              disabled={!usersData?.data?.hasPreviousPage}
            >
              <ChevronLeft size={16} />
            </button>
            {Array.from(
              { length: usersData?.data?.totalPages || 0 },
              (_, i) => i + 1
            )
              .filter((p) => {
                const current = usersData?.data?.pageNumber || 1;
                const total = usersData?.data?.totalPages || 0;
                return p === 1 || p === total || Math.abs(p - current) <= 1;
              })
              .map((p, i, arr) => (
                <div key={p} style={{ display: 'flex', alignItems: 'center' }}>
                  {i > 0 && arr[i - 1] !== p - 1 && (
                    <span className="dots">...</span>
                  )}
                  <button
                    type="button"
                    className={`page-num ${
                      (usersData?.data?.pageNumber || 1) === p ? 'active' : ''
                    }`}
                    onClick={() => setPageNumber(p)}
                  >
                    {p}
                  </button>
                </div>
              ))}
            <button
              type="button"
              className="page-nav"
              onClick={() => setPageNumber((p) => p + 1)}
              disabled={!usersData?.data?.hasNextPage}
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>

      <CreateUserModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />

      <BlockUserModal
        isOpen={isBlockModalOpen}
        onClose={() => setIsBlockModalOpen(false)}
        userId={selectedUser?.id || ''}
        userName={selectedUser?.fullName || ''}
        isBlocked={selectedUser?.isBlocked || false}
      />
      <ImportUserModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
      />
    </div>
  );
}

export default UserList;
