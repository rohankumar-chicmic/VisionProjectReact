import { useEffect } from 'react';
import { useHeader } from '../../../../Shared/Context/HeaderContext';
import {
  useGetOrganiserGalasQuery,
  useGetOrganiserGalaSummaryQuery,
} from '../../../../Services/Api/module/Organiser/Gala';
import { useGetOrganiserGrantSummaryQuery } from '../../../../Services/Api/module/Organiser/Grant';
import DashboardStats from './components/DashboardStats';
import GalaList from './components/GalaList';

function OrganiserDashboard() {
  const { setTitle, setSubtitle, resetHeader } = useHeader();
  const { data: galaResponse, isLoading: isGalaLoading } =
    useGetOrganiserGalasQuery({
      pageNumber: 1,
      pageSize: 5,
    });
  const { data: summaryResponse } = useGetOrganiserGalaSummaryQuery();
  const { data: grantSummaryResponse } = useGetOrganiserGrantSummaryQuery();

  const galaItems = galaResponse?.data.items ?? [];

  useEffect(() => {
    setTitle('Organiser Dashboard');
    setSubtitle('Track gala activity and grants from one place');
    return () => resetHeader();
  }, [resetHeader, setSubtitle, setTitle]);

  return (
    <div className="dashboard-view role-dashboard">
      <DashboardStats
        galaSummary={summaryResponse?.data}
        grantSummary={grantSummaryResponse?.data}
      />

      <GalaList data={galaItems} isLoading={isGalaLoading} />
    </div>
  );
}

export default OrganiserDashboard;
