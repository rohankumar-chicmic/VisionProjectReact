import { useEffect } from 'react';
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
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './GalaList.scss';
import { HeaderActions, useHeader } from '../../Shared/Context/HeaderContext';

function GalaList() {
  const { setTitle, setSubtitle, setBackAction } = useHeader();
  const navigate = useNavigate();

  useEffect(() => {
    setTitle('Gala Management');
    setSubtitle('Manage and announce your gala events');
    setBackAction(false);
  }, [setTitle, setSubtitle, setBackAction]);
  const galas = [
    {
      id: 1,
      title: 'Gala Vision Montréal 2024',
      description:
        'The biggest entrepreneurial event of the year. Network with industry leaders...',
      date: 'June 20, 2024',
      time: '6:30 PM',
      applied: 0,
      status: 'Draft',
      image:
        'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80&w=300',
    },
    {
      id: 2,
      title: 'Gala Startup Sherbrooke',
      description:
        'Join our annual spring celebration with awards and performances',
      date: 'March 15, 2024',
      time: '7:00 PM',
      applied: 142,
      status: 'Active',
      image:
        'https://images.unsplash.com/photo-1540575861501-7cf05a4b125a?auto=format&fit=crop&q=80&w=300',
    },
    {
      id: 3,
      title: 'Gala Vision Montréal 2023',
      description:
        'A look back at the achievements of our community in the past year.',
      date: 'Dec 10, 2023',
      time: '7:00 PM',
      applied: 320,
      status: 'Completed',
      image:
        'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&q=80&w=300',
    },
  ];

  return (
    <div className="gala-management-view">
      <HeaderActions>
        <button
          type="button"
          className="header-btn btn-primary"
          onClick={() => navigate('/galas/create')}
        >
          + Create New Gala
        </button>
      </HeaderActions>
      <div className="view-header">
        <div className="header-actions">
          <div className="search-box">
            <Search size={18} />
            <input type="text" placeholder="Search galas..." />
          </div>
          <div className="filter-group">
            <div className="filter-select">
              <span>All Status</span>
              <Filter size={16} />
            </div>
            <div className="filter-select sort">
              <ArrowUpDown size={16} />
              <span>Sort</span>
            </div>
          </div>
        </div>
      </div>

      <div className="gala-grid">
        {galas.map((gala) => (
          <div key={gala.id} className="gala-card">
            <div className="gala-image">
              <img src={gala.image} alt={gala.title} />
              <div className={`status-tag ${gala.status.toLowerCase()}`}>
                <div className="dot"></div>
                {gala.status}
              </div>
            </div>

            <div className="gala-content">
              <div className="gala-info">
                <h3 className="gala-title">{gala.title}</h3>
                <p className="gala-description">{gala.description}</p>

                <div className="gala-meta">
                  <div className="meta-item">
                    <Calendar size={14} />
                    <span>{gala.date}</span>
                  </div>
                  <div className="meta-item">
                    <Clock size={14} />
                    <span>{gala.time}</span>
                  </div>
                  <div className="meta-item">
                    <Users size={14} />
                    <span>{gala.applied} Applied</span>
                  </div>
                </div>
              </div>

              <div className="gala-actions">
                <button type="button" className="action-btn edit">
                  <Edit3 size={16} />
                  <span>Edit</span>
                </button>

                {gala.status === 'Draft' && (
                  <button type="button" className="action-btn publish">
                    <Send size={16} />
                    <span>Publish</span>
                  </button>
                )}

                {gala.status === 'Active' && (
                  <button type="button" className="action-btn unpublish">
                    <EyeOff size={16} />
                    <span>Unpublish</span>
                  </button>
                )}

                {gala.status === 'Completed' && (
                  <button type="button" className="action-btn delete">
                    <Trash2 size={16} />
                    <span>Delete</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default GalaList;
