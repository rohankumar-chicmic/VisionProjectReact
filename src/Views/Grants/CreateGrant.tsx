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
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { useHeader, HeaderActions } from '../../Shared/Context/HeaderContext';
import RequirementsModal from './Components/RequirementsModal';
import {
  GrantQuestion,
  GrantAdditionalRequirement,
} from '../../Services/Api/module/Admin/Grant';
import {
  useCreateOrganiserGrantMutation,
  useGetOrganiserGrantByIdQuery,
  useUpdateOrganiserGrantMutation,
} from '../../Services/Api/module/Organiser/Grant';
import { useGetOrganiserGalasQuery } from '../../Services/Api/module/Organiser/Gala';
import { useGetOrganiserJuriesQuery } from '../../Services/Api/module/Organiser/Jury';
import useCurrentUserRole from '../../Shared/Auth/useCurrentUserRole';
import showToast from '../../Shared/Utils/toast';
import './CreateGrant.scss';

interface Question extends GrantQuestion {
  id: number;
}

interface PrizeWinnerInput {
  rank: number;
  amount: string;
}

const CREATE_GALA_FORM_SESSION_KEY = 'create_gala_form_state';

function CreateGrant() {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const isGalaBuilderMode = searchParams.get('mode') === 'gala-builder';
  const draftIndex = searchParams.get('draftIndex');
  const returnTo = searchParams.get('returnTo') || '/galas/create';
  const isEditMode = Boolean(id);
  const { setTitle, setSubtitle, setBackAction, resetHeader } = useHeader();
  const navigate = useNavigate();
  const { role } = useCurrentUserRole();
  const isOrganiser = role === 'organiser';

  // API Hooks
  const { data: galasResponse } = useGetOrganiserGalasQuery(
    { status: 1, pageSize: 100 },
    { skip: !isOrganiser }
  );
  const { data: organiserJuriesResponse, isLoading: isLoadingJuries } =
    useGetOrganiserJuriesQuery(undefined, { skip: !isOrganiser });
  const { data: grantResponse, isLoading: isFetchingGrant } =
    useGetOrganiserGrantByIdQuery(id ?? '', { skip: !id });
  const [createGrant, { isLoading: isCreating }] =
    useCreateOrganiserGrantMutation();
  const [updateGrant, { isLoading: isUpdating }] =
    useUpdateOrganiserGrantMutation();

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
  const [status, setStatus] = useState(1); // Default to Draft
  const [prizeWinners, setPrizeWinners] = useState<PrizeWinnerInput[]>([]);

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

  const normalizePrizeWinners = (
    count: number,
    baseAmount: string
  ): PrizeWinnerInput[] => {
    const next = prizeWinners.slice(0, Math.max(0, count));
    const defaultAmount = baseAmount || '0';
    while (next.length < count) {
      next.push({ rank: next.length + 1, amount: defaultAmount });
    }
    return next.map((item, index) => ({
      ...item,
      rank: index + 1,
    }));
  };

  const handlePrizeAmountChange = (value: string) => {
    setPrizeAmount(value);
    setPrizeWinners((prev) =>
      prev.map((winner) => ({
        ...winner,
        amount: winner.amount === prizeAmount ? value : winner.amount,
      }))
    );
  };

  const handleNumberOfPrizesChange = (value: string) => {
    setNumberOfPrizes(value);
    const count = Number(value) || 0;
    setPrizeWinners(normalizePrizeWinners(count, prizeAmount));
  };

  const handlePrizeWinnerAmountChange = (rank: number, amount: string) => {
    setPrizeWinners((current) =>
      current.map((winner) =>
        winner.rank === rank ? { ...winner, amount } : winner
      )
    );
  };

  const [juryCriteria] = useState<number[]>([1, 2, 5, 8]);
  const [selectedJuryIds, setSelectedJuryIds] = useState<string[]>([]);
  const [juryIdToAdd, setJuryIdToAdd] = useState('');

  const organiserJuries = useMemo(
    () => organiserJuriesResponse?.data ?? [],
    [organiserJuriesResponse?.data]
  );

  // Sync Data on Edit Mode
  useEffect(() => {
    if (isGalaBuilderMode) {
      const savedState = sessionStorage.getItem(CREATE_GALA_FORM_SESSION_KEY);

      if (!savedState) return;

      try {
        const state = JSON.parse(savedState) as {
          grants?: Array<{
            name: string;
            description: string;
            category: string;
            prizeAmount: number;
            numberOfPrizes: number;
            applicationDeadline: string;
            status: number;
            questions: GrantQuestion[];
            additionalRequirements: GrantAdditionalRequirement[];
            requireInterview: boolean;
            requireCompanyName: boolean;
            requireIndustrySelection: boolean;
            requireMotivationStatement: boolean;
            requireBusinessPlanDocument: boolean;
            juryCriteria: number[];
            prizeWinners?: Array<{ rank: number; amount: number }>;
            juryIds?: string[];
          }>;
        };

        const existingGrant =
          draftIndex === null ? undefined : state.grants?.[Number(draftIndex)];

        if (!existingGrant) return;

        setName(existingGrant.name);
        setDescription(existingGrant.description);
        setCategory(existingGrant.category);
        setPrizeAmount(existingGrant.prizeAmount.toString());
        setNumberOfPrizes(existingGrant.numberOfPrizes.toString());
        setApplicationDeadline(
          new Date(existingGrant.applicationDeadline)
            .toISOString()
            .split('T')[0]
        );
        setStatus(existingGrant.status);
        setQuestions(
          existingGrant.questions.map((question, index) => ({
            ...question,
            id: index + 1,
          }))
        );
        setRequirements(existingGrant.additionalRequirements || []);
        setRequireInterview(existingGrant.requireInterview);
        setRequiredFields({
          companyName: existingGrant.requireCompanyName,
          industrySelection: existingGrant.requireIndustrySelection,
          motivationStatement: existingGrant.requireMotivationStatement,
          businessPlan: existingGrant.requireBusinessPlanDocument,
        });
        setSelectedJuryIds(existingGrant.juryIds || []);
        setPrizeWinners(
          existingGrant.prizeWinners?.map((winner) => ({
            rank: winner.rank,
            amount: winner.amount.toString(),
          })) ||
            Array.from(
              { length: existingGrant.numberOfPrizes || 0 },
              (_, index) => ({
                rank: index + 1,
                amount: existingGrant.prizeAmount.toString(),
              })
            )
        );
      } catch (error: unknown) {
        // Silently handle draft restore error
      }

      return;
    }

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
        grant.questions.map((q, idx) => ({
          ...q,
          id: idx + 1,
          questionType: q.questionType as
            | 'LongText'
            | 'Number'
            | 'File'
            | 'ShortText',
        })) || []
      );
      setRequirements(
        (grant.requirements || []).map(
          (r: { text: string; order: number }) => ({
            text: r.text,
            order: r.order,
          })
        )
      );
      setRequireInterview(grant.requireInterview);
      setRequiredFields({
        companyName: grant.requireCompanyName,
        industrySelection: grant.requireIndustrySelection,
        motivationStatement: grant.requireMotivationStatement,
        businessPlan: grant.requireBusinessPlanDocument,
      });
      setSelectedJuryIds(grant.juries?.map((j: { id: string }) => j.id) || []);
      setPrizeWinners(
        grant.prizeWinners?.map(
          (winner: { rank: number; amount: number | string }) => ({
            rank: winner.rank,
            amount: winner.amount.toString(),
          })
        ) ||
          Array.from({ length: grant.numberOfPrizes || 0 }, (_, index) => ({
            rank: index + 1,
            amount: grant.prizeAmount.toString(),
          }))
      );
    }
  }, [draftIndex, grantResponse, isEditMode, isGalaBuilderMode]);

  useEffect(() => {
    setTitle(isEditMode ? 'Edit Grant' : 'Create Grant');
    setSubtitle(
      isEditMode
        ? `Editing ${name || 'Grant'}`
        : 'Set up Grant details and eligibility criteria'
    );
    setBackAction(true, () =>
      navigate(isGalaBuilderMode ? returnTo : '/grants')
    );
    return () => resetHeader();
  }, [
    isGalaBuilderMode,
    setTitle,
    setSubtitle,
    setBackAction,
    resetHeader,
    navigate,
    isEditMode,
    name,
    returnTo,
  ]);

  const handleSave = async (isPublishingParam: boolean = false) => {
    const isPublishing = isPublishingParam;
    if (
      !name ||
      (!isGalaBuilderMode && !galaEventId) ||
      !description ||
      !prizeAmount ||
      !numberOfPrizes ||
      !applicationDeadline
    ) {
      showToast.error('Please fill in all required fields');
      return;
    }

    const payload = {
      id,
      name,
      description,
      category,
      prizeAmount: Number(prizeAmount),
      numberOfPrizes: Number(numberOfPrizes),
      applicationDeadline: new Date(applicationDeadline).toISOString(),
      status: isPublishing ? 1 : status,
      questions: questions.map((q, idx) => ({
        questionText: q.questionText,
        questionType: q.questionType,
        order: q.order ?? idx,
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
      galaEventId,
      juryPanelSize: selectedJuryIds.length,
      prizeWinners: prizeWinners.map((winner) => ({
        rank: winner.rank,
        amount: Number(winner.amount),
      })),
      juryIds: selectedJuryIds,
    };

    if (isGalaBuilderMode) {
      try {
        const savedState = sessionStorage.getItem(CREATE_GALA_FORM_SESSION_KEY);

        if (!savedState) {
          showToast.error('No gala draft was found to link this grant.');
          return;
        }

        const state = JSON.parse(savedState) as { grants?: unknown[] };
        const nextGrants = [...(state.grants || [])];
        const linkedGrant = {
          ...payload,
          galaEventId: '',
        };

        if (draftIndex === null) {
          nextGrants.push(linkedGrant);
        } else {
          nextGrants[Number(draftIndex)] = linkedGrant;
        }

        sessionStorage.setItem(
          CREATE_GALA_FORM_SESSION_KEY,
          JSON.stringify({
            ...state,
            grants: nextGrants,
          })
        );
        showToast.success('Grant linked to gala successfully.');
        navigate(returnTo);
        return;
      } catch (error: unknown) {
        showToast.error('Failed to link grant to the gala draft.');
        return;
      }
    }

    try {
      if (isEditMode) {
        await updateGrant({
          ...payload,
          id: id!,
        }).unwrap();
        showToast.success('Grant updated successfully');
      } else {
        await createGrant(payload).unwrap();
        showToast.success('Grant created successfully');
      }
      navigate('/grants');
    } catch (error: unknown) {
      const err = error as { data?: { message?: string }; message?: string };
      showToast.error(
        err?.data?.message || err?.message || 'Failed to save grant'
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
        questionType: 'ShortText',
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

  const availableJuries = useMemo(
    () => organiserJuries.filter((jury) => !selectedJuryIds.includes(jury.id)),
    [organiserJuries, selectedJuryIds]
  );

  const selectedJuries = useMemo(
    () => organiserJuries.filter((jury) => selectedJuryIds.includes(jury.id)),
    [organiserJuries, selectedJuryIds]
  );

  const handleAddJury = () => {
    if (!juryIdToAdd) return;

    setSelectedJuryIds((current) =>
      current.includes(juryIdToAdd) ? current : [...current, juryIdToAdd]
    );
    setJuryIdToAdd('');
  };

  const handleRemoveJury = (juryId: string) => {
    setSelectedJuryIds((current) =>
      current.filter((idValue) => idValue !== juryId)
    );
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
                <label htmlFor="grant-name">
                  Grant Name *
                  <input
                    id="grant-name"
                    type="text"
                    placeholder="e.g., Innovation Technology Grant"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </label>
              </div>

              <div className="form-group">
                <label htmlFor="associated-gala">
                  Associated Gala *
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
                          galas.find((g) => g.id === galaEventId)?.eventDate ||
                            ''
                        ).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                </label>
              </div>

              <div className="form-group">
                <label htmlFor="description">
                  Description *
                  <textarea
                    id="description"
                    placeholder="For businesses developing innovative technology solutions..."
                    rows={4}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </label>
              </div>

              <div className="form-group">
                <label htmlFor="category">
                  Category/Industry *
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
                </label>
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
                            | 'LongText'
                            | 'Number'
                            | 'File'
                            | 'ShortText';
                          setQuestions(next);
                        }}
                      >
                        <option value="ShortText">Short Text</option>
                        <option value="LongText">Long Text</option>
                        <option value="Number">Number</option>
                        <option value="File">File Upload</option>
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
                  <label htmlFor="prize-amount">
                    Prize Amount *
                    <div className="input-with-icon">
                      <span className="currency-symbol">$</span>
                      <input
                        id="prize-amount"
                        type="number"
                        placeholder="5,000"
                        value={prizeAmount}
                        onChange={(e) =>
                          handlePrizeAmountChange(e.target.value)
                        }
                      />
                    </div>
                  </label>
                </div>
                <div className="form-group">
                  <label htmlFor="num-prizes">
                    Number of Prizes *
                    <div className="input-with-icon">
                      <Trophy size={18} />
                      <input
                        id="num-prizes"
                        type="number"
                        min="1"
                        placeholder="e.g., 3"
                        value={numberOfPrizes}
                        onChange={(e) =>
                          handleNumberOfPrizesChange(e.target.value)
                        }
                      />
                    </div>
                  </label>
                </div>
                <div className="form-group">
                  <label htmlFor="deadline">
                    Application Deadline *
                    <div className="input-with-icon">
                      <Calendar size={18} />
                      <input
                        id="deadline"
                        type="date"
                        value={applicationDeadline}
                        onChange={(e) => setApplicationDeadline(e.target.value)}
                      />
                    </div>
                  </label>
                </div>
              </div>

              <div className="info-alert">
                <Info size={18} />
                <p>
                  Example: 3 prizes means 3 winners will be selected from
                  approved candidates
                </p>
              </div>

              <div className="prize-winners-section">
                <div className="section-heading">
                  <h4>Prize Winners</h4>
                  <p>Set amount for each winning rank</p>
                </div>
                <div className="prize-winners-grid">
                  {prizeWinners.length > 0 ? (
                    prizeWinners.map((winner) => (
                      <div key={winner.rank} className="prize-winner-item">
                        <label htmlFor={`prize-winner-${winner.rank}`}>
                          Rank {winner.rank}
                          <div className="input-with-icon">
                            <span className="currency-symbol">$</span>
                            <input
                              id={`prize-winner-${winner.rank}`}
                              type="number"
                              min="0"
                              value={winner.amount}
                              onChange={(e) =>
                                handlePrizeWinnerAmountChange(
                                  winner.rank,
                                  e.target.value
                                )
                              }
                            />
                          </div>
                        </label>
                      </div>
                    ))
                  ) : (
                    <div className="empty-prize-winners">
                      Add a number of prizes to configure winner rankings.
                    </div>
                  )}
                </div>
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
                <button
                  type="button"
                  className={`toggle-switch ${requireInterview ? 'active' : ''}`}
                  onClick={() => setRequireInterview(!requireInterview)}
                  role="switch"
                  aria-checked={requireInterview}
                  aria-label="Require Interview"
                >
                  <div className="switch-handle" />
                </button>
              </div>

              <div className="required-fields-section">
                <h4>Required Application Fields</h4>
                <div className="checkbox-grid">
                  <button
                    type="button"
                    className="checkbox-item"
                    onClick={() => toggleField('companyName')}
                    role="checkbox"
                    aria-checked={requiredFields.companyName}
                  >
                    <div
                      className={`checkbox ${requiredFields.companyName ? 'checked' : ''}`}
                    >
                      {requiredFields.companyName && (
                        <Plus size={12} className="check-icon" />
                      )}
                    </div>
                    <span>Company Name</span>
                  </button>
                  <button
                    type="button"
                    className="checkbox-item"
                    onClick={() => toggleField('industrySelection')}
                    role="checkbox"
                    aria-checked={requiredFields.industrySelection}
                  >
                    <div
                      className={`checkbox ${requiredFields.industrySelection ? 'checked' : ''}`}
                    >
                      {requiredFields.industrySelection && (
                        <Plus size={12} className="check-icon" />
                      )}
                    </div>
                    <span>Industry Selection</span>
                  </button>
                  <button
                    type="button"
                    className="checkbox-item"
                    onClick={() => toggleField('motivationStatement')}
                    role="checkbox"
                    aria-checked={requiredFields.motivationStatement}
                  >
                    <div
                      className={`checkbox ${requiredFields.motivationStatement ? 'checked' : ''}`}
                    >
                      {requiredFields.motivationStatement && (
                        <Plus size={12} className="check-icon" />
                      )}
                    </div>
                    <span>Motivation Statement</span>
                  </button>
                  <button
                    type="button"
                    className="checkbox-item"
                    onClick={() => toggleField('businessPlan')}
                    role="checkbox"
                    aria-checked={requiredFields.businessPlan}
                  >
                    <div
                      className={`checkbox ${requiredFields.businessPlan ? 'checked' : ''}`}
                    >
                      {requiredFields.businessPlan && (
                        <Plus size={12} className="check-icon" />
                      )}
                    </div>
                    <span>Business Plan Document</span>
                  </button>
                </div>
              </div>
            </div>
          </section>

          {isOrganiser && (
            <section className="form-card">
              <div className="card-header">
                <h3>Jury Panel</h3>
                <p>Select organiser jury members who can review this grant</p>
              </div>
              <div className="card-body">
                <div className="jury-panel-picker">
                  <div className="jury-picker-row">
                    <div className="custom-select">
                      <label htmlFor="jury-select" className="sr-only">
                        Select Jury Member
                      </label>
                      <select
                        id="jury-select"
                        value={juryIdToAdd}
                        onChange={(e) => setJuryIdToAdd(e.target.value)}
                        disabled={
                          isLoadingJuries || availableJuries.length === 0
                        }
                      >
                        <option value="">
                          {isLoadingJuries
                            ? 'Loading jury members...'
                            : 'Select a jury member'}
                        </option>
                        {availableJuries.map((jury) => (
                          <option key={jury.id} value={jury.id}>
                            {jury.fullName} - {jury.domainOfExpertise}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="select-arrow" size={18} />
                    </div>
                    <button
                      type="button"
                      className="btn-add-item btn-primary-lite"
                      onClick={handleAddJury}
                      disabled={!juryIdToAdd}
                    >
                      <Plus size={16} />
                      <span>Add Jury</span>
                    </button>
                  </div>

                  {selectedJuries.length > 0 ? (
                    <div className="selected-jury-list">
                      {selectedJuries.map((jury) => (
                        <div key={jury.id} className="selected-jury-card">
                          <div className="jury-copy">
                            <strong>{jury.fullName}</strong>
                            <span>
                              {jury.domainOfExpertise} • {jury.email}
                            </span>
                          </div>
                          <button
                            type="button"
                            className="icon-btn delete"
                            onClick={() => handleRemoveJury(jury.id)}
                            aria-label={`Remove ${jury.fullName}`}
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="jury-panel-empty">
                      No jury members selected yet. Add one from the dropdown.
                    </div>
                  )}
                </div>
              </div>
            </section>
          )}

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
