import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Calendar,
  Award,
  FileText,
  Megaphone,
  ShieldCheck,
  Bell,
} from 'lucide-react';
import './Sidebar.scss';

import logo from '../../assets/logo.png';

function Sidebar() {
  const menuItems = [
    {
      icon: <LayoutDashboard size={20} />,
      label: 'Dashboard',
      path: '/dashboard',
    },
    { icon: <Users size={20} />, label: 'Users Management', path: '/users' },
    { icon: <Calendar size={20} />, label: 'Galas Management', path: '/galas' },
    { icon: <Award size={20} />, label: 'Grants', path: '/grants' },
    {
      icon: <FileText size={20} />,
      label: 'Applications',
      path: '/applications',
    },
    {
      icon: <Megaphone size={20} />,
      label: 'Announcements',
      path: '/announcements',
    },
    {
      icon: <ShieldCheck size={20} />,
      label: 'Admin Managers',
      path: '/admins',
    },
    {
      icon: <Bell size={20} />,
      label: 'Notifications',
      path: '/notifications',
    },
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <div className="logo-icon">
          <img src={logo} alt="" />
        </div>
        <span className="logo-text">Vision PME Admin</span>
      </div>

      <nav className="sidebar-nav">
        {menuItems.map((item, index) => (
          <NavLink
            key={index}
            to={item.path}
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
          >
            <span className="nav-icon">{item.icon}</span>
            <span className="nav-label">{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-footer">
        <div className="user-profile">
          <div className="avatar">A</div>
          <div className="user-info">
            <span className="user-name">Admin User</span>
            <span className="user-email">admin@gala.com</span>
          </div>
        </div>
        {/* <button type="button" className="logout-btn"></button> */}
      </div>
    </aside>
  );
}

export default Sidebar;
