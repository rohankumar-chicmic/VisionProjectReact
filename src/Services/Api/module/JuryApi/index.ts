import api from '../../api';

export interface JuryMember {
  id: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  companyName: string;
  domainOfExpertise: string;
  createdAt: string;
}

export interface UpdateJuryProfilePayload {
  fullName: string;
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
  grantId: string;
  grantName: string;
  galaName: string;
  applicantsCount: number;
  applicationDeadline: string;
  grantStatus: string;
}

export interface EvaluationQueueItem {
  applicationId: string;
  applicationCode: string;
  applicantName: string;
  grantName: string;
  dueAt: string;
  dueLabel: string;
  juryReviewStatus: string;
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

export interface CriteriaScore {
  criteriaKey: string;
  criteriaName: string;
  criteriaCategory: string;
  score: number;
}

export interface EvaluationPayload {
  applicationId: string;
  scores: CriteriaScore[];
  overallScore: number;
  qualitativeFeedback: string;
  privateNotes: string;
}

export interface JuryReviewCriteria {
  criteriaKey: string;
  criteriaName: string;
  criteriaCategory: string;
  existingScore: number | null;
}

export interface AssignedApplication {
  id: string;
  applicationId: string;
  grantId: string;
  grantName: string;
  galaName: string;
  applicantId: string;
  applicantName: string;
  applicantEmail: string;
  submittedAt: string;
  interviewDate: string | null;
  status: number;
  totalJuryScore: number | null;
  hasCurrentJuryEvaluated: boolean;
  juryReviewStatus: number;
  juryReviewStatusDescription: string;
}

export interface AssignedApplicationsResponse {
  success: boolean;
  message: string;
  data: AssignedApplication[];
}

export interface ApplicationReviewData {
  applicationId: string;
  applicationCode: string;
  grantId: string;
  grantName: string;
  galaName: string;
  applicantId: string;
  applicantName: string;
  applicantEmail: string;
  companyName: string | null;
  industry: string | null;
  motivationStatement: string | null;
  videoUrl: string | null;
  prizeAmount: number | null;
  applicationDeadline: string | null;
  submittedAt: string | null;
  memberSince: string | null;
  subscriptionPlan: string | null;
  totalApplications: number;
  totalApproved: number;
  applicationStatus: number;
  interviewDate: string | null;
  interviewCompleted: boolean;
  juryReviewStatus: number;
  myOverallScore: number | null;
  qualitativeFeedback: string | null;
  privateNotes: string | null;
  criteria: JuryReviewCriteria[];
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
    getAssignedApplications: build.query<
      AssignedApplicationsResponse,
      {
        searchTerm?: string;
        status?: number;
        pageNumber?: number;
        pageSize?: number;
      }
    >({
      query: (params) => ({
        url: '/api/v1/jury/applications',
        method: 'GET',
        params,
      }),
      providesTags: ['JuryDashboard'],
    }),
    getApplicationReview: build.query<
      { success: boolean; data: ApplicationReviewData },
      string
    >({
      query: (id) => ({
        url: `/api/v1/jury/applications/${id}`,
        method: 'GET',
      }),
      providesTags: ['ApplicationReview'],
    }),
    markInterviewComplete: build.mutation<
      unknown,
      { id: string; markCompleted: boolean }
    >({
      query: ({ id, markCompleted }) => ({
        url: `/api/v1/jury/applications/${id}/interview-completion`,
        method: 'POST',
        body: { markCompleted },
      }),
      invalidatesTags: ['ApplicationReview'],
    }),
    approveApplication: build.mutation<unknown, string>({
      query: (id) => ({
        url: `/api/v1/jury/applications/${id}/approve`,
        method: 'POST',
      }),
      invalidatesTags: ['JuryDashboard', 'ApplicationReview'],
    }),
    rejectApplication: build.mutation<
      unknown,
      { id: string; reason: string; feedback: string; allowReapply: boolean }
    >({
      query: ({ id, ...body }) => ({
        url: `/api/v1/jury/applications/${id}/reject`,
        method: 'POST',
        body,
      }),
      invalidatesTags: ['JuryDashboard', 'ApplicationReview'],
    }),
    startApplicationReview: build.mutation<unknown, string>({
      query: (id) => ({
        url: `/api/v1/jury/applications/${id}/start-review`,
        method: 'POST',
      }),
      invalidatesTags: ['JuryDashboard'],
    }),
    submitEvaluation: build.mutation<unknown, EvaluationPayload>({
      query: (body) => ({
        url: `/api/v1/jury/applications/${body.applicationId}/evaluation`,
        method: 'POST',
        body,
      }),
      invalidatesTags: ['JuryDashboard', 'ApplicationReview'],
    }),
    getJuryProfile: build.query<JuryMember, void>({
      query: () => ({
        url: '/api/v1/jury/profile',
        method: 'GET',
      }),
      providesTags: ['Jury'],
    }),
    updateJuryProfile: build.mutation<JuryMember, UpdateJuryProfilePayload>({
      query: (body) => ({
        url: '/api/v1/jury/profile',
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['Jury'],
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
  useGetAssignedApplicationsQuery,
  useGetApplicationReviewQuery,
  useMarkInterviewCompleteMutation,
  useApproveApplicationMutation,
  useRejectApplicationMutation,
  useStartApplicationReviewMutation,
  useSubmitEvaluationMutation,
  useGetJuryProfileQuery,
  useUpdateJuryProfileMutation,
} = JuryApi;
