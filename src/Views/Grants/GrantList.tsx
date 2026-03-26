import React, { useEffect } from 'react';
import { 
  Search, 
  ArrowUpDown, 
  Award, 
  DollarSign, 
  Calendar, 
  Users, 
  Plus, 
  Edit3, 
  Send, 
  Trash2,
  CheckCircle2
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useHeader, HeaderActions } from '../../Shared/Context/HeaderContext';
import KpiCard from '../../Components/Shared/KpiCard';
import './GrantList.scss';

// Simple EyeOff fallback
const EyeOff: React.FC<{ size: number }> = ({ size }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
  >
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
    <line x1="1" y1="1" x2="23" y2="23" />
  </svg>
);

const GrantList: React.FC = () => {
  const { setTitle, setSubtitle, setBackAction, resetHeader } = useHeader();
  const navigate = useNavigate();

  useEffect(() => {
    setTitle('Grant Management');
    setSubtitle('Create and manage grant programs');
    setBackAction(false);
    return () => resetHeader();
  }, [setTitle, setSubtitle, setBackAction, resetHeader]);

  const kpis = [
    { label: 'Total Grants', value: '32', trend: '+15%', trendType: 'up' as const, color: '#a855f7', icon: <Award size={20} /> },
    { label: 'Active Programs', value: '18', trend: '+8%', trendType: 'up' as const, color: '#10b981', icon: <CheckCircle2 size={20} /> },
    { label: 'Total Fund Amount', value: '$2.4M', trend: '+32%', trendType: 'up' as const, color: '#f59e0b', icon: <DollarSign size={20} /> },
    { label: 'Total Applicants', value: '856', trend: '+24%', trendType: 'up' as const, color: '#3b82f6', icon: <Users size={20} /> },
  ];

  const grants = [
    {
      id: 1,
      title: 'Merit Grant 2024',
      status: 'Active',
      description: 'Full tuition coverage for outstanding academic achievement',
      amount: '$50,000',
      deadline: 'May 30, 2024',
      applied: '156 applied',
      criteria: ['Must attend gala event', 'Must be registered business entity'],
    },
    {
      id: 2,
      title: 'STEM Excellence Award',
      status: 'Active',
      description: 'Supporting students pursuing careers in science and technology',
      amount: '$25,000',
      deadline: 'June 15, 2024',
      applied: '89 applied',
      criteria: ['Must be registered business entity', 'Must attend gala event'],
    },
    {
      id: 3,
      title: 'Community Leader Grant',
      status: 'Closing Soon',
      description: 'Recognizing students with exceptional community service records',
      amount: '$15,000',
      deadline: 'Mar 25, 2024',
      applied: '234 applied',
      criteria: ['Active technology development', 'Must be registered business entity'],
    },
    {
      id: 4,
      title: 'Athletic Achievement Fund',
      status: 'Closed',
      description: 'For student athletes demonstrating excellence in sports and academics',
      amount: '$20,000',
      deadline: 'Feb 28, 2024',
      applied: '167 applied',
      criteria: ['Must be registered business entity', 'Must attend gala event', 'Active technology development'],
    },
    {
      id: 5,
      title: 'Women in Tech Grant',
      status: 'Draft',
      description: 'Empowering female students pursuing technology careers',
      amount: '$30,000',
      deadline: 'Not set',
      applied: '0 applied',
      criteria: ['Must be registered business entity', 'Active technology development', 'Must attend gala event'],
    },
  ];

  return (
    <div className="grant-management-page">
      <HeaderActions>
        <button className="header-btn btn-primary" onClick={() => navigate('/grants/create')}>
          <Plus size={18} />
          <span>Add New Grant</span>
        </button>
      </HeaderActions>

      <div className="kpi-grid">
        {kpis.map((kpi, idx) => (
          <KpiCard key={idx} {...kpi} period="Since last month" />
        ))}
      </div>

      <div className="view-controls">
        <div className="search-bar">
          <Search size={18} />
          <input type="text" placeholder="Search grants..." />
        </div>
        <div className="filters">
          <select className="filter-select">
            <option>All Status</option>
          </select>
          <select className="filter-select">
            <option>All Types</option>
          </select>
          <button className="sort-btn">
            <ArrowUpDown size={16} />
            <span>Sort</span>
          </button>
        </div>
      </div>

      <div className="grants-grid">
        {grants.map((grant) => (
          <div key={grant.id} className="grant-card">
            <div className="card-header">
              <h3 className="grant-title">{grant.title}</h3>
              <span className={`status-badge ${grant.status.toLowerCase().replace(' ', '-')}`}>
                {grant.status}
              </span>
            </div>
            <p className="grant-description">{grant.description}</p>
            
            <div className="grant-meta">
              <div className="meta-item">
                <DollarSign size={16} />
                <span className="label">Award Amount</span>
                <span className="value">{grant.amount}</span>
              </div>
              <div className="meta-item">
                <Calendar size={16} />
                <span className="label">Deadline</span>
                <span className="value">{grant.deadline}</span>
              </div>
              <div className="meta-item">
                <Users size={16} />
                <span className="label">Applicants</span>
                <span className="value">{grant.applied}</span>
              </div>
            </div>

            <div className="eligibility-section">
              <span className="section-title">Eligibility Criteria</span>
              <div className="criteria-chips">
                {grant.criteria.map((chip, idx) => (
                  <span key={idx} className="chip">{chip}</span>
                ))}
              </div>
            </div>

            <div className="card-actions">
              {grant.status === 'Closed' ? (
                <>
                  <button className="action-btn reopen">
                    <Send size={16} />
                    <span>Reopen</span>
                  </button>
                  <button className="action-btn delete">
                    <Trash2 size={16} />
                    <span>Delete</span>
                  </button>
                </>
              ) : grant.status === 'Draft' ? (
                <>
                  <button className="action-btn edit">
                    <Edit3 size={16} />
                    <span>Edit</span>
                  </button>
                  <button className="action-btn delete">
                    <Trash2 size={16} />
                    <span>Delete</span>
                  </button>
                  <button className="action-btn publish-main">
                    <Send size={16} />
                    <span>Publish</span>
                  </button>
                </>
              ) : (
                <>
                  <button className="action-btn edit">
                    <Edit3 size={16} />
                    <span>Edit</span>
                  </button>
                  <button className="action-btn unpublish">
                    <EyeOff size={16} />
                    <span>Unpublish</span>
                  </button>
                  <button className="action-btn delete">
                    <Trash2 size={16} />
                    <span>Delete</span>
                  </button>
                </>
              )}
            </div>
          </div>
        ))}

        <div className="grant-card add-new-placeholder" onClick={() => navigate('/grants/create')}>
          <div className="plus-icon-box">
            <Plus size={32} />
          </div>
          <h3>Add New Grant</h3>
          <p>Create a new Grant program</p>
        </div>
      </div>
    </div>
  );
};

export default GrantList;
