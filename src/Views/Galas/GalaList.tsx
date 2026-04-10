import { useEffect, useMemo, useState } from 'react';
import {
  Search,
  ArrowUpDown,
  Calendar,
  Clock,
  Users,
  Edit3,
  Send,
  Trash2,
  Plus,
  ChevronDown,
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
import useCurrentUserRole from '../../Shared/Auth/useCurrentUserRole';
import { GalaGridSkeleton } from './Components/GalaSkeletons';
import DEFAULT_GALA_IMAGE from '../../assets/general-img-landscape.png';
import showToast from '../../Shared/Utils/toast';
import { createGrantPlatformTransaction } from '../../Services/WalletConnect';

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
    if (url?.startsWith('http')) return url;
    return DEFAULT_GALA_IMAGE;
  };

  const getEmptyMessage = () => {
    if (!debouncedSearchTerm) return 'Start by creating your first gala event.';
    return `No results for "${debouncedSearchTerm}"`;
  };

  const handleAction = async (id: string, action: 'publish' | 'delete') => {
    const successMessages = {
      publish: 'Gala published successfully.',
      delete: 'Gala deleted successfully.',
    };

    try {
      if (action === 'publish') {
        if (isAdmin) {
          await publishAdminGala(id).unwrap();
        } else {
          showToast.info(
            'Please confirm the wallet transaction for your grants.'
          );
          const { transactionHash, walletAddress } =
            await createGrantPlatformTransaction();

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
          await deleteOrganiserGala(id).unwrap();
        }
      }

      showToast.success(successMessages[action]);
    } catch {
      showToast.error(`Unable to ${action} this gala right now.`);
    }
  };

  const renderContent = () => {
    if (isLoading) {
      return <GalaGridSkeleton />;
    }

    if (isEmpty) {
      return (
        <div className="dashboard-empty">
          <div className="empty-content">
            <Search size={48} />
            <h3>No Galas Found</h3>
            <p>{getEmptyMessage()}</p>
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
                      <Calendar size={14} />
                      <span>{formatDate(gala.eventDate)}</span>
                    </div>
                    <div className="meta-item">
                      <Clock size={14} />
                      <span>{gala.eventTime}</span>
                    </div>
                    <div className="meta-item">
                      <Users size={14} />
                      <span>{gala.appliedCount} Applied</span>
                    </div>
                  </div>
                </div>

                <div className="gala-actions">
                  {gala.status === 1 && (
                    <>
                      <button
                        type="button"
                        className="action-btn edit"
                        onClick={() => navigate(`/galas/edit/${gala.id}`)}
                      >
                        <Edit3 size={16} />
                        <span>Edit</span>
                      </button>

                      <button
                        type="button"
                        className="action-btn publish"
                        onClick={() => handleAction(gala.id, 'publish')}
                        disabled={isPublishing}
                      >
                        <Send size={16} />
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
                    <Trash2 size={16} />
                    <span>{isDeleting ? 'Deleting...' : 'Delete'}</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="gala-management-view">
      <HeaderActions>
        <button
          type="button"
          className="header-btn btn-primary"
          onClick={() => navigate('/galas/create')}
        >
          <Plus size={18} />
          <span>Create New Gala</span>
        </button>
      </HeaderActions>

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
