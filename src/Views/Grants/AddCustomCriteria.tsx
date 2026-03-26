import React, { useEffect, useState } from 'react';
import { 
  ChevronDown, 
  MoreVertical,
  PlusCircle,
  Eye
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useHeader, HeaderActions } from '../../Shared/Context/HeaderContext';
import './AddCustomCriteria.scss';

const AddCustomCriteria: React.FC = () => {
  const { setTitle, setSubtitle, setBackAction, resetHeader } = useHeader();
  const navigate = useNavigate();

  const [criteriaName, setCriteriaName] = useState('');
  const [description, setDescription] = useState('');
  const [scale, setScale] = useState('0-10');

  useEffect(() => {
    setTitle('Add Custom Criteria');
    setSubtitle('Innovation Technology > Grant Jury Criteria > Add Custom');
    setBackAction(true, () => navigate('/grants/jury-criteria'));
    return () => resetHeader();
  }, [setTitle, setSubtitle, setBackAction, resetHeader, navigate]);

  return (
    <div className="add-custom-criteria-page">
      <HeaderActions>
        <button className="header-btn btn-outline" onClick={() => navigate('/grants/jury-criteria')}>
          Cancel
        </button>
        <button className="header-btn btn-primary" onClick={() => navigate('/grants/jury-criteria')}>
          <PlusCircle size={18} />
          <span>Create Criteria</span>
        </button>
      </HeaderActions>

      <div className="add-criteria-content">
        <div className="form-column">
          <section className="form-card main-form">
            <div className="card-header-icon">
              <div className="icon-box">
                <PlusCircle size={32} />
              </div>
              <div className="header-text">
                <h3>Create New Evaluation Criteria</h3>
                <p>This criteria will appear as a scoring field on the jury evaluation form</p>
              </div>
            </div>

            <div className="form-body">
              <div className="form-group">
                <div className="label-row">
                  <label>Criteria Name *</label>
                  <span className="char-count">{criteriaName.length}/50 characters</span>
                </div>
                <input 
                  type="text" 
                  placeholder="e.g., Pitch Quality" 
                  maxLength={50}
                  value={criteriaName}
                  onChange={(e) => setCriteriaName(e.target.value)}
                />
              </div>

              <div className="form-group">
                <div className="label-row">
                  <label>Description *</label>
                  <span className="helper-text">Helps jury members understand how to evaluate</span>
                </div>
                <textarea 
                  placeholder="e.g., How clearly and compellingly does the applicant present their business idea?" 
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                ></textarea>
              </div>

              <div className="form-group">
                <label>Scoring Scale *</label>
                <div className="scale-selector">
                  <div 
                    className={`scale-option ${scale === '0-10' ? 'active' : ''}`}
                    onClick={() => setScale('0-10')}
                  >
                    <div className="radio"></div>
                    <div className="option-text">
                      <span className="scale-val">0 - 10</span>
                      <span className="desc">Standard (recommended)</span>
                    </div>
                  </div>
                  <div 
                    className={`scale-option ${scale === '0-5' ? 'active' : ''}`}
                    onClick={() => setScale('0-5')}
                  >
                    <div className="radio"></div>
                    <div className="option-text">
                      <span className="scale-val">0 - 5</span>
                      <span className="desc">Simplified scale</span>
                    </div>
                  </div>
                  <div 
                    className={`scale-option ${scale === '1-100' ? 'active' : ''}`}
                    onClick={() => setScale('1-100')}
                  >
                    <div className="radio"></div>
                    <div className="option-text">
                      <span className="scale-val">1 - 100</span>
                      <span className="desc">Percentage scale</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="form-group">
                <label>Category (Optional)</label>
                <div className="custom-select">
                  <select>
                    <option>Select a category to group with</option>
                  </select>
                  <ChevronDown className="select-arrow" size={18} />
                </div>
              </div>

              <div className="toggle-group">
                <div className="toggle-text">
                  <h4>Enable for this grant immediately</h4>
                  <p>Criteria will be pre-selected in Manage Criteria</p>
                </div>
                <div className="toggle-switch active">
                  <div className="switch-handle"></div>
                </div>
              </div>
            </div>
          </section>
        </div>

        <div className="side-column">
          <section className="preview-card">
            <div className="section-header">
              <Eye size={18} />
              <h3>Jury Form Preview</h3>
            </div>
            <p className="preview-sub">How it will appear to jury members:</p>
            
            <div className="preview-box">
              <div className="preview-header">
                <div className="preview-title-row">
                  <h4>{criteriaName || 'Pitch Quality'}</h4>
                  <span className="score">8 <span className="max">/ 10</span></span>
                </div>
                <p>{description || 'How clearly and compellingly does the applicant present their business idea?'}</p>
              </div>
              <div className="preview-slider">
                <div className="slider-track">
                  <div className="slider-fill" style={{ width: '80%' }}></div>
                  <div className="slider-handle" style={{ left: '80%' }}></div>
                </div>
                <div className="slider-labels">
                  <span>0</span>
                  <span>5</span>
                  <span>10</span>
                </div>
              </div>
            </div>
          </section>

          <section className="existing-list-card">
            <div className="section-header">
              <PlusCircle size={18} />
              <h3>Existing Custom Criteria</h3>
              <span className="count-tag">3 created</span>
            </div>
            <div className="criteria-items">
              <div className="small-item">
                <div className="item-main">
                  <div className="item-title-row">
                    <h4>Pitch Quality</h4>
                    <span className="status-tag active">Active</span>
                  </div>
                  <p>0 - 10 scale</p>
                </div>
                <MoreVertical size={16} className="item-menu" />
              </div>
              <div className="small-item">
                <div className="item-main">
                  <div className="item-title-row">
                    <h4>Market Readiness</h4>
                    <span className="status-tag active">Active</span>
                  </div>
                  <p>0 - 10 scale</p>
                </div>
                <MoreVertical size={16} className="item-menu" />
              </div>
              <div className="small-item">
                <div className="item-main">
                  <div className="item-title-row">
                    <h4>Community Impact Score</h4>
                    <span className="status-tag inactive">Inactive</span>
                  </div>
                  <p>0 - 10 scale</p>
                </div>
                <MoreVertical size={16} className="item-menu" />
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default AddCustomCriteria;
