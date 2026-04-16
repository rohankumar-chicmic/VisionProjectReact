import { useEffect } from 'react';
import { Clock, XCircle, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useHeader } from '../../../../Shared/Context/HeaderContext';
import {
  useGetOrganiserGalasQuery,
  useGetOrganiserGalaSummaryQuery,
} from '../../../../Services/Api/module/Organiser/Gala';
import { useGetOrganiserGrantSummaryQuery } from '../../../../Services/Api/module/Organiser/Grant';
import { useGetOrganiserProfileQuery } from '../../../../Services/Api/module/Organiser/Profile';
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
  const { data: profileRes } = useGetOrganiserProfileQuery();
  const navigate = useNavigate();

  const profile = profileRes?.data;
  const galaItems = galaResponse?.data.items ?? [];

  useEffect(() => {
    setTitle('Organiser Dashboard');
    setSubtitle('Track gala activity and grants from one place');
    return () => resetHeader();
  }, [resetHeader, setSubtitle, setTitle]);

  return (
    <div className="dashboard-view role-dashboard">
      {profile && profile.verificationStatus !== 'Verified' && (
        <div
          className={`verification-banner ${profile.verificationStatus.toLowerCase()}`}
        >
          <div className="banner-icon">
            {profile.verificationStatus === 'Pending' ? (
              <Clock size={20} />
            ) : (
              <XCircle size={20} />
            )}
          </div>
          <div className="banner-content">
            <div className="banner-title">
              Account Verification {profile.verificationStatus}
            </div>
            <p className="banner-message">
              {profile.verificationStatus === 'Pending'
                ? "Your profile is under review. Some features might be restricted until you're verified."
                : `Your verification was rejected: ${profile.adminRejectionReason || 'No reason provided.'}`}
            </p>
          </div>
          <button
            type="button"
            className="banner-action"
            onClick={() => navigate('/organiser/profile')}
          >
            <span>View Profile</span>
            <ArrowRight size={16} />
          </button>
        </div>
      )}

      <DashboardStats
        galaSummary={summaryResponse?.data}
        grantSummary={grantSummaryResponse?.data}
      />

      <GalaList data={galaItems} isLoading={isGalaLoading} />
    </div>
  );
}

export default OrganiserDashboard;
