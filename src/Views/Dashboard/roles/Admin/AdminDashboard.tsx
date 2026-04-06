import { useEffect } from 'react';
import { useHeader } from '../../../../Shared/Context/HeaderContext';
import { useGetDashboardDataQuery } from '../../../../Services/Api/module/CommonApi';
import { useGetGalasQuery } from '../../../../Services/Api/module/GalaApi';
import { useGetAdminUsersQuery } from '../../../../Services/Api/module/AdminApi';
import AdminStats from './components/AdminStats';
import GalaTable from './components/GalaTable';
import UserTable from './components/UserTable';
import ReportsPanel from './components/ReportsPanel';

function AdminDashboard() {
  const { setTitle, setSubtitle, resetHeader } = useHeader();
  const { data: dashboardResponse, isLoading: isStatsLoading } =
    useGetDashboardDataQuery();
  const { data: galaResponse, isLoading: isGalaLoading } = useGetGalasQuery({
    pageNumber: 1,
    pageSize: 4,
  });
  const { data: userResponse, isLoading: isUserLoading } = useGetAdminUsersQuery(
    {
      pageNumber: 1,
      pageSize: 4,
    }
  );

  useEffect(() => {
    setTitle('Admin Dashboard');
    setSubtitle('Platform health, recent galas, and user activity in one place');
    return () => resetHeader();
  }, [resetHeader, setSubtitle, setTitle]);

  return (
    <div className="dashboard-view role-dashboard">
      <AdminStats
        isLoading={isStatsLoading}
        stats={dashboardResponse?.data}
      />

      <div className="dashboard-grid-two">
        <GalaTable
          data={galaResponse?.data.items || []}
          isLoading={isGalaLoading}
        />
        <UserTable
          data={userResponse?.data.items || []}
          isLoading={isUserLoading}
        />
      </div>

      <ReportsPanel stats={dashboardResponse?.data} />
    </div>
  );
}

export default AdminDashboard;
