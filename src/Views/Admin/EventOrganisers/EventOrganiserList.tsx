import { useState, useEffect, useMemo } from 'react';
import {
  Search,
  ExternalLink,
  ShieldCheck,
  ShieldAlert,
  UserCheck,
  XCircle,
  Ban,
  Unlock,
} from 'lucide-react';
import { useHeader } from '../../../Shared/Context/HeaderContext';
import Table, { Column } from '../../../Components/Atom/Table/Table';
import Modal from '../../../Components/Atom/Modal/Modal';
import {
  useGetAdminEventOrganisersQuery,
  EventOrganiser,
  useVerifyEventOrganiserMutation,
  useRejectEventOrganiserMutation,
  useBlockEventOrganiserMutation,
} from '../../../Services/Api/module/Admin/EventOrganisers';
import { getAssetUrl } from '../../../Shared/Utils/url';
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

const renderStatusPill = (o: EventOrganiser) => {
  let status = 'Pending';
  if (o.isVerifiedByAdmin) {
    status = 'Verified';
  } else if (o.isRejected) {
    status = 'Rejected';
  }

  return (
    <span className={`status-pill ${status.toLowerCase()}`}>
      {status === 'Verified' && <ShieldCheck size={14} />}
      {status === 'Pending' && <ShieldAlert size={14} />}
      {status === 'Rejected' && <XCircle size={14} />}
      <span>{status}</span>
    </span>
  );
};

const renderActionsCell = (
  o: EventOrganiser,
  onVerify: (organiser: EventOrganiser) => void,
  onReject: (organiser: EventOrganiser) => void,
  onBlock: (organiser: EventOrganiser) => void
) => (
  <div className="table-actions">
    <div className="action-group primary">
      {!o.isVerifiedByAdmin && (
        <>
          <button
            type="button"
            className="action-btn verify"
            title="Verify Organiser"
            onClick={(e) => {
              e.stopPropagation();
              onVerify(o);
            }}
          >
            <UserCheck size={16} />
            <span>Verify</span>
          </button>
          <button
            type="button"
            className="action-btn reject"
            title={o.isRejected ? 'Update Rejection' : 'Reject Organiser'}
            onClick={(e) => {
              e.stopPropagation();
              onReject(o);
            }}
          >
            <XCircle size={16} />
            <span>{o.isRejected ? 'Re-Reject' : 'Reject'}</span>
          </button>
        </>
      )}
    </div>
    <div className="action-group secondary">
      <button
        type="button"
        className={`action-btn ${o.isBlocked ? 'unblock' : 'block'}`}
        title={o.isBlocked ? 'Unblock Organiser' : 'Block Organiser'}
        onClick={(e) => {
          e.stopPropagation();
          onBlock(o);
        }}
      >
        {o.isBlocked ? <Unlock size={16} /> : <Ban size={16} />}
        <span>{o.isBlocked ? 'Unblock' : 'Block'}</span>
      </button>
      <a
        href={getAssetUrl(o.governmentIdUrl)}
        target="_blank"
        rel="noopener noreferrer"
        className="action-btn link"
        title="View Government ID"
        onClick={(e) => e.stopPropagation()}
      >
        <ExternalLink size={16} />
        <span>View ID</span>
      </a>
    </div>
  </div>
);

const getColumns = (
  onVerify: (o: EventOrganiser) => void,
  onReject: (o: EventOrganiser) => void,
  onBlock: (o: EventOrganiser) => void
): Column<EventOrganiser>[] => [
  {
    header: 'Organiser',
    accessor: renderOrganiserCell,
  },
  { header: 'Company', accessor: 'companyName' },
  {
    header: 'Published Galas',
    accessor: (o) => (
      <div
        className="published-galas-cell"
        title={
          o.publishedGalas?.length
            ? o.publishedGalas.map((g) => g.name).join(', ')
            : 'No published galas'
        }
      >
        <span>{o.publishedGalas?.length || 0}</span>
      </div>
    ),
  },
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
    accessor: (o) => renderActionsCell(o, onVerify, onReject, onBlock),
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
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');

  const { data: response, isLoading } = useGetAdminEventOrganisersQuery({
    verifiedOnly: verifiedFilter === true ? true : undefined,
  });

  const [verifyOrganiser, { isLoading: isVerifying }] =
    useVerifyEventOrganiserMutation();
  const [rejectOrganiser, { isLoading: isRejecting }] =
    useRejectEventOrganiserMutation();
  const [blockOrganiser] = useBlockEventOrganiserMutation();

  const handleBlock = async (o: EventOrganiser) => {
    try {
      await blockOrganiser({ id: o.id, isBlocked: !o.isBlocked }).unwrap();
      showToast.success(
        `Organiser ${o.fullName} has been ${
          o.isBlocked ? 'unblocked' : 'blocked'
        }.`
      );
    } catch (error: unknown) {
      if (error && typeof error === 'object' && 'data' in error) {
        const rtkError = error as { data: { message?: string } };
        if (rtkError.data.message) {
          showToast.error(rtkError.data.message);
        }
      } else if (error instanceof Error) {
        showToast.error(error.message);
      } else {
        showToast.error('Failed to change block status for this organiser.');
      }
    }
  };

  const handleVerify = async () => {
    if (!selectedOrganiser) return;

    try {
      await verifyOrganiser(selectedOrganiser.id).unwrap();
      showToast.success(
        `Organiser ${selectedOrganiser.fullName} verified successfully`
      );
      setIsVerifyModalOpen(false);
      setSelectedOrganiser(null);
    } catch (error: unknown) {
      if (error && typeof error === 'object' && 'data' in error) {
        const rtkError = error as { data: { message?: string } };
        if (rtkError.data.message) {
          showToast.error(rtkError.data.message);
        }
      } else if (error instanceof Error) {
        showToast.error(error.message);
      } else {
        showToast.error('Failed to verify organiser');
      }
    }
  };

  const handleReject = async () => {
    if (!selectedOrganiser || !rejectionReason.trim()) {
      showToast.error('Please provide a reason for rejection');
      return;
    }

    try {
      await rejectOrganiser({
        id: selectedOrganiser.id,
        reason: rejectionReason,
      }).unwrap();
      showToast.success(`Organiser ${selectedOrganiser.fullName} rejected`);
      setIsRejectModalOpen(false);
      setSelectedOrganiser(null);
      setRejectionReason('');
    } catch (error: unknown) {
      if (error && typeof error === 'object' && 'data' in error) {
        const rtkError = error as { data: { message?: string } };
        if (rtkError.data.message) {
          showToast.error(rtkError.data.message);
        }
      } else if (error instanceof Error) {
        showToast.error(error.message);
      } else {
        showToast.error('Failed to reject organiser');
      }
    }
  };

  const handleOpenVerifyModal = (o: EventOrganiser) => {
    setSelectedOrganiser(o);
    setIsVerifyModalOpen(true);
  };

  const handleOpenRejectModal = (o: EventOrganiser) => {
    setSelectedOrganiser(o);
    setIsRejectModalOpen(true);
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
    () => getColumns(handleOpenVerifyModal, handleOpenRejectModal, handleBlock),
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

      <Modal
        isOpen={isRejectModalOpen}
        onClose={() => setIsRejectModalOpen(false)}
        title="Reject Organiser"
        subtitle="Please provide a reason for rejecting this organiser"
        width="500px"
        footer={
          <div className="modal-actions-footer">
            <button
              type="button"
              className="btn-cancel"
              onClick={() => setIsRejectModalOpen(false)}
              disabled={isRejecting}
            >
              Cancel
            </button>
            <button
              type="button"
              className="btn-confirm-reject"
              style={{
                backgroundColor: '#ef4444',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                padding: '10px 20px',
                fontWeight: 600,
                cursor: 'pointer',
              }}
              onClick={handleReject}
              disabled={isRejecting}
            >
              {isRejecting ? 'Rejecting...' : 'Confirm Rejection'}
            </button>
          </div>
        }
      >
        <div className="rejection-modal-body" style={{ padding: '16px 0' }}>
          <div
            className="selected-organiser-info"
            style={{
              marginBottom: '20px',
              padding: '12px',
              background: '#fef2f2',
              borderRadius: '12px',
              border: '1px solid #fee2e2',
            }}
          >
            <p style={{ margin: 0, fontSize: '14px', color: '#991b1b' }}>
              Rejecting: <strong>{selectedOrganiser?.fullName}</strong> (
              {selectedOrganiser?.companyName})
            </p>
          </div>
          <div className="form-group">
            <label
              htmlFor="rejection-reason"
              style={{
                display: 'block',
                marginBottom: '8px',
                fontWeight: 600,
                color: '#374151',
                fontSize: '14px',
              }}
            >
              Rejection Reason
              <textarea
                id="rejection-reason"
                placeholder="Explain why this organiser is being rejected..."
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                style={{
                  width: '100%',
                  minHeight: '120px',
                  padding: '12px',
                  borderRadius: '10px',
                  border: '1px solid #d1d5db',
                  marginTop: '8px',
                  fontSize: '14px',
                  outline: 'none',
                  transition: 'border-color 0.2s',
                }}
              />
            </label>
            <p style={{ marginTop: '8px', fontSize: '12px', color: '#6b7280' }}>
              This reason will be shown to the organiser on their dashboard.
            </p>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default EventOrganiserList;
