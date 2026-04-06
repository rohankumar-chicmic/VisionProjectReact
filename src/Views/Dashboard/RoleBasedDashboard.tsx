import AdminDashboard from './roles/Admin/AdminDashboard';
import JuryDashboard from './roles/Jury/JuryDashboard';
import OrganiserDashboard from './roles/Organiser/OrganiserDashboard';
import SubAdminDashboard from './roles/SubAdmin/SubAdminDashboard';
import EmptyRoleState from './Components/EmptyRoleState';
import { useCurrentUserRole } from '../../Shared/Auth/useCurrentUserRole';
import type { AppRole } from '../../Shared/Auth/roles';
import './Dashboard.scss';
import './RoleBasedDashboard.scss';

const dashboardByRole: Record<AppRole, JSX.Element> = {
  organiser: <OrganiserDashboard />,
  admin: <AdminDashboard />,
  sub_admin: <SubAdminDashboard />,
  jury: <JuryDashboard />,
};

function RoleBasedDashboard() {
  const { role } = useCurrentUserRole();

  return dashboardByRole[role] || <EmptyRoleState />;
}

export default RoleBasedDashboard;
