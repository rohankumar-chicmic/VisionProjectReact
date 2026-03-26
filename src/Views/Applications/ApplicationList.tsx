import React, { useEffect, useState } from 'react';
import { 
  Search, 
  ChevronDown, 
  Download, 
  CheckCircle2, 
  XCircle, 
  Eye, 
  Filter,
  Star
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useHeader, HeaderActions } from '../../Shared/Context/HeaderContext';
import './ApplicationList.scss';

interface Application {
  id: string;
  applicant: {
    name: string;
    email: string;
    avatar?: string;
  };
  galaName: string;
  grant: string;
  appliedDate: string;
  juryScore: number;
  status: 'Pending' | 'Approved' | 'Rejected';
}

const ApplicationList: React.FC = () => {
  const { setTitle, setSubtitle, setBackAction, resetHeader } = useHeader();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('All');

  const applications: Application[] = [
    {
      id: 'APP-45230',
      applicant: { name: 'John Doe', email: 'john.doe@email.com' },
      galaName: 'Spring Gala 2024',
      grant: 'Innovation Tech Grant',
      appliedDate: 'Mar 10, 2024',
      juryScore: 9.2,
      status: 'Pending'
    },
    {
      id: 'APP-45231',
      applicant: { name: 'Courtney Henry', email: 'courtney.henry@email.com' },
      galaName: 'Spring Gala 2024',
      grant: 'Community Grant',
      appliedDate: 'Mar 10, 2024',
      juryScore: 7.1,
      status: 'Pending'
    },
    {
      id: 'APP-45232',
      applicant: { name: 'Sarah Miller', email: 's.miller@email.com' },
      galaName: 'Summer Charity Event',
      grant: 'Innovation Tech Grant',
      appliedDate: 'Mar 12, 2024',
      juryScore: 8.4,
      status: 'Approved'
    },
    {
      id: 'APP-45233',
      applicant: { name: 'Darrell Steward', email: 'darrell.steward@email.com' },
      galaName: 'Spring Gala 2024',
      grant: 'Women Leader Grant',
      appliedDate: 'Mar 10, 2024',
      juryScore: 6.5,
      status: 'Pending'
    },
    {
      id: 'APP-45234',
      applicant: { name: 'Michael Wilson', email: 'michael.wilson@email.com' },
      galaName: 'Fall Fundraiser',
      grant: 'Community Grant',
      appliedDate: 'Mar 08, 2024',
      juryScore: 3.2,
      status: 'Rejected'
    },
    {
      id: 'APP-45235',
      applicant: { name: 'Marvin McKinney', email: 'marvin.mckinney@email.com' },
      galaName: 'Summer Charity Event',
      grant: 'Tech Startup Grant',
      appliedDate: 'Mar 12, 2024',
      juryScore: 0,
      status: 'Approved'
    }
  ];

  useEffect(() => {
    setTitle('Application Management');
    setSubtitle('Review and manage all submitted applications');
    setBackAction(false);
    return () => resetHeader();
  }, [setTitle, setSubtitle, setBackAction, resetHeader]);

  const tabs = [
    { label: 'All', count: 187 },
    { label: 'Pending', count: 43 },
    { label: 'Approved', count: 122 },
    { label: 'Rejected', count: 22 },
    { label: 'Past Events', count: 15 }
  ];

  return (
    <div className="application-list-page">
      <HeaderActions>
        <button className="header-btn btn-outline">
          <Download size={18} />
          <span>Export CSV</span>
        </button>
      </HeaderActions>

      <div className="list-container-card">
        <div className="filters-ecosystem">
          <div className="top-row">
            <div className="search-bar">
              <Search size={18} />
              <input type="text" placeholder="Search applications..." />
            </div>
            <div className="status-tabs">
              {tabs.map(tab => (
                <button 
                  key={tab.label}
                  className={`tab-btn ${activeTab === tab.label ? 'active' : ''}`}
                  onClick={() => setActiveTab(tab.label)}
                >
                  {tab.label} ({tab.count})
                </button>
              ))}
            </div>
          </div>

          <div className="bottom-row">
            <div className="filter-label">
              <Filter size={16} />
              <span>Filter by:</span>
            </div>
            <div className="filter-dropdowns">
              <div className="filter-select">
                <select><option>All Galas</option></select>
                <ChevronDown size={14} />
              </div>
              <div className="filter-select">
                <select><option>All Grants</option></select>
                <ChevronDown size={14} />
              </div>
              <div className="filter-select">
                <select><option>All Classes</option></select>
                <ChevronDown size={14} />
              </div>
              <div className="filter-select rating">
                <Star size={14} />
                <select><option>Rating: Best First</option></select>
                <ChevronDown size={14} />
              </div>
            </div>
          </div>
        </div>

        <div className="applications-table-wrapper">
          <table className="hi-fi-table">
            <thead>
              <tr>
                <th>Applicant</th>
                <th>Gala Name</th>
                <th>Grant</th>
                <th>Applied Date</th>
                <th>Jury Score</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {applications.map((app) => (
                <tr key={app.id}>
                  <td>
                    <div className="applicant-cell">
                      <div className="avatar">{app.applicant.name.charAt(0)}</div>
                      <div className="info">
                        <span className="name">{app.applicant.name}</span>
                        <span className="email">{app.applicant.email}</span>
                      </div>
                    </div>
                  </td>
                  <td>{app.galaName}</td>
                  <td>{app.grant}</td>
                  <td>{app.appliedDate}</td>
                  <td>
                    <div className="score-cell">
                      <span className={`score-value ${app.juryScore >= 8 ? 'high' : app.juryScore >= 5 ? 'medium' : app.juryScore > 0 ? 'low' : 'none'}`}>
                        {app.juryScore > 0 ? `${app.juryScore.toFixed(1)} / 10` : '—'}
                      </span>
                    </div>
                  </td>
                  <td>
                    <span className={`status-pill ${app.status.toLowerCase()}`}>
                      {app.status}
                    </span>
                  </td>
                  <td>
                    <div className="action-buttons">
                      {app.status === 'Pending' && (
                        <>
                          <button className="btn-approve">
                            <CheckCircle2 size={16} />
                            <span>Approve</span>
                          </button>
                          <button className="btn-reject">
                            <XCircle size={16} />
                            <span>Reject</span>
                          </button>
                        </>
                      )}
                      <button 
                        className="btn-view" 
                        onClick={() => navigate(`/applications/${app.id}`)}
                      >
                        <Eye size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ApplicationList;
