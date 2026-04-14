import api from '../../../api';

export interface OrganiserApplication {
  id: string;
  applicationId: string;
  applicantName: string;
  applicantEmail: string;
  applicantAvatarUrl: string | null;
  galaName: string;
  grantName: string;
  appliedDate: string;
  juryScore: number;
  status: string | number;
}

export interface OrganiserApplicationData {
  items: OrganiserApplication[];
  pageNumber: number;
  totalPages: number;
  totalCount: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

export interface OrganiserApplicationListResponse {
  success: boolean;
  message: string;
  data: OrganiserApplicationData;
  errors: unknown;
  notificationCount: number;
}

export interface OrganiserApplicationParams {
  searchTerm?: string;
  galaId?: string;
  grantId?: string;
  status?: number;
  sortBy?: string;
  sortOrder?: string;
  pageNumber?: number;
  pageSize?: number;
}

export interface JuryCriteriaScore {
  criteriaKey: string;
  criteriaName: string;
  category: string;
  score: number;
}

export interface JuryPanelMember {
  juryMemberId: string;
  juryMemberName: string;
  averageScore: number | null;
  comment: string | null;
  personalNote: string | null;
  evaluatedAt: string | null;
  isCurrentUser: boolean;
  criteriaScores: JuryCriteriaScore[];
}

export interface JuryCriteriaAverage {
  criteriaKey: string;
  criteriaName: string;
  category: string;
  averageScore: number;
}

export interface JuryPanelSummary {
  overallAverageScore: number | null;
  criteriaAverages: JuryCriteriaAverage[];
  suggestedClass: string | null;
}

export interface OrganiserApplicationDetail {
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

export interface OrganiserApplicationDetailResponse {
  success: boolean;
  message: string;
  data: OrganiserApplicationDetail;
  errors: unknown;
  notificationCount: number;
}

export const organiserApplicationApi = api.injectEndpoints({
  endpoints: (build) => ({
    getOrganiserApplications: build.query<
      OrganiserApplicationListResponse,
      OrganiserApplicationParams
    >({
      query: (params) => ({
        url: '/api/v1/organiser/applications',
        method: 'GET',
        params,
      }),
      providesTags: ['OrganiserApplications'],
    }),
    getOrganiserApplicationById: build.query<
      OrganiserApplicationDetailResponse,
      string
    >({
      query: (id) => ({
        url: `/api/v1/organiser/applications/${id}`,
        method: 'GET',
      }),
      providesTags: (_result, _error, id) => [
        { type: 'OrganiserApplications', id },
      ],
    }),
    downloadOrganiserApplicationAvatar: build.query<Blob, string>({
      query: (id) => ({
        url: `/api/v1/organiser/applications/${id}/applicant-avatar`,
        method: 'GET',
        responseHandler: (response) => response.blob(),
      }),
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetOrganiserApplicationsQuery,
  useGetOrganiserApplicationByIdQuery,
  useLazyDownloadOrganiserApplicationAvatarQuery,
} = organiserApplicationApi;
