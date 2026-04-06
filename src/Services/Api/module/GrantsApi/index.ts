import api from '../../api';

export interface GrantQuestion {
  questionText: string;
  questionType: 'Long Text' | 'File Upload' | 'Short Text';
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
}

export interface GrantResponse {
  success: boolean;
  message: string;
  data: GrantItem[];
  errors: unknown;
  notificationCount: number;
}

export interface SingleGrantResponse {
  success: boolean;
  message: string;
  data: CreateUpdateGrantRequest & { id: string };
}

export interface GrantParams {
  page?: number;
  pageSize?: number;
  status?: number;
  galaEventId?: string;
  search?: string;
}

export const grantsApi = api.injectEndpoints({
  endpoints: (build) => ({
    getGrants: build.query<GrantResponse, GrantParams>({
      query: (params) => ({
        url: '/api/v1/admin/grants',
        method: 'GET',
        params,
      }),
      providesTags: ['Grants'],
    }),
    getGrantById: build.query<SingleGrantResponse, string>({
      query: (id) => ({
        url: `/api/v1/admin/grants/${id}`,
        method: 'GET',
      }),
      providesTags: (_result, _error, id) => [{ type: 'Grants', id }],
    }),
    getGrantsSummary: build.query<
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
    createGrant: build.mutation<
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
    updateGrant: build.mutation<
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
    deleteGrant: build.mutation<{ success: boolean; message: string }, string>({
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
  useGetGrantsQuery,
  useGetGrantByIdQuery,
  useGetGrantsSummaryQuery,
  useCreateGrantMutation,
  useUpdateGrantMutation,
  useDeleteGrantMutation,
} = grantsApi;
