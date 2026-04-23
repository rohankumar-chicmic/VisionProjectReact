import type { OrganiserGrantCreateRequest } from '../../../Services/Api/module/Organiser/Grant';
import {
  CREATE_GALA_FORM_SESSION_KEY,
  CREATE_GRANT_FORM_SESSION_KEY,
} from './constants';
import type {
  GalaBuilderGrantDraft,
  GalaBuilderState,
  GrantDetail,
  GrantFormState,
  GrantPayloadOptions,
  GrantSessionState,
} from './types';
import {
  createInitialGrantFormState,
  hasPersistedGrantContent,
  normalizePrizeWinners,
  normalizeQuestions,
  normalizeRequirements,
  sanitizeSessionState,
  toDateInputValue,
} from './utils';

export const buildGrantSessionState = (
  formState: GrantFormState
): GrantSessionState => ({
  ...formState,
  id: formState.id,
  requiredFields: { ...formState.requiredFields },
  juryCriteria: [...formState.juryCriteria],
  questions: [...formState.questions],
  requirements: [...formState.requirements],
  selectedJuryIds: [...formState.selectedJuryIds],
  prizeWinners: [...formState.prizeWinners],
  customCriteriaDefinitions: [...formState.customCriteriaDefinitions],
});

export const saveGrantSessionState = (formState: GrantFormState) => {
  sessionStorage.setItem(
    CREATE_GRANT_FORM_SESSION_KEY,
    JSON.stringify(buildGrantSessionState(formState))
  );
};

export const clearGrantSessionState = () => {
  sessionStorage.removeItem(CREATE_GRANT_FORM_SESSION_KEY);
};

export const loadGrantSessionState = (): GrantFormState | null => {
  const savedState = sessionStorage.getItem(CREATE_GRANT_FORM_SESSION_KEY);

  if (!savedState) return null;

  try {
    const parsedState = JSON.parse(savedState) as Partial<GrantSessionState>;

    if (!hasPersistedGrantContent(parsedState)) {
      return null;
    }

    return sanitizeSessionState(parsedState);
  } catch {
    return null;
  }
};

export const loadGalaBuilderState = (): GalaBuilderState | null => {
  const savedState = sessionStorage.getItem(CREATE_GALA_FORM_SESSION_KEY);

  if (!savedState) return null;

  try {
    return JSON.parse(savedState) as GalaBuilderState;
  } catch {
    return null;
  }
};

export const mapGrantDetailToFormState = (
  grant: GrantDetail
): GrantFormState => ({
  ...createInitialGrantFormState(),
  id: grant.id,
  name: grant.name,
  galaEventId: grant.galaEventId,
  description: grant.description,
  category: grant.category,
  prizeAmount: grant.prizeAmount.toString(),
  numberOfPrizes: grant.numberOfPrizes.toString(),
  applicationDeadline: toDateInputValue(grant.applicationDeadline),
  status: grant.status,
  questions: normalizeQuestions(grant.questions),
  requirements: normalizeRequirements(grant.requirements),
  requireInterview: grant.requireInterview,
  requiredFields: {
    companyName: grant.requireCompanyName,
    industrySelection: grant.requireIndustrySelection,
    motivationStatement: grant.requireMotivationStatement,
    businessPlan: grant.requireBusinessPlanDocument,
  },
  selectedJuryIds: grant.juries?.map((jury) => jury.id) || [],
  prizeWinners:
    grant.prizeWinners?.map((winner) => ({
      rank: winner.rank,
      amount: winner.amount.toString(),
    })) ||
    normalizePrizeWinners(
      [],
      grant.numberOfPrizes || 0,
      grant.prizeAmount.toString()
    ),
});

export const mapGalaDraftToFormState = (
  grantDraft: GalaBuilderGrantDraft
): GrantFormState => ({
  ...createInitialGrantFormState(),
  id: grantDraft.id,
  name: grantDraft.name,
  description: grantDraft.description,
  category: grantDraft.category,
  prizeAmount: grantDraft.prizeAmount.toString(),
  numberOfPrizes: grantDraft.numberOfPrizes.toString(),
  applicationDeadline: toDateInputValue(grantDraft.applicationDeadline),
  status: grantDraft.status,
  questions: normalizeQuestions(grantDraft.questions),
  requirements: (grantDraft.additionalRequirements || []).map(
    (requirement) => ({
      text: requirement.text,
      order: requirement.order,
    })
  ),
  requireInterview: grantDraft.requireInterview,
  requiredFields: {
    companyName: grantDraft.requireCompanyName,
    industrySelection: grantDraft.requireIndustrySelection,
    motivationStatement: grantDraft.requireMotivationStatement,
    businessPlan: grantDraft.requireBusinessPlanDocument,
  },
  juryCriteria: grantDraft.juryCriteria || [],
  selectedJuryIds: grantDraft.juryIds || [],
  prizeWinners:
    grantDraft.prizeWinners?.map((winner) => ({
      rank: winner.rank,
      amount: winner.amount.toString(),
    })) ||
    normalizePrizeWinners(
      [],
      grantDraft.numberOfPrizes || 0,
      grantDraft.prizeAmount.toString()
    ),
});

export const buildGrantPayload = (
  formState: GrantFormState,
  options: GrantPayloadOptions
): OrganiserGrantCreateRequest & { id?: string } => ({
  id: options.id || formState.id,
  name: formState.name,
  description: formState.description,
  category: formState.category,
  prizeAmount: Number(formState.prizeAmount),
  numberOfPrizes: Number(formState.numberOfPrizes),
  applicationDeadline: new Date(formState.applicationDeadline).toISOString(),
  status: options.isPublishing ? 1 : formState.status,
  questions: formState.questions.map((question, index) => ({
    questionText: question.questionText,
    questionType: question.questionType,
    order: question.order ?? index,
  })),
  requireInterview: formState.requireInterview,
  requireCompanyName: formState.requiredFields.companyName,
  requireIndustrySelection: formState.requiredFields.industrySelection,
  requireMotivationStatement: formState.requiredFields.motivationStatement,
  requireBusinessPlanDocument: formState.requiredFields.businessPlan,
  juryCriteria: formState.juryCriteria,
  additionalRequirements: formState.requirements.map((requirement, index) => ({
    ...requirement,
    order: index,
  })),
  galaEventId: formState.galaEventId,
  juryPanelSize: formState.selectedJuryIds.length,
  prizeWinners: formState.prizeWinners.slice(0, 3).map((winner) => ({
    rank: winner.rank,
    amount: Number(winner.amount),
  })),
  juryIds: formState.selectedJuryIds,
});

export const saveLinkedGrantToGalaDraft = (
  formState: GrantFormState,
  draftIndex: string | null
) => {
  const savedState = loadGalaBuilderState();

  if (!savedState) {
    return { error: 'No gala draft was found to link this grant.' };
  }

  const payload = buildGrantPayload(formState, { isPublishing: false });
  const linkedGrant: GalaBuilderGrantDraft = {
    ...payload,
    id: formState.id,
    galaEventId: '',
  };
  const nextGrants = [...(savedState.grants || [])];

  if (draftIndex === null) {
    nextGrants.push(linkedGrant);
  } else {
    nextGrants[Number(draftIndex)] = linkedGrant;
  }

  sessionStorage.setItem(
    CREATE_GALA_FORM_SESSION_KEY,
    JSON.stringify({
      ...savedState,
      grants: nextGrants,
    })
  );

  clearGrantSessionState();

  return { success: true };
};
