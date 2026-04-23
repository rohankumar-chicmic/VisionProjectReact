import type {
  GrantAdditionalRequirement,
  GrantQuestion,
} from '../../../Services/Api/module/Admin/Grant';
import type {
  OrganiserGrantCreateRequest,
  OrganiserGrantDetailData,
} from '../../../Services/Api/module/Organiser/Grant';

export interface Question extends GrantQuestion {
  id: number;
}

export interface Criterion {
  id: string;
  name: string;
  description: string;
  selected: boolean;
  scoreRange: string;
  custom?: boolean;
}

export interface PrizeWinnerInput {
  rank: number;
  amount: string;
}

export interface RequiredFieldsState {
  companyName: boolean;
  industrySelection: boolean;
  motivationStatement: boolean;
  businessPlan: boolean;
}

export interface GrantFormState {
  id?: string;
  name: string;
  galaEventId: string;
  description: string;
  category: string;
  prizeAmount: string;
  numberOfPrizes: string;
  applicationDeadline: string;
  status: number;
  questions: Question[];
  requirements: GrantAdditionalRequirement[];
  requireInterview: boolean;
  requiredFields: RequiredFieldsState;
  juryCriteria: (string | number)[];
  selectedJuryIds: string[];
  prizeWinners: PrizeWinnerInput[];
  customCriteriaDefinitions: Criterion[];
}

export type QuestionInput = OrganiserGrantCreateRequest['questions'][number];

export interface GalaBuilderGrantDraft {
  id?: string;
  galaEventId?: string;
  name: string;
  description: string;
  category: string;
  prizeAmount: number;
  numberOfPrizes: number;
  applicationDeadline: string;
  status: number;
  questions: QuestionInput[];
  additionalRequirements: GrantAdditionalRequirement[];
  requireInterview: boolean;
  requireCompanyName: boolean;
  requireIndustrySelection: boolean;
  requireMotivationStatement: boolean;
  requireBusinessPlanDocument: boolean;
  juryCriteria: (string | number)[];
  prizeWinners?: Array<{ rank: number; amount: number }>;
  juryIds?: string[];
}

export interface GalaBuilderState {
  id?: string;
  name?: string;
  grants?: GalaBuilderGrantDraft[];
}

export interface GrantSessionState extends GrantFormState {}

export interface GrantPayloadOptions {
  id?: string;
  isPublishing: boolean;
}

export type OrganiserGrantPayload = OrganiserGrantCreateRequest & {
  id?: string;
};

export type GrantDetail = OrganiserGrantDetailData;
