import api from '../../../api';

export interface GrantQuestion {
  questionText: string;
  questionType: 'ShortText' | 'LongText' | 'Number' | 'File';
  order: number;
}

export interface GrantAdditionalRequirement {
  text: string;
  order: number;
}

export interface CreateUpdateGrantRequest {
  id?: string;
  galaEventId: string;
  name: string;
  description: string;
  category: string;
  prizeAmount: number;
  numberOfPrizes: number;
  applicationDeadline: string;
  status: number;
  questions: GrantQuestion[];
  requireInterview: boolean;
  requireCompanyName: boolean;
  requireIndustrySelection: boolean;
  requireMotivationStatement: boolean;
  requireBusinessPlanDocument: boolean;
  juryCriteria: number[];
  additionalRequirements: GrantAdditionalRequirement[];
}

export interface GrantItem {
  id: string;
  galaEventId: string;
  name: string;
  description: string;
  category: string;
  prizeAmount: number;
  numberOfPrizes: number;
  applicationDeadline: string;
  status: number;
  createdAt: string;
  applicantCount: number;
  eligibilityCriteria: string[];
  isWinnerDecided?: boolean;
}

export interface GrantResponse {
  success: boolean;
  message: string;
  data: GrantItem[];
  errors: unknown;
  notificationCount: number;
}

export interface AdminGrantDetailData {
  id: string;
  galaEventId: string;
  galaEventName: string;
  name: string;
  description: string;
  category: string;
  prizeAmount: number;
  numberOfPrizes: number;
  applicationDeadline: string;
  durationLeftSeconds: number;
  status: number;
  createdAt: string;
  requireInterview: boolean;
  requireCompanyName: boolean;
  requireIndustrySelection: boolean;
  requireMotivationStatement: boolean;
  requireBusinessPlanDocument: boolean;
  questions: GrantQuestion[];
  requirements: GrantAdditionalRequirement[];
  criteria: {
    criteriaKey: string;
    name: string;
    description: string;
    category: string;
    isCustom: boolean;
    isActive: boolean;
    type: number;
  }[];
  juries: {
    id: string;
    fullName: string;
    email: string;
    phoneNumber: string;
    companyName: string;
    domainOfExpertise: string;
  }[];
  prizeWinners: {
    id: string;
    rank: number;
    amount: number;
    winnerUserId: string | null;
    winnerFullName: string | null;
    winnerUserName: string | null;
  }[];
  isWinnerDecided: boolean;
  decidedWinnersCount: number;
  totalWinnerSlots: number;
  winnerDecisionMessage: string;
  applicantCount?: number;
}

export interface SingleGrantResponse {
  success: boolean;
  message: string;
  data: AdminGrantDetailData;
}

export interface GrantParams {
  page?: number;
  pageSize?: number;
  status?: number;
  galaEventId?: string;
  search?: string;
}

export const adminGrantsApi = api.injectEndpoints({
  endpoints: (build) => ({
    getAdminGrants: build.query<GrantResponse, GrantParams>({
      query: (params) => ({
        url: '/api/v1/admin/grants',
        method: 'GET',
        params,
      }),
      providesTags: ['Grants'],
    }),
    getAdminGrantById: build.query<SingleGrantResponse, string>({
      query: (id) => ({
        url: `/api/v1/admin/grants/${id}`,
        method: 'GET',
      }),
      providesTags: (_result, _error, id) => [{ type: 'Grants', id }],
    }),
    getAdminGrantsSummary: build.query<
      {
        data: {
          totalGrants: number;
          activePrograms: number;
          totalFundAmount: number;
          totalApplicants: number;
        };
      },
      void
    >({
      query: () => ({
        url: '/api/v1/admin/grants/summary',
        method: 'GET',
      }),
      providesTags: ['Grants'],
    }),
    createAdminGrant: build.mutation<
      { success: boolean; message: string },
      CreateUpdateGrantRequest
    >({
      query: (body) => ({
        url: '/api/v1/admin/grants',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Grants'],
    }),
    updateAdminGrant: build.mutation<
      { success: boolean; message: string },
      CreateUpdateGrantRequest
    >({
      query: (body) => ({
        url: `/api/v1/admin/grants/${body.id}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: (_result, _error, body) => [
        'Grants',
        { type: 'Grants', id: body.id },
      ],
    }),
    deleteAdminGrant: build.mutation<
      { success: boolean; message: string },
      string
    >({
      query: (id) => ({
        url: `/api/v1/admin/grants/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Grants'],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetAdminGrantsQuery,
  useGetAdminGrantByIdQuery,
  useGetAdminGrantsSummaryQuery,
  useCreateAdminGrantMutation,
  useUpdateAdminGrantMutation,
  useDeleteAdminGrantMutation,
} = adminGrantsApi;
