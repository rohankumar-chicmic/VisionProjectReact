/* eslint-disable jsx-a11y/click-events-have-key-events, jsx-a11y/label-has-associated-control, jsx-a11y/no-static-element-interactions */
import { useEffect, useState } from 'react';
import { MoreVertical, PlusCircle, Eye, Edit } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useHeader, HeaderActions } from '../../Shared/Context/HeaderContext';
import {
  useCreateOrganiserJuryCriteriaMutation,
  useGetOrganiserJuryCriteriaByIdQuery,
  useUpdateOrganiserJuryCriteriaMutation,
} from '../../Services/Api/module/Organiser/JuryCriteria';
import type { Criterion, GrantSessionState } from './CreateGrant/types';
import showToast from '../../Shared/Utils/toast';
import './AddCustomCriteria.scss';

function AddCustomCriteria() {
  const { setTitle, setSubtitle, setBackAction, resetHeader } = useHeader();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const editId = searchParams.get('id');

  const [criteriaName, setCriteriaName] = useState('');
  const [description, setDescription] = useState('');
  const [scale, setScale] = useState('0-10');
  const [isEnabled, setIsEnabled] = useState(true);

  const [createCriteria] = useCreateOrganiserJuryCriteriaMutation();
  const [updateCriteria] = useUpdateOrganiserJuryCriteriaMutation();
  const { data: detailRes } = useGetOrganiserJuryCriteriaByIdQuery(editId!, {
    skip: !editId || !editId.includes('-'),
  });

  useEffect(() => {
    setTitle(editId ? 'Edit Custom Criteria' : 'Add Custom Criteria');
    setSubtitle(
      `Innovation Technology > Grant Jury Criteria > ${editId ? 'Edit' : 'Add'} Custom`
    );
    setBackAction(true, () => navigate('/grants/jury-criteria'));
    return () => resetHeader();
  }, [setTitle, setSubtitle, setBackAction, resetHeader, navigate, editId]);

  useEffect(() => {
    if (editId) {
      if (editId.includes('-')) {
        // Backend UUID
        if (detailRes?.data) {
          setCriteriaName(detailRes.data.name);
          setDescription(detailRes.data.description);
          // Scale is currently fixed to 0-10 based on earlier request
        }
      } else {
        // Session-only or hardcoded ID (e.g. c101)
        const savedState = sessionStorage.getItem('create_grant_form_state');
        if (savedState) {
          try {
            const state = JSON.parse(savedState) as Partial<GrantSessionState>;
            const criterion = (state.customCriteriaDefinitions || []).find(
              (c: Criterion) => c.id === editId
            );
            if (criterion) {
              setCriteriaName(criterion.name);
              setDescription(criterion.description);
              setScale(criterion.scoreRange);
              setIsEnabled(criterion.selected ?? true);
            }
          } catch {
            // ignore error
          }
        }
      }
    }
  }, [editId, detailRes]);

  const handleCreateCriteria = async () => {
    if (!criteriaName.trim() || !description.trim()) {
      return;
    }

    try {
      let finalId = editId;

      if (editId && editId.includes('-')) {
        // Update backend
        await updateCriteria({
          id: editId,
          name: criteriaName,
          description,
          category: 'Custom',
        }).unwrap();
      } else {
        // Create new or update session-only
        const result = await createCriteria({
          name: criteriaName,
          description,
          category: 'Custom',
        }).unwrap();
        finalId = result.data.id;
      }

      const savedState = sessionStorage.getItem('create_grant_form_state');
      const existingState = savedState
        ? (JSON.parse(savedState) as Partial<GrantSessionState>)
        : {};

      const updatedDefinitions = [
        ...(existingState.customCriteriaDefinitions || []),
      ];
      const updatedJuryCriteria = [...(existingState.juryCriteria || [])];

      if (editId) {
        const index = updatedDefinitions.findIndex((d) => d.id === editId);
        if (index !== -1) {
          updatedDefinitions[index] = {
            ...updatedDefinitions[index],
            id: finalId!,
            name: criteriaName,
            description,
            selected: isEnabled,
            scoreRange: scale,
          };

          const oldCritId = parseInt(editId.replace('c', ''), 10) || editId;
          const criteriaIndex = updatedJuryCriteria.indexOf(oldCritId);
          if (isEnabled && criteriaIndex === -1) {
            updatedJuryCriteria.push(finalId!);
          } else if (!isEnabled && criteriaIndex !== -1) {
            updatedJuryCriteria.splice(criteriaIndex, 1);
          } else if (isEnabled && criteriaIndex !== -1) {
            updatedJuryCriteria[criteriaIndex] = finalId!;
          }
        }
      } else {
        updatedDefinitions.push({
          id: finalId!,
          name: criteriaName,
          description,
          selected: isEnabled,
          scoreRange: scale,
          custom: true,
        });

        if (isEnabled) {
          updatedJuryCriteria.push(finalId!);
        }
      }

      const updatedState = {
        ...existingState,
        customCriteriaDefinitions: updatedDefinitions,
        juryCriteria: updatedJuryCriteria,
      };

      sessionStorage.setItem(
        'create_grant_form_state',
        JSON.stringify(updatedState)
      );
      navigate('/grants/jury-criteria');
    } catch {
      showToast.error('Failed to save criteria');
    }
  };

  return (
    <div className="add-custom-criteria-page">
      <HeaderActions>
        <button
          type="button"
          className="header-btn btn-outline"
          onClick={() => navigate('/grants/jury-criteria')}
        >
          Cancel
        </button>
        <button
          type="button"
          className="header-btn btn-primary"
          onClick={handleCreateCriteria}
        >
          {editId ? <Edit size={18} /> : <PlusCircle size={18} />}
          <span>{editId ? 'Update Criteria' : 'Create Criteria'}</span>
        </button>
      </HeaderActions>

      <div className="add-criteria-content">
        <div className="form-column">
          <section className="form-card main-form">
            <div className="card-header-icon">
              <div className="icon-box">
                {editId ? <Edit size={32} /> : <PlusCircle size={32} />}
              </div>
              <div className="header-text">
                <h3>{editId ? 'Edit' : 'Create New'} Evaluation Criteria</h3>
                <p>
                  This criteria will appear as a scoring field on the jury
                  evaluation form
                </p>
              </div>
            </div>

            <div className="form-body">
              <div className="form-group">
                <div className="label-row">
                  <label>Criteria Name *</label>
                  <span className="char-count">
                    {criteriaName.length}/50 characters
                  </span>
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
                  <span className="helper-text">
                    Helps jury members understand how to evaluate
                  </span>
                </div>
                <textarea
                  placeholder="e.g., How clearly and compellingly does the applicant present their business idea?"
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              {/* 
              <div className="form-group">
                <label>Scoring Scale *</label>
                <div className="scale-selector">
                  <div
                    className={`scale-option ${scale === '0-10' ? 'active' : ''}`}
                    onClick={() => setScale('0-10')}
                  >
                    <div className="radio" />
                    <div className="option-text">
                      <span className="scale-val">0 - 10</span>
                      <span className="desc">Standard (recommended)</span>
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
*/}

              <div className="toggle-group">
                <div className="toggle-text">
                  <h4>Enable for this grant immediately</h4>
                  <p>Criteria will be pre-selected in Manage Criteria</p>
                </div>
                <div
                  className={`toggle-switch ${isEnabled ? 'active' : ''}`}
                  onClick={() => setIsEnabled(!isEnabled)}
                >
                  <div className="switch-handle" />
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
                  <span className="score">
                    8 <span className="max">/ 10</span>
                  </span>
                </div>
                <p>
                  {description ||
                    'How clearly and compellingly does the applicant present their business idea?'}
                </p>
              </div>
              <div className="preview-slider">
                <div className="slider-track">
                  <div className="slider-fill" style={{ width: '80%' }} />
                  <div className="slider-handle" style={{ left: '80%' }} />
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
}

export default AddCustomCriteria;
