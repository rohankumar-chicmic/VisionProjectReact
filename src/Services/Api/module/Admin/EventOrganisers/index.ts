import api from '../../../api';

export interface EventOrganiser {
  id: string;
  fullName: string;
  email: string;
  companyName: string;
  governmentIdUrl: string;
  isVerifiedByAdmin: boolean;
  isRejected: boolean;
  verificationStatus: 'Pending' | 'Verified' | 'Rejected';
  adminRejectionReason?: string;
  createdAt: string;
  isBlocked: boolean;
  publishedGalas: { id: string; name: string }[];
}

export interface AdminEventOrganisersResponse {
  success: boolean;
  message: string;
  data: EventOrganiser[];
  errors: unknown;
  notificationCount: number;
}

export interface AdminEventOrganisersParams {
  verifiedOnly?: boolean;
}

export const adminEventOrganisersApi = api.injectEndpoints({
  endpoints: (build) => ({
    getAdminEventOrganisers: build.query<
      AdminEventOrganisersResponse,
      AdminEventOrganisersParams | undefined
    >({
      query: (params) => ({
        url: '/api/v1/admin/event-organisers',
        method: 'GET',
        params: params || {},
      }),
      providesTags: ['Admins'],
    }),
    verifyEventOrganiser: build.mutation<unknown, string>({
      query: (id) => ({
        url: `/api/v1/admin/event-organisers/${id}/verify`,
        method: 'POST',
      }),
      invalidatesTags: ['Admins'],
    }),
    rejectEventOrganiser: build.mutation<
      unknown,
      { id: string; reason: string }
    >({
      query: ({ id, reason }) => ({
        url: `/api/v1/admin/event-organisers/${id}/reject`,
        method: 'POST',
        body: { id, reason },
      }),
      invalidatesTags: ['Admins'],
    }),
    blockEventOrganiser: build.mutation<
      unknown,
      { id: string; isBlocked: boolean }
    >({
      query: ({ id, isBlocked }) => ({
        url: `/api/v1/admin/event-organisers/${id}/block`,
        method: 'POST',
        body: { isBlocked },
      }),
      invalidatesTags: ['Admins'],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetAdminEventOrganisersQuery,
  useVerifyEventOrganiserMutation,
  useRejectEventOrganiserMutation,
  useBlockEventOrganiserMutation,
} = adminEventOrganisersApi;
