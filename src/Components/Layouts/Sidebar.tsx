import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { LogOut } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import {
  useLogoutAdminMutation,
  useLogoutOrganiserMutation,
  useLogoutJuryMutation,
} from '../../Services/Api/module/Auth';
import { clearAuthTokenRedux } from '../../Store/Common';
import { RootState } from '../../Store';
import LogoutModal from '../Molecule/LogoutModal/LogoutModal';
import { SIDEBAR_CONFIG } from './sidebarConfig';
import useCurrentUserRole from '../../Shared/Auth/useCurrentUserRole';
import './Sidebar.scss';

import logo from '../../assets/logo.png';

function Sidebar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [logoutAdmin, { isLoading: isAdminLoading }] = useLogoutAdminMutation();
  const [logoutOrganiser, { isLoading: isOrganiserLoading }] =
    useLogoutOrganiserMutation();
  const [logoutJury, { isLoading: isJuryLoading }] = useLogoutJuryMutation();

  const isLoading = isAdminLoading || isOrganiserLoading || isJuryLoading;

  const { user } = useSelector((state: RootState) => state.common);
  const { role, roleLabel } = useCurrentUserRole();
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  const handleLogout = async () => {
    try {
      if (user?.email) {
        let logoutMutation;
        if (role === 'admin') {
          logoutMutation = logoutAdmin;
        } else if (role === 'organiser') {
          logoutMutation = logoutOrganiser;
        } else {
          logoutMutation = logoutJury;
        }
        await logoutMutation({ email: user.email }).unwrap();
      }
    } catch (error) {
      // Even if API fails, we should clear local state and redirect
    } finally {
      dispatch(clearAuthTokenRedux());
      navigate('/login');
    }
  };

  const menuItems = SIDEBAR_CONFIG[role];

  const userInitial =
    user?.username?.charAt(0) || user?.email?.charAt(0) || 'A';

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
              <span className="nav-icon">
                <item.icon size={20} />
              </span>
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
                {roleLabel} • {user?.email || 'admin@visionpme.com'}
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
