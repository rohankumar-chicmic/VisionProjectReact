import React, { useEffect, useState } from 'react';
import { 
  Check, 
  Info, 
  Plus, 
  X, 
  MoreVertical
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useHeader, HeaderActions } from '../../Shared/Context/HeaderContext';
import './ManageJuryCriteria.scss';

interface Criterion {
  id: string;
  name: string;
  description: string;
  selected: boolean;
  scoreRange: string;
  custom?: boolean;
}

interface Category {
  title: string;
  criteria: Criterion[];
}

const ManageJuryCriteria: React.FC = () => {
  const { setTitle, setSubtitle, setBackAction, resetHeader } = useHeader();
  const navigate = useNavigate();

  const [categories, setCategories] = useState<Category[]>([
    {
      title: 'Business & Finance',
      criteria: [
        { id: '1', name: 'Business Viability', description: 'Is the business model sustainable?', selected: true, scoreRange: '0 - 10' },
        { id: '2', name: 'Financial Potential', description: 'Revenue and growth projections', selected: true, scoreRange: '0 - 10' },
        { id: '3', name: 'Market Size', description: 'Total addressable market', selected: false, scoreRange: '0 - 10' },
        { id: '4', name: 'Revenue Track Record', description: 'Existing sales and traction', selected: false, scoreRange: '0 - 10' },
      ]
    },
    {
      title: 'Social & Environmental',
      criteria: [
        { id: '5', name: 'Social Impact', description: 'Positive community contribution', selected: false, scoreRange: '0 - 10' },
        { id: '6', name: 'Environmental Responsibility', description: 'Eco-friendly practices', selected: false, scoreRange: '0 - 10' },
        { id: '7', name: 'Community Engagement', description: 'Local involvement and outreach', selected: false, scoreRange: '0 - 10' },
      ]
    },
    {
      title: 'Team & Leadership',
      criteria: [
        { id: '8', name: 'Team Experience', description: 'Relevant skills and background', selected: true, scoreRange: '0 - 10' },
        { id: '9', name: 'Leadership Quality', description: 'Founder\'s vision and drive', selected: false, scoreRange: '0 - 10' },
        { id: '10', name: 'Team Diversity', description: 'Complementary team skills', selected: false, scoreRange: '0 - 10' },
      ]
    },
    {
      title: 'Innovation & Technology',
      criteria: [
        { id: '11', name: 'Innovation Level', description: 'Uniqueness of the solution', selected: true, scoreRange: '0 - 10' },
        { id: '12', name: 'Technical Feasibility', description: 'Can the solution actually be built?', selected: false, scoreRange: '0 - 10' },
        { id: '13', name: 'Scalability', description: 'Growth beyond initial market', selected: false, scoreRange: '0 - 10' },
        { id: '14', name: 'Competitive Advantage', description: 'Differentiation from competitors', selected: false, scoreRange: '0 - 10' },
      ]
    }
  ]);

  const [customCriteria, setCustomCriteria] = useState<Criterion[]>([
    { id: 'c1', name: 'Pitch Quality', description: 'Clarity and impact of the presentation', selected: true, scoreRange: '0 - 10', custom: true },
    { id: 'c2', name: 'Market Readiness', description: 'Is the market ready to adopt this solution?', selected: true, scoreRange: '0 - 10', custom: true },
    { id: 'c3', name: 'Community Impact Score', description: 'Local community engagement level', selected: false, scoreRange: '0 - 10', custom: true },
  ]);

  useEffect(() => {
    setTitle('Manage Jury Criteria');
    setSubtitle('Innovation Technology > Grant Jury Criteria');
    setBackAction(true, () => navigate('/grants/create'));
    return () => resetHeader();
  }, [setTitle, setSubtitle, setBackAction, resetHeader, navigate]);

  const toggleCriterion = (catIdx: number, critIdx: number) => {
    const newCats = [...categories];
    newCats[catIdx].criteria[critIdx].selected = !newCats[catIdx].criteria[critIdx].selected;
    setCategories(newCats);
  };

  return (
    <div className="manage-jury-page">
      <HeaderActions>
        <button className="header-btn btn-outline" onClick={() => navigate('/grants/create')}>
          Cancel
        </button>
        <button className="header-btn btn-primary" onClick={() => navigate('/grants/create')}>
          <Check size={18} />
          <span>Save & Return</span>
        </button>
      </HeaderActions>

      <div className="info-strip">
        <Info size={16} />
        <p>Selected criteria will each appear as a separate 0–10 scoring field on the jury evaluation form. Jury members will rate each criterion individually.</p>
        <X size={16} className="close-info" />
      </div>

      <div className="criteria-grid">
        <div className="criteria-column">
          {categories.slice(0, 2).map((cat, catIdx) => (
            <section key={cat.title} className="criteria-section">
              <div className="section-header">
                <h3>{cat.title}</h3>
                <span className="count-badge">
                  {cat.criteria.filter(c => c.selected).length} of {cat.criteria.length} selected
                </span>
              </div>
              <div className="criteria-list">
                {cat.criteria.map((crit, critIdx) => (
                  <div 
                    key={crit.id} 
                    className={`criterion-item ${crit.selected ? 'selected' : ''}`}
                    onClick={() => toggleCriterion(catIdx, critIdx)}
                  >
                    <div className="checkbox">
                      {crit.selected && <Check size={12} />}
                    </div>
                    <div className="crit-info">
                      <h4>{crit.name}</h4>
                      <p>{crit.description}</p>
                    </div>
                    <div className="score-indicator">{crit.scoreRange}</div>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>

        <div className="criteria-column">
          <section className="criteria-section">
            <div className="section-header">
              <h3>{categories[2].title}</h3>
              <span className="count-badge">
                {categories[2].criteria.filter(c => c.selected).length} of {categories[2].criteria.length} selected
              </span>
            </div>
            <div className="criteria-list">
              {categories[2].criteria.map((crit, critIdx) => (
                <div 
                  key={crit.id} 
                  className={`criterion-item ${crit.selected ? 'selected' : ''}`}
                  onClick={() => toggleCriterion(2, critIdx)}
                >
                  <div className="checkbox">
                    {crit.selected && <Check size={12} />}
                  </div>
                  <div className="crit-info">
                    <h4>{crit.name}</h4>
                    <p>{crit.description}</p>
                  </div>
                  <div className="score-indicator">{crit.scoreRange}</div>
                </div>
              ))}
            </div>
          </section>

          <section className="criteria-section custom-criteria-section">
            <div className="section-header">
              <h3>Custom Criteria</h3>
              <button className="btn-add-new" onClick={() => navigate('/grants/add-custom-criteria')}>
                <Plus size={16} />
                <span>Add New</span>
              </button>
            </div>
            <div className="criteria-list">
              {customCriteria.map((crit) => (
                <div 
                  key={crit.id} 
                  className={`criterion-item ${crit.selected ? 'selected' : ''}`}
                >
                  <div className="checkbox" onClick={() => {
                    const next = [...customCriteria];
                    const idx = next.findIndex(c => c.id === crit.id);
                    next[idx].selected = !next[idx].selected;
                    setCustomCriteria(next);
                  }}>
                    {crit.selected && <Check size={12} />}
                  </div>
                  <div className="crit-info">
                    <div className="title-row">
                      <h4>{crit.name}</h4>
                      <span className="custom-tag">Custom</span>
                    </div>
                    <p>{crit.description}</p>
                  </div>
                  <div className="score-indicator">{crit.scoreRange}</div>
                  <MoreVertical size={16} className="item-menu" />
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>

      <section className="criteria-section full-width">
        <div className="section-header">
          <h3>{categories[3].title}</h3>
          <span className="count-badge">
            {categories[3].criteria.filter(c => c.selected).length} of {categories[3].criteria.length} selected
          </span>
        </div>
        <div className="criteria-grid-inner">
          {categories[3].criteria.map((crit, critIdx) => (
            <div 
              key={crit.id} 
              className={`criterion-item ${crit.selected ? 'selected' : ''}`}
              onClick={() => toggleCriterion(3, critIdx)}
            >
              <div className="checkbox">
                {crit.selected && <Check size={12} />}
              </div>
              <div className="crit-info">
                <h4>{crit.name}</h4>
                <p>{crit.description}</p>
              </div>
              <div className="score-indicator">{crit.scoreRange}</div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default ManageJuryCriteria;
