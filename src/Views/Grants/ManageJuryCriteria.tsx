/* eslint-disable jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions, react/button-has-type, react/function-component-definition */
import React, { useEffect, useState, useRef, useMemo } from 'react';
import { Check, Info, Plus, X, MoreVertical, Trash2, Edit } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useHeader, HeaderActions } from '../../Shared/Context/HeaderContext';
import {
  useGetOrganiserJuryCriteriaQuery,
  useDeleteOrganiserJuryCriteriaMutation,
} from '../../Services/Api/module/Organiser/JuryCriteria';
import type { GrantSessionState } from './CreateGrant/types';
import showToast from '../../Shared/Utils/toast';
import './ManageJuryCriteria.scss';

const CREATE_GRANT_FORM_SESSION_KEY = 'create_grant_form_state';

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

  // Define initial categories as a memoized constant
  const initialCategoriesData: Category[] = useMemo(
    () => [
      {
        title: 'Business & Finance',
        criteria: [
          {
            id: '1',
            name: 'Business Viability',
            description: 'Is the business model sustainable?',
            selected: true,
            scoreRange: '0 - 10',
          },
          {
            id: '2',
            name: 'Financial Potential',
            description: 'Revenue and growth projections',
            selected: true,
            scoreRange: '0 - 10',
          },
          {
            id: '3',
            name: 'Market Size',
            description: 'Total addressable market',
            selected: false,
            scoreRange: '0 - 10',
          },
          {
            id: '4',
            name: 'Revenue Track Record',
            description: 'Existing sales and traction',
            selected: false,
            scoreRange: '0 - 10',
          },
        ],
      },
      {
        title: 'Social & Environmental',
        criteria: [
          {
            id: '12',
            name: 'Social Impact',
            description: 'Positive community contribution',
            selected: false,
            scoreRange: '0 - 10',
          },
          {
            id: '13',
            name: 'Environmental Responsibility',
            description: 'Eco-friendly practices',
            selected: false,
            scoreRange: '0 - 10',
          },
          {
            id: '14',
            name: 'Community Engagement',
            description: 'Local involvement and outreach',
            selected: false,
            scoreRange: '0 - 10',
          },
        ],
      },
      {
        title: 'Team & Leadership',
        criteria: [
          {
            id: '5',
            name: 'Team Experience',
            description: 'Relevant skills and background',
            selected: true,
            scoreRange: '0 - 10',
          },
          {
            id: '6',
            name: 'Leadership Quality',
            description: "Founder's vision and drive",
            selected: false,
            scoreRange: '0 - 10',
          },
          {
            id: '7',
            name: 'Team Diversity',
            description: 'Complementary team skills',
            selected: false,
            scoreRange: '0 - 10',
          },
        ],
      },
      {
        title: 'Innovation & Technology',
        criteria: [
          {
            id: '8',
            name: 'Innovation Level',
            description: 'Uniqueness of the solution',
            selected: true,
            scoreRange: '0 - 10',
          },
          {
            id: '9',
            name: 'Technical Feasibility',
            description: 'Can the solution actually be built?',
            selected: false,
            scoreRange: '0 - 10',
          },
          {
            id: '10',
            name: 'Scalability',
            description: 'Growth beyond initial market',
            selected: false,
            scoreRange: '0 - 10',
          },
          {
            id: '11',
            name: 'Competitive Advantage',
            description: 'Differentiation from competitors',
            selected: false,
            scoreRange: '0 - 10',
          },
        ],
      },
    ],
    []
  );

  // Define initial custom criteria as a memoized constant
  const initialCustomCriteriaData: Criterion[] = useMemo(
    () => [
      {
        id: 'c101',
        name: 'Pitch Quality',
        description: 'Clarity and impact of the presentation',
        selected: true,
        scoreRange: '0 - 10',
        custom: true,
      },
      {
        id: 'c102',
        name: 'Market Readiness',
        description: 'Is the market ready to adopt this solution?',
        selected: true,
        scoreRange: '0 - 10',
        custom: true,
      },
      {
        id: 'c103',
        name: 'Community Impact Score',
        description: 'Local community engagement level',
        selected: false,
        scoreRange: '0 - 10',
        custom: true,
      },
    ],
    []
  );

  const [categories, setCategories] = useState<Category[]>(
    initialCategoriesData
  );
  const [customCriteria, setCustomCriteria] = useState<Criterion[]>(
    initialCustomCriteriaData
  );

  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const { data: apiCriteriaRes } = useGetOrganiserJuryCriteriaQuery();
  const [deleteCriteria] = useDeleteOrganiserJuryCriteriaMutation();

  // Track if we've already restored criteria to prevent overwriting
  const hasRestoredCriteria = useRef(false);

  // Restore jury criteria from sessionStorage on component mount
  useEffect(() => {
    if (!hasRestoredCriteria.current) {
      const savedState = sessionStorage.getItem(CREATE_GRANT_FORM_SESSION_KEY);
      if (savedState) {
        try {
          const state = JSON.parse(savedState) as Partial<GrantSessionState>;
          const savedCriteria = state.juryCriteria || [1, 2, 5, 8];

          // Update categories to reflect saved criteria using initial values
          const updatedCategories = initialCategoriesData.map(
            (cat: Category) => ({
              ...cat,
              criteria: cat.criteria.map((crit: Criterion) => ({
                ...crit,
                selected: savedCriteria.includes(parseInt(crit.id, 10)),
              })),
            })
          );
          setCategories(updatedCategories);

          // Update custom criteria using initial values plus any saved definitions and API data
          const sessionDefinitions = state.customCriteriaDefinitions || [];
          const sessionIds = sessionDefinitions.map((d: Criterion) => d.id);

          const apiDefinitions = (apiCriteriaRes?.data || []).map((c) => ({
            id: c.id,
            name: c.name,
            description: c.description,
            selected: false, // will be set below
            scoreRange: '0 - 10',
            custom: true,
          }));
          const apiIds = apiDefinitions.map((d) => d.id);

          const allCustomDefinitions = [
            // Only include hardcoded ones if they haven't been "overridden" in session
            ...initialCustomCriteriaData.filter(
              (d) => !sessionIds.includes(d.id) && !apiIds.includes(d.id)
            ),
            ...apiDefinitions.filter((d) => !sessionIds.includes(d.id)),
            ...sessionDefinitions,
          ];

          // Use a Map to deduplicate by ID if necessary (just in case)
          const uniqueCustomDefinitions = Array.from(
            new Map(allCustomDefinitions.map((c) => [c.id, c])).values()
          );

          const updatedCustomCriteria = uniqueCustomDefinitions.map(
            (crit: Criterion) => {
              return {
                ...crit,
                selected: savedCriteria.some((savedId) => {
                  const critIdMatch = crit.id?.toString().match(/^c?(\d+)$/);
                  const critId = critIdMatch
                    ? parseInt(critIdMatch[1], 10)
                    : crit.id;
                  return savedId.toString() === critId?.toString();
                }),
              };
            }
          );
          setCustomCriteria(updatedCustomCriteria);
        } catch {
          // Silently handle restore error
        }
      }
      hasRestoredCriteria.current = true;
    }
  }, [initialCategoriesData, initialCustomCriteriaData, apiCriteriaRes]); // Include constants as dependencies

  useEffect(() => {
    setTitle('Manage Jury Criteria');
    setSubtitle('Innovation Technology > Grant Jury Criteria');
    setBackAction(true, () => navigate('/grants/create'));
    return () => resetHeader();
  }, [setTitle, setSubtitle, setBackAction, resetHeader, navigate]);

  const toggleCriterion = (catIdx: number, critIdx: number) => {
    const newCats = [...categories];
    newCats[catIdx].criteria[critIdx].selected =
      !newCats[catIdx].criteria[critIdx].selected;
    setCategories(newCats);
  };

  // Save selected criteria to sessionStorage
  const saveCriteriaToSessionStorage = () => {
    const allCriteria = [
      ...categories.flatMap((cat) => cat.criteria),
      ...customCriteria,
    ];
    const selectedCriteria = allCriteria
      .filter((crit) => crit.selected)
      .map((crit) => {
        // Handle both regular IDs (1, 2, 3) and custom IDs (c1, c2, c3 or UUID)
        const numericMatch = crit.id.match(/^c?(\d+)$/);
        if (numericMatch) {
          return parseInt(numericMatch[1], 10);
        }
        return crit.id; // Keep UUIDs as strings if they dont match numeric format
      });

    try {
      const savedState = sessionStorage.getItem(CREATE_GRANT_FORM_SESSION_KEY);
      const existingState = savedState ? JSON.parse(savedState) : {};

      const updatedState = {
        ...existingState,
        juryCriteria: selectedCriteria,
        customCriteriaDefinitions: customCriteria.filter((c) => c.custom),
      };

      sessionStorage.setItem(
        CREATE_GRANT_FORM_SESSION_KEY,
        JSON.stringify(updatedState)
      );

      showToast.success('Jury criteria saved successfully');
    } catch {
      showToast.error('Failed to save jury criteria');
    }
  };

  const handleSaveAndReturn = () => {
    saveCriteriaToSessionStorage();
    navigate('/grants/create');
  };

  const handleDeleteCriteria = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();

    // If it's a UUID (contains hyphens), it's from the backend
    const isBackend = id.includes('-');

    try {
      if (isBackend) {
        await deleteCriteria(id).unwrap();
      }

      setCustomCriteria((prev) => prev.filter((c) => c.id !== id));

      const savedState = sessionStorage.getItem(CREATE_GRANT_FORM_SESSION_KEY);
      if (savedState) {
        const state = JSON.parse(savedState) as Partial<GrantSessionState>;
        const numericMatch = id.match(/^c?(\d+)$/);
        const critId = numericMatch ? parseInt(numericMatch[1], 10) : id;

        const updatedState = {
          ...state,
          customCriteriaDefinitions: (
            state.customCriteriaDefinitions || []
          ).filter((d) => d.id !== id),
          juryCriteria: (state.juryCriteria || []).filter(
            (cid) => cid !== critId
          ),
        };

        sessionStorage.setItem(
          CREATE_GRANT_FORM_SESSION_KEY,
          JSON.stringify(updatedState)
        );
        showToast.success('Criterion deleted');
      }
    } catch {
      showToast.error('Failed to delete criterion');
    }

    setActiveMenuId(null);
  };

  const handleEditCriteria = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    navigate(`/grants/add-custom-criteria?id=${id}`);
  };

  return (
    <div className="manage-jury-page">
      <HeaderActions>
        <button
          className="header-btn btn-outline"
          onClick={() => {
            navigate('/grants/create');
          }}
        >
          Cancel
        </button>
        <button
          className="header-btn btn-primary"
          onClick={handleSaveAndReturn}
        >
          <Check size={18} />
          <span>Save & Return</span>
        </button>
      </HeaderActions>

      <div className="info-strip">
        <Info size={16} />
        <p>
          Selected criteria will each appear as a separate 0–10 scoring field on
          the jury evaluation form. Jury members will rate each criterion
          individually.
        </p>
        <X size={16} className="close-info" />
      </div>

      <div className="criteria-grid">
        <div className="criteria-column">
          {categories.slice(0, 2).map((cat, catIdx) => (
            <section key={cat.title} className="criteria-section">
              <div className="section-header">
                <h3>{cat.title}</h3>
                <span className="count-badge">
                  {cat.criteria.filter((c) => c.selected).length} of{' '}
                  {cat.criteria.length} selected
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
                {categories[2].criteria.filter((c) => c.selected).length} of{' '}
                {categories[2].criteria.length} selected
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
              <button
                className="btn-add-new"
                onClick={() => navigate('/grants/add-custom-criteria')}
              >
                <Plus size={16} />
                <span>Add New</span>
              </button>
            </div>
            <div className="criteria-list">
              {customCriteria.map((crit) => (
                <div
                  key={crit.id}
                  className={`criterion-item ${crit.selected ? 'selected' : ''}`}
                  onClick={() => {
                    const next = [...customCriteria];
                    const idx = next.findIndex((c) => c.id === crit.id);
                    next[idx].selected = !next[idx].selected;
                    setCustomCriteria(next);
                  }}
                >
                  <div className="checkbox">
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
                  <div className="menu-container">
                    <MoreVertical
                      size={16}
                      className="item-menu"
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveMenuId(
                          activeMenuId === crit.id ? null : crit.id
                        );
                      }}
                    />
                    {activeMenuId === crit.id && (
                      <div className="action-dropdown shadow-lg">
                        <button
                          className="menu-item"
                          onClick={(e) => handleEditCriteria(e, crit.id)}
                        >
                          <Edit size={14} />
                          <span>Edit</span>
                        </button>
                        <button
                          className="menu-item delete"
                          onClick={(e) => handleDeleteCriteria(e, crit.id)}
                        >
                          <Trash2 size={14} />
                          <span>Delete</span>
                        </button>
                      </div>
                    )}
                  </div>
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
            {categories[3].criteria.filter((c) => c.selected).length} of{' '}
            {categories[3].criteria.length} selected
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
