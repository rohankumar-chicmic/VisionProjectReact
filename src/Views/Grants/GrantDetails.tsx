/* eslint-disable no-alert */
import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  Award,
  DollarSign,
  Calendar,
  Users,
  CheckCircle2,
  Trash2,
  Edit3,
  ArrowRight,
  Info,
  HelpCircle,
  Briefcase,
  User,
  AlertTriangle,
} from 'lucide-react';
import Modal from '../../Components/Atom/Modal/Modal';
import { useHeader, HeaderActions } from '../../Shared/Context/HeaderContext';
import {
  useGetOrganiserGrantByIdQuery,
  useDeleteOrganiserGrantMutation,
} from '../../Services/Api/module/Organiser/Grant';
import Skeleton from '../../Components/Shared/Skeleton';
import showToast from '../../Shared/Utils/toast';
import KpiCard from '../../Components/Shared/KpiCard';
import './GrantDetails.scss';

function GrantDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { setTitle, setSubtitle, setBackAction, resetHeader } = useHeader();

  const {
    data: grantResponse,
    isLoading,
    isError,
  } = useGetOrganiserGrantByIdQuery(id ?? '', { skip: !id });

  const [deleteGrant, { isLoading: isDeleting }] =
    useDeleteOrganiserGrantMutation();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const grant = grantResponse?.data;

  useEffect(() => {
    setTitle('Grant Details');
    setSubtitle('Overview of grant program, jury, and requirements');
    setBackAction(true, () => navigate('/grants'));
    return () => resetHeader();
  }, [setTitle, setSubtitle, setBackAction, resetHeader, navigate]);

  const handleDelete = async () => {
    if (!id || isDeleting) return;

    try {
      await deleteGrant(id).unwrap();
      showToast.success('Grant deleted successfully');
      setIsDeleteModalOpen(false);
      navigate('/grants');
    } catch (error) {
      showToast.error(
        error instanceof Error ? error.message : 'Failed to delete grant'
      );
    }
  };

  const getStatusLabel = (status: number) => {
    switch (status) {
      case 1:
        return 'Draft';
      case 2:
        return 'Upcoming';
      case 3:
        return 'Active';
      case 4:
        return 'Completed';
      case 5:
        return 'Closed';
      default:
        return 'Unknown';
    }
  };

  const getStatusClass = (status: number) => {
    return getStatusLabel(status).toLowerCase().replace(' ', '-');
  };

  const formatDate = (dateString: string) => {
    try {
      return new Intl.DateTimeFormat('en-US', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      }).format(new Date(dateString));
    } catch {
      return dateString;
    }
  };

  if (isLoading) {
    return (
      <div className="grant-details-page">
        <div className="skeleton-hero">
          <Skeleton height={200} borderRadius={24} />
        </div>
        <div className="kpi-grid">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={`skeleton-${i}`} height={120} borderRadius={20} />
          ))}
        </div>
        <div className="details-main-grid">
          <Skeleton height={600} borderRadius={24} />
          <Skeleton height={600} borderRadius={24} />
        </div>
      </div>
    );
  }

  if (isError || !grant) {
    return (
      <div className="grant-details-page">
        <div className="error-state text-center">
          <div className="icon-box">
            <Info size={48} />
          </div>
          <h2>Oops! Grant not found</h2>
          <p>
            The grant you are looking for doesn&apos;t exist or has been
            removed.
          </p>
          <button
            type="button"
            className="btn-primary"
            onClick={() => navigate('/grants')}
          >
            Back to Grants
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="grant-details-page">
      <HeaderActions>
        <button
          type="button"
          className="header-btn btn-outline"
          onClick={() => navigate(`/grants/edit/${id}`)}
        >
          <Edit3 size={18} />
          <span>Edit Program</span>
        </button>
        <button
          type="button"
          className="header-btn btn-danger-soft"
          onClick={() => setIsDeleteModalOpen(true)}
          disabled={isDeleting}
        >
          <Trash2 size={18} />
          <span>Delete Program</span>
        </button>
      </HeaderActions>

      {/* Hero Section */}
      <section className="grant-hero">
        <div className="hero-content">
          <div className="hero-top">
            <span className={`status-badge ${getStatusClass(grant.status)}`}>
              <span className="dot" />
              {getStatusLabel(grant.status)}
            </span>
            <span className="category-chip">{grant.category}</span>
          </div>
          <h1>{grant.name}</h1>
          <p className="event-info">
            <Link to={`/galas/${grant.galaEventId}`} className="gala-link">
              <Award size={18} />
              <span>{grant.galaEventName}</span>
              <ArrowRight size={14} className="hover-arrow" />
            </Link>
          </p>
        </div>
      </section>

      {/* KPI Stats */}
      <div className="kpi-grid">
        <KpiCard
          label="Total Prize Pool"
          value={`$${grant.prizeAmount.toLocaleString()}`}
          trend="+0%"
          trendType="up"
          color="#10b981"
          icon={<DollarSign size={24} />}
        />
        <KpiCard
          label="Prize Slots"
          value={`${grant.numberOfPrizes} Winners`}
          trend="+0%"
          trendType="up"
          color="#f59e0b"
          icon={<Award size={24} />}
        />
        <KpiCard
          label="Deadline"
          value={formatDate(grant.applicationDeadline)}
          trend="Upcoming"
          trendType="up"
          color="#3b82f6"
          icon={<Calendar size={24} />}
        />
        <KpiCard
          label="Applicant Count"
          value={`${grant.applicantCount || 0} Applied`}
          trend="+0%"
          trendType="up"
          color="#a855f7"
          icon={<Users size={24} />}
        />
      </div>

      <div className="details-main-grid">
        {/* Main Content Column */}
        <div className="content-column">
          <div className="card description-card">
            <h3 className="card-title">
              <Info size={24} />
              About the Grant
            </h3>
            <p className="about-text">{grant.description}</p>
          </div>

          <div className="card requirements-card">
            <h3 className="card-title">
              <CheckCircle2 size={24} />
              Eligibility & Requirements
            </h3>
            <div className="requirements-list">
              {grant.requirements.map((req) => (
                <div key={req.text} className="req-item">
                  <div className="check-box">
                    <CheckCircle2 size={16} />
                  </div>
                  <p>{req.text}</p>
                </div>
              ))}
              {grant.requireInterview && (
                <div className="req-item mandatory">
                  <div className="check-box">
                    <CheckCircle2 size={16} />
                  </div>
                  <p>In-person or Virtual Interview required</p>
                </div>
              )}
            </div>
          </div>

          <div className="card questions-card">
            <h3 className="card-title">
              <HelpCircle size={24} />
              Application Questionnaire
            </h3>
            <div className="questions-list">
              {grant.questions.map((q) => (
                <div key={q.questionText} className="question-item">
                  <div className="q-number">{q.order}</div>
                  <div className="q-content">
                    <h4>{q.questionText}</h4>
                    <span className="q-type badge-soft">{q.questionType}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar Column */}
        <div className="sidebar-column">
          <div className="card jury-card">
            <h3 className="card-title">
              <User size={24} />
              Jury Panel
            </h3>
            <div className="jury-list">
              {grant.juries.map((jury) => (
                <div key={jury.id} className="jury-item">
                  <div className="jury-avatar">
                    <User size={20} />
                  </div>
                  <div className="jury-info">
                    <h4>{jury.fullName}</h4>
                    <span className="expertise">{jury.domainOfExpertise}</span>
                    <span className="company">{jury.companyName}</span>
                  </div>
                </div>
              ))}
              {grant.juries.length === 0 && (
                <p className="empty-msg">No jury members assigned yet.</p>
              )}
            </div>
          </div>

          <div className="card evaluation-card">
            <h3 className="card-title">
              <Briefcase size={24} />
              Evaluation Criteria
            </h3>
            <div className="criteria-list">
              {grant.criteria.map((item) => (
                <div key={item.criteriaKey} className="criteria-item">
                  <div className="criteria-header">
                    <h4>{item.name}</h4>
                    <span className="category-tag">{item.category}</span>
                  </div>
                  <p>{item.description}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="card prize-pool-card">
            <h3 className="card-title">
              <DollarSign size={24} />
              Prize Distribution
            </h3>
            <div className="prize-table">
              {grant.prizeWinners
                .slice()
                .sort((a, b) => a.rank - b.rank)
                .map((prize) => (
                  <div key={prize.id} className="prize-row">
                    <div className="rank">
                      <span className="rank-num">#{prize.rank}</span>
                    </div>
                    <div className="amount">
                      ${prize.amount.toLocaleString()}
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Delete Grant"
        subtitle="Are you sure you want to delete this grant program? This action cannot be undone."
        width="450px"
        footer={
          <div className="modal-actions-footer">
            <button
              type="button"
              className="btn-cancel"
              onClick={() => setIsDeleteModalOpen(false)}
              disabled={isDeleting}
            >
              Cancel
            </button>
            <button
              type="button"
              className="btn-danger"
              style={{
                backgroundColor: '#ef4444',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                padding: '10px 20px',
                fontWeight: 600,
              }}
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting ? 'Deleting...' : 'Delete Permanently'}
            </button>
          </div>
        }
      >
        <div style={{ textAlign: 'center', padding: '24px 0' }}>
          <AlertTriangle
            size={48}
            color="#ef4444"
            style={{ marginBottom: '16px' }}
          />
          <p style={{ color: '#4b5563', fontSize: '15px' }}>
            Warning: This will permanently delete <strong>{grant.name}</strong>{' '}
            and all associated data.
          </p>
        </div>
      </Modal>
    </div>
  );
}

export default GrantDetails;
