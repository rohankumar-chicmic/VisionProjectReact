import { useEffect } from 'react';
import { useHeader } from '../../../../Shared/Context/HeaderContext';
import {
  useGetAdminApplicationsQuery,
  useGetAdminUserDashboardQuery,
} from '../../../../Services/Api/module/AdminApi';
import SubAdminSummary from './components/SubAdminSummary';
import RecentApplicationsTable from './components/RecentApplicationsTable';
import OperationsPanel from './components/OperationsPanel';

function SubAdminDashboard() {
  const { setTitle, setSubtitle, resetHeader } = useHeader();
  const { data: dashboardResponse, isLoading: isSummaryLoading } =
    useGetAdminUserDashboardQuery();
  const { data: applicationResponse, isLoading: isApplicationLoading } =
    useGetAdminApplicationsQuery({ pageNumber: 1, pageSize: 5 });

  useEffect(() => {
    setTitle('Sub Admin Dashboard');
    setSubtitle(
      'Daily moderation, operational follow-up, and queue visibility'
    );
    return () => resetHeader();
  }, [resetHeader, setSubtitle, setTitle]);

  return (
    <div className="dashboard-view role-dashboard">
      <SubAdminSummary
        isLoading={isSummaryLoading}
        stats={dashboardResponse?.data}
      />

      <div className="dashboard-grid-two">
        <RecentApplicationsTable
          data={applicationResponse?.data.items || []}
          isLoading={isApplicationLoading}
        />
        <OperationsPanel />
      </div>
    </div>
  );
}

export default SubAdminDashboard;
