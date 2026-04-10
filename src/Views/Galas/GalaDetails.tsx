/* eslint-disable no-alert */
import { useEffect, useState } from 'react';
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
  Trash2,
  Users,
  AlertTriangle,
} from 'lucide-react';
import Modal from '../../Components/Atom/Modal/Modal';
import { useHeader, HeaderActions } from '../../Shared/Context/HeaderContext';
import {
  useGetAdminGalaByIdQuery,
  usePublishAdminGalaMutation,
  useDeleteAdminGalaMutation,
} from '../../Services/Api/module/Admin/Gala';
import {
  useDeleteOrganiserGalaMutation,
  useGetOrganiserGalaByIdQuery,
  usePublishOrganiserGalaMutation,
} from '../../Services/Api/module/Organiser/Gala';
import Skeleton from '../../Components/Shared/Skeleton';
import showToast from '../../Shared/Utils/toast';
import useCurrentUserRole from '../../Shared/Auth/useCurrentUserRole';
import { createGrantPlatformTransaction } from '../../Services/WalletConnect';
import './GalaDetails.scss';
import DEFAULT_GALA_IMAGE from '../../assets/general-img-landscape.png';

function GalaDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { setTitle, setSubtitle, setBackAction } = useHeader();
  const { role } = useCurrentUserRole();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const isAdmin = role === 'admin' || role === 'sub_admin';
  const isOrganiser = role === 'organiser';

  const {
    data: adminResponse,
    isLoading: isAdminLoading,
    isError: isAdminError,
  } = useGetAdminGalaByIdQuery(id ?? '', { skip: !isAdmin || !id });
  const {
    data: organiserResponse,
    isLoading: isOrganiserLoading,
    isError: isOrganiserError,
  } = useGetOrganiserGalaByIdQuery(id ?? '', { skip: !isOrganiser || !id });
  const [publishAdminGala, { isLoading: isPublishingAdmin }] =
    usePublishAdminGalaMutation();
  const [publishOrganiserGala, { isLoading: isPublishingOrganiser }] =
    usePublishOrganiserGalaMutation();
  const [deleteAdminGala, { isLoading: isDeletingAdmin }] =
    useDeleteAdminGalaMutation();
  const [deleteOrganiserGala, { isLoading: isDeletingOrganiser }] =
    useDeleteOrganiserGalaMutation();

  const response = isAdmin ? adminResponse : organiserResponse;
  const isLoading = isAdmin ? isAdminLoading : isOrganiserLoading;
  const isError = isAdmin ? isAdminError : isOrganiserError;
  const isPublishing = isAdmin ? isPublishingAdmin : isPublishingOrganiser;
  const isDeleting = isAdmin ? isDeletingAdmin : isDeletingOrganiser;
  const gala = response?.data;
  const totalPrizePool =
    gala && 'totalPrizePool' in gala
      ? (gala as { totalPrizePool: number }).totalPrizePool
      : (gala?.totalGalaValue ?? 0);

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
        return { label: 'Upcoming', class: 'upcoming' };
      case 3:
        return { label: 'Active', class: 'active' };
      case 4:
        return { label: 'Completed', class: 'completed' };
      default:
        return { label: 'Unknown', class: 'unknown' };
    }
  };

  const getApplicationStatus = (status: number) => {
    switch (status) {
      case 1:
        return { label: 'Draft', class: 'draft' };
      case 2:
        return { label: 'Pending', class: 'pending' };
      case 3:
        return { label: 'In Review', class: 'in-review' };
      case 4:
        return { label: 'Approved', class: 'approved' };
      case 5:
        return { label: 'Rejected', class: 'rejected' };
      case 6:
        return { label: 'Winner', class: 'winner' };
      case 7:
        return { label: 'Interview', class: 'interview' };
      default:
        return { label: 'Unknown', class: 'unknown' };
    }
  };

  const handlePublish = async () => {
    const activeGala = gala;
    if (!id || !activeGala) return;
    try {
      if (isAdmin) {
        await publishAdminGala(id).unwrap();
      } else {
        showToast.info(
          'Please confirm the wallet transaction for your grants.'
        );

        const totalPrizePoolValue =
          activeGala.grants?.reduce((acc, grant) => {
            return acc + (grant.prizeAmount || 0) * (grant.numberOfPrizes || 0);
          }, 0) || totalPrizePool;

        const { transactionHash, walletAddress } =
          await createGrantPlatformTransaction(totalPrizePoolValue);

        await publishOrganiserGala({
          id,
          body: {
            blockchainTransactionHash: transactionHash,
            organiserWalletAddress: walletAddress,
          },
        }).unwrap();
      }
      showToast.success('Gala published successfully!');
    } catch (error) {
      showToast.error(
        error instanceof Error ? error.message : 'Failed to publish gala'
      );
    }
  };

  const handleDelete = async () => {
    if (!id || isDeleting) return;
    try {
      if (isAdmin) {
        await deleteAdminGala(id).unwrap();
      } else {
        await deleteOrganiserGala(id).unwrap();
      }
      showToast.success('Gala deleted successfully!');
      setDeletingId(null);
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
            onClick={() => setDeletingId(id ?? null)}
            disabled={isDeleting}
          >
            <Trash2 size={18} />
            Delete
          </button>

          {gala.status === 1 && (
            <>
              <button
                type="button"
                className="header-btn btn-primary"
                onClick={handlePublish}
                disabled={isPublishing}
              >
                <CheckCircle size={18} />
                Publish Gala
              </button>

              <button
                type="button"
                className="header-btn btn-outline"
                onClick={() => navigate(`/galas/edit/${id}`)}
              >
                Edit Gala
              </button>
            </>
          )}
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
            <span className="value">{formatCurrency(totalPrizePool)}</span>
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
                                <span className="app-id">
                                  {app.applicationId}
                                </span>
                              </td>
                              <td>{app.companyName}</td>
                              <td>{app.industry}</td>
                              <td>{formatDate(app.submittedAt)}</td>
                              <td>
                                <span
                                  className={`status-pill ${appStatus.class}`}
                                >
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
              {gala.eveningItems?.map((item) => (
                <div
                  key={`${item.time}-${item.title}`}
                  className="schedule-item"
                >
                  <span className="item-time">{formatTime(item.time)}</span>
                  <h3 className="item-title">{item.title}</h3>
                  <p className="item-desc">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <Modal
        isOpen={Boolean(deletingId)}
        onClose={() => setDeletingId(null)}
        title="Delete Gala"
        subtitle="Are you sure you want to delete this gala? All associated data will be permanently removed."
        width="450px"
        footer={
          <div className="modal-actions-footer">
            <button
              type="button"
              className="btn-cancel"
              onClick={() => setDeletingId(null)}
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
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting ? 'Deleting...' : 'Delete Gala Permanently'}
            </button>
          </div>
        }
      >
        <div style={{ textAlign: 'center', padding: '24px 0' }}>
          <div
            style={{
              width: '64px',
              height: '64px',
              backgroundColor: '#fee2e2',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px',
            }}
          >
            <AlertTriangle size={32} color="#ef4444" />
          </div>
          <p style={{ color: '#4b5563', fontSize: '15px', lineHeight: '1.5' }}>
            Warning: This will permanently delete <strong>{gala.name}</strong>{' '}
            and all its linked grants and applications.
          </p>
        </div>
      </Modal>
    </div>
  );
}

export default GalaDetails;
