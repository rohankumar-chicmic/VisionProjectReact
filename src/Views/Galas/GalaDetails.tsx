/* eslint-disable no-alert */
import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Calendar,
  Clock,
  MapPin,
  Trophy,
  Info,
  ClipboardList,
  CheckCircle,
  Trash2,
  Users,
  AlertTriangle,
  Ticket,
  Link as LinkIcon,
  ShieldCheck,
  Copy,
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
import GalaActionOverlay from './Components/GalaActionOverlay';
import showToast from '../../Shared/Utils/toast';
import useCurrentUserRole from '../../Shared/Auth/useCurrentUserRole';
import {
  createGrantPlatformTransaction,
  deleteGalaOnChain,
} from '../../Services/WalletConnect';
import './GalaDetails.scss';
import DEFAULT_GALA_IMAGE from '../../assets/general-img-landscape.png';

import { getAssetUrl } from '../../Shared/Utils/url';
import { formatDateTime } from '../../Shared/Utils/dateUtils';

function GalaDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { setTitle, setSubtitle, setBackAction } = useHeader();
  const { role } = useCurrentUserRole();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isLocalPublishing, setIsLocalPublishing] = useState(false);
  const isAbortedRef = useRef(false);
  const publishPromiseRef = useRef<{
    abort: () => void;
    unwrap: () => Promise<unknown>;
  } | null>(null);

  const handleCancelPublishing = () => {
    isAbortedRef.current = true;
    setIsLocalPublishing(false);
    if (publishPromiseRef.current) {
      publishPromiseRef.current.abort();
    }
    showToast.info('Publishing procedure cancelled.');
  };
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
  const totalPrizePool = gala?.totalGalaValue ?? 0;

  useEffect(() => {
    setTitle('Gala Details');
    setSubtitle('Review event schedule, grants, and applications');
    setBackAction(true, () => navigate('/galas'));
  }, [setTitle, setSubtitle, setBackAction, navigate]);

  const formatTime = (timeString: string) => {
    return timeString;
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
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

  const handlePublish = async () => {
    isAbortedRef.current = false;
    const activeGala = gala;
    if (!id || !activeGala) return;

    setIsLocalPublishing(true);
    try {
      if (isAdmin) {
        publishPromiseRef.current = publishAdminGala(id);
        await publishPromiseRef.current.unwrap();
      } else {
        showToast.info(
          'Please confirm the wallet transaction for your grants.'
        );

        // Use totalGalaValue from API (authoritative), fallback to sum of grant prizeAmounts.
        // prizeAmount IS the total pool per grant — do NOT multiply by numberOfPrizes.
        const totalPrizePoolValue =
          totalPrizePool ||
          activeGala.grants?.reduce(
            (acc, grant) => acc + (grant.prizeAmount || 0),
            0
          ) ||
          0;

        // Initiating Gala Publish
        const { transactionHash, walletAddress } =
          await createGrantPlatformTransaction(totalPrizePoolValue);

        if (isAbortedRef.current) return;

        publishPromiseRef.current = publishOrganiserGala({
          id,
          body: {
            blockchainTransactionHash: transactionHash,
            organiserWalletAddress: walletAddress,
          },
        });
        await publishPromiseRef.current.unwrap();
      }

      if (!isAbortedRef.current) {
        showToast.success('Gala published successfully!');
      }
    } catch (error: unknown) {
      let errorMessage = 'Failed to publish gala';
      if (typeof error === 'object' && error !== null && 'data' in error) {
        const rtkError = error as { data?: { message?: string } };
        if (rtkError.data?.message) {
          errorMessage = rtkError.data.message;
        }
      } else if (error instanceof Error) {
        if (
          error.message.includes('User denied transaction') ||
          error.message.includes('user rejected')
        ) {
          errorMessage = 'Wallet transaction cancelled by user.';
        } else {
          errorMessage = error.message;
        }
      }
      showToast.error(errorMessage);
    } finally {
      setIsLocalPublishing(false);
    }
  };

  const handleDelete = async () => {
    if (!id || isDeleting) return;
    try {
      if (isAdmin) {
        await deleteAdminGala(id).unwrap();
      } else {
        // Organiser: call contract first, then backend
        showToast.info(
          'Please confirm the wallet transaction to delete this gala.'
        );
        await deleteGalaOnChain(id);
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
      {!isAdmin && (
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
                  disabled={isPublishing || isLocalPublishing}
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
      )}

      <div className="gala-hero-banner">
        <img
          src={getAssetUrl(gala.coverImageUrl) || DEFAULT_GALA_IMAGE}
          alt={gala.name}
        />
        <div className="hero-overlay">
          <div className={`status-pill ${status.class}`}>
            <span className="dot" />
            {status.label}
          </div>
          <h1>{gala.name}</h1>
          {gala.winnerDecisionMessage && (
            <div className="status-message">
              <Trophy size={16} />
              {gala.winnerDecisionMessage}
            </div>
          )}
          <div className="hero-meta">
            <div className="meta-item">
              <Calendar size={20} />
              {formatDateTime(gala.eventDate)}
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

      <div className="stats-container-card">
        <div className="stat-unit prize">
          <div className="stat-icon">
            <Trophy size={22} />
          </div>
          <div className="stat-info">
            <span className="label">Total Prize Pool</span>
            <span className="value">{formatCurrency(totalPrizePool)}</span>
          </div>
        </div>
        <div className="stat-unit attendees">
          <div className="stat-icon">
            <Users size={22} />
          </div>
          <div className="stat-info">
            <span className="label">Expected Attendees</span>
            <span className="value">{gala.expectedAttendees}</span>
          </div>
        </div>
        <div className="stat-unit applications">
          <div className="stat-icon">
            <ClipboardList size={22} />
          </div>
          <div className="stat-info">
            <span className="label">Total Applications</span>
            <span className="value">{gala.appliedCount}</span>
          </div>
        </div>
        <div className="stat-unit ticket">
          <div className="stat-icon">
            <Ticket size={22} />
          </div>
          <div className="stat-info">
            <span className="label">Entry Fee</span>
            <span className="value">
              {gala.entryFee && gala.entryFee > 0
                ? formatCurrency(gala.entryFee)
                : 'Free'}
            </span>
          </div>
        </div>
      </div>

      <div className="details-main-grid">
        <div className="content-column">
          <div className="card main-overview-card">
            <section className="about-section">
              <h2 className="section-title">
                <Info size={20} />
                About this Event
              </h2>
              <p className="about-text">{gala.about}</p>
            </section>

            <div className="section-divider" />

            <section className="grants-section">
              <h2 className="section-title">
                <Trophy size={20} />
                Featured Grants
              </h2>
              {gala.grants?.map((grant) => (
                <div
                  key={grant.id}
                  className="grant-item clickable"
                  onClick={() => navigate(`/grants/${grant.id}`)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      navigate(`/grants/${grant.id}`);
                    }
                  }}
                >
                  <div className="grant-header">
                    <div className="title-group">
                      <h3>{grant.name}</h3>
                      <div className="metadata-badges">
                        <span className="badge category">{grant.category}</span>
                        {grant.isWinnerDecided && (
                          <span className="badge winner">Winners Ready</span>
                        )}
                      </div>
                    </div>
                    <div className="view-details-arrow">
                      <LinkIcon size={20} />
                    </div>
                  </div>
                  <p className="grant-description">{grant.description}</p>

                  <div className="grant-meta-strip">
                    <div className="meta-box">
                      <span className="m-label">Award Value</span>
                      <span className="m-value">
                        {formatCurrency(grant.prizeAmount)}
                      </span>
                    </div>
                    <div className="meta-box">
                      <span className="m-label">Winners</span>
                      <span className="m-value">
                        {grant.totalWinnerSlots} total
                      </span>
                    </div>
                    <div className="meta-box">
                      <span className="m-label">Applications</span>
                      <span className="m-value">
                        {grant.appliedCount} received
                      </span>
                    </div>
                    <div className="meta-box deadline">
                      <span className="m-label">Deadline</span>
                      <span className="m-value">
                        {formatDateTime(grant.applicationDeadline)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </section>
          </div>
        </div>

        <div className="sidebar-column">
          <div className="card sidebar-info-card">
            <section className="schedule-section">
              <h2 className="section-title">
                <Calendar size={20} />
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
            </section>

            <div className="section-divider" />

            <section className="blockchain-section">
              <h2 className="section-title">
                <ShieldCheck size={20} />
                Blockchain Proof
              </h2>
              <div className="blockchain-data">
                <div className="data-grid">
                  <div className="data-item">
                    <span className="d-label">Transaction Hash</span>
                    <div className="d-value-box">
                      <code title={gala.blockchainTransactionHash ?? undefined}>
                        {gala.blockchainTransactionHash
                          ? `${gala.blockchainTransactionHash.substring(0, 10)}...${gala.blockchainTransactionHash.substring(gala.blockchainTransactionHash.length - 8)}`
                          : 'N/A'}
                      </code>
                      {gala.blockchainTransactionHash && (
                        <button
                          type="button"
                          onClick={() => {
                            const hash = gala.blockchainTransactionHash;
                            if (hash) {
                              navigator.clipboard.writeText(hash);
                              showToast.success('Hash copied!');
                            }
                          }}
                          className="copy-btn"
                        >
                          <Copy size={14} />
                        </button>
                      )}
                    </div>
                  </div>
                  <div className="data-item">
                    <span className="d-label">Organiser Wallet</span>
                    <div className="d-value-box">
                      <code title={gala.organiserWalletAddress ?? undefined}>
                        {gala.organiserWalletAddress
                          ? `${gala.organiserWalletAddress.substring(0, 10)}...${gala.organiserWalletAddress.substring(gala.organiserWalletAddress.length - 8)}`
                          : 'N/A'}
                      </code>
                      {gala.organiserWalletAddress && (
                        <button
                          type="button"
                          onClick={() => {
                            const wallet = gala.organiserWalletAddress;
                            if (wallet) {
                              navigator.clipboard.writeText(wallet);
                              showToast.success('Wallet info copied!');
                            }
                          }}
                          className="copy-btn"
                        >
                          <Copy size={14} />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
      <GalaActionOverlay
        isOpen={isLocalPublishing}
        title="Publishing Gala"
        message={
          isAdmin
            ? 'Please wait while we verify and publish your gala securely.'
            : 'Verifying prize pool proof on the blockchain. Please confirm the transaction if your wallet prompts you.'
        }
        onCancel={handleCancelPublishing}
      />

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
