import { useEffect, useState } from 'react';
import {
  Search,
  Filter,
  ArrowUpDown,
  Calendar,
  Clock,
  Users,
  Edit3,
  Send,
  Trash2,
  EyeOff,
  Eye,
  Plus,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './GalaList.scss';
import { HeaderActions, useHeader } from '../../Shared/Context/HeaderContext';
import {
  useGetGalasQuery,
  usePublishGalaMutation,
  useUnpublishGalaMutation,
  useDeleteGalaMutation,
} from '../../Services/Api/module/GalaApi';
import { GalaGridSkeleton } from './Components/GalaSkeletons';
import DEFAULT_GALA_IMAGE from '../../assets/general-img-landscape.png';

function GalaList() {
  const { setTitle, setSubtitle, setBackAction } = useHeader();
  const navigate = useNavigate();

  // API State
  const [searchTerm, setSearchTerm] = useState('');
  const [status, setStatus] = useState<number | undefined>(undefined);
  const [pageNumber] = useState(1);

  const { data: response, isLoading } = useGetGalasQuery({
    searchTerm: searchTerm || undefined,
    status,
    pageNumber,
    pageSize: 10,
  });

  const [publishGala, { isLoading: isPublishing }] = usePublishGalaMutation();
  const [unpublishGala, { isLoading: isUnpublishing }] =
    useUnpublishGalaMutation();
  const [deleteGala, { isLoading: isDeleting }] = useDeleteGalaMutation();

  const galas = response?.data?.items ?? [];
  const totalCount = response?.data?.totalCount ?? 0;

  useEffect(() => {
    setTitle('Gala Management');
    setSubtitle('Manage and announce your gala events');
    setBackAction(false);
  }, [setTitle, setSubtitle, setBackAction]);

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
        return { label: 'Active', class: 'active' };
      case 3:
        return { label: 'Completed', class: 'completed' };
      default:
        return { label: 'Unknown', class: 'unknown' };
    }
  };

  const isEmpty = !isLoading && galas.length === 0;

  const getGalaImage = (url?: string) => {
    if (url?.startsWith('http')) return url;
    return DEFAULT_GALA_IMAGE;
  };

  const getEmptyMessage = () => {
    if (!searchTerm) return 'Start by creating your first gala event.';
    return `No results for "${searchTerm}"`;
  };

  const handleAction = async (
    id: string,
    action: 'publish' | 'unpublish' | 'delete'
  ) => {
    try {
      if (action === 'publish') {
        await publishGala(id).unwrap();
      } else if (action === 'unpublish') {
        await unpublishGala(id).unwrap();
      } else if (action === 'delete') {
        // eslint-disable-next-line no-alert
        if (globalThis.confirm('Are you sure you want to delete this gala?')) {
          await deleteGala(id).unwrap();
        }
      }
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(`Failed to ${action} gala:`, err);
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
              <div className="gala-image">
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
                <div className={`status-tag ${statusDisplay.class}`}>
                  <div className="dot" />
                  {statusDisplay.label}
                </div>
              </div>

              <div className="gala-content">
                <div className="gala-info">
                  <h3 className="gala-title">{gala.name}</h3>
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
                  <button
                    type="button"
                    className="action-btn view"
                    onClick={() => navigate(`/galas/${gala.id}`)}
                  >
                    <Eye size={16} />
                    <span>View Details</span>
                  </button>

                  <button
                    type="button"
                    className="action-btn edit"
                    onClick={() => navigate(`/galas/edit/${gala.id}`)}
                  >
                    <Edit3 size={16} />
                    <span>Edit</span>
                  </button>

                  {gala.status === 1 && (
                    <button
                      type="button"
                      className="action-btn publish"
                      onClick={() => handleAction(gala.id, 'publish')}
                      disabled={isPublishing}
                    >
                      <Send size={16} />
                      <span>{isPublishing ? 'Publishing...' : 'Publish'}</span>
                    </button>
                  )}

                  {gala.status === 2 && (
                    <button
                      type="button"
                      className="action-btn unpublish"
                      onClick={() => handleAction(gala.id, 'unpublish')}
                      disabled={isUnpublishing}
                    >
                      <EyeOff size={16} />
                      <span>
                        {isUnpublishing ? 'Unpublishing...' : 'Unpublish'}
                      </span>
                    </button>
                  )}

                  {gala.status === 3 && (
                    <button
                      type="button"
                      className="action-btn delete"
                      onClick={() => handleAction(gala.id, 'delete')}
                      disabled={isDeleting}
                    >
                      <Trash2 size={16} />
                      <span>{isDeleting ? 'Deleting...' : 'Delete'}</span>
                    </button>
                  )}
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
                value={status ?? ''}
                onChange={(e) =>
                  setStatus(
                    e.target.value === '' ? undefined : Number(e.target.value)
                  )
                }
              >
                <option value="">All Status</option>
                <option value="1">Draft</option>
                <option value="2">Active</option>
                <option value="3">Completed</option>
              </select>
              <Filter size={16} />
            </div>
            <div className="filter-select sort">
              <ArrowUpDown size={16} />
              <span>Sort</span>
            </div>
          </div>
        </div>
      </div>

      {renderContent()}

      {!isLoading && totalCount > 10 && (
        <div className="pagination">
          <p>
            Showing {galas.length} of {totalCount} Galas
          </p>
        </div>
      )}
    </div>
  );
}

export default GalaList;
