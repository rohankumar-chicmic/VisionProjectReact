import api from '../../api';
import {
  LoginFormValues,
  ResetPasswordFormValues,
} from '../../../../Views/Auth/Helpers/AuthValidations';

export interface AuthData {
  accessToken: string;
  refreshToken: string;
  username: string;
  email: string;
  isEmailVerified: boolean;
  isProfileCompleted: boolean;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data: AuthData;
  errors: string | null;
  notificationCount: number;
}

export const userApi = api.injectEndpoints({
  endpoints: (build) => ({
    loginAdmin: build.mutation<AuthResponse, LoginFormValues>({
      query: (body) => ({
        url: '/api/v1/admin/auth/login',
        method: 'POST',
        body,
      }),
    }),
    refreshToken: build.mutation<AuthResponse, { refreshToken: string }>({
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
    forgotPassword: build.mutation<unknown, { email: string }>({
      query: (body) => ({
        url: '/api/v1/admin/auth/forgot-password',
        method: 'POST',
        body,
      }),
    }),
    resetPassword: build.mutation<
      unknown,
      ResetPasswordFormValues & { token: string }
    >({
      query: (body) => ({
        url: '/api/v1/admin/auth/reset-password',
        method: 'POST',
        body,
      }),
    }),
  }),
  overrideExisting: false,
});

export const {
  useLoginAdminMutation,
  useLogoutAdminMutation,
  useRefreshTokenMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
} = userApi;
