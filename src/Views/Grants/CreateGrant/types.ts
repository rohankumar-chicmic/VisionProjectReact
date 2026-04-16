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
  juryCriteria: number[];
  selectedJuryIds: string[];
  prizeWinners: PrizeWinnerInput[];
}

export type QuestionInput = OrganiserGrantCreateRequest['questions'][number];

export interface GalaBuilderGrantDraft {
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
  juryCriteria: number[];
  prizeWinners?: Array<{ rank: number; amount: number }>;
  juryIds?: string[];
}

export interface GalaBuilderState {
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
