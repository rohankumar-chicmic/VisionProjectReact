import { useEffect } from 'react';
import { Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import {
  HeaderActions,
  useHeader,
} from '../../../../Shared/Context/HeaderContext';
import { useJuryDashboardQuery } from '../../../../Services/Api/module/JuryApi';
import JurySummary from './components/JurySummary';
import AssignedGrantsList from './components/AssignedGrantsList';
import EvaluationQueue from './components/EvaluationQueue';
import './JuryDashboard.scss';

function JuryDashboard() {
  const navigate = useNavigate();
  const { setTitle, setSubtitle, resetHeader } = useHeader();
  const { data, isLoading, isError } = useJuryDashboardQuery();

  useEffect(() => {
    setTitle('Jury Dashboard');
    setSubtitle('Assigned reviews, deadlines, and evaluation progress');
    return () => resetHeader();
  }, [resetHeader, setSubtitle, setTitle]);

  if (isLoading) {
    return (
      <div className="dashboard-view role-dashboard loading">
        <div className="loading-spinner" />
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="dashboard-view role-dashboard error">
        <p>Failed to load dashboard data. Please try again later.</p>
      </div>
    );
  }

  return (
    <div className="dashboard-view role-dashboard">
      <HeaderActions>
        <button
          type="button"
          className="header-btn btn-primary"
          onClick={() => navigate('/jury/workspace')}
        >
          <Star size={18} />
          <span>Open Jury Workspace</span>
        </button>
      </HeaderActions>

      <JurySummary data={data?.data} />

      <div className="dashboard-grid-two">
        <AssignedGrantsList data={data?.data?.assignedPrograms} />
        <EvaluationQueue data={data?.data?.evaluationQueue} />
      </div>
    </div>
  );
}

export default JuryDashboard;
