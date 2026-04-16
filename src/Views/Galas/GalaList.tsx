import { useEffect, useMemo, useState } from 'react';
import {
  LayoutGrid,
  List,
  Search,
  ArrowUpDown,
  ChevronDown,
  Plus,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './GalaList.scss';
import { HeaderActions, useHeader } from '../../Shared/Context/HeaderContext';
import {
  useGetAdminGalasQuery,
  usePublishAdminGalaMutation,
  useDeleteAdminGalaMutation,
} from '../../Services/Api/module/Admin/Gala';
import {
  useDeleteOrganiserGalaMutation,
  useGetOrganiserGalasQuery,
  usePublishOrganiserGalaMutation,
} from '../../Services/Api/module/Organiser/Gala';
import { useGetOrganiserProfileQuery } from '../../Services/Api/module/Organiser/Profile';
import useCurrentUserRole from '../../Shared/Auth/useCurrentUserRole';
import { GalaGridSkeleton, GalaListSkeleton } from './Components/GalaSkeletons';
import DEFAULT_GALA_IMAGE from '../../assets/general-img-landscape.png';
import GalaActionOverlay from './Components/GalaActionOverlay';
import showToast from '../../Shared/Utils/toast';
import {
  createGrantPlatformTransaction,
  deleteGalaOnChain,
} from '../../Services/WalletConnect';
import EmptyState from '../../Components/Shared/EmptyState';
import { getAssetUrl } from '../../Shared/Utils/url';
import { formatDateTime } from '../../Shared/Utils/dateUtils';

type GalaSortOption = 'latest' | 'oldest' | 'name-asc' | 'name-desc';

const PAGE_SIZE = 10;
const SEARCH_DEBOUNCE_MS = 300;

function GalaList() {
  const { setTitle, setSubtitle, setBackAction } = useHeader();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [status, setStatus] = useState<number | undefined>(undefined);
  const [sortOption, setSortOption] = useState<GalaSortOption>('latest');
  const [pageNumber] = useState(1);
  const [loadingAction, setLoadingAction] = useState<{
    type: 'publish' | 'delete';
    id: string;
  } | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>(() => {
    return (localStorage.getItem('galaViewMode') as 'grid' | 'list') || 'grid';
  });

  useEffect(() => {
    localStorage.setItem('galaViewMode', viewMode);
  }, [viewMode]);

  const { role } = useCurrentUserRole();
  const isAdmin = role === 'admin' || role === 'sub_admin';
  const isOrganiser = role === 'organiser';

  useEffect(() => {
    const timer = globalThis.setTimeout(() => {
      setDebouncedSearchTerm(searchTerm.trim());
    }, SEARCH_DEBOUNCE_MS);

    return () => globalThis.clearTimeout(timer);
  }, [searchTerm]);

  useEffect(() => {
    setTitle('Gala Management');
    setSubtitle('Create, edit and manage all galas');
    setBackAction(false);
  }, [setTitle, setSubtitle, setBackAction]);

  const queryParams = useMemo(() => {
    const sortMap: Record<
      GalaSortOption,
      { sortBy: string; sortOrder: string }
    > = {
      latest: { sortBy: 'eventDate', sortOrder: 'desc' },
      oldest: { sortBy: 'eventDate', sortOrder: 'asc' },
      'name-asc': { sortBy: 'name', sortOrder: 'asc' },
      'name-desc': { sortBy: 'name', sortOrder: 'desc' },
    };

    return {
      searchTerm: debouncedSearchTerm || undefined,
      status,
      pageNumber,
      pageSize: PAGE_SIZE,
      ...sortMap[sortOption],
    };
  }, [debouncedSearchTerm, pageNumber, sortOption, status]);

  const { data: adminResponse, isLoading: isAdminLoading } =
    useGetAdminGalasQuery(queryParams, { skip: !isAdmin });

  const { data: organiserResponse, isLoading: isOrganiserLoading } =
    useGetOrganiserGalasQuery(queryParams, { skip: !isOrganiser });

  const { data: profileRes } = useGetOrganiserProfileQuery(undefined, {
    skip: !isOrganiser,
  });

  const isVerified = profileRes?.data?.verificationStatus === 'Verified';

  const response = isAdmin ? adminResponse : organiserResponse;
  const isLoading = isAdmin ? isAdminLoading : isOrganiserLoading;

  const [publishAdminGala, { isLoading: isPublishingAdmin }] =
    usePublishAdminGalaMutation();
  const [publishOrganiserGala, { isLoading: isPublishingOrganiser }] =
    usePublishOrganiserGalaMutation();
  const [deleteAdminGala, { isLoading: isDeletingAdmin }] =
    useDeleteAdminGalaMutation();
  const [deleteOrganiserGala, { isLoading: isDeletingOrganiser }] =
    useDeleteOrganiserGalaMutation();
  const isPublishing = isAdmin ? isPublishingAdmin : isPublishingOrganiser;
  const isDeleting = isAdmin ? isDeletingAdmin : isDeletingOrganiser;

  const galas = useMemo(() => {
    const items = response?.data?.items ?? [];

    return [...items].sort((first, second) => {
      if (sortOption === 'name-asc') {
        return first.name.localeCompare(second.name);
      }

      if (sortOption === 'name-desc') {
        return second.name.localeCompare(first.name);
      }

      const firstDate = new Date(first.eventDate).getTime();
      const secondDate = new Date(second.eventDate).getTime();

      if (Number.isNaN(firstDate) || Number.isNaN(secondDate)) {
        return 0;
      }

      return sortOption === 'oldest'
        ? firstDate - secondDate
        : secondDate - firstDate;
    });
  }, [response?.data?.items, sortOption]);

  const totalCount = response?.data?.totalCount ?? 0;
  const isEmpty = !isLoading && galas.length === 0;

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

  const getGalaImage = (url?: string) => {
    return getAssetUrl(url) || DEFAULT_GALA_IMAGE;
  };

  const handleAction = async (id: string, action: 'publish' | 'delete') => {
    const successMessages = {
      publish: 'Gala published successfully.',
      delete: 'Gala deleted successfully.',
    };

    try {
      setLoadingAction({ type: action, id });
      if (action === 'publish') {
        if (isAdmin) {
          await publishAdminGala(id).unwrap();
        } else {
          showToast.info(
            'Please confirm the wallet transaction for your grants.'
          );
          const galaToPublish = galas.find((g) => g.id === id);
          // Use totalGalaValue from API (authoritative), fallback to sum of grant prizeAmounts.
          // prizeAmount IS the total pool per grant — do NOT multiply by numberOfPrizes.
          const totalPrizePoolValue =
            (galaToPublish?.totalGalaValue ?? 0) ||
            galaToPublish?.grants?.reduce(
              (acc, grant) => acc + (grant.prizeAmount || 0),
              0
            ) ||
            0;

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
      } else {
        // eslint-disable-next-line no-alert
        if (!globalThis.confirm('Are you sure you want to delete this gala?')) {
          return;
        }

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
      }

      showToast.success(successMessages[action]);
    } catch {
      showToast.error(`Unable to ${action} this gala right now.`);
    } finally {
      setLoadingAction(null);
    }
  };

  const getOverlayInfo = () => {
    if (!loadingAction) return { isOpen: false, title: '', message: '' };

    if (loadingAction.type === 'publish') {
      return {
        isOpen: true,
        title: 'Publishing Gala',
        message: isAdmin
          ? 'Please wait while we verify and publish your gala securely.'
          : 'Verifying prize pool on the blockchain. Please confirm the transaction if your wallet prompts you.',
      };
    }

    return {
      isOpen: true,
      title: 'Deleting Gala',
      message: isAdmin
        ? 'Please wait while we process the deletion request.'
        : 'Removing gala data from the blockchain and platform. Please confirm the transaction in your wallet.',
    };
  };

  const overlayInfo = getOverlayInfo();

  const renderContent = () => {
    if (isLoading) {
      return viewMode === 'grid' ? <GalaGridSkeleton /> : <GalaListSkeleton />;
    }

    if (isEmpty) {
      return (
        <EmptyState
          icon={Search}
          title="No galas found"
          description={
            debouncedSearchTerm
              ? `We couldn't find any gala events matching "${debouncedSearchTerm}".`
              : "You haven't created any gala events yet. Create your first one to get started!"
          }
          action={
            debouncedSearchTerm ? (
              <button
                type="button"
                className="header-btn btn-outline"
                onClick={() => setSearchTerm('')}
              >
                Clear Search
              </button>
            ) : undefined
          }
        />
      );
    }

    if (viewMode === 'list') {
      return (
        <div
          className={`galas-list-view ${isAdmin ? 'view-admin' : 'view-organiser'}`}
        >
          <div className="list-header">
            <div className="col-image" />
            <div className="col-details">Gala Info</div>
            <div className="col-status">Status</div>
            <div className="col-date">Event Date</div>
            <div className="col-applicants">Applied</div>
            {!isAdmin && <div className="col-actions">Actions</div>}
          </div>
          <div className="list-body">
            {galas.map((gala) => {
              const statusDisplay = getStatusDisplay(gala.status);
              return (
                <div
                  key={gala.id}
                  className="gala-list-item"
                  role="button"
                  tabIndex={0}
                  onClick={() => navigate(`/galas/${gala.id}`)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      navigate(`/galas/${gala.id}`);
                    }
                  }}
                >
                  <div className="col-image">
                    <img
                      src={getGalaImage(gala.coverImageUrl)}
                      alt={gala.name}
                    />
                  </div>
                  <div className="col-details">
                    <div className="gala-name">{gala.name}</div>
                    {isAdmin && gala.createdByFullName ? (
                      <div
                        className="gala-about"
                        style={{ color: '#475569', fontWeight: 500 }}
                      >
                        Created by: {gala.createdByFullName}
                      </div>
                    ) : (
                      <div className="gala-about">{gala.about}</div>
                    )}
                  </div>
                  <div className="col-status">
                    <span className={`status-pill ${statusDisplay.class}`}>
                      {statusDisplay.label}
                    </span>
                  </div>
                  <div className="col-date">
                    <div className="date">{formatDateTime(gala.eventDate)}</div>
                  </div>
                  <div className="col-applicants">
                    <span className="count">{gala.appliedCount}</span>
                    <span className="label">Applications</span>
                  </div>
                  {!isAdmin && (
                    <div
                      className="col-actions"
                      role="presentation"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {gala.status === 1 && (
                        <button
                          type="button"
                          className="action-btn-small publish"
                          onClick={() => {
                            if (!isVerified) {
                              showToast.error('Your account is not verified');
                              return;
                            }
                            handleAction(gala.id, 'publish');
                          }}
                          disabled={isPublishing}
                          title={
                            !isVerified ? 'Verify your account to publish' : ''
                          }
                        >
                          Publish
                        </button>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      );
    }

    return (
      <div className="gala-grid">
        {galas.map((gala) => {
          const statusDisplay = getStatusDisplay(gala.status);

          return (
            <div key={gala.id} className="gala-card">
              <button
                type="button"
                className="gala-image"
                onClick={() => navigate(`/galas/${gala.id}`)}
              >
                <img
                  src={getGalaImage(gala.coverImageUrl)}
                  alt={gala.name}
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    if (target.src !== DEFAULT_GALA_IMAGE) {
                      target.src = DEFAULT_GALA_IMAGE;
                    }
                  }}
                />
              </button>

              <div className="gala-content">
                <div className="gala-info">
                  <div className="gala-top-row">
                    <button
                      type="button"
                      className="gala-title-button"
                      onClick={() => navigate(`/galas/${gala.id}`)}
                    >
                      <h3 className="gala-title">{gala.name}</h3>
                    </button>
                    <div className={`status-tag ${statusDisplay.class}`}>
                      <div className="dot" />
                      {statusDisplay.label}
                    </div>
                  </div>

                  <p className="gala-description">{gala.about}</p>

                  <div className="gala-meta">
                    <div className="meta-item">
                      <span>{formatDateTime(gala.eventDate)}</span>
                    </div>
                    <div className="meta-item">
                      <span>{gala.eventTime}</span>
                    </div>
                    <div className="meta-item">
                      <span>{gala.appliedCount} Applied</span>
                    </div>
                    {isAdmin && gala.createdByFullName && (
                      <div className="meta-item">
                        <span style={{ fontWeight: 600, color: '#3b82f6' }}>
                          By {gala.createdByFullName}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {!isAdmin && (
                  <div className="gala-actions">
                    {gala.status === 1 && (
                      <>
                        <button
                          type="button"
                          className="action-btn edit"
                          onClick={() => navigate(`/galas/edit/${gala.id}`)}
                        >
                          <span>Edit</span>
                        </button>
                        <button
                          type="button"
                          className="action-btn publish"
                          onClick={() => {
                            if (!isVerified) {
                              showToast.error('Your account is not verified');
                              return;
                            }
                            handleAction(gala.id, 'publish');
                          }}
                          disabled={isPublishing}
                          title={
                            !isVerified ? 'Verify your account to publish' : ''
                          }
                        >
                          <span>
                            {isPublishing ? 'Publishing...' : 'Publish'}
                          </span>
                        </button>
                      </>
                    )}

                    <button
                      type="button"
                      className="action-btn delete"
                      onClick={() => handleAction(gala.id, 'delete')}
                      disabled={isDeleting}
                    >
                      <span>{isDeleting ? 'Deleting...' : 'Delete'}</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="gala-management-view">
      {!isAdmin && (
        <HeaderActions>
          <button
            type="button"
            className="header-btn btn-primary"
            onClick={() => {
              if (!isVerified) {
                showToast.error('Your account is not verified');
                return;
              }
              navigate('/galas/create');
            }}
            title={!isVerified ? 'Verify your account to create galas' : ''}
          >
            <Plus size={18} />
            <span>Create New Gala</span>
          </button>
        </HeaderActions>
      )}

      <GalaActionOverlay
        isOpen={overlayInfo.isOpen}
        title={overlayInfo.title}
        message={overlayInfo.message}
      />

      <div className="view-header">
        <div className="header-actions">
          <div className="search-box">
            <Search size={18} />
            <input
              type="text"
              placeholder="Search galas..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="filter-group">
            <div className="filter-select">
              <select
                aria-label="Filter galas by status"
                value={status ?? ''}
                onChange={(e) =>
                  setStatus(
                    e.target.value === '' ? undefined : Number(e.target.value)
                  )
                }
              >
                <option value="">All Status</option>
                <option value="1">Draft</option>
                <option value="2">Upcoming</option>
                <option value="3">Active</option>
                <option value="4">Completed</option>
              </select>
              <ChevronDown size={16} />
            </div>

            <div className="filter-select sort">
              <ArrowUpDown size={16} />
              <select
                aria-label="Sort galas"
                value={sortOption}
                onChange={(e) =>
                  setSortOption(e.target.value as GalaSortOption)
                }
              >
                <option value="latest">Latest</option>
                <option value="oldest">Oldest</option>
                <option value="name-asc">Name A-Z</option>
                <option value="name-desc">Name Z-A</option>
              </select>
            </div>

            <div className="view-toggle">
              <button
                type="button"
                className={`toggle-btn ${viewMode === 'list' ? 'active' : ''}`}
                onClick={() => setViewMode('list')}
                title="List View"
              >
                <List size={20} />
              </button>
              <button
                type="button"
                className={`toggle-btn ${viewMode === 'grid' ? 'active' : ''}`}
                onClick={() => setViewMode('grid')}
                title="Grid View"
              >
                <LayoutGrid size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {renderContent()}

      {!isLoading && totalCount > PAGE_SIZE && (
        <div className="pagination">
          <p>
            Showing {galas.length} of {totalCount} galas
          </p>
        </div>
      )}
    </div>
  );
}

export default GalaList;
