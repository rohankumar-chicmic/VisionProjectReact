import api from '../../api';

export const userApi = api.injectEndpoints({
  endpoints: (build) => ({
    loginAdmin: build.mutation({
      query: (body) => ({
        url: '/api/v1/admin/auth/login',
        method: 'POST',
        body,
      }),
    }),
    refreshToken: build.mutation({
      query: (body: { refreshToken: string }) => ({
        url: '/api/v1/admin/auth/refresh',
        method: 'POST',
        body,
      }),
    }),
    logoutAdmin: build.mutation({
      query: (body: { email: string }) => ({
        url: '/api/v1/admin/auth/logout',
        method: 'POST',
        body,
      }),
    }),
    forgotPassword: build.mutation({
      query: (body: { email: string }) => ({
        url: '/api/v1/admin/auth/forgot-password',
        method: 'POST',
        body,
      }),
    }),
    resetPassword: build.mutation({
      query: (body: { token: 'string'; newPassword: 'string' }) => ({
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
  useRefreshTokenMutation,
  useLogoutAdminMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
} = userApi;
