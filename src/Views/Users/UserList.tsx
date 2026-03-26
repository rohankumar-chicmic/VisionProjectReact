import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, 
  Upload, 
  Download, 
  Plus, 
  Eye, 
  Slash,
  ChevronLeft,
  ChevronRight,
  Info
} from 'lucide-react';
import { useHeader, HeaderActions } from '../../Shared/Context/HeaderContext';
import KpiCard, { KpiCardProps } from '../../Components/Shared/KpiCard';
import Table, { Column } from '../../Components/Atom/Table/Table';
import ImportUserModal from './Components/ImportUserModal';
import CreateUserModal from './Components/CreateUserModal';
import BlockUserModal from './Components/BlockUserModal';
import './UserList.scss';

interface User {
  id: string;
  name: string;
  avatar: string;
  email: string;
  subscription: 'Monthly' | 'Yearly' | 'Member' | 'Trial' | 'Trial expired';
  joinedDate: string;
  status: 'Active' | 'Blocked';
}

const UserList: React.FC = () => {
  const { setTitle, setSubtitle } = useHeader();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('All');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isBlockModalOpen, setIsBlockModalOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  useEffect(() => {
    setTitle('User Management');
    setSubtitle('View and manage all registered users');
  }, [setTitle, setSubtitle]);

  const kpis: KpiCardProps[] = [
    { icon: <Plus size={22} />, label: 'Total Users', value: '12,543', trend: '+12.5% from last month', trendType: 'up', color: '#1DB954' },
    { icon: <Plus size={22} />, label: 'Active Subscriptions', value: '8,234', trend: '+8.2% from last month', trendType: 'up', color: '#3B82F6' },
    { icon: <Plus size={22} />, label: 'Members (No Passport)', value: '3,108', trend: '+5.1% from last month', trendType: 'up', color: '#6366F1' },
    { icon: <Slash size={22} />, label: 'Blocked Users', value: '18', trend: '-5.3% from last month', trendType: 'down', color: '#EF4444' },
  ];

  const users: User[] = [
    { id: 'USR-10234', name: 'John Doe', avatar: '', email: 'john.doe@example.com', subscription: 'Yearly', joinedDate: 'Jan 15, 2024', status: 'Active' },
    { id: 'USR-10235', name: 'Sarah Miller', avatar: '', email: 'sarah.m@example.com', subscription: 'Monthly', joinedDate: 'Feb 03, 2024', status: 'Active' },
    { id: 'USR-10236', name: 'Robert Johnson', avatar: '', email: 'r.johnson@example.com', subscription: 'Trial', joinedDate: 'Mar 10, 2024', status: 'Active' },
    { id: 'USR-10235', name: 'Jane Cooper', avatar: '', email: 'sarah.m@example.com', subscription: 'Member', joinedDate: 'Feb 03, 2024', status: 'Blocked' },
    { id: 'USR-10236', name: 'Bessie Cooper', avatar: '', email: 'r.johnson@example.com', subscription: 'Trial expired', joinedDate: 'Mar 10, 2024', status: 'Blocked' },
    { id: 'USR-10236', name: 'Guy Hawkins', avatar: '', email: 'r.johnson@example.com', subscription: 'Trial', joinedDate: 'Mar 10, 2024', status: 'Active' },
  ];

  const columns: Column<User>[] = [
    {
      header: 'User',
      accessor: (user) => (
        <div className="user-info-cell">
          <div className="avatar-small">{user.name.charAt(0)}</div>
          <div className="text-info">
            <span className="name">{user.name}</span>
            <span className="id">ID: {user.id}</span>
          </div>
        </div>
      )
    },
    { header: 'Email', accessor: 'email' },
    {
      header: (
        <div className="header-with-icon">
          <span>Subscription</span>
          <Info size={14} className="info-icon" />
        </div>
      ),
      accessor: (user) => (
        <span className={`sub-badge ${user.subscription.toLowerCase().replace(' ', '-')}`}>
          {user.subscription}
        </span>
      )
    },
    { header: 'Joined Date', accessor: 'joinedDate' },
    {
      header: 'Status',
      accessor: (user) => (
        <span className={`status-pill ${user.status.toLowerCase()}`}>
          {user.status}
        </span>
      )
    },
    {
      header: 'Actions',
      accessor: (user) => (
        <div className="table-actions">
          <button 
            className="icon-action-btn"
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/users/${user.id}`);
            }}
          >
            <Eye size={18} />
          </button>
          <button 
            className={`block-action-btn ${user.status === 'Blocked' ? 'unblock' : ''}`}
            onClick={(e) => {
              e.stopPropagation();
              setSelectedUser(user);
              setIsBlockModalOpen(true);
            }}
          >
            <Slash size={18} />
            <span>{user.status === 'Blocked' ? 'Unblock' : 'Block'}</span>
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="user-list-page">
      <HeaderActions>
        <button 
          className="header-btn btn-outline"
          onClick={() => setIsImportModalOpen(true)}
        >
          <Upload size={18} />
          <span>Import Users</span>
        </button>
        <button className="header-btn btn-outline">
          <Download size={18} />
          <span>Export Users</span>
        </button>
        <button 
          className="header-btn btn-primary"
          onClick={() => setIsCreateModalOpen(true)}
        >
          <Plus size={18} />
          <span>Create New User</span>
        </button>
      </HeaderActions>

      <div className="kpi-grid">
        {kpis.map((kpi, idx) => (
          <KpiCard key={idx} {...kpi} />
        ))}
      </div>

      <div className="legend-and-filters">
        <div className="subscription-legend">
          <span className="legend-label">Subscription Types:</span>
          <div className="legend-item monthly">Monthly<span>= Passport (Premium)</span></div>
          <div className="legend-item yearly">Yearly<span>= Passport (Premium)</span></div>
          <div className="legend-item member">Member<span>= Regular paying user</span></div>
          <div className="legend-item trial">Trial<span>= Free trial</span></div>
        </div>

        <div className="table-controls">
          <div className="search-bar-inline">
            <Search size={18} />
            <input type="text" placeholder="Search users..." />
          </div>
          <div className="filter-tabs">
            {['All', 'Active', 'Passport', 'Member', 'Blocked', 'Trial', 'Trial Expired'].map(tab => (
              <button 
                key={tab} 
                className={`tab-btn ${activeTab === tab ? 'active' : ''}`}
                onClick={() => setActiveTab(tab)}
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
          data={users} 
          onRowClick={(user) => navigate(`/users/${user.id}`)}
        />
        
        <div className="table-pagination">
          <span className="pagination-info">Showing 1-7 of 12,543 users</span>
          <div className="pagination-controls">
            <button className="page-nav"><ChevronLeft size={16} /></button>
            <button className="page-num active">1</button>
            <button className="page-num">2</button>
            <button className="page-num">3</button>
            <span className="dots">...</span>
            <button className="page-num">125</button>
            <button className="page-nav"><ChevronRight size={16} /></button>
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
        userName={selectedUser?.name || ''}
      />
      <ImportUserModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
      />
    </div>
  );
};

export default UserList;
