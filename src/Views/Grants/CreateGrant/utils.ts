import type { GrantAdditionalRequirement } from '../../../Services/Api/module/Admin/Grant';
import {
  DEFAULT_JURY_CRITERIA,
  DEFAULT_REQUIRED_FIELDS,
  DEFAULT_CATEGORY,
  INITIAL_GRANT_FORM_STATE,
  MAX_PRIZES_PER_GRANT,
} from './constants';
import type {
  GrantFormState,
  GrantSessionState,
  PrizeWinnerInput,
  QuestionInput,
  Question,
  RequiredFieldsState,
} from './types';

export const createInitialGrantFormState = (): GrantFormState => ({
  ...INITIAL_GRANT_FORM_STATE,
  requiredFields: { ...DEFAULT_REQUIRED_FIELDS },
  juryCriteria: [...DEFAULT_JURY_CRITERIA],
  questions: [],
  requirements: [],
  selectedJuryIds: [],
  prizeWinners: [],
  customCriteriaDefinitions: [],
});

export const hasPersistedGrantContent = (
  state: Partial<GrantSessionState> | null | undefined
) => Boolean(state?.name || state?.description || state?.prizeAmount);

export const clampPrizeCount = (value: string) => {
  const parsedValue = Number(value) || 0;
  const count = Math.min(parsedValue, MAX_PRIZES_PER_GRANT);

  return {
    count,
    wasClamped: parsedValue > MAX_PRIZES_PER_GRANT,
  };
};

export const createQuestion = (id: number, order: number): Question => ({
  id,
  questionText: 'New Question',
  questionType: 'ShortText',
  order,
});

export const getNextQuestionId = (questions: Question[]) =>
  questions.length > 0
    ? Math.max(...questions.map((question) => question.id)) + 1
    : 1;

const toQuestionType = (questionType: string): Question['questionType'] => {
  switch (questionType) {
    case 'LongText':
    case 'Number':
    case 'File':
    case 'ShortText':
      return questionType;
    default:
      return 'ShortText';
  }
};

export const normalizeQuestions = (questions: QuestionInput[]): Question[] =>
  questions.map((question, index) => ({
    ...question,
    id: index + 1,
    questionType: toQuestionType(question.questionType),
  }));

export const normalizeRequirements = (
  requirements?: Array<{ text: string; order: number }>
): GrantAdditionalRequirement[] =>
  (requirements || []).map((requirement) => ({
    text: requirement.text,
    order: requirement.order,
  }));

export const buildDefaultPrizeWinners = (
  count: number,
  totalPrizeAmount: string
): PrizeWinnerInput[] => {
  const total = Number(totalPrizeAmount) || 0;
  const defaultAmount = count > 0 ? (total / count).toString() : '0';

  return Array.from({ length: count }, (_, index) => ({
    rank: index + 1,
    amount: defaultAmount,
  }));
};

export const normalizePrizeWinners = (
  currentPrizeWinners: PrizeWinnerInput[],
  count: number,
  totalPrizeAmount: string
): PrizeWinnerInput[] => {
  const nextPrizeWinners = currentPrizeWinners.slice(0, Math.max(0, count));
  const total = Number(totalPrizeAmount) || 0;
  const defaultAmount = count > 0 ? (total / count).toString() : '0';

  while (nextPrizeWinners.length < count) {
    nextPrizeWinners.push({
      rank: nextPrizeWinners.length + 1,
      amount: defaultAmount,
    });
  }

  return nextPrizeWinners.map((winner, index) => ({
    ...winner,
    rank: index + 1,
  }));
};

export const syncPrizeWinnerAmounts = (
  prizeWinners: PrizeWinnerInput[],
  previousPrizeAmount: string,
  nextPrizeAmount: string
) =>
  prizeWinners.map((winner) => ({
    ...winner,
    amount:
      winner.amount === previousPrizeAmount ? nextPrizeAmount : winner.amount,
  }));

export const suggestPrizeDistribution = (
  totalPrizeAmount: string,
  numberOfPrizes: string,
  prizeWinners: PrizeWinnerInput[]
) => {
  const total = Number(totalPrizeAmount) || 0;
  const count = Number(numberOfPrizes) || 0;

  if (total <= 0) {
    return { error: 'Please enter a valid total prize amount first.' };
  }

  if (count <= 0) {
    return { error: 'Please enter the number of prizes first.' };
  }

  const nextPrizeWinners = prizeWinners.map((winner) => {
    let suggestedAmount = 0;

    if (count === 3) {
      if (winner.rank === 1) suggestedAmount = total * 0.5;
      else if (winner.rank === 2) suggestedAmount = total * 0.3;
      else if (winner.rank === 3) suggestedAmount = total * 0.2;
    } else if (count === 4) {
      if (winner.rank === 4) suggestedAmount = total * 0.15;
      else {
        const remainingAmount = total * 0.85;
        if (winner.rank === 1) suggestedAmount = remainingAmount * 0.5;
        else if (winner.rank === 2) suggestedAmount = remainingAmount * 0.3;
        else if (winner.rank === 3) suggestedAmount = remainingAmount * 0.2;
      }
    } else if (count === 5) {
      if (winner.rank >= 4) suggestedAmount = total * 0.1;
      else {
        const remainingAmount = total * 0.8;
        if (winner.rank === 1) suggestedAmount = remainingAmount * 0.5;
        else if (winner.rank === 2) suggestedAmount = remainingAmount * 0.3;
        else if (winner.rank === 3) suggestedAmount = remainingAmount * 0.2;
      }
    } else {
      suggestedAmount = total / count;
    }

    return {
      ...winner,
      amount: Math.round(suggestedAmount).toString(),
    };
  });

  return { prizeWinners: nextPrizeWinners };
};

export const getMissingRequiredFields = (
  formState: GrantFormState,
  isGalaBuilderMode: boolean
) => {
  const missingFields: string[] = [];

  if (!formState.name.trim()) missingFields.push('Grant Name');
  if (!isGalaBuilderMode && !formState.galaEventId)
    missingFields.push('Associated Gala');
  if (!formState.description.trim()) missingFields.push('Description');
  if (!formState.prizeAmount) missingFields.push('Prize Amount');
  if (!formState.numberOfPrizes) missingFields.push('Number of Prizes');
  if (!formState.applicationDeadline)
    missingFields.push('Application Deadline');

  return missingFields;
};

export const toDateInputValue = (date: string) => {
  if (!date) return '';
  const d = new Date(date);
  if (Number.isNaN(d.getTime())) return '';
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');
  return `${year}-${month}-${day}T${hours}:${minutes}`;
};

export const toUtcIsoString = (localDateStr: string) => {
  if (!localDateStr) return '';
  const d = new Date(localDateStr);
  if (Number.isNaN(d.getTime())) return '';
  return d.toISOString();
};

export const getRequiredFieldsState = (
  requiredFields?: Partial<RequiredFieldsState>
): RequiredFieldsState => ({
  companyName:
    requiredFields?.companyName ?? DEFAULT_REQUIRED_FIELDS.companyName,
  industrySelection:
    requiredFields?.industrySelection ??
    DEFAULT_REQUIRED_FIELDS.industrySelection,
  motivationStatement:
    requiredFields?.motivationStatement ??
    DEFAULT_REQUIRED_FIELDS.motivationStatement,
  businessPlan:
    requiredFields?.businessPlan ?? DEFAULT_REQUIRED_FIELDS.businessPlan,
});

export const sanitizeSessionState = (
  state: Partial<GrantSessionState>
): GrantFormState => ({
  ...createInitialGrantFormState(),
  ...state,
  category: state.category || DEFAULT_CATEGORY,
  requiredFields: getRequiredFieldsState(state.requiredFields),
  juryCriteria: state.juryCriteria || [...DEFAULT_JURY_CRITERIA],
  questions: state.questions || [],
  requirements: state.requirements || [],
  selectedJuryIds: state.selectedJuryIds || [],
  prizeWinners: state.prizeWinners || [],
  customCriteriaDefinitions: state.customCriteriaDefinitions || [],
});
