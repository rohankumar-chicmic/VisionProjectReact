/* eslint-disable jsx-a11y/label-has-associated-control, react/no-array-index-key */
import { useEffect, useState, useMemo } from 'react';
import {
  Plus,
  Trash2,
  Save,
  Send,
  Info,
  ChevronDown,
  Calendar,
  Trophy,
  CheckCircle2,
  Settings2,
  Loader2,
} from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { useHeader, HeaderActions } from '../../Shared/Context/HeaderContext';
import RequirementsModal from './Components/RequirementsModal';
import {
  useCreateGrantMutation,
  useGetGrantByIdQuery,
  useUpdateGrantMutation,
  GrantQuestion,
  GrantAdditionalRequirement,
} from '../../Services/Api/module/GrantsApi';
import { useGetGalasQuery } from '../../Services/Api/module/GalaApi';
import showToast from '../../Shared/Utils/toast';
import './CreateGrant.scss';

interface Question extends GrantQuestion {
  id: number;
}

function CreateGrant() {
  const { id } = useParams<{ id: string }>();
  const isEditMode = Boolean(id);
  const { setTitle, setSubtitle, setBackAction, resetHeader } = useHeader();
  const navigate = useNavigate();

  // API Hooks
  const { data: galasResponse } = useGetGalasQuery({});
  const { data: grantResponse, isLoading: isFetchingGrant } =
    useGetGrantByIdQuery(id!, { skip: !isEditMode });
  const [createGrant, { isLoading: isCreating }] = useCreateGrantMutation();
  const [updateGrant, { isLoading: isUpdating }] = useUpdateGrantMutation();

  const galas = useMemo(
    () => galasResponse?.data?.items || [],
    [galasResponse]
  );

  // Form State
  const [name, setName] = useState('');
  const [galaEventId, setGalaEventId] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Technology');
  const [prizeAmount, setPrizeAmount] = useState<string>('');
  const [numberOfPrizes, setNumberOfPrizes] = useState<string>('');
  const [applicationDeadline, setApplicationDeadline] = useState('');
  const [status, setStatus] = useState(4); // Default to Draft

  const [questions, setQuestions] = useState<Question[]>([]);
  const [isReqModalOpen, setIsReqModalOpen] = useState(false);
  const [requirements, setRequirements] = useState<
    GrantAdditionalRequirement[]
  >([]);

  const [requireInterview, setRequireInterview] = useState(false);
  const [requiredFields, setRequiredFields] = useState({
    companyName: true,
    industrySelection: true,
    motivationStatement: true,
    businessPlan: false,
  });

  const [juryCriteria] = useState<number[]>([1, 2, 8, 11]);

  // Sync Data on Edit Mode
  useEffect(() => {
    if (isEditMode && grantResponse?.data) {
      const grant = grantResponse.data;
      setName(grant.name);
      setGalaEventId(grant.galaEventId);
      setDescription(grant.description);
      setCategory(grant.category);
      setPrizeAmount(grant.prizeAmount.toString());
      setNumberOfPrizes(grant.numberOfPrizes.toString());
      setApplicationDeadline(
        new Date(grant.applicationDeadline).toISOString().split('T')[0]
      );
      setStatus(grant.status);
      setQuestions(
        grant.questions.map((q, idx) => ({ ...q, id: idx + 1 })) || []
      );
      setRequirements(grant.additionalRequirements || []);
      setRequireInterview(grant.requireInterview);
      setRequiredFields({
        companyName: grant.requireCompanyName,
        industrySelection: grant.requireIndustrySelection,
        motivationStatement: grant.requireMotivationStatement,
        businessPlan: grant.requireBusinessPlanDocument,
      });
    }
  }, [isEditMode, grantResponse]);

  useEffect(() => {
    setTitle(isEditMode ? 'Edit Grant' : 'Create Grant');
    setSubtitle(
      isEditMode
        ? `Editing ${name || 'Grant'}`
        : 'Set up Grant details and eligibility criteria'
    );
    setBackAction(true, () => navigate('/grants'));
    return () => resetHeader();
  }, [
    setTitle,
    setSubtitle,
    setBackAction,
    resetHeader,
    navigate,
    isEditMode,
    name,
  ]);

  const handleSave = async (isPublishing = false) => {
    if (!name || !galaEventId || !description || !prizeAmount) {
      showToast.error('Please fill in all required fields');
      return;
    }

    const payload = {
      id,
      name,
      galaEventId,
      description,
      category,
      prizeAmount: Number(prizeAmount),
      numberOfPrizes: Number(numberOfPrizes),
      applicationDeadline: new Date(applicationDeadline).toISOString(),
      status: isPublishing ? 1 : status,
      questions: questions.map((q, idx) => ({
        questionText: q.questionText,
        questionType: q.questionType,
        order: idx,
      })),
      requireInterview,
      requireCompanyName: requiredFields.companyName,
      requireIndustrySelection: requiredFields.industrySelection,
      requireMotivationStatement: requiredFields.motivationStatement,
      requireBusinessPlanDocument: requiredFields.businessPlan,
      juryCriteria,
      additionalRequirements: requirements.map((r, idx) => ({
        ...r,
        order: idx,
      })),
    };

    try {
      if (isEditMode) {
        await updateGrant(payload).unwrap();
        showToast.success('Grant updated successfully');
      } else {
        await createGrant(payload).unwrap();
        showToast.success('Grant created successfully');
      }
      navigate('/grants');
    } catch (error) {
      showToast.error(
        error instanceof Error ? error.message : 'Failed to save grant'
      );
    }
  };

  const addQuestion = () => {
    const newId =
      questions.length > 0 ? Math.max(...questions.map((q) => q.id)) + 1 : 1;
    setQuestions([
      ...questions,
      {
        id: newId,
        questionText: 'New Question',
        questionType: 'Short Text',
        order: questions.length,
      },
    ]);
  };

  const removeQuestion = (qId: number) => {
    setQuestions(questions.filter((q) => q.id !== qId));
  };

  const toggleField = (field: keyof typeof requiredFields) => {
    setRequiredFields((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  if (isFetchingGrant) {
    return (
      <div className="loading-container">
        <Loader2 className="animate-spin" size={48} />
        <p>Fetching grant details...</p>
      </div>
    );
  }

  return (
    <div className="create-grant-page">
      <HeaderActions>
        <button
          type="button"
          className="header-btn btn-outline"
          onClick={() => handleSave(false)}
          disabled={isCreating || isUpdating}
        >
          <Save size={18} />
          <span>{isEditMode ? 'Update' : 'Save Draft'}</span>
        </button>
        <button
          type="button"
          className="header-btn btn-primary"
          onClick={() => handleSave(true)}
          disabled={isCreating || isUpdating}
        >
          <Send size={18} />
          <span>Publish</span>
        </button>
      </HeaderActions>

      <RequirementsModal
        isOpen={isReqModalOpen}
        onClose={() => setIsReqModalOpen(false)}
        onSave={(newReqs) => {
          setRequirements(
            newReqs
              .filter((r) => r.enabled)
              .map((r) => ({ text: r.text, order: 0 }))
          );
          setIsReqModalOpen(false);
        }}
        initialRequirements={requirements.map((r, i) => ({
          id: i.toString(),
          text: r.text,
          enabled: true,
        }))}
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
                <label htmlFor="grant-name">Grant Name *</label>
                <input
                  id="grant-name"
                  type="text"
                  placeholder="e.g., Innovation Technology Grant"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label htmlFor="associated-gala">Associated Gala *</label>
                <div className="select-with-info">
                  <select
                    id="associated-gala"
                    value={galaEventId}
                    onChange={(e) => setGalaEventId(e.target.value)}
                  >
                    <option value="">Select a Gala</option>
                    {galas.map((g) => (
                      <option key={g.id} value={g.id}>
                        {g.name}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="select-arrow" size={18} />
                  {galaEventId && (
                    <span className="info-text">
                      {galas.find((g) => g.id === galaEventId)?.city} •{' '}
                      {new Date(
                        galas.find((g) => g.id === galaEventId)?.eventDate || ''
                      ).toLocaleDateString()}
                    </span>
                  )}
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="description">Description *</label>
                <textarea
                  id="description"
                  placeholder="For businesses developing innovative technology solutions..."
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label htmlFor="category">Category/Industry *</label>
                <div className="custom-select">
                  <select
                    id="category"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                  >
                    <option value="Technology">Technology</option>
                    <option value="Environment">Environment</option>
                    <option value="Social Impact">Social Impact</option>
                    <option value="Health">Health</option>
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
                <p>
                  Custom questions shown to users when applying to this grant
                </p>
              </div>
              <button
                type="button"
                className="btn-add-item btn-primary-lite"
                onClick={addQuestion}
              >
                <Plus size={16} />
                <span>Add Question</span>
              </button>
            </div>
            <div className="card-body">
              <div className="questions-list">
                {questions.map((q) => (
                  <div key={q.id} className="question-item">
                    <div className="number-circle">{q.id}</div>
                    <label
                      htmlFor={`question-text-${q.id}`}
                      className="sr-only"
                    >
                      Question Text
                    </label>
                    <input
                      id={`question-text-${q.id}`}
                      className="question-input"
                      value={q.questionText}
                      onChange={(e) => {
                        const next = [...questions];
                        const idx = next.findIndex((item) => item.id === q.id);
                        next[idx].questionText = e.target.value;
                        setQuestions(next);
                      }}
                    />
                    <div className="question-actions">
                      <label
                        htmlFor={`question-type-${q.id}`}
                        className="sr-only"
                      >
                        Question Type
                      </label>
                      <select
                        id={`question-type-${q.id}`}
                        className="type-select"
                        value={q.questionType}
                        onChange={(e) => {
                          const next = [...questions];
                          const idx = next.findIndex(
                            (item) => item.id === q.id
                          );
                          next[idx].questionType = e.target.value as
                            | 'Long Text'
                            | 'File Upload'
                            | 'Short Text';
                          setQuestions(next);
                        }}
                      >
                        <option value="Short Text">Short Text</option>
                        <option value="Long Text">Long Text</option>
                        <option value="File Upload">File Upload</option>
                      </select>
                      <button
                        type="button"
                        className="icon-btn delete"
                        onClick={() => removeQuestion(q.id)}
                        aria-label="Delete question"
                      >
                        <Trash2 size={16} />
                      </button>
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
                  <label htmlFor="prize-amount">Prize Amount *</label>
                  <div className="input-with-icon">
                    <span className="currency-symbol">$</span>
                    <input
                      id="prize-amount"
                      type="number"
                      placeholder="5,000"
                      value={prizeAmount}
                      onChange={(e) => setPrizeAmount(e.target.value)}
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label htmlFor="num-prizes">Number of Prizes *</label>
                  <div className="input-with-icon">
                    <Trophy size={18} />
                    <input
                      id="num-prizes"
                      type="number"
                      placeholder="e.g., 3"
                      value={numberOfPrizes}
                      onChange={(e) => setNumberOfPrizes(e.target.value)}
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label htmlFor="deadline">Application Deadline *</label>
                  <div className="input-with-icon">
                    <Calendar size={18} />
                    <input
                      id="deadline"
                      type="date"
                      value={applicationDeadline}
                      onChange={(e) => setApplicationDeadline(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <div className="info-alert">
                <Info size={18} />
                <p>
                  Example: 3 prizes means 3 winners will be selected from
                  approved candidates
                </p>
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
                  <button
                    type="button"
                    className="btn-manage"
                    onClick={() => setIsReqModalOpen(true)}
                  >
                    <Settings2 size={16} />
                    <span>Manage</span>
                  </button>
                </div>
                <div className="requirements-summary">
                  {requirements.map((req, idx) => (
                    <div
                      key={`req-${req.text}-${idx}`}
                      className="req-summary-item"
                    >
                      <CheckCircle2 size={16} />
                      <span>{req.text}</span>
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
                  onKeyDown={(e) =>
                    e.key === 'Enter' && setRequireInterview(!requireInterview)
                  }
                  role="switch"
                  aria-checked={requireInterview}
                  aria-label="Require Interview"
                  tabIndex={0}
                >
                  <div className="switch-handle" />
                </div>
              </div>

              <div className="required-fields-section">
                <h4>Required Application Fields</h4>
                <div className="checkbox-grid">
                  <div
                    className="checkbox-item"
                    onClick={() => toggleField('companyName')}
                    onKeyDown={(e) =>
                      e.key === 'Enter' && toggleField('companyName')
                    }
                    role="checkbox"
                    aria-checked={requiredFields.companyName}
                    tabIndex={0}
                  >
                    <div
                      className={`checkbox ${requiredFields.companyName ? 'checked' : ''}`}
                    >
                      {requiredFields.companyName && (
                        <Plus size={12} className="check-icon" />
                      )}
                    </div>
                    <span>Company Name</span>
                  </div>
                  <div
                    className="checkbox-item"
                    onClick={() => toggleField('industrySelection')}
                    onKeyDown={(e) =>
                      e.key === 'Enter' && toggleField('industrySelection')
                    }
                    role="checkbox"
                    aria-checked={requiredFields.industrySelection}
                    tabIndex={0}
                  >
                    <div
                      className={`checkbox ${requiredFields.industrySelection ? 'checked' : ''}`}
                    >
                      {requiredFields.industrySelection && (
                        <Plus size={12} className="check-icon" />
                      )}
                    </div>
                    <span>Industry Selection</span>
                  </div>
                  <div
                    className="checkbox-item"
                    onClick={() => toggleField('motivationStatement')}
                    onKeyDown={(e) =>
                      e.key === 'Enter' && toggleField('motivationStatement')
                    }
                    role="checkbox"
                    aria-checked={requiredFields.motivationStatement}
                    tabIndex={0}
                  >
                    <div
                      className={`checkbox ${requiredFields.motivationStatement ? 'checked' : ''}`}
                    >
                      {requiredFields.motivationStatement && (
                        <Plus size={12} className="check-icon" />
                      )}
                    </div>
                    <span>Motivation Statement</span>
                  </div>
                  <div
                    className="checkbox-item"
                    onClick={() => toggleField('businessPlan')}
                    onKeyDown={(e) =>
                      e.key === 'Enter' && toggleField('businessPlan')
                    }
                    role="checkbox"
                    aria-checked={requiredFields.businessPlan}
                    tabIndex={0}
                  >
                    <div
                      className={`checkbox ${requiredFields.businessPlan ? 'checked' : ''}`}
                    >
                      {requiredFields.businessPlan && (
                        <Plus size={12} className="check-icon" />
                      )}
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
                <p>
                  Define evaluation criteria that jury members will use to score
                  applicants
                </p>
              </div>
              <button
                type="button"
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
                  <div className="count-badge">{juryCriteria.length}</div>
                  <div className="header-text">
                    <h4>Criteria selected</h4>
                    <p>Will appear on jury scoring form</p>
                  </div>
                </div>
                <div className="criteria-chips-list">
                  {juryCriteria.map((critId) => (
                    <span key={critId} className="crit-chip">
                      Criterion #{critId}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </section>

          <footer className="form-navigation">
            <button
              type="button"
              className="btn-secondary"
              onClick={() => navigate('/grants')}
            >
              Discard Changes
            </button>
            <button
              type="button"
              className="btn-primary"
              onClick={() => handleSave(false)}
              disabled={isCreating || isUpdating}
            >
              {isCreating || isUpdating ? (
                <Loader2 className="animate-spin" size={18} />
              ) : (
                <Save size={18} />
              )}
              <span>{isEditMode ? 'Update Grant' : 'Save Grant'}</span>
            </button>
          </footer>
        </div>
      </div>
    </div>
  );
}

export default CreateGrant;
