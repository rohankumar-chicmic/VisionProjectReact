/* eslint-disable import/no-cycle */
import api from '../../api';
import {
  LoginFormValues,
  ResetPasswordFormValues,
} from '../../../../Views/Auth/Helpers/AuthValidations';

export interface OrganiserRegisterPayload {
  fullName: string;
  email: string;
  password: string;
  phoneNumber: string;
  governmentId: string;
  companyName: string;
  industryDomain: string;
}

export interface AuthData {
  accessToken: string;
  refreshToken: string;
  username: string;
  email: string;
  isEmailVerified: boolean;
  isProfileCompleted: boolean;
  role?: string | number | null;
  roleLabel?: string | null;
  userRole?: string | number | null;
  type?: string | number | null;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data: AuthData;
  errors: string | null;
  notificationCount: number;
}

export const authApi = api.injectEndpoints({
  endpoints: (build) => ({
    loginAdmin: build.mutation<AuthResponse, LoginFormValues>({
      query: (body) => ({
        url: '/api/v1/admin/auth/login',
        method: 'POST',
        body,
      }),
    }),
    loginOrganiser: build.mutation<AuthResponse, LoginFormValues>({
      query: (body) => ({
        url: '/api/v1/organiser/auth/login',
        method: 'POST',
        body,
      }),
    }),
    registerOrganiser: build.mutation<AuthResponse, OrganiserRegisterPayload>({
      query: (body) => ({
        url: '/api/v1/organiser/auth/register',
        method: 'POST',
        body,
      }),
    }),
    loginJury: build.mutation<AuthResponse, LoginFormValues>({
      query: (body) => ({
        url: '/api/v1/jury/auth/login',
        method: 'POST',
        body,
      }),
    }),
    refreshTokenAdmin: build.mutation<AuthResponse, { refreshToken: string }>({
      query: (body) => ({
        url: '/api/v1/admin/auth/refresh',
        method: 'POST',
        body,
      }),
    }),
    logoutAdmin: build.mutation<unknown, { email: string }>({
      query: (body) => ({
        url: '/api/v1/admin/auth/logout',
        method: 'POST',
        body,
      }),
    }),
    forgotPasswordAdmin: build.mutation<unknown, { email: string }>({
      query: (body) => ({
        url: '/api/v1/admin/auth/forgot-password',
        method: 'POST',
        body,
      }),
    }),
    resetPasswordAdmin: build.mutation<
      unknown,
      ResetPasswordFormValues & { token: string }
    >({
      query: (body) => ({
        url: '/api/v1/admin/auth/reset-password',
        method: 'POST',
        body,
      }),
    }),

    refreshTokenOrganiser: build.mutation<
      AuthResponse,
      { refreshToken: string }
    >({
      query: (body) => ({
        url: '/api/v1/organiser/auth/refresh',
        method: 'POST',
        body,
      }),
    }),
    logoutOrganiser: build.mutation<unknown, { email: string }>({
      query: (body) => ({
        url: '/api/v1/organiser/auth/logout',
        method: 'POST',
        body,
      }),
    }),
    forgotPasswordOrganiser: build.mutation<unknown, { email: string }>({
      query: (body) => ({
        url: '/api/v1/organiser/auth/forgot-password',
        method: 'POST',
        body,
      }),
    }),
    resetPasswordOrganiser: build.mutation<
      unknown,
      ResetPasswordFormValues & { token: string }
    >({
      query: (body) => ({
        url: '/api/v1/organiser/auth/reset-password',
        method: 'POST',
        body,
      }),
    }),

    refreshTokenJury: build.mutation<AuthResponse, { refreshToken: string }>({
      query: (body) => ({
        url: '/api/v1/jury/auth/refresh',
        method: 'POST',
        body,
      }),
    }),
    logoutJury: build.mutation<unknown, { email: string }>({
      query: (body) => ({
        url: '/api/v1/jury/auth/logout',
        method: 'POST',
        body,
      }),
    }),
    forgotPasswordJury: build.mutation<unknown, { email: string }>({
      query: (body) => ({
        url: '/api/v1/jury/auth/forgot-password',
        method: 'POST',
        body,
      }),
    }),
    resetPasswordJury: build.mutation<
      unknown,
      ResetPasswordFormValues & { token: string }
    >({
      query: (body) => ({
        url: '/api/v1/jury/auth/reset-password',
        method: 'POST',
        body,
      }),
    }),
  }),
  overrideExisting: false,
});

export const {
  useLoginAdminMutation,
  useLoginOrganiserMutation,
  useLoginJuryMutation,
  useLogoutAdminMutation,
  useLogoutOrganiserMutation,
  useLogoutJuryMutation,
  useRefreshTokenAdminMutation,
  useRefreshTokenOrganiserMutation,
  useRefreshTokenJuryMutation,
  useForgotPasswordAdminMutation,
  useForgotPasswordOrganiserMutation,
  useForgotPasswordJuryMutation,
  useResetPasswordAdminMutation,
  useResetPasswordOrganiserMutation,
  useResetPasswordJuryMutation,
  useRegisterOrganiserMutation,
} = authApi;
