import { useEffect, useState } from 'react';
import { Plus } from 'lucide-react';
import {
  HeaderActions,
  useHeader,
} from '../../../../Shared/Context/HeaderContext';
import { useGetGrantsSummaryQuery } from '../../../../Services/Api/module/GrantsApi';
import { useGetGalasQuery } from '../../../../Services/Api/module/GalaApi';
import DashboardStats from './components/DashboardStats';
import GalaList from './components/GalaList';
import CreateGalaCTA from './components/CreateGalaCTA';
import CreateGalaWizard from './components/CreateGalaWizard/CreateGalaWizard';

function OrganiserDashboard() {
  const [isWizardOpen, setIsWizardOpen] = useState(false);
  const { setTitle, setSubtitle, resetHeader } = useHeader();
  const { data: galaResponse, isLoading: isGalaLoading } = useGetGalasQuery({
    pageNumber: 1,
    pageSize: 5,
  });
  const { data: grantSummary } = useGetGrantsSummaryQuery();

  const galaItems = galaResponse?.data.items || [];
  const totalExpectedGuests = galaItems.reduce(
    (total, item) => total + item.expectedAttendees,
    0
  );

  useEffect(() => {
    setTitle('Organiser Dashboard');
    setSubtitle(
      'Plan galas, shape pricing, and assign jury members from one flow'
    );
    return () => resetHeader();
  }, [resetHeader, setSubtitle, setTitle]);

  return (
    <div className="dashboard-view role-dashboard">
      <HeaderActions>
        <button
          type="button"
          className="header-btn btn-primary"
          onClick={() => setIsWizardOpen((value) => !value)}
        >
          <Plus size={18} />
          <span>{isWizardOpen ? 'Close Wizard' : 'Create Gala'}</span>
        </button>
      </HeaderActions>

      <DashboardStats
        activeGalas={galaItems.length}
        totalPrizePool={grantSummary?.data?.totalFundAmount || 0}
        expectedGuests={totalExpectedGuests}
      />

      <CreateGalaCTA
        isOpen={isWizardOpen}
        onToggle={() => setIsWizardOpen((value) => !value)}
      />

      {isWizardOpen && (
        <CreateGalaWizard onComplete={() => setIsWizardOpen(false)} />
      )}

      <GalaList data={galaItems} isLoading={isGalaLoading} />
    </div>
  );
}

export default OrganiserDashboard;
