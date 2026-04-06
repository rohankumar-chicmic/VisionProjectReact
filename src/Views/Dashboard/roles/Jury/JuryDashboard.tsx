import { useEffect } from 'react';
import { Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { HeaderActions, useHeader } from '../../../../Shared/Context/HeaderContext';
import JurySummary from './components/JurySummary';
import AssignedGrantsList from './components/AssignedGrantsList';
import EvaluationQueue from './components/EvaluationQueue';

function JuryDashboard() {
  const navigate = useNavigate();
  const { setTitle, setSubtitle, resetHeader } = useHeader();

  useEffect(() => {
    setTitle('Jury Dashboard');
    setSubtitle('Assigned reviews, deadlines, and evaluation progress');
    return () => resetHeader();
  }, [resetHeader, setSubtitle, setTitle]);

  return (
    <div className="dashboard-view role-dashboard">
      <HeaderActions>
        <button
          type="button"
          className="header-btn btn-primary"
          onClick={() => navigate('/jury')}
        >
          <Star size={18} />
          <span>Open Jury Workspace</span>
        </button>
      </HeaderActions>

      <JurySummary />

      <div className="dashboard-grid-two">
        <AssignedGrantsList />
        <EvaluationQueue />
      </div>
    </div>
  );
}

export default JuryDashboard;
