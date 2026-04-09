import { useEffect, useMemo, useState } from 'react';
import {
  Search,
  Plus,
  Mail,
  Phone,
  Building2,
  Briefcase,
  MoreVertical,
  Edit2,
  Trash2,
  UserPlus,
  Loader2,
} from 'lucide-react';
import { useHeader, HeaderActions } from '../../Shared/Context/HeaderContext';
import Table, { Column } from '../../Components/Atom/Table/Table';
import CreateJuryModal from './Components/CreateJuryModal';
import {
  useCreateOrganiserJuryMutation,
  useDeleteOrganiserJuryMutation,
  useGetOrganiserJuriesQuery,
  useUpdateOrganiserJuryMutation,
  type CreateOrganiserJuryRequest,
  type OrganiserJuryMember,
} from '../../Services/Api/module/Organiser/Jury';
import showToast from '../../Shared/Utils/toast';
import './ManageJury.scss';

function ManageJury() {
  const { setTitle, setSubtitle, resetHeader } = useHeader();
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingJury, setEditingJury] = useState<OrganiserJuryMember | null>(
    null
  );
  const {
    data: juryResponse,
    isLoading,
    isFetching,
  } = useGetOrganiserJuriesQuery();
  const [createJury] = useCreateOrganiserJuryMutation();
  const [updateJury] = useUpdateOrganiserJuryMutation();
  const [deleteJury, { isLoading: isDeleting }] =
    useDeleteOrganiserJuryMutation();

  useEffect(() => {
    setTitle('Manage Jury');
    setSubtitle('View and manage jury members for your programs');
    return () => resetHeader();
  }, [setTitle, setSubtitle, resetHeader]);

  const juryList = useMemo(
    () => juryResponse?.data ?? [],
    [juryResponse?.data]
  );

  const filteredJury = useMemo(() => {
    return juryList.filter(
      (j) =>
        j.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        j.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        j.companyName.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [juryList, searchTerm]);

  const handleCreateOrUpdateJury = async (
    juryData: CreateOrganiserJuryRequest
  ) => {
    try {
      if (editingJury) {
        const payload = {
          id: editingJury.id,
          ...juryData,
          password: juryData.password || 'unchanged-password',
        };
        await updateJury(payload).unwrap();
        showToast.success('Jury member updated successfully');
      } else {
        await createJury(juryData).unwrap();
        showToast.success('Jury member created successfully');
      }

      setIsModalOpen(false);
      setEditingJury(null);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Failed to save jury member';
      showToast.error(message);
    }
  };

  const handleDeleteJury = async (juryId: string) => {
    if (
      isDeleting ||
      !globalThis.confirm('Are you sure you want to delete this jury member?')
    ) {
      return;
    }

    try {
      await deleteJury(juryId).unwrap();
      showToast.success('Jury member deleted successfully');
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Failed to delete jury member';
      showToast.error(message);
    }
  };

  const openCreateModal = () => {
    setEditingJury(null);
    setIsModalOpen(true);
  };

  const columns: Column<OrganiserJuryMember>[] = [
    {
      header: 'Jury Member',
      accessor: (jury) => (
        <div className="jury-user-cell">
          <div className="avatar-circle">{jury.fullName.charAt(0)}</div>
          <div className="user-details">
            <span className="name">{jury.fullName}</span>
            <span className="date">{jury.domainOfExpertise}</span>
          </div>
        </div>
      ),
    },
    {
      header: 'Contact Information',
      accessor: (jury) => (
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
      ),
    },
    {
      header: 'Company & Industry',
      accessor: (jury) => (
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
      ),
    },
    {
      header: 'Actions',
      accessor: (jury) => (
        <div className="table-actions">
          <button
            type="button"
            className="action-btn edit"
            title="Edit"
            onClick={() => {
              setEditingJury(jury);
              setIsModalOpen(true);
            }}
          >
            <Edit2 size={16} />
          </button>
          <button
            type="button"
            className="action-btn delete"
            title="Delete"
            onClick={() => handleDeleteJury(jury.id)}
            disabled={isDeleting}
          >
            <Trash2 size={16} />
          </button>
          <button type="button" className="action-btn more">
            <MoreVertical size={16} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="manage-jury-page">
      <HeaderActions>
        <button
          type="button"
          className="header-btn btn-primary"
          onClick={openCreateModal}
        >
          <UserPlus size={18} />
          <span>Invite New Jury</span>
        </button>
      </HeaderActions>

      <div className="jury-stats-grid">
        <div className="stat-card">
          <div className="stat-icon jury">
            <Plus size={24} />
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
          {isFetching && !juryList.length ? (
            <div className="jury-loading-state">
              <Loader2 className="spin" size={22} />
              <span>Loading jury members...</span>
            </div>
          ) : (
            <Table<OrganiserJuryMember>
            columns={columns}
            data={filteredJury}
            isLoading={isLoading}
          />
          )}
        </div>
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
    </div>
  );
}

export default ManageJury;
