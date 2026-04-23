/* eslint-disable jsx-a11y/label-has-associated-control, react/no-array-index-key */
import { useEffect, useMemo, useRef, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { HeaderActions, useHeader } from '../../Shared/Context/HeaderContext';
import RequirementsModal from './Components/RequirementsModal';
import {
  useCreateOrganiserGrantMutation,
  useGetOrganiserGrantByIdQuery,
  useUpdateOrganiserGrantMutation,
} from '../../Services/Api/module/Organiser/Grant';
import { useGetOrganiserGalasQuery } from '../../Services/Api/module/Organiser/Gala';
import { useGetOrganiserJuriesQuery } from '../../Services/Api/module/Organiser/Jury';
import useCurrentUserRole from '../../Shared/Auth/useCurrentUserRole';
import showToast from '../../Shared/Utils/toast';
import GrantApplicationSettingsSection from './CreateGrant/components/GrantApplicationSettingsSection';
import GrantBasicInfoSection from './CreateGrant/components/GrantBasicInfoSection';
import GrantCriteriaSection from './CreateGrant/components/GrantCriteriaSection';
import GrantEligibilitySection from './CreateGrant/components/GrantEligibilitySection';
import GrantFooterActions from './CreateGrant/components/GrantFooterActions';
import GrantHeaderActions from './CreateGrant/components/GrantHeaderActions';
import GrantJuryPanelSection from './CreateGrant/components/GrantJuryPanelSection';
import GrantPrizeSection from './CreateGrant/components/GrantPrizeSection';
import GrantQuestionsSection from './CreateGrant/components/GrantQuestionsSection';
import {
  buildGrantPayload,
  clearGrantSessionState,
  loadGalaBuilderState,
  loadGrantSessionState,
  mapGalaDraftToFormState,
  mapGrantDetailToFormState,
  saveGrantSessionState,
  saveLinkedGrantToGalaDraft,
} from './CreateGrant/mappers';
import type { GrantFormState, RequiredFieldsState } from './CreateGrant/types';
import {
  clampPrizeCount,
  createInitialGrantFormState,
  createQuestion,
  getMissingRequiredFields,
  getNextQuestionId,
  normalizePrizeWinners,
  suggestPrizeDistribution,
  syncPrizeWinnerAmounts,
} from './CreateGrant/utils';
import './CreateGrant.scss';

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

  const galaIdFromUrl = searchParams.get('galaId');
  const galaNameFromUrl = searchParams.get('galaName');

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
  const organiserJuries = useMemo(
    () => organiserJuriesResponse?.data ?? [],
    [organiserJuriesResponse?.data]
  );
  const isSaving = isCreating || isUpdating;

  const [formState, setFormState] = useState<GrantFormState>(
    createInitialGrantFormState
  );
  const [isReqModalOpen, setIsReqModalOpen] = useState(false);
  const [juryIdToAdd, setJuryIdToAdd] = useState('');
  const hasRestored = useRef(false);

  const updateFormState = (
    updater: (currentState: typeof formState) => typeof formState
  ) => {
    setFormState((currentState) => updater(currentState));
  };

  const setField = <K extends keyof typeof formState>(
    field: K,
    value: (typeof formState)[K]
  ) => {
    setFormState((currentState) => ({
      ...currentState,
      [field]: value,
    }));
  };

  useEffect(() => {
    const handleBeforeUnload = () => {
      if (!isEditMode) {
        saveGrantSessionState(formState);
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [formState, isEditMode]);

  useEffect(() => {
    if (!isEditMode && hasRestored.current) {
      saveGrantSessionState(formState);
    }
  }, [formState, isEditMode]);

  useEffect(() => {
    if (!isEditMode && !hasRestored.current) {
      const restoredState = loadGrantSessionState();

      if (restoredState) {
        setFormState(restoredState);
      }

      hasRestored.current = true;
    }
  }, [isEditMode]);

  useEffect(() => {
    if (isGalaBuilderMode) {
      const localState = loadGrantSessionState();
      const savedGalaState = loadGalaBuilderState();
      const targetGalaId = galaIdFromUrl || savedGalaState?.id || '';

      if (localState) {
        if (targetGalaId && !localState.galaEventId) {
          setFormState({ ...localState, galaEventId: targetGalaId });
        } else {
          setFormState(localState);
        }
        return;
      }

      const existingGrant =
        draftIndex === null
          ? undefined
          : savedGalaState?.grants?.[Number(draftIndex)];

      if (existingGrant) {
        const mapped = mapGalaDraftToFormState(existingGrant);
        setFormState({
          ...mapped,
          galaEventId: targetGalaId,
        });
      } else {
        setFormState((prev) => ({
          ...prev,
          galaEventId: targetGalaId,
        }));
      }

      return;
    }

    if (isEditMode && grantResponse?.data) {
      setFormState(mapGrantDetailToFormState(grantResponse.data));
    }
  }, [
    draftIndex,
    grantResponse,
    isEditMode,
    isGalaBuilderMode,
    galaIdFromUrl,
    id,
  ]);

  useEffect(() => {
    setTitle(isEditMode ? 'Edit Grant' : 'Create Grant');
    setSubtitle(
      isEditMode
        ? `Editing ${formState.name || 'Grant'}`
        : 'Set up Grant details and eligibility criteria'
    );
    setBackAction(true, () =>
      navigate(isGalaBuilderMode ? returnTo : '/grants')
    );

    return () => resetHeader();
  }, [
    formState.name,
    isEditMode,
    isGalaBuilderMode,
    navigate,
    resetHeader,
    returnTo,
    setBackAction,
    setSubtitle,
    setTitle,
  ]);

  const availableJuries = useMemo(
    () =>
      organiserJuries.filter(
        (jury) => !formState.selectedJuryIds.includes(jury.id)
      ),
    [organiserJuries, formState.selectedJuryIds]
  );

  const selectedJuries = useMemo(
    () =>
      organiserJuries.filter((jury) =>
        formState.selectedJuryIds.includes(jury.id)
      ),
    [organiserJuries, formState.selectedJuryIds]
  );

  const handlePrizeAmountChange = (value: string) => {
    updateFormState((currentState) => ({
      ...currentState,
      prizeAmount: value,
      prizeWinners: syncPrizeWinnerAmounts(
        currentState.prizeWinners,
        currentState.prizeAmount,
        value
      ),
    }));
  };

  const handleNumberOfPrizesChange = (value: string) => {
    const { count, wasClamped } = clampPrizeCount(value);

    if (wasClamped) {
      showToast.info('Maximum 5 prizes allowed per grant.');
    }

    updateFormState((currentState) => ({
      ...currentState,
      numberOfPrizes: count.toString(),
      prizeWinners: normalizePrizeWinners(
        currentState.prizeWinners,
        count,
        currentState.prizeAmount
      ),
    }));
  };

  const handlePrizeWinnerAmountChange = (rank: number, amount: string) => {
    updateFormState((currentState) => ({
      ...currentState,
      prizeWinners: currentState.prizeWinners.map((winner) =>
        winner.rank === rank ? { ...winner, amount } : winner
      ),
    }));
  };

  const handleSuggestDistribution = () => {
    const result = suggestPrizeDistribution(
      formState.prizeAmount,
      formState.numberOfPrizes,
      formState.prizeWinners
    );

    if (result.error) {
      showToast.error(result.error);
      return;
    }

    updateFormState((currentState) => ({
      ...currentState,
      prizeWinners: result.prizeWinners || currentState.prizeWinners,
    }));
    showToast.success('Distribution suggested based on your total pool.');
  };

  const handleSave = async (isPublishing = false) => {
    const missingFields = getMissingRequiredFields(
      formState,
      isGalaBuilderMode
    );

    if (missingFields.length > 0) {
      showToast.error(
        `Please fill in required fields: ${missingFields.join(', ')}`
      );
      return;
    }

    if (isGalaBuilderMode) {
      const result = saveLinkedGrantToGalaDraft(formState, draftIndex);

      if (result.error) {
        showToast.error(result.error);
        return;
      }

      showToast.success('Grant linked to gala successfully.');
      navigate(returnTo);
      return;
    }

    const payload = buildGrantPayload(formState, {
      id: id || formState.id,
      isPublishing,
    });
    const effectiveId = id || formState.id;

    try {
      if (effectiveId) {
        await updateGrant({
          ...payload,
          id: effectiveId,
        }).unwrap();
        showToast.success('Grant updated successfully');
      } else {
        await createGrant(payload).unwrap();
        showToast.success('Grant created successfully');
        clearGrantSessionState();
      }

      navigate('/grants');
    } catch (error: unknown) {
      const err = error as { data?: { message?: string }; message?: string };
      showToast.error(
        err?.data?.message || err?.message || 'Failed to save grant'
      );
    }
  };

  const handleAddQuestion = () => {
    updateFormState((currentState) => {
      const nextId = getNextQuestionId(currentState.questions);
      return {
        ...currentState,
        questions: [
          ...currentState.questions,
          createQuestion(nextId, currentState.questions.length),
        ],
      };
    });
  };

  const handleRemoveQuestion = (questionId: number) => {
    updateFormState((currentState) => ({
      ...currentState,
      questions: currentState.questions.filter(
        (question) => question.id !== questionId
      ),
    }));
  };

  const handleQuestionTextChange = (questionId: number, value: string) => {
    updateFormState((currentState) => ({
      ...currentState,
      questions: currentState.questions.map((question) =>
        question.id === questionId
          ? { ...question, questionText: value }
          : question
      ),
    }));
  };

  const handleQuestionTypeChange = (
    questionId: number,
    value: 'LongText' | 'Number' | 'File' | 'ShortText'
  ) => {
    updateFormState((currentState) => ({
      ...currentState,
      questions: currentState.questions.map((question) =>
        question.id === questionId
          ? { ...question, questionType: value }
          : question
      ),
    }));
  };

  const toggleField = (field: keyof RequiredFieldsState) => {
    updateFormState((currentState) => ({
      ...currentState,
      requiredFields: {
        ...currentState.requiredFields,
        [field]: !currentState.requiredFields[field],
      },
    }));
  };

  const handleAddJury = () => {
    if (!juryIdToAdd) return;

    updateFormState((currentState) => ({
      ...currentState,
      selectedJuryIds: currentState.selectedJuryIds.includes(juryIdToAdd)
        ? currentState.selectedJuryIds
        : [...currentState.selectedJuryIds, juryIdToAdd],
    }));
    setJuryIdToAdd('');
  };

  const handleRemoveJury = (juryId: string) => {
    updateFormState((currentState) => ({
      ...currentState,
      selectedJuryIds: currentState.selectedJuryIds.filter(
        (currentJuryId) => currentJuryId !== juryId
      ),
    }));
  };

  const handleManageCriteria = () => {
    saveGrantSessionState(formState);
    navigate('/grants/jury-criteria');
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
        <GrantHeaderActions
          isGalaBuilderMode={isGalaBuilderMode}
          isEditMode={isEditMode}
          isSaving={isSaving}
          onSaveDraft={() => handleSave(false)}
          onPublish={() => handleSave(true)}
        />
      </HeaderActions>

      <RequirementsModal
        isOpen={isReqModalOpen}
        onClose={() => setIsReqModalOpen(false)}
        onSave={(newRequirements) => {
          setField(
            'requirements',
            newRequirements
              .filter((requirement) => requirement.enabled)
              .map((requirement) => ({ text: requirement.text, order: 0 }))
          );
          setIsReqModalOpen(false);
        }}
        initialRequirements={formState.requirements.map(
          (requirement, index) => ({
            id: index.toString(),
            text: requirement.text,
            enabled: true,
          })
        )}
      />

      <div className="grant-form-centered-wrapper">
        <div className="grant-form-container">
          <GrantBasicInfoSection
            name={formState.name}
            galaEventId={formState.galaEventId}
            description={formState.description}
            category={formState.category}
            galas={galas}
            onNameChange={(value) => setField('name', value)}
            onGalaEventChange={(value) => setField('galaEventId', value)}
            onDescriptionChange={(value) => setField('description', value)}
            onCategoryChange={(value) => setField('category', value)}
            isGalaBuilderMode={isGalaBuilderMode}
            draftGalaName={galaNameFromUrl || loadGalaBuilderState()?.name}
          />

          <GrantQuestionsSection
            questions={formState.questions}
            onAddQuestion={handleAddQuestion}
            onRemoveQuestion={handleRemoveQuestion}
            onQuestionTextChange={handleQuestionTextChange}
            onQuestionTypeChange={handleQuestionTypeChange}
          />

          <GrantPrizeSection
            prizeAmount={formState.prizeAmount}
            numberOfPrizes={formState.numberOfPrizes}
            applicationDeadline={formState.applicationDeadline}
            prizeWinners={formState.prizeWinners}
            onPrizeAmountChange={handlePrizeAmountChange}
            onNumberOfPrizesChange={handleNumberOfPrizesChange}
            onApplicationDeadlineChange={(value) =>
              setField('applicationDeadline', value)
            }
            onPrizeWinnerAmountChange={handlePrizeWinnerAmountChange}
            onSuggestDistribution={handleSuggestDistribution}
          />

          <GrantEligibilitySection
            requirements={formState.requirements}
            onManageRequirements={() => setIsReqModalOpen(true)}
          />

          <GrantApplicationSettingsSection
            requireInterview={formState.requireInterview}
            requiredFields={formState.requiredFields}
            onToggleInterview={() =>
              setField('requireInterview', !formState.requireInterview)
            }
            onToggleField={toggleField}
          />

          {isOrganiser && (
            <GrantJuryPanelSection
              isLoadingJuries={isLoadingJuries}
              availableJuries={availableJuries}
              selectedJuries={selectedJuries}
              juryIdToAdd={juryIdToAdd}
              onJuryIdToAddChange={setJuryIdToAdd}
              onAddJury={handleAddJury}
              onRemoveJury={handleRemoveJury}
            />
          )}

          <GrantCriteriaSection
            juryCriteria={formState.juryCriteria}
            customCriteriaDefinitions={formState.customCriteriaDefinitions}
            onManageCriteria={handleManageCriteria}
          />

          <GrantFooterActions
            isSaving={isSaving}
            isEditMode={isEditMode}
            onDiscard={() => navigate('/grants')}
            onSave={() => handleSave(false)}
          />
        </div>
      </div>
    </div>
  );
}

export default CreateGrant;
