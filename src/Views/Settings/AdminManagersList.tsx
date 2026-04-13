/* eslint-disable no-alert */
import { useEffect, useState, useMemo } from 'react';
import {
  Search,
  Edit2,
  Trash2,
  Shield,
  Users,
  ShieldCheck,
  UserPlus,
  AlertCircle,
} from 'lucide-react';
import {
  useGetAdminManagersQuery,
  useDeleteAdminManagerMutation,
} from '../../Services/Api/module/Admin/User';
import { HeaderActions, useHeader } from '../../Shared/Context/HeaderContext';
import AdminManagerModal from './Components/AdminManagerModal';
import { AdminManagersTableSkeleton } from './Components/AdminManagersSkeleton';
import './AdminManagersList.scss';

function AdminManagersList() {
  const { setTitle, setSubtitle, setBackAction, resetHeader } = useHeader();
  const [activeTab, setActiveTab] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [pageNumber, setPageNumber] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAdminId, setSelectedAdminId] = useState<string | undefined>(
    undefined
  );

  const [deleteAdmin, { isLoading: isDeleting }] =
    useDeleteAdminManagerMutation();

  const roleFilter = useMemo(() => {
    if (activeTab === 'Super Admin') return 1;
    if (activeTab === 'Sub Admin') return 2;
    return undefined;
  }, [activeTab]);

  const {
    data: adminResponse,
    isLoading,
    isError,
    refetch,
  } = useGetAdminManagersQuery({
    searchTerm: searchTerm || undefined,
    role: roleFilter,
    pageNumber,
    pageSize: 10,
  });

  useEffect(() => {
    setTitle('Admin Managers');
    setSubtitle('Manage admin accounts and permissions');
    setBackAction(false);
    return () => resetHeader();
  }, [setTitle, setSubtitle, setBackAction, resetHeader]);

  const admins = useMemo(
    () => adminResponse?.data?.items || [],
    [adminResponse]
  );
  const summary = adminResponse?.data?.summary;
  const superAdminCount = summary?.superAdminCount || 0;
  const subAdminCount = summary?.subAdminCount || 0;
  const totalCount = summary?.totalAdmins || 0;

  const getRoleLabel = (role: number) => {
    return role === 1 ? 'Super Admin' : 'Sub Admin';
  };

  const getInitials = (name?: string) => {
    if (!name) return '??';
    return name
      .split(' ')
      .filter(Boolean)
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  const getRelativeTime = (dateString?: string | null) => {
    if (!dateString) return 'Never';

    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return 'Just now';

    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60)
      return `${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`;

    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24)
      return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;

    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 30)
      return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;

    const diffInMonths = Math.floor(diffInDays / 30);
    if (diffInMonths < 12)
      return `${diffInMonths} month${diffInMonths > 1 ? 's' : ''} ago`;

    return date.toLocaleDateString();
  };

  const handleEdit = (id: string) => {
    setSelectedAdminId(id);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string, name: string) => {
    // eslint-disable-next-line no-alert
    if (
      globalThis.confirm(`Are you sure you want to delete admin "${name}"?`)
    ) {
      try {
        await deleteAdmin(id).unwrap();
      } catch {
        // Error handled by RTK Query Global middleware or local catch
      }
    }
  };

  const openCreateModal = () => {
    setSelectedAdminId(undefined);
    setIsModalOpen(true);
  };

  const renderRoleBadge = (role: number) => {
    const Icon = role === 1 ? Shield : Users;
    return (
      <div className={`role-badge ${role === 1 ? 'super' : 'sub'}`}>
        <Icon size={14} />
        <span>{getRoleLabel(role)}</span>
      </div>
    );
  };

  const renderTableContent = () => {
    if (isLoading) {
      return <AdminManagersTableSkeleton rows={8} />;
    }

    if (isError) {
      return (
        <div className="error-state">
          <AlertCircle size={40} />
          <p>Failed to load admins</p>
          <button type="button" className="retry-btn" onClick={() => refetch()}>
            Retry
          </button>
        </div>
      );
    }

    return (
      <table className="hi-fi-table">
        <thead>
          <tr>
            <th>Admin</th>
            <th>Email</th>
            <th>Role</th>
            <th>Created Date</th>
            <th>Last active</th>
            <th>Password</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {admins.map((admin) => (
            <tr key={admin.id}>
              <td>
                <div className="admin-cell">
                  <div
                    className="avatar"
                    style={{
                      backgroundColor: admin.avatarColor || '#94a3b8',
                    }}
                  >
                    {getInitials(admin.fullName)}
                  </div>
                  <div className="info">
                    <span className="name">{admin.fullName}</span>
                    <span className="id-text">ID: {admin.displayId}</span>
                  </div>
                </div>
              </td>
              <td>
                <span className="email-text">{admin.email}</span>
              </td>
              <td>{renderRoleBadge(admin.role)}</td>
              <td>{new Date(admin.createdAt).toLocaleDateString()}</td>
              <td>{getRelativeTime(admin.lastActiveAt)}</td>
              <td>
                <span className="password-mask">{admin.passwordMasked}</span>
              </td>
              <td>
                <div className="action-buttons">
                  <button
                    type="button"
                    className="btn-icon edit"
                    onClick={() => handleEdit(admin.id)}
                    title="Edit Admin"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button
                    type="button"
                    className="btn-icon delete"
                    onClick={() => handleDelete(admin.id, admin.fullName)}
                    disabled={isDeleting}
                    title="Delete Admin"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  return (
    <div className="admin-managers-page">
      <AdminManagerModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={() => setIsModalOpen(false)}
        adminId={selectedAdminId}
      />

      <HeaderActions>
        <button
          type="button"
          className="header-btn btn-primary"
          onClick={openCreateModal}
        >
          <UserPlus size={16} />
          <span>Add New Admin</span>
        </button>
      </HeaderActions>

      <div className="kpi-cards-grid">
        <div className="kpi-card">
          <div className="icon-wrap super">
            <Shield size={24} />
          </div>
          <div className="stats-wrap">
            <span className="label">Super Admin</span>
            <span className="value">
              {superAdminCount.toString().padStart(2, '0')}
            </span>
          </div>
        </div>

        <div className="kpi-card">
          <div className="icon-wrap sub">
            <Users size={24} />
          </div>
          <div className="stats-wrap">
            <span className="label">Sub Admins</span>
            <span className="value">
              {subAdminCount.toString().padStart(2, '0')}
            </span>
          </div>
        </div>

        <div className="kpi-card">
          <div className="icon-wrap total">
            <ShieldCheck size={24} />
          </div>
          <div className="stats-wrap">
            <span className="label">Total Admins</span>
            <span className="value">
              {totalCount.toString().padStart(2, '0')}
            </span>
          </div>
        </div>
      </div>

      <div className="admin-table-card">
        <div className="table-header-controls">
          <div className="search-bar">
            <Search size={18} />
            <input
              type="text"
              placeholder="Search admins..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="status-tabs">
            {['All', 'Super Admin', 'Sub Admin'].map((tab) => (
              <button
                key={tab}
                type="button"
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

        <div className="table-wrapper">{renderTableContent()}</div>
      </div>
    </div>
  );
}

export default AdminManagersList;
