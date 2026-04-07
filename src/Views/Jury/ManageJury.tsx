import { useState, useMemo } from 'react';
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
} from 'lucide-react';
import { useHeader, HeaderActions } from '../../Shared/Context/HeaderContext';
import Table, { Column } from '../../Components/Atom/Table/Table';
import CreateJuryModal from './Components/CreateJuryModal';
import './ManageJury.scss';

export interface JuryMember {
  id: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  companyName: string;
  industryType: string;
  password?: string;
  createdAt: string;
}

const MOCK_JURY: JuryMember[] = [
  {
    id: '1',
    fullName: 'Alex Rivera',
    email: 'alex.rivera@techventure.com',
    phoneNumber: '+1 (555) 0123',
    companyName: 'TechVenture Partners',
    industryType: 'Technology',
    createdAt: '2024-03-15T10:00:00Z',
  },
  {
    id: '2',
    fullName: 'Sarah Chen',
    email: 'sarah.c@healthinnovate.org',
    phoneNumber: '+1 (555) 0456',
    companyName: 'HealthInnovate',
    industryType: 'Health',
    createdAt: '2024-03-18T14:30:00Z',
  },
  {
    id: '3',
    fullName: 'Marcus Thorne',
    email: 'm.thorne@buildright.net',
    phoneNumber: '+1 (555) 0890',
    companyName: 'BuildRight Construction',
    industryType: 'Construction',
    createdAt: '2024-03-20T09:15:00Z',
  },
];

function ManageJury() {
  const { setTitle, setSubtitle, resetHeader } = useHeader();
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [juryList, setJuryList] = useState<JuryMember[]>(MOCK_JURY);

  useMemo(() => {
    setTitle('Manage Jury');
    setSubtitle('View and manage jury members for your programs');
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

  const handleCreateJury = (newJury: Omit<JuryMember, 'id' | 'createdAt'>) => {
    const member: JuryMember = {
      ...newJury,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString(),
    };
    setJuryList((prev) => [member, ...prev]);
    setIsModalOpen(false);
  };

  const columns: Column<JuryMember>[] = [
    {
      header: 'Jury Member',
      accessor: (jury) => (
        <div className="jury-user-cell">
          <div className="avatar-circle">
            {jury.fullName.charAt(0)}
          </div>
          <div className="user-details">
            <span className="name">{jury.fullName}</span>
            <span className="date">Added {new Date(jury.createdAt).toLocaleDateString()}</span>
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
            <span>{jury.industryType}</span>
          </div>
        </div>
      ),
    },
    {
      header: 'Actions',
      accessor: () => (
        <div className="table-actions">
          <button type="button" className="action-btn edit" title="Edit">
            <Edit2 size={16} />
          </button>
          <button type="button" className="action-btn delete" title="Delete">
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
          onClick={() => setIsModalOpen(true)}
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
          <Table<JuryMember>
            columns={columns}
            data={filteredJury}
            isLoading={false}
          />
        </div>
      </div>

      <CreateJuryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreateJury}
      />
    </div>
  );
}

export default ManageJury;
