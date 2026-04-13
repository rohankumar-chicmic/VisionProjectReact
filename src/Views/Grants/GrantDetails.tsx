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
  Trophy,
} from 'lucide-react';
import Modal from '../../Components/Atom/Modal/Modal';
import { useHeader, HeaderActions } from '../../Shared/Context/HeaderContext';
import {
  useGetOrganiserGrantByIdQuery,
  useDeleteOrganiserGrantMutation,
} from '../../Services/Api/module/Organiser/Grant';
import Skeleton from '../../Components/Shared/Skeleton';
import showToast from '../../Shared/Utils/toast';
import useCurrentUserRole from '../../Shared/Auth/useCurrentUserRole';
import EmptyState from '../../Components/Shared/EmptyState';
import './GrantDetails.scss';

function GrantDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { setTitle, setSubtitle, setBackAction, resetHeader } = useHeader();
  const { role } = useCurrentUserRole();
  const isAdmin = role === 'admin' || role === 'sub_admin';

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

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  if (isLoading) {
    return (
      <div className="grant-details-page">
        <div className="skeleton-hero">
          <Skeleton height={280} borderRadius={24} />
        </div>
        <div className="stats-container-card">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={`stat-skeleton-${i}`}
              style={{ flex: 1, padding: '24px' }}
            >
              <Skeleton height={60} borderRadius={12} />
            </div>
          ))}
        </div>
        <div className="details-main-grid">
          <div className="content-column">
            <Skeleton height={400} borderRadius={24} />
            <Skeleton height={300} borderRadius={24} />
          </div>
          <div className="sidebar-column">
            <Skeleton height={400} borderRadius={24} />
            <Skeleton height={400} borderRadius={24} />
          </div>
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

  const statusDisplay = getStatusLabel(grant.status);
  const statusClass = getStatusClass(grant.status);

  return (
    <div className="grant-details-page">
      {!isAdmin && (
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
      )}

      {/* Hero Section */}
      <section className="grant-hero">
        <div className="hero-overlay">
          <div className="hero-top">
            <div className={`status-pill ${statusClass}`}>
              <div className="dot" />
              {statusDisplay}
            </div>
            <div className="category-chip">
              <Award size={14} />
              {grant.category}
            </div>
          </div>
          <h1>{grant.name}</h1>
          <div className="hero-meta">
            <Link to={`/galas/${grant.galaEventId}`} className="gala-link">
              <div className="link-icon-box">
                <Trophy size={18} />
              </div>
              <div className="link-text">
                <span className="l-label">Linked Gala Event</span>
                <span className="l-value">{grant.galaEventName}</span>
              </div>
              <ArrowRight size={18} className="hover-arrow" />
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Container Card */}
      <div className="stats-container-card">
        <div className="stat-unit prize">
          <div className="stat-icon">
            <DollarSign size={22} />
          </div>
          <div className="stat-info">
            <span className="label">Total Prize Pool</span>
            <span className="value">{formatCurrency(grant.prizeAmount)}</span>
          </div>
        </div>
        <div className="stat-unit slots">
          <div className="stat-icon">
            <Award size={22} />
          </div>
          <div className="stat-info">
            <span className="label">Prize Slots</span>
            <span className="value">{grant.numberOfPrizes} Winners</span>
          </div>
        </div>
        <div className="stat-unit deadline">
          <div className="stat-icon">
            <Calendar size={22} />
          </div>
          <div className="stat-info">
            <span className="label">Application Deadline</span>
            <span className="value">
              {formatDate(grant.applicationDeadline)}
            </span>
          </div>
        </div>
        <div className="stat-unit applicants">
          <div className="stat-icon">
            <Users size={22} />
          </div>
          <div className="stat-info">
            <span className="label">Total Applicants</span>
            <span className="value">{grant.applicantCount || 0}</span>
          </div>
        </div>
      </div>

      <div className="details-main-grid">
        <div className="content-column">
          <div className="card description-card">
            <h3 className="card-title">
              <Info size={22} />
              About the Grant
            </h3>
            <p className="about-text">{grant.description}</p>
          </div>

          <div className="card requirements-card">
            <h3 className="card-title">
              <CheckCircle2 size={22} />
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
            <div className="card-header-with-badge">
              <h3 className="card-title">
                <HelpCircle size={22} />
                Questionnaire
              </h3>
              <span className="count-badge">
                {grant.questions.length} Questions
              </span>
            </div>
            <div className="questions-list">
              {grant.questions.map((q) => (
                <div key={q.questionText} className="question-item">
                  <div className="q-number">{q.order}</div>
                  <div className="q-content">
                    <h4>{q.questionText}</h4>
                    <span className="q-type">{q.questionType}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="sidebar-column">
          <div className="card jury-card">
            <h3 className="card-title">
              <Users size={22} />
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
                <EmptyState
                  icon={Users}
                  title="No jury assigned"
                  description="This grant hasn't been assigned to any jury panel members yet."
                  className="empty-state-mini"
                />
              )}
            </div>
          </div>

          <div className="card criteria-card">
            <h3 className="card-title">
              <Briefcase size={22} />
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
              <Trophy size={22} />
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
                      <span className="rank-label">Rank</span>
                    </div>
                    <div className="amount">{formatCurrency(prize.amount)}</div>
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
