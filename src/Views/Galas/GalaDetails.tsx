import { useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  Calendar,
  Clock,
  MapPin,
  Trophy,
  Info,
  ExternalLink,
  ClipboardList,
  CheckCircle,
  EyeOff,
  Trash2,
  Users,
} from 'lucide-react';
import { useHeader, HeaderActions } from '../../Shared/Context/HeaderContext';
import {
  useGetGalaByIdQuery,
  usePublishGalaMutation,
  useUnpublishGalaMutation,
  useDeleteGalaMutation,
} from '../../Services/Api/module/GalaApi';
import Skeleton from '../../Components/Shared/Skeleton';
import showToast from '../../Shared/Utils/toast';
import './GalaDetails.scss';
import DEFAULT_GALA_IMAGE from '../../assets/general-img-landscape.png';

function GalaDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { setTitle, setSubtitle, setBackAction } = useHeader();

  const { data: response, isLoading, isError } = useGetGalaByIdQuery(id ?? '');
  const [publishGala, { isLoading: isPublishing }] = usePublishGalaMutation();
  const [unpublishGala, { isLoading: isUnpublishing }] =
    useUnpublishGalaMutation();
  const [deleteGala, { isLoading: isDeleting }] = useDeleteGalaMutation();

  const gala = response?.data;

  useEffect(() => {
    setTitle('Gala Details');
    setSubtitle('Review event schedule, grants, and applications');
    setBackAction(true, () => navigate('/galas'));
  }, [setTitle, setSubtitle, setBackAction, navigate]);

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

  const formatTime = (timeString: string) => {
    return timeString;
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getStatusDisplay = (statusCode: number) => {
    switch (statusCode) {
      case 1:
        return { label: 'Draft', class: 'draft' };
      case 2:
        return { label: 'Active', class: 'active' };
      case 3:
        return { label: 'Completed', class: 'completed' };
      default:
        return { label: 'Active', class: 'active' };
    }
  };

  const getApplicationStatus = (status: number) => {
    switch (status) {
      case 0:
        return { label: 'Pending', class: 'pending' };
      case 2:
        return { label: 'Approved', class: 'approved' };
      case 3:
        return { label: 'Rejected', class: 'rejected' };
      default:
        return { label: 'Pending', class: 'pending' };
    }
  };

  const handlePublish = async () => {
    if (!id) return;
    try {
      await publishGala(id).unwrap();
      showToast.success('Gala published successfully!');
    } catch (error) {
      showToast.error(
        error instanceof Error ? error.message : 'Failed to publish gala'
      );
    }
  };

  const handleUnpublish = async () => {
    if (!id) return;
    try {
      await unpublishGala(id).unwrap();
      showToast.success('Gala unpublished successfully!');
    } catch (error) {
      showToast.error(
        error instanceof Error ? error.message : 'Failed to unpublish gala'
      );
    }
  };

  const handleDelete = async () => {
    if (
      !id ||
      !globalThis.confirm('Are you sure you want to delete this gala?')
    )
      return;
    try {
      await deleteGala(id).unwrap();
      showToast.success('Gala deleted successfully!');
      navigate('/galas');
    } catch (error) {
      showToast.error(
        error instanceof Error ? error.message : 'Failed to delete gala'
      );
    }
  };

  if (isLoading) {
    return (
      <div className="gala-details-page">
        <Skeleton height={400} borderRadius={24} />
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '24px',
            marginTop: '32px',
          }}
        >
          <Skeleton height={120} borderRadius={20} />
          <Skeleton height={120} borderRadius={20} />
          <Skeleton height={120} borderRadius={20} />
        </div>
      </div>
    );
  }

  if (isError || !gala) {
    return (
      <div className="gala-details-page">
        <div className="error-state">
          <h2>Failed to load gala details</h2>
          <button
            type="button"
            className="btn-primary"
            onClick={() => navigate('/galas')}
          >
            Back to List
          </button>
        </div>
      </div>
    );
  }

  const status = getStatusDisplay(gala.status);

  return (
    <div className="gala-details-page">
      <HeaderActions>
        <div className="header-actions">
          <button
            type="button"
            className="header-btn btn-danger-soft"
            onClick={handleDelete}
            disabled={isDeleting}
          >
            <Trash2 size={18} />
            Delete
          </button>
          {gala.status === 2 ? (
            <button
              type="button"
              className="header-btn btn-warning"
              onClick={handleUnpublish}
              disabled={isUnpublishing}
            >
              <EyeOff size={18} />
              Unpublish
            </button>
          ) : (
            <button
              type="button"
              className="header-btn btn-primary"
              onClick={handlePublish}
              disabled={isPublishing}
            >
              <CheckCircle size={18} />
              Publish Gala
            </button>
          )}
          <button
            type="button"
            className="header-btn btn-outline"
            onClick={() => navigate(`/galas/edit/${id}`)}
          >
            Edit Gala
          </button>
        </div>
      </HeaderActions>

      <div className="gala-hero-banner">
        <img src={gala.coverImageUrl || DEFAULT_GALA_IMAGE} alt={gala.name} />
        <div className="hero-overlay">
          <div className={`status-pill ${status.class}`}>
            <span className="dot" />
            {status.label}
          </div>
          <h1>{gala.name}</h1>
          <div className="hero-meta">
            <div className="meta-item">
              <Calendar size={20} />
              {formatDate(gala.eventDate)}
            </div>
            <div className="meta-item">
              <Clock size={20} />
              {gala.eventTime}
            </div>
            <div className="meta-item">
              <MapPin size={20} />
              {gala.venue}, {gala.city}
            </div>
          </div>
        </div>
      </div>

      <div className="stats-strip">
        <div className="stat-card prize">
          <div className="stat-icon">
            <Trophy size={28} />
          </div>
          <div className="stat-info">
            <span className="label">Total Prize Pool</span>
            <span className="value">{formatCurrency(gala.totalPrizePool)}</span>
          </div>
        </div>
        <div className="stat-card attendees">
          <div className="stat-icon">
            <Users size={28} />
          </div>
          <div className="stat-info">
            <span className="label">Expected Attendees</span>
            <span className="value">{gala.expectedAttendees}</span>
          </div>
        </div>
        <div className="stat-card applications">
          <div className="stat-icon">
            <ClipboardList size={28} />
          </div>
          <div className="stat-info">
            <span className="label">Total Applications</span>
            <span className="value">{gala.appliedCount}</span>
          </div>
        </div>
      </div>

      <div className="details-main-grid">
        <div className="content-column">
          <div className="card about-section">
            <h2 className="card-title">
              <Info size={24} />
              About this Event
            </h2>
            <p className="about-text">{gala.about}</p>
          </div>

          <div className="card grants-section">
            <h2 className="card-title">
              <Trophy size={24} />
              Featured Grants
            </h2>
            {gala.grants?.map((grant) => (
              <div key={grant.id} className="grant-item">
                <div className="grant-header">
                  <h3>{grant.name}</h3>
                  <span className="badge">{grant.category}</span>
                </div>
                <p className="grant-description">{grant.description}</p>

                <div className="grant-meta-strip">
                  <div className="meta-box">
                    <span className="m-label">Prizes</span>
                    <span className="m-value">{grant.numberOfPrizes}</span>
                  </div>
                  <div className="meta-box">
                    <span className="m-label">Amount</span>
                    <span className="m-value">
                      {formatCurrency(grant.prizeAmount)}
                    </span>
                  </div>
                  <div className="meta-box">
                    <span className="m-label">Deadline</span>
                    <span className="m-value">
                      {formatDate(grant.applicationDeadline)}
                    </span>
                  </div>
                </div>

                <div className="app-table-container">
                  <div className="table-header">
                    <h4>
                      <ClipboardList size={20} />
                      Recent Applications
                    </h4>
                  </div>
                  <div className="table-responsive">
                    <table>
                      <thead>
                        <tr>
                          <th>ID</th>
                          <th>Company</th>
                          <th>Industry</th>
                          <th>Submitted</th>
                          <th>Status</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {grant.applications?.map((app) => {
                          const appStatus = getApplicationStatus(app.status);
                          return (
                            <tr key={app.id}>
                              <td>
                                <span className="app-id">{app.applicationId}</span>
                              </td>
                              <td>{app.companyName}</td>
                              <td>{app.industry}</td>
                              <td>{formatDate(app.submittedAt)}</td>
                              <td>
                                <span className={`status-pill ${appStatus.class}`}>
                                  {appStatus.label}
                                </span>
                              </td>
                              <td>
                                <Link
                                  to={`/applications/${app.id}`}
                                  className="action-link"
                                  title="View Details"
                                >
                                  <ExternalLink size={18} />
                                </Link>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="sidebar-column">
          <div className="card schedule-section">
            <h2 className="card-title">
              <Calendar size={24} />
              Evening Program
            </h2>
            <div className="schedule-list">
              {gala.eveningItems?.map((item, index) => (
                <div key={item.id ?? index} className="schedule-item">
                  <span className="item-time">{formatTime(item.time)}</span>
                  <h3 className="item-title">{item.title}</h3>
                  <p className="item-desc">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default GalaDetails;
