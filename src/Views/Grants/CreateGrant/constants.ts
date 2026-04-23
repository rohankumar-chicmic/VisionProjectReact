import type { GrantFormState, RequiredFieldsState } from './types';

export const CREATE_GALA_FORM_SESSION_KEY = 'create_gala_form_state';
export const CREATE_GRANT_FORM_SESSION_KEY = 'create_grant_form_state';
export const MAX_PRIZES_PER_GRANT = 5;

export const DEFAULT_CATEGORY = 'Technology';

export const GRANT_CATEGORY_OPTIONS = [
  'Technology',
  'Environment',
  'Social Impact',
  'Health',
  'Education',
  'Arts & Culture',
  'Finance',
  'Media',
] as const;

export const DEFAULT_REQUIRED_FIELDS: RequiredFieldsState = {
  companyName: true,
  industrySelection: true,
  motivationStatement: true,
  businessPlan: false,
};

export const DEFAULT_JURY_CRITERIA = [1, 2, 5, 8];

export const INITIAL_GRANT_FORM_STATE: GrantFormState = {
  name: '',
  galaEventId: '',
  description: '',
  category: DEFAULT_CATEGORY,
  prizeAmount: '',
  numberOfPrizes: '',
  applicationDeadline: '',
  status: 1,
  questions: [],
  requirements: [],
  requireInterview: false,
  requiredFields: DEFAULT_REQUIRED_FIELDS,
  juryCriteria: DEFAULT_JURY_CRITERIA,
  selectedJuryIds: [],
  prizeWinners: [],
  customCriteriaDefinitions: [],
};
