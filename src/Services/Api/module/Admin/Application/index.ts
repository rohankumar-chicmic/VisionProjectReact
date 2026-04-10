import api from '../../../api';

export interface AdminApplication {
  id: string;
  applicantName: string;
  applicantEmail: string;
  applicantAvatarUrl: string | null;
  galaName: string;
  grantName: string;
  appliedDate: string;
  juryScore: number;
  status: number;
}

export interface AdminApplicationData {
  items: AdminApplication[];
  pageNumber: number;
  totalPages: number;
  totalCount: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

export interface AdminApplicationListResponse {
  success: boolean;
  message: string;
  data: AdminApplicationData;
  errors: unknown;
  notificationCount: number;
}

export interface AdminApplicationParams {
  searchTerm?: string;
  galaId?: string;
  grantId?: string;
  status?: number;
  sortBy?: string;
  sortOrder?: string;
  pageNumber?: number;
  pageSize?: number;
}

export const adminApplicationApi = api.injectEndpoints({
  endpoints: (build) => ({
    getAdminApplications: build.query<
      AdminApplicationListResponse,
      AdminApplicationParams
    >({
      query: (params) => ({
        url: '/api/v1/admin/applications',
        method: 'GET',
        params,
      }),
      providesTags: ['Admins'],
    }),
  }),
  overrideExisting: false,
});

export const { useGetAdminApplicationsQuery } = adminApplicationApi;
