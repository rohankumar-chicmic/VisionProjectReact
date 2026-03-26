import React, { useEffect, useState } from 'react';
import { HeaderActions, useHeader } from '../../Shared/Context/HeaderContext';
import { Search, Edit2, Trash2, Shield, Users, ShieldCheck, UserPlus } from 'lucide-react';
import CreateAdminModal from './Components/CreateAdminModal';
import './AdminManagersList.scss';

interface AdminUser {
  id: string;
  name: string;
  initials: string;
  email: string;
  role: 'Super Admin' | 'Sub Admin';
  createdDate: string;
  lastActive: string;
  passwordPrefix: string;
  avatarColor: string;
}

const AdminManagersList: React.FC = () => {
  const { setTitle, setSubtitle, setBackAction, resetHeader } = useHeader();
  const [activeTab, setActiveTab] = useState('All');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  useEffect(() => {
    setTitle('Admin Managers');
    setSubtitle('Manage admin accounts and permissions');
    setBackAction(false);
    return () => resetHeader();
  }, [setTitle, setSubtitle, setBackAction, resetHeader]);

  const admins: AdminUser[] = [
    { id: 'ADM-001', name: 'John Doe', initials: 'JD', email: 'john.doe@example.com', role: 'Super Admin', createdDate: 'Jan 15, 2024', lastActive: '5 hrs ago', passwordPrefix: 'F7OUbCj1d', avatarColor: '#00ce86' },
    { id: 'ADM-002', name: 'Sarah Miller', initials: 'SM', email: 'sarah.m@example.com', role: 'Sub Admin', createdDate: 'Feb 03, 2024', lastActive: '30 min ago', passwordPrefix: '3mGQ37b', avatarColor: '#f59e0b' },
    { id: 'ADM-003', name: 'Robert Johnson', initials: 'RJ', email: 'r.johnson@example.com', role: 'Sub Admin', createdDate: 'Mar 10, 2024', lastActive: '23 hrs ago', passwordPrefix: 'yRzjaHTjxlE4', avatarColor: '#475569' },
    { id: 'ADM-004', name: 'Jane Cooper', initials: 'JC', email: 'sarah.m@example.com', role: 'Super Admin', createdDate: 'Feb 03, 2024', lastActive: '1 day ago', passwordPrefix: 'y4nyu0', avatarColor: '#64748b' },
    { id: 'ADM-005', name: 'Bessie Cooper', initials: 'BC', email: 'r.johnson@example.com', role: 'Sub Admin', createdDate: 'Mar 10, 2024', lastActive: '1 week ago', passwordPrefix: 'pJPHHEsz', avatarColor: '#3b82f6' },
    { id: 'ADM-006', name: 'Guy Hawkins', initials: 'GH', email: 'r.johnson@example.com', role: 'Sub Admin', createdDate: 'Mar 10, 2024', lastActive: '1 month ago', passwordPrefix: 'o7LoDM', avatarColor: '#94a3b8' },
  ];

  return (
    <div className="admin-managers-page">
      <CreateAdminModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onConfirm={() => setIsCreateModalOpen(false)}
      />

      <HeaderActions>
        <button className="header-btn btn-primary" onClick={() => setIsCreateModalOpen(true)}>
          <UserPlus size={16} />
          <span>Add New Admin</span>
        </button>
      </HeaderActions>

      <div className="kpi-cards-grid">
        <div className="kpi-card">
          <div className="icon-wrap super">
            <Shield size={24} />
            <span className="badge">Super</span>
          </div>
          <div className="stats-wrap">
            <span className="label">Super Admin</span>
            <span className="value">03</span>
          </div>
        </div>

        <div className="kpi-card">
          <div className="icon-wrap sub">
            <Users size={24} />
            <span className="badge trend green">▲ +2</span>
          </div>
          <div className="stats-wrap">
            <span className="label">Sub Admins</span>
            <span className="value">04</span>
          </div>
        </div>

        <div className="kpi-card">
          <div className="icon-wrap total">
            <ShieldCheck size={24} />
          </div>
          <div className="stats-wrap">
            <span className="label">Total Admins</span>
            <span className="value">07</span>
          </div>
        </div>
      </div>

      <div className="admin-table-card">
        <div className="table-header-controls">
          <div className="search-bar">
            <Search size={18} />
            <input type="text" placeholder="Search admins..." />
          </div>
          <div className="status-tabs">
            {['All', 'Super Admin', 'Sub Admin'].map(tab => (
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

        <div className="table-wrapper">
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
                      <div className="avatar" style={{ backgroundColor: admin.avatarColor }}>
                        {admin.initials}
                      </div>
                      <div className="info">
                        <span className="name">{admin.name}</span>
                        <span className="id-text">ID: {admin.id}</span>
                      </div>
                    </div>
                  </td>
                  <td><span className="email-text">{admin.email}</span></td>
                  <td>
                    <div className={`role-badge ${admin.role === 'Super Admin' ? 'super' : 'sub'}`}>
                      {admin.role === 'Super Admin' ? <Shield size={14} /> : <Users size={14} />}
                      <span>{admin.role}</span>
                    </div>
                  </td>
                  <td>{admin.createdDate}</td>
                  <td>{admin.lastActive}</td>
                  <td>
                    <span className="password-mask">{admin.passwordPrefix}</span>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button className="btn-icon edit">
                        <Edit2 size={16} />
                      </button>
                      <button className="btn-icon delete">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminManagersList;
