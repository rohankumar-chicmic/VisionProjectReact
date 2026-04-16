import { useState, useMemo, useEffect } from 'react';
import {
  Search,
  Edit2,
  Trash2,
  Users,
  AlertTriangle,
  Loader2,
  Plus,
  Building2,
} from 'lucide-react';
import { HeaderActions, useHeader } from '../../Shared/Context/HeaderContext';
import CreateJuryModal from './Components/CreateJuryModal';
import {
  useCreateOrganiserJuryMutation,
  useDeleteOrganiserJuryMutation,
  useGetOrganiserJuriesQuery,
  useUpdateOrganiserJuryMutation,
  type CreateOrganiserJuryRequest,
  type OrganiserJuryMember,
} from '../../Services/Api/module/Organiser/Jury';
import Modal from '../../Components/Atom/Modal/Modal';
import showToast from '../../Shared/Utils/toast';
import './ManageJury.scss';

interface MemberCardProps {
  jury: OrganiserJuryMember;
  onEdit: (jury: OrganiserJuryMember) => void;
  onDelete: (jury: OrganiserJuryMember) => void;
}

const getAvatarStyle = (name: string) => {
  const colors = [
    { bg: '#ecfdf5', text: '#059669' }, // Green
    { bg: '#eff6ff', text: '#2563eb' }, // Blue
    { bg: '#fff7ed', text: '#ea580c' }, // Orange
    { bg: '#fef2f2', text: '#dc2626' }, // Red
    { bg: '#f5f3ff', text: '#7c3aed' }, // Purple
  ];
  const index = name.charCodeAt(0) % colors.length;
  return {
    backgroundColor: colors[index].bg,
    color: colors[index].text,
  };
};

function JuryMemberCard({ jury, onEdit, onDelete }: Readonly<MemberCardProps>) {
  return (
    <div className="jury-member-card">
      <div className="card-left">
        <div className="member-avatar" style={getAvatarStyle(jury.fullName)}>
          {jury.fullName.charAt(0)}
        </div>
        <div className="member-info">
          <div className="name-row">
            <h3 className="member-name">{jury.fullName}</h3>
          </div>
          <div className="member-details">
            <div className="detail-line">
              <span>{jury.email}</span>
              <span className="dot">•</span>
              <span>{jury.phoneNumber}</span>
            </div>
            <div className="detail-line secondary">
              <Building2 size={14} />
              <span>{jury.companyName}</span>
              <span className="dot">•</span>
              <span>{jury.domainOfExpertise}</span>
            </div>
          </div>
        </div>
      </div>
      <div className="card-actions">
        <button
          type="button"
          className="icon-action-btn edit"
          onClick={() => onEdit(jury)}
          title="Edit Jury Member"
        >
          <Edit2 size={18} strokeWidth={2} />
        </button>
        <button
          type="button"
          className="icon-action-btn delete"
          onClick={() => onDelete(jury)}
          title="Delete Jury Member"
        >
          <Trash2 size={18} strokeWidth={2} />
        </button>
      </div>
    </div>
  );
}

function ManageJury() {
  const { setTitle, setSubtitle, resetHeader } = useHeader();
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingJury, setEditingJury] = useState<OrganiserJuryMember | null>(
    null
  );

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [juryToDelete, setJuryToDelete] = useState<OrganiserJuryMember | null>(
    null
  );

  const { data: juriesData, isLoading } = useGetOrganiserJuriesQuery();
  const [createJury] = useCreateOrganiserJuryMutation();
  const [updateJury] = useUpdateOrganiserJuryMutation();
  const [deleteJury, { isLoading: isDeleting }] =
    useDeleteOrganiserJuryMutation();

  const juryList = useMemo(() => juriesData?.data || [], [juriesData]);

  useEffect(() => {
    setTitle('Jury Management');
    setSubtitle('Invite and manage your expert jury members');
    return () => resetHeader();
  }, [setTitle, setSubtitle, resetHeader]);

  const filteredJury = useMemo(() => {
    return juryList.filter(
      (j) =>
        j.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        j.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        j.companyName.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [juryList, searchTerm]);

  const handleCreateOrUpdateJury = async (data: CreateOrganiserJuryRequest) => {
    try {
      if (editingJury?.id) {
        const payload = {
          id: editingJury.id,
          ...data,
          password: data.password || 'unchanged-password',
        };
        await updateJury(payload).unwrap();
        showToast.success('Jury member updated successfully');
      } else {
        await createJury(data).unwrap();
        showToast.success('Jury member invited successfully');
      }
      setIsModalOpen(false);
      setEditingJury(null);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Failed to save jury member';
      showToast.error(message);
    }
  };

  const confirmDelete = async () => {
    if (!juryToDelete) return;
    try {
      await deleteJury(juryToDelete.id).unwrap();
      showToast.success('Jury member deleted successfully');
      setIsDeleteModalOpen(false);
      setJuryToDelete(null);
    } catch (error) {
      showToast.error('Failed to delete jury member');
    }
  };

  return (
    <div className="jury-management-page">
      <HeaderActions>
        <button
          type="button"
          className="header-btn btn-primary"
          onClick={() => {
            setEditingJury(null);
            setIsModalOpen(true);
          }}
        >
          <Plus size={18} />
          <span>Invite Jury Member</span>
        </button>
      </HeaderActions>

      <div className="view-header">
        <div className="header-actions">
          <div className="search-box">
            <Search size={18} />
            <input
              type="text"
              placeholder="Search jury members by name, email or company..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="stats-indicator">
            <Users size={16} />
            <span>Total: {juryList.length}</span>
          </div>
        </div>
      </div>

      <div className="juries-list-container">
        {(() => {
          if (isLoading && !juryList.length) {
            return (
              <div className="loading-state">
                <Loader2 className="spin" size={32} />
                <span>Loading jury members...</span>
              </div>
            );
          }

          if (filteredJury.length > 0) {
            return (
              <div className="jury-grid">
                {filteredJury.map((jury) => (
                  <JuryMemberCard
                    key={jury.id}
                    jury={jury}
                    onEdit={(j) => {
                      setEditingJury(j);
                      setIsModalOpen(true);
                    }}
                    onDelete={(j) => {
                      setJuryToDelete(j);
                      setIsDeleteModalOpen(true);
                    }}
                  />
                ))}
              </div>
            );
          }

          return (
            <div className="empty-state">
              <div className="icon-circle">
                <Users size={48} />
              </div>
              <h3>No Jury Members Found</h3>
              <p>
                {searchTerm
                  ? `No results for "${searchTerm}"`
                  : 'Invite your first jury member to get started!'}
              </p>
            </div>
          );
        })()}
      </div>

      <CreateJuryModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingJury(null);
        }}
        onSubmit={handleCreateOrUpdateJury}
        initialValues={editingJury}
      />

      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Delete Jury Member"
        subtitle="This action will remove the member from all assigned evaluations."
        width="440px"
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
              className="btn-confirm-delete"
              onClick={confirmDelete}
              disabled={isDeleting}
            >
              {isDeleting ? 'Removing...' : 'Remove Member'}
            </button>
          </div>
        }
      >
        <div className="delete-confirm-modal">
          <div className="icon-box">
            <AlertTriangle size={32} />
          </div>
          <p>
            Are you sure you want to remove{' '}
            <strong>{juryToDelete?.fullName}</strong> from your jury?
          </p>
        </div>
      </Modal>
    </div>
  );
}

export default ManageJury;
