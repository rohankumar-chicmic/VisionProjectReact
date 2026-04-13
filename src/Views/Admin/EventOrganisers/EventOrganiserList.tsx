import { useState, useEffect, useMemo } from 'react';
import {
  Search,
  ExternalLink,
  ShieldCheck,
  ShieldAlert,
  UserCheck,
} from 'lucide-react';
import { useHeader } from '../../../Shared/Context/HeaderContext';
import Table, { Column } from '../../../Components/Atom/Table/Table';
import Modal from '../../../Components/Atom/Modal/Modal';
import {
  useGetAdminEventOrganisersQuery,
  EventOrganiser,
  useVerifyEventOrganiserMutation,
} from '../../../Services/Api/module/Admin/EventOrganisers';
import showToast from '../../../Shared/Utils/toast';
import './EventOrganiserList.scss';

const renderOrganiserCell = (o: EventOrganiser) => (
  <div className="organiser-cell">
    <div className="avatar-small">{o.fullName.charAt(0)}</div>
    <div className="text-info">
      <span className="name">{o.fullName}</span>
      <span className="email">{o.email}</span>
    </div>
  </div>
);

const renderStatusPill = (o: EventOrganiser) => (
  <span
    className={`status-pill ${o.isVerifiedByAdmin ? 'verified' : 'unverified'}`}
  >
    {o.isVerifiedByAdmin ? (
      <>
        <ShieldCheck size={14} />
        <span>Verified</span>
      </>
    ) : (
      <>
        <ShieldAlert size={14} />
        <span>Pending</span>
      </>
    )}
  </span>
);

const renderActionsCell = (
  o: EventOrganiser,
  onVerify: (organiser: EventOrganiser) => void
) => (
  <div className="table-actions">
    {!o.isVerifiedByAdmin && (
      <button
        type="button"
        className="action-btn verify"
        title="Verify Organiser"
        onClick={(e) => {
          e.stopPropagation();
          onVerify(o);
        }}
      >
        <UserCheck size={18} />
        <span>Verify</span>
      </button>
    )}
    <a
      href={o.governmentIdUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="action-btn link"
      title="View Government ID"
      onClick={(e) => e.stopPropagation()}
    >
      <ExternalLink size={18} />
      <span>Verify ID</span>
    </a>
  </div>
);

const getColumns = (
  onVerify: (o: EventOrganiser) => void
): Column<EventOrganiser>[] => [
  {
    header: 'Organiser',
    accessor: renderOrganiserCell,
  },
  { header: 'Company', accessor: 'companyName' },
  {
    header: 'Registered On',
    accessor: (o) =>
      new Date(o.createdAt).toLocaleDateString('en-US', {
        month: 'short',
        day: '2-digit',
        year: 'numeric',
      }),
  },
  {
    header: 'Status',
    accessor: renderStatusPill,
  },
  {
    header: 'Actions',
    accessor: (o) => renderActionsCell(o, onVerify),
  },
];

function EventOrganiserList() {
  const { setTitle, setSubtitle, setBackAction, resetHeader } = useHeader();
  const [searchTerm, setSearchTerm] = useState('');
  const [verifiedFilter, setVerifiedFilter] = useState<boolean | undefined>(
    undefined
  );
  const [selectedOrganiser, setSelectedOrganiser] =
    useState<EventOrganiser | null>(null);
  const [isVerifyModalOpen, setIsVerifyModalOpen] = useState(false);

  const { data: response, isLoading } = useGetAdminEventOrganisersQuery({
    verifiedOnly: verifiedFilter === true ? true : undefined,
  });

  const [verifyOrganiser, { isLoading: isVerifying }] =
    useVerifyEventOrganiserMutation();

  const handleVerify = async () => {
    if (!selectedOrganiser) return;

    try {
      await verifyOrganiser(selectedOrganiser.id).unwrap();
      showToast.success(
        `Organiser ${selectedOrganiser.fullName} verified successfully`
      );
      setIsVerifyModalOpen(false);
      setSelectedOrganiser(null);
    } catch (error) {
      showToast.error(
        error instanceof Error ? error.message : 'Failed to verify organiser'
      );
    }
  };

  const handleOpenVerifyModal = (o: EventOrganiser) => {
    setSelectedOrganiser(o);
    setIsVerifyModalOpen(true);
  };

  useEffect(() => {
    setTitle('Event Organisers');
    setSubtitle('Review and verify event organiser accounts and documentation');
    setBackAction(false);
    return () => resetHeader();
  }, [setTitle, setSubtitle, setBackAction, resetHeader]);

  const filteredOrganisers = useMemo(() => {
    if (!response?.data) return [];

    let items = response.data;

    if (searchTerm) {
      const lowerSearch = searchTerm.toLowerCase();
      items = items.filter(
        (o) =>
          o.fullName.toLowerCase().includes(lowerSearch) ||
          o.email.toLowerCase().includes(lowerSearch) ||
          o.companyName.toLowerCase().includes(lowerSearch)
      );
    }

    if (verifiedFilter !== undefined) {
      items = items.filter((o) => o.isVerifiedByAdmin === verifiedFilter);
    }

    return items;
  }, [response?.data, searchTerm, verifiedFilter]);

  const columns: Column<EventOrganiser>[] = useMemo(
    () => getColumns(handleOpenVerifyModal),
    []
  );

  return (
    <div className="event-organiser-list-page">
      <div className="list-controls">
        <div className="search-bar">
          <Search size={18} />
          <input
            type="text"
            placeholder="Search organisers by name, email or company..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="filter-tabs">
          <button
            type="button"
            className={`tab-btn ${verifiedFilter === undefined ? 'active' : ''}`}
            onClick={() => setVerifiedFilter(undefined)}
          >
            All
          </button>
          <button
            type="button"
            className={`tab-btn ${verifiedFilter === false ? 'active' : ''}`}
            onClick={() => setVerifiedFilter(false)}
          >
            Pending
          </button>
          <button
            type="button"
            className={`tab-btn ${verifiedFilter === true ? 'active' : ''}`}
            onClick={() => setVerifiedFilter(true)}
          >
            Verified
          </button>
        </div>
      </div>

      <div className="table-container-styled">
        <Table
          columns={columns}
          data={filteredOrganisers}
          isLoading={isLoading}
        />
        {!isLoading && filteredOrganisers.length === 0 && (
          <div className="empty-results">
            <p>No event organisers found matching your filters.</p>
          </div>
        )}
      </div>

      <Modal
        isOpen={isVerifyModalOpen}
        onClose={() => setIsVerifyModalOpen(false)}
        title="Verify Organiser"
        subtitle="Are you sure you want to verify this event organiser?"
        width="450px"
        footer={
          <div className="modal-actions-footer">
            <button
              type="button"
              className="btn-cancel"
              onClick={() => setIsVerifyModalOpen(false)}
              disabled={isVerifying}
            >
              Cancel
            </button>
            <button
              type="button"
              className="btn-confirm-verify"
              style={{
                backgroundColor: '#3b82f6',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                padding: '10px 20px',
                fontWeight: 600,
                cursor: 'pointer',
              }}
              onClick={handleVerify}
              disabled={isVerifying}
            >
              {isVerifying ? 'Verifying...' : 'Confirm Verification'}
            </button>
          </div>
        }
      >
        <div style={{ textAlign: 'center', padding: '24px 0' }}>
          <ShieldCheck
            size={48}
            color="#3b82f6"
            style={{ marginBottom: '16px' }}
          />
          <p style={{ color: '#4b5563', fontSize: '15px' }}>
            You are about to verify{' '}
            <strong>{selectedOrganiser?.fullName}</strong> from{' '}
            <strong>{selectedOrganiser?.companyName}</strong>. This will allow
            them to create and manage events on the platform.
          </p>
        </div>
      </Modal>
    </div>
  );
}

export default EventOrganiserList;
