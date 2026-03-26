import { useEffect } from 'react';
import {
  Upload,
  Calendar,
  MapPin,
  Clock,
  Users,
  Trophy,
  Plus,
  Edit2,
  Trash2,
  Trash,
  Save,
  Send,
  Eye,
  RefreshCcw,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useHeader, HeaderActions } from '../../Shared/Context/HeaderContext';
import './CreateGala.scss';

function CreateGala() {
  const { setTitle, setSubtitle, setBackAction, resetHeader } = useHeader();
  const navigate = useNavigate();

  useEffect(() => {
    setTitle('Create New Gala Event');
    setSubtitle('Set up event details, Grants, and evening program');
    setBackAction(true, () => navigate('/galas'));

    return () => resetHeader();
  }, [setTitle, setSubtitle, setBackAction, resetHeader, navigate]);

  return (
    <div className="create-gala-page">
      <HeaderActions>
        <button type="button" className="header-btn btn-danger-soft">
          <Trash size={18} />
          <span>Trash</span>
        </button>
        <button type="button" className="header-btn btn-outline">
          <Save size={18} />
          <span>Save Draft</span>
        </button>
        <button type="button" className="header-btn btn-primary">
          <Send size={18} />
          <span>Publish</span>
        </button>
      </HeaderActions>

      <div className="gala-form-centered-wrapper">
        <div className="gala-form-container">
          {/* Event Information */}
          <section className="form-card">
            <div className="card-header">
              <h3>Event Information</h3>
              <p>Basic details about the gala event</p>
            </div>
            <div className="card-body">
              <div className="form-group">
                <label>Event Name *</label>
                <input
                  type="text"
                  placeholder="e.g., Gala Vision Montréal 2026"
                />
              </div>
              <div className="form-group">
                <label>About Event *</label>
                <textarea
                  placeholder="The biggest entrepreneurial event of the year..."
                  rows={4}
                />
              </div>
              <div className="form-group">
                <label>Event Cover Image *</label>
                <div className="dropzone-area">
                  <Upload size={32} />
                  <p>Click to upload or drag and drop</p>
                  <span>PNG, JPG up to 10MB</span>
                </div>
              </div>
              <div className="form-group">
                <label>Event Status *</label>
                <div className="status-tabs">
                  <button type="button" className="status-tab active">
                    <Clock size={16} />
                    <span>Upcoming</span>
                  </button>
                  <button type="button" className="status-tab">
                    <RefreshCcw size={16} />
                    <span>Active</span>
                  </button>
                  <button type="button" className="status-tab">
                    <Trophy size={16} />
                    <span>Completed</span>
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* Date, Time & Location */}
          <section className="form-card">
            <div className="card-header">
              <h3>Date, Time & Location</h3>
              <p>When and where the event will take place</p>
            </div>
            <div className="card-body">
              <div className="form-row">
                <div className="form-group">
                  <label>Event Date *</label>
                  <div className="input-with-icon">
                    <Calendar size={18} />
                    <input type="text" placeholder="April 14, 2026" />
                  </div>
                </div>
                <div className="form-group">
                  <label>Event Time *</label>
                  <div className="input-with-icon">
                    <Clock size={18} />
                    <input type="text" placeholder="6:00 PM" />
                  </div>
                </div>
              </div>
              <div className="form-group">
                <label>Venue/Location *</label>
                <div className="input-with-icon">
                  <MapPin size={18} />
                  <input
                    type="text"
                    placeholder="Palais des congrès, Montréal"
                  />
                </div>
              </div>
              <div className="form-group">
                <label>City/Region</label>
                <input type="text" placeholder="Montreal, QC" />
              </div>
            </div>
          </section>

          {/* Participants & Prize Pool */}
          <section className="form-card">
            <div className="card-header">
              <h3>Participants & Prize Pool</h3>
              <p>Expected attendees and grant prize pool</p>
            </div>
            <div className="card-body">
              <div className="form-row">
                <div className="form-group">
                  <label>Expected Attendees *</label>
                  <div className="input-with-icon">
                    <Users size={18} />
                    <input type="text" placeholder="245 entrepreneurs" />
                  </div>
                </div>
                <div className="form-group">
                  <label>Number of Grants *</label>
                  <div className="input-with-icon">
                    <Trophy size={18} />
                    <input type="text" placeholder="3" />
                  </div>
                </div>
              </div>
              <div className="form-group">
                <label>Total Prize Pool *</label>
                <div className="input-with-icon">
                  <span className="currency-symbol">$</span>
                  <input type="text" placeholder="15,000 in grants" />
                </div>
              </div>
            </div>
          </section>

          {/* Evening Program */}
          <section className="form-card">
            <div className="card-header flex-header">
              <div className="header-text">
                <h3>Evening Program</h3>
                <p>Schedule of activities and sessions</p>
              </div>
              <button type="button" className="btn-add-item">
                <Plus size={16} />
                <span>Add Item</span>
              </button>
            </div>
            <div className="card-body">
              <div className="program-list">
                <div className="program-item">
                  <div className="time-badge">18h00</div>
                  <div className="item-info">
                    <h4>Welcome and cocktail</h4>
                    <p>Networking with entrepreneurs and partners</p>
                  </div>
                  <div className="item-actions">
                    <button type="button" className="action-btn-small edit">
                      <Edit2 size={14} />
                    </button>
                    <button type="button" className="action-btn-small delete">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
                <div className="program-item">
                  <div className="time-badge">19h30</div>
                  <div className="item-info">
                    <h4>Opening ceremony</h4>
                    <p>Official welcome and introduction speeches</p>
                  </div>
                  <div className="item-actions">
                    <button type="button" className="action-btn-small edit">
                      <Edit2 size={14} />
                    </button>
                    <button type="button" className="action-btn-small delete">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Associated Grants */}
          <section className="form-card">
            <div className="card-header flex-header">
              <div className="header-text">
                <h3>Associated Grants</h3>
                <p>Grants available for this gala</p>
              </div>
              <button type="button" className="btn-add-item">
                <Plus size={16} />
                <span>Link Grant</span>
              </button>
            </div>
            <div className="card-body">
              <div className="associated-list">
                <div className="associated-item">
                  <div className="grant-icon-box">
                    <Trophy size={18} />
                  </div>
                  <div className="grant-info">
                    <h4>Innovation Technology Grant</h4>
                    <p>
                      <span>$ 5,000</span> • <span>Mar 31</span>
                    </p>
                  </div>
                  <div className="item-actions">
                    <button type="button" className="action-btn-small view">
                      <Eye size={14} />
                    </button>
                    <button
                      type="button"
                      className="action-btn-small disconnect"
                    >
                      <RefreshCcw size={14} />
                    </button>
                  </div>
                </div>
                <div className="associated-item">
                  <div className="grant-icon-box second">
                    <Users size={18} />
                  </div>
                  <div className="grant-info">
                    <h4>Social Entrepreneurship Grant</h4>
                    <p>
                      <span>$ 5,000</span> • <span>Mar 31</span>
                    </p>
                  </div>
                  <div className="item-actions">
                    <button type="button" className="action-btn-small view">
                      <Eye size={14} />
                    </button>
                    <button
                      type="button"
                      className="action-btn-small disconnect"
                    >
                      <RefreshCcw size={14} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

export default CreateGala;
