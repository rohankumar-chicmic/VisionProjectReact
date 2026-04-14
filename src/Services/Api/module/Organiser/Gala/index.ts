import api from '../../../api';

export interface GalaEveningItem {
  time: string;
  title: string;
  description: string;
}

export interface GalaQuestion {
  questionText: string;
  questionType: string;
  order: number;
}

export interface GalaAdditionalRequirement {
  text: string;
  order: number;
}

export interface GalaJuryCriteria {
  criteriaKey: string;
  name: string;
  description: string;
  category: string;
  isCustom: boolean;
  isActive: boolean;
  type: number;
}

export interface GalaApplication {
  id: string;
  userId: string;
  applicationId: string;
  status: number;
  totalJuryScore: number | null;
  submittedAt: string;
  companyName: string;
  industry: string;
  motivationStatement: string;
  businessPlanDocumentUrl: string | null;
  videoUrl: string | null;
}

export interface GalaGrantDetail {
  id: string;
  galaEventId: string;
  name: string;
  description: string;
  category: string;
  prizeAmount: number;
  numberOfPrizes: number;
  applicationDeadline: string;
  durationLeftSeconds: number;
  status: number;
  requireInterview: boolean;
  requireCompanyName: boolean;
  requireIndustrySelection: boolean;
  requireMotivationStatement: boolean;
  requireBusinessPlanDocument: boolean;
  questions: GalaQuestion[];
  additionalRequirements: GalaAdditionalRequirement[];
  juryCriteria: GalaJuryCriteria[];
  appliedCount: number;
  isWinnerDecided: boolean;
  decidedWinnersCount: number;
  totalWinnerSlots: number;
  winnerDecisionMessage: string;
  applications: GalaApplication[];
}

export interface GalaItem {
  id: string;
  name: string;
  about: string;
  coverImageUrl: string;
  status: number;
  eventDate: string;
  eventTime: string;
  venue: string;
  city: string;
  expectedAttendees: number;
  totalGalaValue: number | null;
  estimatedTicketPrice: number | null;
  entryFee: number | null;
  ticketPrice: number | null;
  publishedAt: string | null;
  blockchainTransactionHash: string | null;
  organiserWalletAddress: string | null;
  canEditTicketPricingInputs: boolean;
  appliedCount: number;
  allWinnersDecided: boolean;
  winnerDecisionMessage: string;
  eveningItems: GalaEveningItem[];
  grants: GalaGrantDetail[];
}

export interface GalaListData {
  items: GalaItem[];
  pageNumber: number;
  totalPages: number;
  totalCount: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

export interface GalaListResponse {
  success: boolean;
  message: string;
  data: GalaListData;
  errors: unknown;
  notificationCount: number;
}

export interface GalaSingleResponse {
  success: boolean;
  message: string;
  data: GalaItem;
  errors: unknown;
  notificationCount: number;
}

export interface OrganiserGalaSummaryData {
  totalGalas: number;
  draftGalas: number;
  upcomingGalas: number;
  activeGalas: number;
  completedGalas: number;
  totalGrants: number;
  totalApplications: number;
  totalGalaValue: number;
}

export interface OrganiserGalaSummaryResponse {
  success: boolean;
  message: string;
  data: OrganiserGalaSummaryData;
  errors: unknown;
  notificationCount: number;
}

export interface CreateGalaRequest {
  name: string;
  about: string;
  coverImageUrl: string;
  status: number;
  eventDate: string;
  eventTime: string;
  venue: string;
  city: string;
  expectedAttendees: number;
  eveningItems: GalaEveningItem[];
}

export interface UpdateGalaRequest extends CreateGalaRequest {
  id: string;
  saveAsDraft?: boolean;
}

export interface PublishGalaRequest {
  blockchainTransactionHash: string;
  organiserWalletAddress: string;
}

export interface GalaQueryParams {
  searchTerm?: string;
  status?: number;
  sortBy?: string;
  sortOrder?: string;
  pageNumber?: number;
  pageSize?: number;
}

export interface PrizeWinner {
  rank: number;
  amount: number;
}

export interface GrantQuestion {
  questionText: string;
  questionType: string;
  order: number;
}

export interface GrantAdditionalRequirement {
  text: string;
  order: number;
}

export interface CreateGrantRequest {
  name: string;
  description: string;
  category: string;
  prizeAmount: number;
  numberOfPrizes: number;
  juryPanelSize: number;
  applicationDeadline: string;
  status: number;
  questions: GrantQuestion[];
  requireInterview: boolean;
  requireCompanyName: boolean;
  requireIndustrySelection: boolean;
  requireMotivationStatement: boolean;
  requireBusinessPlanDocument: boolean;
  juryCriteria: number[]; // Array of integer enum values
  additionalRequirements: GrantAdditionalRequirement[];
  prizeWinners: PrizeWinner[];
  juryIds: string[];
}

export interface CreateGalaWithGrantsRequest extends CreateGalaRequest {
  grant: CreateGrantRequest[];
  saveAsDraft?: boolean;
}

const normalizeGalaListResponse = (
  response: GalaListResponse
): GalaListResponse => ({
  ...response,
  data: {
    items: response.data?.items ?? [],
    pageNumber: response.data?.pageNumber ?? 1,
    totalPages: response.data?.totalPages ?? 0,
    totalCount: response.data?.totalCount ?? 0,
    hasPreviousPage: response.data?.hasPreviousPage ?? false,
    hasNextPage: response.data?.hasNextPage ?? false,
  },
});

export const organiserGalaApi = api.injectEndpoints({
  endpoints: (build) => ({
    // Get paginated list of gala events with filters
    getOrganiserGalas: build.query<GalaListResponse, GalaQueryParams>({
      query: (params) => ({
        url: '/api/v1/organiser/gala',
        method: 'GET',
        params,
      }),
      transformResponse: (response: GalaListResponse) =>
        normalizeGalaListResponse(response),
      providesTags: ['OrganiserGalas'],
    }),

    // Get single gala by ID
    getOrganiserGalaById: build.query<GalaSingleResponse, string>({
      query: (id) => ({
        url: `/api/v1/organiser/gala/${id}`,
        method: 'GET',
      }),
      providesTags: (_result, _error, id) => [{ type: 'OrganiserGalas', id }],
    }),

    // Get dashboard summary metrics
    getOrganiserGalaSummary: build.query<OrganiserGalaSummaryResponse, void>({
      query: () => ({
        url: '/api/v1/organiser/gala/summary',
        method: 'GET',
      }),
      providesTags: ['OrganiserGalas'],
    }),

    // Create new gala event
    createOrganiserGala: build.mutation<GalaSingleResponse, CreateGalaRequest>({
      query: (body) => ({
        url: '/api/v1/organiser/gala',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['OrganiserGalas'],
    }),

    // Create gala event with grants
    createOrganiserGalaWithGrants: build.mutation<
      GalaSingleResponse,
      CreateGalaWithGrantsRequest
    >({
      query: (body) => ({
        url: '/api/v1/organiser/gala/with-grants',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['OrganiserGalas'],
    }),

    // Update existing gala event
    updateOrganiserGala: build.mutation<GalaSingleResponse, UpdateGalaRequest>({
      query: (body) => ({
        url: '/api/v1/organiser/gala',
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['OrganiserGalas'],
    }),

    // Publish gala event
    publishOrganiserGala: build.mutation<
      GalaSingleResponse,
      { id: string; body: PublishGalaRequest }
    >({
      query: ({ id, body }) => ({
        url: `/api/v1/organiser/gala/${id}/publish`,
        method: 'POST',
        body,
      }),
      invalidatesTags: ['OrganiserGalas'],
    }),

    // Unpublish gala event
    unpublishOrganiserGala: build.mutation<GalaSingleResponse, string>({
      query: (id) => ({
        url: `/api/v1/organiser/gala/${id}/unpublish`,
        method: 'POST',
      }),
      invalidatesTags: ['OrganiserGalas'],
    }),

    // Delete gala event
    deleteOrganiserGala: build.mutation<GalaSingleResponse, string>({
      query: (id) => ({
        url: `/api/v1/organiser/gala/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['OrganiserGalas'],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetOrganiserGalasQuery,
  useGetOrganiserGalaByIdQuery,
  useGetOrganiserGalaSummaryQuery,
  useCreateOrganiserGalaMutation,
  useCreateOrganiserGalaWithGrantsMutation,
  useUpdateOrganiserGalaMutation,
  usePublishOrganiserGalaMutation,
  useUnpublishOrganiserGalaMutation,
  useDeleteOrganiserGalaMutation,
} = organiserGalaApi;
