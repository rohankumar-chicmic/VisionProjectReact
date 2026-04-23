import api from '../../../api';
import type { GrantParams, GrantResponse } from '../../Admin/Grant';

export interface PrizeWinner {
  rank: number;
  amount: number;
}

export interface OrganiserGrantCreateRequest {
  galaEventId: string;
  name: string;
  description: string;
  category: string;
  prizeAmount: number;
  numberOfPrizes: number;
  applicationDeadline: string;
  status: number;
  questions: { questionText: string; questionType: string; order: number }[];
  requireInterview: boolean;
  requireCompanyName: boolean;
  requireIndustrySelection: boolean;
  requireMotivationStatement: boolean;
  requireBusinessPlanDocument: boolean;
  juryCriteria: (string | number)[];
  additionalRequirements: { text: string; order: number }[];
  juryPanelSize?: number;
  prizeWinners: PrizeWinner[];
  juryIds: string[];
}

export interface OrganiserGrantDetailData {
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
  questions: {
    questionText: string;
    questionType: string;
    order: number;
  }[];
  requirements: {
    text: string;
    order: number;
  }[];
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
  canAllocate?: boolean;
  cannotAllocateReason?: string;
  isWinnersReleased?: boolean;
}

export interface OrganiserGrantDetailResponse {
  success: boolean;
  message: string;
  data: OrganiserGrantDetailData;
  errors: unknown;
  notificationCount: number;
}

export interface OrganiserGrantSummaryData {
  totalGrants: number;
  activePrograms: number;
  totalFundAmount: number;
  totalApplicants: number;
}

export interface OrganiserGrantSummaryResponse {
  success: boolean;
  message: string;
  data: OrganiserGrantSummaryData;
  errors: unknown;
  notificationCount: number;
}

export interface AutoAllocateGrantWinnersResponse {
  success: boolean;
  message: string;
  data: unknown;
  errors: unknown;
}

export interface WinnerForRelease {
  id: string;
  rank: number;
  amount: number;
  winnerUserId: string;
  winnerFullName: string;
  walletAddress: string;
}

export interface GetGrantWinnersForReleaseResponse {
  success: boolean;
  message: string;
  data: WinnerForRelease[];
  errors: unknown;
}

export interface ReleaseGrantWinnersOnChainResponse {
  success: boolean;
  message: string;
  data: unknown;
  errors: unknown;
}

export const organiserGrantApi = api.injectEndpoints({
  endpoints: (build) => ({
    getOrganiserGrants: build.query<GrantResponse, GrantParams>({
      query: (params) => ({
        url: '/api/v1/organiser/grants',
        method: 'GET',
        params,
      }),
      providesTags: ['OrganiserGrants'],
    }),

    getOrganiserGrantSummary: build.query<OrganiserGrantSummaryResponse, void>({
      query: () => ({
        url: '/api/v1/organiser/grants/summary',
        method: 'GET',
      }),
      providesTags: ['OrganiserGrants'],
    }),
    getOrganiserGrantById: build.query<OrganiserGrantDetailResponse, string>({
      query: (id) => ({
        url: `/api/v1/organiser/grants/${id}`,
        method: 'GET',
      }),
      providesTags: (_result, _error, id) => [{ type: 'OrganiserGrants', id }],
    }),

    createOrganiserGrant: build.mutation<
      { success: boolean; message: string },
      OrganiserGrantCreateRequest
    >({
      query: (body) => ({
        url: '/api/v1/organiser/grants',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['OrganiserGrants'],
    }),

    deleteOrganiserGrant: build.mutation<
      { success: boolean; message: string },
      string
    >({
      query: (id) => ({
        url: `/api/v1/organiser/grants/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['OrganiserGrants'],
    }),

    updateOrganiserGrant: build.mutation<
      { success: boolean; message: string },
      OrganiserGrantCreateRequest & { id: string }
    >({
      query: ({ id, ...body }) => ({
        url: `/api/v1/organiser/grants/${id}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        'OrganiserGrants',
        { type: 'OrganiserGrants', id },
      ],
    }),

    autoAllocateGrantWinners: build.mutation<
      AutoAllocateGrantWinnersResponse,
      string
    >({
      query: (id) => ({
        url: `/api/v1/organiser/grants/${id}/winners/auto-allocate`,
        method: 'POST',
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: 'OrganiserGrants', id },
      ],
    }),

    getGrantWinners: build.query<GetGrantWinnersForReleaseResponse, string>({
      query: (id) => ({
        url: `/api/v1/organiser/grants/${id}/winners`,
        method: 'GET',
      }),
    }),

    releaseGrantWinners: build.mutation<
      ReleaseGrantWinnersOnChainResponse,
      string
    >({
      query: (id) => ({
        url: `/api/v1/organiser/grants/${id}/winners/release`,
        method: 'POST',
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: 'OrganiserGrants', id },
      ],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetOrganiserGrantsQuery,
  useGetOrganiserGrantSummaryQuery,
  useGetOrganiserGrantByIdQuery,
  useCreateOrganiserGrantMutation,
  useDeleteOrganiserGrantMutation,
  useUpdateOrganiserGrantMutation,
  useAutoAllocateGrantWinnersMutation,
  useGetGrantWinnersQuery,
  useReleaseGrantWinnersMutation,
} = organiserGrantApi;
