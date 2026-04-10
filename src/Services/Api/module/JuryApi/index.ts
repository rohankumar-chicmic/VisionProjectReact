import api from '../../api';

export interface JuryMember {
  id: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  companyName: string;
  domainOfExpertise: string;
}

export interface JurySummaryData {
  assignedApplicationsCount: number;
  pendingReviewsCount: number;
  completedReviewsCount: number;
  linkedGrantsCount: number;
  scheduledInterviewsCount: number;
  pendingEvaluationsCount: number;
}

export interface AssignedGrant {
  name: string;
  gala: string;
  applicants: number;
  status: string;
}

export interface EvaluationQueueItem {
  id: string;
  applicant: string;
  grant: string;
  deadline: string;
  priority: 'high' | 'medium' | 'low';
}

export interface JuryDashboardResponse {
  success: boolean;
  message: string;
  data: JurySummaryData & {
    assignedPrograms: AssignedGrant[];
    evaluationQueue: EvaluationQueueItem[];
  };
}

export interface JuryResponse {
  success: boolean;
  message: string;
  data: JuryMember[];
}

export interface SingleJuryResponse {
  success: boolean;
  message: string;
  data: JuryMember;
}

export interface CreateJuryPayload {
  fullName: string;
  email: string;
  phoneNumber: string;
  companyName: string;
  domainOfExpertise: string;
  password?: string;
}

export const JuryApi = api.injectEndpoints({
  endpoints: (build) => ({
    getJuries: build.query<JuryResponse, void>({
      query: () => ({
        url: '/api/v1/organiser/juries',
        method: 'GET',
      }),
      providesTags: ['Jury'],
    }),
    createJury: build.mutation<SingleJuryResponse, CreateJuryPayload>({
      query: (body) => ({
        url: '/api/v1/organiser/juries',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Jury'],
    }),
    updateJury: build.mutation<
      SingleJuryResponse,
      { id: string; body: CreateJuryPayload }
    >({
      query: ({ id, body }) => ({
        url: `/api/v1/organiser/juries/${id}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['Jury'],
    }),
    deleteJury: build.mutation<unknown, string>({
      query: (id) => ({
        url: `/api/v1/organiser/juries/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Jury'],
    }),
    juryDashboard: build.query<JuryDashboardResponse, void>({
      query: () => ({
        url: '/api/v1/jury/dashboard/summary',
        method: 'GET',
      }),
      providesTags: ['JuryDashboard'],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetJuriesQuery,
  useCreateJuryMutation,
  useUpdateJuryMutation,
  useDeleteJuryMutation,
  useJuryDashboardQuery,
} = JuryApi;
