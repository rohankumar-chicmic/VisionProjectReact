import {
  Search,
  Filter,
  ArrowUpDown,
  MoreVertical,
  ShieldCheck,
} from 'lucide-react';
import Table, { Column } from '../../Components/Atom/Table/Table';
import './AdminManagement.scss';

interface Admin {
  id: number;
  name: string;
  email: string;
  role: string;
  status: string;
  lastActive: string;
}

const columns: Column<Admin>[] = [
  {
    header: 'Admin',
    accessor: (admin) => (
      <div className="admin-profile-cell">
        <div className="admin-avatar">{admin.name.charAt(0)}</div>
        <div className="admin-info">
          <span className="admin-name">{admin.name}</span>
          <span className="admin-email">{admin.email}</span>
        </div>
      </div>
    ),
  },
  {
    header: 'Role',
    accessor: (admin) => (
      <div className="role-cell">
        <ShieldCheck
          size={16}
          className={admin.role.replace(' ', '-').toLowerCase()}
        />
        <span>{admin.role}</span>
      </div>
    ),
  },
  {
    header: 'Last Active',
    accessor: 'lastActive',
  },
  {
    header: 'Status',
    accessor: (admin) => (
      <span className={`status-badge ${admin.status.toLowerCase()}`}>
        {admin.status}
      </span>
    ),
  },
  {
    header: 'Actions',
    accessor: () => (
      <button type="button" className="action-btn">
        <MoreVertical size={18} />
      </button>
    ),
    width: '80px',
  },
];

function AdminManagement() {
  const admins: Admin[] = [
    {
      id: 1,
      name: 'Eleanor Pena',
      email: 'eleanor@visionpme.com',
      role: 'Super Admin',
      status: 'Active',
      lastActive: '2 mins ago',
    },
    {
      id: 2,
      name: 'Brooklyn Simmons',
      email: 'brooklyn@visionpme.com',
      role: 'Editor',
      status: 'Active',
      lastActive: '1 hour ago',
    },
    {
      id: 3,
      name: 'Guy Hawkins',
      email: 'guy@visionpme.com',
      role: 'Viewer',
      status: 'Inactive',
      lastActive: '2 days ago',
    },
  ];

  return (
    <div className="admin-management-view">
      <div className="view-header">
        <div className="header-actions">
          <div className="search-box">
            <Search size={18} />
            <input type="text" placeholder="Search admins..." />
          </div>
          <div className="filter-group">
            <div className="filter-select">
              <span>All Roles</span>
              <Filter size={16} />
            </div>
            <div className="filter-select sort">
              <ArrowUpDown size={16} />
              <span>Sort</span>
            </div>
          </div>
        </div>
        <button type="button" className="create-btn">
          + Create New Admin
        </button>
      </div>

      <div className="table-section">
        <Table columns={columns} data={admins} />
      </div>
    </div>
  );
}

export default AdminManagement;
