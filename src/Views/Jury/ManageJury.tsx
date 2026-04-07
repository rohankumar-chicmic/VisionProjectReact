import { useState, useMemo, useEffect } from 'react';
import {
  Search,
  Mail,
  Phone,
  Building2,
  Briefcase,
  Edit2,
  Trash2,
  UserPlus,
  Users,
  AlertTriangle,
} from 'lucide-react';
import { useHeader, HeaderActions } from '../../Shared/Context/HeaderContext';
import Table, { Column } from '../../Components/Atom/Table/Table';
import CreateJuryModal, { JuryFormData } from './Components/CreateJuryModal';
import Modal from '../../Components/Atom/Modal/Modal';
import {
  useGetJuriesQuery,
  useCreateJuryMutation,
  useUpdateJuryMutation,
  useDeleteJuryMutation,
  JuryMember,
} from '../../Services/Api/module/JuryApi';
import showToast from '../../Shared/Utils/toast';
import './ManageJury.scss';

function UserCell({ jury }: { jury: JuryMember }) {
  return (
    <div className="jury-user-cell">
      <div className="avatar-circle">{jury.fullName.charAt(0)}</div>
      <div className="user-details">
        <span className="name">{jury.fullName}</span>
        <span className="date">Jury Member</span>
      </div>
    </div>
  );
}

function ContactCell({ jury }: { jury: JuryMember }) {
  return (
    <div className="contact-cell">
      <div className="contact-item">
        <Mail size={14} />
        <span>{jury.email}</span>
      </div>
      <div className="contact-item">
        <Phone size={14} />
        <span>{jury.phoneNumber}</span>
      </div>
    </div>
  );
}

function CompanyCell({ jury }: { jury: JuryMember }) {
  return (
    <div className="company-cell">
      <div className="company-item">
        <Building2 size={14} />
        <span>{jury.companyName}</span>
      </div>
      <div className="industry-badge">
        <Briefcase size={12} />
        <span>{jury.domainOfExpertise}</span>
      </div>
    </div>
  );
}

interface ActionsCellProps {
  onEdit: () => void;
  onDelete: () => void;
}

function ActionsCell({ onEdit, onDelete }: ActionsCellProps) {
  return (
    <div className="table-actions">
      <button
        type="button"
        className="action-btn edit"
        title="Edit"
        onClick={(e) => {
          e.stopPropagation();
          onEdit();
        }}
      >
        <Edit2 size={16} />
      </button>
      <button
        type="button"
        className="action-btn delete"
        title="Delete"
        onClick={(e) => {
          e.stopPropagation();
          onDelete();
        }}
      >
        <Trash2 size={16} />
      </button>
    </div>
  );
}

function ManageJury() {
  const { setTitle, setSubtitle, resetHeader } = useHeader();
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingJury, setEditingJury] = useState<JuryFormData | null>(null);

  // Delete modal state
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [juryToDelete, setJuryToDelete] = useState<JuryMember | null>(null);

  const { data: juriesData, isLoading: isFetching } = useGetJuriesQuery();
  const [createJury] = useCreateJuryMutation();
  const [updateJury] = useUpdateJuryMutation();
  const [deleteJury] = useDeleteJuryMutation();

  const juryList = useMemo(() => juriesData?.data || [], [juriesData]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setTitle('Manage Jury');
      setSubtitle('View and manage jury members for your programs');
    }, 0);

    return () => {
      clearTimeout(timeoutId);
      resetHeader();
    };
  }, [setTitle, setSubtitle, resetHeader]);

  const filteredJury = useMemo(() => {
    return juryList.filter(
      (j) =>
        j.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        j.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        j.companyName.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [juryList, searchTerm]);

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

  const JURY_COLUMNS: Column<JuryMember>[] = [
    {
      header: 'Jury Member',
      accessor: (jury) => <UserCell jury={jury} />,
    },
    {
      header: 'Contact Information',
      accessor: (jury) => <ContactCell jury={jury} />,
    },
    {
      header: 'Company & Industry',
      accessor: (jury) => <CompanyCell jury={jury} />,
    },
    {
      header: 'Actions',
      accessor: (jury) => (
        <ActionsCell
          onEdit={() => {
            setEditingJury(jury);
            setIsModalOpen(true);
          }}
          onDelete={() => {
            setJuryToDelete(jury);
            setIsDeleteModalOpen(true);
          }}
        />
      ),
    },
  ];

  const handleCreateOrUpdateJury = async (data: JuryFormData) => {
    try {
      if (editingJury?.id) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { password, ...updateData } = data;
        await updateJury({ id: editingJury.id, body: updateData }).unwrap();
        showToast.success('Jury member updated successfully');
      } else {
        await createJury(data).unwrap();
        showToast.success('Jury member invited successfully');
      }
      setIsModalOpen(false);
      setEditingJury(null);
    } catch (error) {
      showToast.error(
        editingJury ? 'Failed to update jury member' : 'Failed to invite jury member'
      );
    }
  };

  return (
    <div className="manage-jury-page">
      <HeaderActions>
        <button
          type="button"
          className="header-btn btn-primary"
          onClick={() => {
            setEditingJury(null);
            setIsModalOpen(true);
          }}
        >
          <UserPlus size={18} />
          <span>Invite New Jury</span>
        </button>
      </HeaderActions>

      <div className="jury-stats-grid">
        <div className="stat-card">
          <div className="stat-icon jury">
            <Users size={24} />
          </div>
          <div className="stat-content">
            <span className="label">Total Jury</span>
            <span className="value">{juryList.length}</span>
          </div>
        </div>
      </div>

      <div className="table-card">
        <div className="table-header">
          <div className="search-box">
            <Search size={18} />
            <input
              type="text"
              placeholder="Search by name, email or company..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="table-wrapper">
          <Table<JuryMember>
            columns={JURY_COLUMNS}
            data={filteredJury}
            isLoading={isFetching}
          />
        </div>
      </div>

      <CreateJuryModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingJury(null);
        }}
        onSubmit={handleCreateOrUpdateJury}
        initialData={editingJury}
      />

      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Delete Jury Member"
        width="400px"
        footer={
          <div className="modal-actions-footer">
            <button
              type="button"
              className="btn-cancel"
              onClick={() => setIsDeleteModalOpen(false)}
            >
              Cancel
            </button>
            <button
              type="button"
              className="btn-confirm-jury btn-danger"
              style={{ backgroundColor: '#ef4444' }}
              onClick={confirmDelete}
            >
              Delete Member
            </button>
          </div>
        }
      >
        <div className="delete-confirm-modal">
          <div className="icon-box">
            <AlertTriangle size={32} />
          </div>
          <p>
            Are you sure you want to delete <strong>{juryToDelete?.fullName}</strong>?
            <br />
            This action cannot be undone.
          </p>
        </div>
      </Modal>
    </div>
  );
}

export default ManageJury;
