import React, { useEffect, useState } from 'react';
import { 
  Plus, 
  Trash2, 
  Edit2, 
  Save, 
  Send,
  Info,
  ChevronDown,
  Calendar,
  Trophy,
  CheckCircle2,
  Settings2
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useHeader, HeaderActions } from '../../Shared/Context/HeaderContext';
import RequirementsModal from './Components/RequirementsModal';
import './CreateGrant.scss';

interface Question {
  id: number;
  text: string;
  type: 'Long Text' | 'File Upload' | 'Short Text';
}

const CreateGrant: React.FC = () => {
  const { setTitle, setSubtitle, setBackAction, resetHeader } = useHeader();
  const navigate = useNavigate();

  const [questions] = useState<Question[]>([
    { id: 1, text: 'What is the main problem your business solves?', type: 'Long Text' },
    { id: 2, text: 'Describe your target market and growth potential', type: 'Long Text' },
    { id: 3, text: 'Upload your business plan document (PDF)', type: 'File Upload' },
  ]);

  const [isReqModalOpen, setIsReqModalOpen] = useState(false);
  const [requirements, setRequirements] = useState<string[]>([
    'Must be registered business entity',
    'Active technology development',
    'Must attend gala event'
  ]);

  const [requireInterview, setRequireInterview] = useState(true);
  const [requiredFields, setRequiredFields] = useState({
    companyName: true,
    industrySelection: true,
    motivationStatement: true,
    businessPlan: false
  });

  const selectedJuryCriteria = [
    'Business Viability',
    'Innovation Level',
    'Team Experience',
    'Pitch Quality'
  ];

  useEffect(() => {
    setTitle('Create Grant');
    setSubtitle('Set up Grant details and eligibility criteria');
    setBackAction(true, () => navigate('/grants'));
    return () => resetHeader();
  }, [setTitle, setSubtitle, setBackAction, resetHeader, navigate]);

  const toggleField = (field: keyof typeof requiredFields) => {
    setRequiredFields(prev => ({ ...prev, [field]: !prev[field] }));
  };

  return (
    <div className="create-grant-page">
      <HeaderActions>
        <button className="header-btn btn-outline">
          <Save size={18} />
          <span>Save Draft</span>
        </button>
        <button className="header-btn btn-primary">
          <Send size={18} />
          <span>Publish</span>
        </button>
      </HeaderActions>

      <RequirementsModal 
        isOpen={isReqModalOpen}
        onClose={() => setIsReqModalOpen(false)}
        onSave={(newReqs) => {
          setRequirements(newReqs.filter(r => r.enabled).map(r => r.text));
          setIsReqModalOpen(false);
        }}
        initialRequirements={requirements.map((text, i) => ({ id: i.toString(), text, enabled: true }))}
      />

      <div className="grant-form-centered-wrapper">
        <div className="grant-form-container">
          {/* Basic Information */}
          <section className="form-card">
            <div className="card-header">
              <h3>Basic Information</h3>
              <p>Grant name and description</p>
            </div>
            <div className="card-body">
              <div className="form-group">
                <label>Grant Name *</label>
                <input type="text" placeholder="e.g., Innovation Technology Grant" />
              </div>
              
              <div className="form-group">
                <label>Associated Gala *</label>
                <div className="select-with-info">
                  <select>
                    <option>Gala Vision Montréal 2026</option>
                  </select>
                  <ChevronDown className="select-arrow" size={18} />
                  <span className="info-text">April 14, 2026 • Montreal</span>
                </div>
              </div>

              <div className="form-group">
                <label>Description *</label>
                <textarea 
                  placeholder="For businesses developing innovative technology solutions..." 
                  rows={4}
                ></textarea>
              </div>

              <div className="form-group">
                <label>Category/Industry *</label>
                <div className="custom-select">
                  <select>
                    <option>Technology</option>
                  </select>
                  <ChevronDown className="select-arrow" size={18} />
                </div>
              </div>
            </div>
          </section>

          {/* Application Questions */}
          <section className="form-card">
            <div className="card-header flex-header">
              <div className="header-text">
                <h3>Application Questions</h3>
                <p>Custom questions shown to users when applying to this grant</p>
              </div>
              <button className="btn-add-item btn-primary-lite">
                <Plus size={16} />
                <span>Add Question</span>
              </button>
            </div>
            <div className="card-body">
              <div className="questions-list">
                {questions.map((q) => (
                  <div key={q.id} className="question-item">
                    <div className="number-circle">{q.id}</div>
                    <div className="question-text">{q.text}</div>
                    <div className="question-actions">
                      <span className={`type-badge ${q.type.toLowerCase().replace(' ', '-')}`}>
                        {q.type}
                      </span>
                      <button className="icon-btn edit"><Edit2 size={16} /></button>
                      <button className="icon-btn delete"><Trash2 size={16} /></button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Prize Details */}
          <section className="form-card">
            <div className="card-header">
              <h3>Prize Details</h3>
              <p>Award amount and deadlines</p>
            </div>
            <div className="card-body">
              <div className="form-row">
                <div className="form-group">
                  <label>Prize Amount *</label>
                  <div className="input-with-icon">
                    <span className="currency-symbol">$</span>
                    <input type="text" placeholder="5,000" />
                  </div>
                </div>
                <div className="form-group">
                  <label>Number of Prizes *</label>
                  <div className="input-with-icon">
                    <Trophy size={18} />
                    <input type="text" placeholder="e.g., 3" />
                  </div>
                </div>
                <div className="form-group">
                  <label>Application Deadline *</label>
                  <div className="input-with-icon">
                    <Calendar size={18} />
                    <input type="text" placeholder="Mar 31, 2026" />
                  </div>
                </div>
              </div>

              <div className="info-alert">
                <Info size={18} />
                <p>Example: 3 prizes means 3 winners will be selected from approved candidates</p>
              </div>
            </div>
          </section>

          {/* Eligibility Criteria */}
          <section className="form-card">
            <div className="card-header flex-header">
              <div className="header-text">
                <h3>Eligibility Criteria</h3>
                <p>Define requirements for applicants</p>
              </div>
            </div>
            <div className="card-body">
              <div className="criteria-sub-section">
                <div className="sub-header">
                  <div className="header-info">
                    <h4>Additional Requirements</h4>
                    <p>Managed separately — click to view and configure</p>
                  </div>
                  <button className="btn-manage" onClick={() => setIsReqModalOpen(true)}>
                    <Settings2 size={16} />
                    <span>Manage</span>
                  </button>
                </div>
                <div className="requirements-summary">
                  {requirements.map((req, idx) => (
                    <div key={idx} className="req-summary-item">
                      <CheckCircle2 size={16} />
                      <span>{req}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Application Settings */}
          <section className="form-card">
            <div className="card-header">
              <h3>Application Settings</h3>
              <p>Configure application process</p>
            </div>
            <div className="card-body">
              <div className="setting-toggle-item">
                <div className="setting-info">
                  <h4>Require Interview</h4>
                  <p>Applicants must schedule an interview</p>
                </div>
                <div 
                  className={`toggle-switch ${requireInterview ? 'active' : ''}`}
                  onClick={() => setRequireInterview(!requireInterview)}
                >
                  <div className="switch-handle"></div>
                </div>
              </div>

              <div className="required-fields-section">
                <h4>Required Application Fields</h4>
                <div className="checkbox-grid">
                  <div className="checkbox-item" onClick={() => toggleField('companyName')}>
                    <div className={`checkbox ${requiredFields.companyName ? 'checked' : ''}`}>
                      {requiredFields.companyName && <Plus size={12} className="check-icon" />}
                    </div>
                    <span>Company Name</span>
                  </div>
                  <div className="checkbox-item" onClick={() => toggleField('industrySelection')}>
                    <div className={`checkbox ${requiredFields.industrySelection ? 'checked' : ''}`}>
                      {requiredFields.industrySelection && <Plus size={12} className="check-icon" />}
                    </div>
                    <span>Industry Selection</span>
                  </div>
                  <div className="checkbox-item" onClick={() => toggleField('motivationStatement')}>
                    <div className={`checkbox ${requiredFields.motivationStatement ? 'checked' : ''}`}>
                      {requiredFields.motivationStatement && <Plus size={12} className="check-icon" />}
                    </div>
                    <span>Motivation Statement</span>
                  </div>
                  <div className="checkbox-item" onClick={() => toggleField('businessPlan')}>
                    <div className={`checkbox ${requiredFields.businessPlan ? 'checked' : ''}`}>
                      {requiredFields.businessPlan && <Plus size={12} className="check-icon" />}
                    </div>
                    <span>Business Plan Document</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Jury Criteria */}
          <section className="form-card">
            <div className="card-header flex-header">
              <div className="header-text">
                <h3>Jury Criteria</h3>
                <p>Define evaluation criteria that jury members will use to score applicants</p>
              </div>
              <button 
                className="btn-manage" 
                onClick={(e) => {
                  e.preventDefault();
                  navigate('/grants/jury-criteria');
                }}
              >
                <Settings2 size={16} />
                <span>Manage Criteria</span>
              </button>
            </div>
            <div className="card-body">
              <div className="criteria-summary-box">
                <div className="summary-header">
                  <div className="count-badge">4</div>
                  <div className="header-text">
                    <h4>Criteria selected</h4>
                    <p>Will appear on jury scoring form</p>
                  </div>
                  {!selectedJuryCriteria.length && (
                    <div className="no-criteria-alert">
                      <Info size={14} />
                      <span>No criteria set yet — click Manage Criteria</span>
                    </div>
                  )}
                </div>
                <div className="criteria-chips-list">
                  {selectedJuryCriteria.map((crit, idx) => (
                    <span key={idx} className="crit-chip">{crit}</span>
                  ))}
                </div>
              </div>
            </div>
          </section>

          <footer className="form-navigation">
            <button className="btn-secondary" onClick={() => navigate('/grants')}>
              Discard Changes
            </button>
            <button className="btn-primary" onClick={() => navigate('/grants')}>
              Save Grant
            </button>
          </footer>
        </div>
      </div>
    </div>
  );
};

export default CreateGrant;
