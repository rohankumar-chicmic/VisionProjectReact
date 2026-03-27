import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Calendar,
  Award,
  FileText,
  Megaphone,
  ShieldCheck,
  Bell,
  LogOut,
} from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { useLogoutAdminMutation } from '../../Services/Api/module/AuthApi';
import { clearAuthTokenRedux } from '../../Store/Common';
import { RootState } from '../../Store';
import LogoutModal from '../Molecule/LogoutModal/LogoutModal';
import './Sidebar.scss';

import logo from '../../assets/logo.png';

function Sidebar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [logoutAdmin, { isLoading }] = useLogoutAdminMutation();
  const { user } = useSelector((state: RootState) => state.common);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  const handleLogout = async () => {
    try {
      if (user?.email) {
        await logoutAdmin({ email: user.email }).unwrap();
      }
    } catch (error) {
      // Even if API fails, we should clear local state and redirect
    } finally {
      dispatch(clearAuthTokenRedux());
      navigate('/login');
    }
  };

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

  const userInitial = user?.username?.charAt(0) || user?.email?.charAt(0) || 'A';

  return (
    <>
      <aside className="sidebar">
        <div className="sidebar-logo">
          <div className="logo-icon">
            <img src={logo} alt="" />
          </div>
          <span className="logo-text">Vision PME Admin</span>
        </div>

        <nav className="sidebar-nav">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `nav-item ${isActive ? 'active' : ''}`
              }
            >
              <span className="nav-icon">{item.icon}</span>
              <span className="nav-label">{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="user-profile">
            <div className="avatar">{userInitial}</div>
            <div className="user-info">
              <span className="user-name">
                {user?.username || 'Admin User'}
              </span>
              <span className="user-email">
                {user?.email || 'admin@visionpme.com'}
              </span>
            </div>
          </div>
          <button
            type="button"
            className="logout-btn"
            onClick={() => setIsLogoutModalOpen(true)}
            aria-label="Logout"
          >
            <LogOut size={20} />
          </button>
        </div>
      </aside>

      <LogoutModal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        onConfirm={handleLogout}
        isLoading={isLoading}
      />
    </>
  );
}

export default Sidebar;
