import api from '../../../api';

export interface CriterionScore {
  criteriaKey: string;
  criteriaName: string;
  criteriaCategory: string;
  score: number;
}

export interface EvaluationRequest {
  applicationId: string;
  scores: CriterionScore[];
  overallScore: number;
  comment: string;
  personalNote: string;
}

export interface InterviewCompletionRequest {
  markCompleted: boolean;
}

// Interfaces for response data (placeholders based on common patterns)
export interface JuryPanelMember {
  jurorName: string;
  score: number | null;
  initials: string;
  comment: string | null;
  criteria: { label: string; score: number }[];
}

export interface JuryPanelSummary {
  overallAverageScore: number | null;
  criteriaAverages: { label: string; average: number }[];
  suggestedClass: string | null;
}

export interface JuryApplicationDetail {
  id: string;
  applicationId: string;
  userId: string;
  applicantDisplayId: string;
  applicantName: string;
  applicantEmail: string;
  applicantAvatarUrl: string | null;
  companyName: string;
  grantId: string;
  grantName: string;
  galaName: string;
  grantPrizeAmount: number;
  grantNumberOfPrizes: number;
  grantApplicationDeadline: string;
  grantDurationLeftSeconds: number;
  grantRequireInterview: boolean;
  appliedDate: string;
  interviewDate: string | null;
  interviewStartTime: string | null;
  interviewEndTime: string | null;
  interviewScheduledBy: string | null;
  isInterviewCompleted: boolean;
  interviewCompletedAt: string | null;
  industry: string;
  motivationStatement: string;
  businessPlanDocumentUrl: string | null;
  videoUrl: string | null;
  juryScore: number | null;
  status: string; // e.g., "Pending", "Approved"
  rejectionReason: string | null;
  rejectionFeedback: string | null;
  canReapply: boolean;
  applicantGrantApplicationCount: number;
  applicantApprovedGrantApplicationCount: number;
  applicantMemberSince: string;
  applicantSubscriptionPlan: number;
  applicantSubscriptionStatus: number;
  adminNotes: string | null;
  canCurrentUserSubmitJuryScores: boolean;
  hasCurrentUserSubmittedJuryScores: boolean;
  juryPanel: JuryPanelMember[];
  juryPanelSummary: JuryPanelSummary;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  errors: unknown;
}

export const juryApplicationApi = api.injectEndpoints({
  endpoints: (build) => ({
    getJuryApplicationById: build.query<
      ApiResponse<JuryApplicationDetail>,
      string
    >({
      query: (id) => ({
        url: `/api/v1/jury/applications/${id}`,
        method: 'GET',
      }),
      providesTags: (_result, _error, id) => [{ type: 'JuryApplications', id }],
    }),

    markInterviewCompleted: build.mutation<
      ApiResponse<void>,
      { id: string; body: InterviewCompletionRequest }
    >({
      query: ({ id, body }) => ({
        url: `/api/v1/jury/applications/${id}/interview-completion`,
        method: 'POST',
        body,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'JuryApplications', id },
      ],
    }),

    startReview: build.mutation<ApiResponse<void>, string>({
      query: (id) => ({
        url: `/api/v1/jury/applications/${id}/start-review`,
        method: 'POST',
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: 'JuryApplications', id },
      ],
    }),

    submitEvaluation: build.mutation<
      ApiResponse<void>,
      { id: string; body: EvaluationRequest }
    >({
      query: ({ id, body }) => ({
        url: `/api/v1/jury/applications/${id}/evaluation`,
        method: 'POST',
        body,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'JuryApplications', id },
      ],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetJuryApplicationByIdQuery,
  useMarkInterviewCompletedMutation,
  useStartReviewMutation,
  useSubmitEvaluationMutation,
} = juryApplicationApi;
