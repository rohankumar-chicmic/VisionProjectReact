import api from '../../../api';

export interface AdminProfile {
  adminId: string;
  fullName: string;
  email: string;
  phoneNumber: string | null;
  avatarUrl: string | null;
}

export interface AdminProfileResponse {
  success: boolean;
  message: string;
  data: AdminProfile;
  errors: unknown;
  notificationCount: number;
}

export interface AdminSettings {
  adminId: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  isTwoFactorEnabled: boolean;
  notifyNewApplicationSubmitted: boolean;
  notifyNewUserRegistration: boolean;
  notifyPaymentReceived: boolean;
  notifyGalaDeadlineApproaching: boolean;
  platformName: string;
  supportEmail: string;
  timezone: string;
  currency: string;
  avatarUrl: string;
}

export interface AdminSettingsResponse {
  success: boolean;
  message: string;
  data: AdminSettings;
  errors: unknown;
  notificationCount: number;
}

export interface UpdateAdminProfileRequest {
  adminId: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  avatarUrl: string;
}

export const adminAuthApi = api.injectEndpoints({
  endpoints: (build) => ({
    getAdminProfile: build.query<AdminProfileResponse, void>({
      query: () => ({
        url: '/api/v1/admin/auth/profile',
        method: 'GET',
      }),
      providesTags: ['AdminProfile'],
    }),
    updateAdminProfile: build.mutation<
      { success: boolean; message: string },
      UpdateAdminProfileRequest
    >({
      query: (body) => ({
        url: '/api/v1/admin/auth/profile',
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['AdminProfile', 'AdminSettings'],
    }),
    getAdminSettings: build.query<AdminSettingsResponse, void>({
      query: () => ({
        url: '/api/v1/admin/auth/settings',
        method: 'GET',
      }),
      providesTags: ['AdminSettings'],
    }),
    updateAdminSettings: build.mutation<
      { success: boolean; message: string },
      AdminSettings
    >({
      query: (body) => ({
        url: '/api/v1/admin/auth/settings',
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['AdminProfile', 'AdminSettings'],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetAdminProfileQuery,
  useUpdateAdminProfileMutation,
  useGetAdminSettingsQuery,
  useUpdateAdminSettingsMutation,
} = adminAuthApi;
