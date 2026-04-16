import api from '../../../api';

export interface OrganiserProfile {
  id: string;
  fullName: string;
  email: string;
  phoneNumber?: string | null;
  governmentId: string;
  companyName: string;
  industryDomain: string;
  isVerifiedByAdmin: boolean;
  verificationStatus: 'Pending' | 'Verified' | 'Rejected';
  adminRejectionReason?: string | null;
  createdAt: string;
  updatedAt?: string | null;
}

export interface OrganiserProfileResponse {
  success: boolean;
  message: string;
  data: OrganiserProfile;
  errors: unknown;
  notificationCount: number;
}

export interface UpdateProfilePayload {
  fullName: string;
  phoneNumber?: string | null;
  companyName: string;
  industryDomain: string;
}

export interface ResubmitVerificationPayload {
  governmentId: string;
  additionalComments?: string;
}

export const organiserProfileApi = api.injectEndpoints({
  endpoints: (build) => ({
    getOrganiserProfile: build.query<OrganiserProfileResponse, void>({
      query: () => ({
        url: '/api/v1/organiser/profile',
        method: 'GET',
      }),
      providesTags: ['OrganiserProfile'],
    }),
    updateOrganiserProfile: build.mutation<
      OrganiserProfileResponse,
      UpdateProfilePayload
    >({
      query: (body) => ({
        url: '/api/v1/organiser/profile',
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['OrganiserProfile'],
    }),
    deleteOrganiserAccount: build.mutation<unknown, void>({
      query: () => ({
        url: '/api/v1/organiser/profile',
        method: 'DELETE',
      }),
    }),
    resubmitVerification: build.mutation<
      OrganiserProfileResponse,
      ResubmitVerificationPayload
    >({
      query: (body) => ({
        url: '/api/v1/organiser/profile/resubmit-verification',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['OrganiserProfile'],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetOrganiserProfileQuery,
  useUpdateOrganiserProfileMutation,
  useDeleteOrganiserAccountMutation,
  useResubmitVerificationMutation,
} = organiserProfileApi;
