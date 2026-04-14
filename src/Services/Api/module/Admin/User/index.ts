import api from '../../../api';

export interface AdminItem {
  id: string;
  displayId: string;
  fullName: string;
  email: string;
  phoneNumber: string | null;
  role: number; // 1: Super Admin, 2: Sub Admin
  roleLabel: string;
  createdAt: string;
  lastActiveAt: string | null;
  passwordMasked: string;
  avatarColor?: string;
}

export interface AdminData {
  summary: {
    superAdminCount: number;
    subAdminCount: number;
    totalAdmins: number;
  };
  items: AdminItem[];
  pageNumber: number;
  totalPages: number;
  totalCount: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

export interface AdminResponse {
  success: boolean;
  message: string;
  data: AdminData;
  errors: unknown;
  notificationCount: number;
}

export interface AdminParams {
  searchTerm?: string;
  role?: number;
  sortBy?: string;
  sortOrder?: string;
  pageNumber?: number;
  pageSize?: number;
}

export interface CreateAdminParams {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: number;
  permissions: string;
  sendWelcomeEmail: boolean;
  createdByUserId?: string;
}

export interface UpdateAdminParams {
  id: string; // From path
  fullName: string;
  role: number;
  permissions: string;
}

export interface AdminDetail {
  id: string;
  fullName: string;
  email: string;
  role: number;
  permissions: string;
  createdAt: string;
  lastActiveAt: string | null;
  passwordMasked: string;
  avatarColor?: string;
}

export interface AdminDetailResponse {
  success: boolean;
  message: string;
  data: AdminDetail;
  errors: unknown;
  notificationCount: number;
}

export interface UserDashboardData {
  totalUsers: number;
  activeSubscriptions: number;
  membersWithoutPassport: number;
  blockedUsers: number;
}

export interface UserDashboardResponse {
  success: boolean;
  message: string;
  data: UserDashboardData;
  errors: unknown;
  notificationCount: number;
}

export interface AdminUser {
  id: string;
  displayId: string;
  fullName: string;
  email: string;
  avatarUrl: string | null;
  subscriptionPlan: number;
  subscriptionStatus: number;
  passportStatus: string;
  createdAt: string;
  isBlocked: boolean;
}

export interface AdminUserData {
  items: AdminUser[];
  pageNumber: number;
  totalPages: number;
  totalCount: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

export interface AdminUserResponse {
  success: boolean;
  message: string;
  data: AdminUserData;
  errors: unknown;
  notificationCount: number;
}

export interface UserHistoryItem {
  title: string;
  subtitle: string;
  date: string;
  status: string;
  type: string;
  color?: string;
}

export interface UserActivityItem {
  title: string;
  time: string;
  meta: string;
  status: string;
  id?: string;
}

export interface AdminUserDetail {
  id: string;
  fullName: string;
  email: string;
  avatarUrl: string | null;
  phoneNumber?: string;
  companyName: string;
  subscriptionPlan: number;
  subscriptionStatus: number;
  subscriptionExpiryDate: string | null;
  createdAt: string;
  isBlocked: boolean;
  isEmailVerified: boolean;
  history: UserHistoryItem[];
  recentActivity: UserActivityItem[];
}

export interface AdminUserDetailResponse {
  success: boolean;
  message: string;
  data: AdminUserDetail;
  errors: unknown;
  notificationCount: number;
}

export interface AdminUserParams {
  searchTerm?: string;
  isBlocked?: boolean;
  subscriptionPlan?: number;
  passportStatus?: string;
  sortBy?: string;
  sortOrder?: string;
  pageNumber?: number;
  pageSize?: number;
}

export interface BlockUserRequest {
  id: string;
  isBlocked: boolean;
}

export interface CreateAdminUserRequest {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  companyName?: string;
  temporaryPassword?: string;
  freeDurationMonths: number;
  sendWelcomeEmail: boolean;
}

export interface UpdateAdminUserRequest {
  id: string; // From path
  firstName?: string;
  lastName?: string;
  email?: string;
  phoneNumber?: string;
  companyName?: string;
}

export const adminUserApi = api.injectEndpoints({
  endpoints: (build) => ({
    getAdminManagers: build.query<AdminResponse, AdminParams>({
      query: (params) => ({
        url: '/api/v1/admin/managers',
        method: 'GET',
        params,
      }),
      providesTags: ['Admins'],
    }),
    getAdminById: build.query<AdminDetailResponse, string>({
      query: (id) => ({
        url: `/api/v1/admin/managers/${id}`,
        method: 'GET',
      }),
    }),
    createAdminManager: build.mutation<unknown, CreateAdminParams>({
      query: (body) => ({
        url: '/api/v1/admin/managers',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Admins'],
    }),
    updateAdminManager: build.mutation<unknown, UpdateAdminParams>({
      query: ({ id, ...body }) => ({
        url: `/api/v1/admin/managers/${id}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['Admins'],
    }),
    deleteAdminManager: build.mutation<unknown, string>({
      query: (id) => ({
        url: `/api/v1/admin/managers/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Admins'],
    }),
    getAdminUserDashboard: build.query<UserDashboardResponse, void>({
      query: () => ({
        url: '/api/v1/admin/users/dashboard',
        method: 'GET',
      }),
      providesTags: ['Admins'],
    }),
    getAdminUsers: build.query<AdminUserResponse, AdminUserParams>({
      query: (params) => ({
        url: '/api/v1/admin/users',
        method: 'GET',
        params,
      }),
      providesTags: ['Admins'],
    }),
    getAdminUserById: build.query<AdminUserDetailResponse, string>({
      query: (id) => ({
        url: `/api/v1/admin/users/${id}`,
        method: 'GET',
      }),
      providesTags: ['Admins'],
    }),
    blockUser: build.mutation<void, BlockUserRequest>({
      query: ({ id, isBlocked }) => ({
        url: `/api/v1/admin/users/${id}/block`,
        method: 'POST',
        body: { isBlocked },
      }),
      invalidatesTags: ['Admins'],
    }),
    createAdminUser: build.mutation<unknown, CreateAdminUserRequest>({
      query: (body) => ({
        url: '/api/v1/admin/users',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Admins'],
    }),
    updateAdminUser: build.mutation<unknown, UpdateAdminUserRequest>({
      query: ({ id, ...body }) => ({
        url: `/api/v1/admin/users/${id}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['Admins'],
    }),
    importAdminUsers: build.mutation<unknown, FormData>({
      query: (body) => ({
        url: '/api/v1/admin/users/import',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Admins'],
    }),
    exportAdminUsers: build.query<Blob, AdminUserParams>({
      query: (params) => ({
        url: '/api/v1/admin/users/export',
        method: 'GET',
        params,
        responseHandler: (response) => response.blob(),
      }),
    }),
    exportAdminUserById: build.query<Blob, string>({
      query: (id) => ({
        url: `/api/v1/admin/users/${id}/export`,
        method: 'GET',
        responseHandler: (response) => response.blob(),
      }),
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetAdminManagersQuery,
  useGetAdminByIdQuery,
  useCreateAdminManagerMutation,
  useUpdateAdminManagerMutation,
  useDeleteAdminManagerMutation,
  useGetAdminUserDashboardQuery,
  useGetAdminUsersQuery,
  useGetAdminUserByIdQuery,
  useBlockUserMutation,
  useCreateAdminUserMutation,
  useUpdateAdminUserMutation,
  useImportAdminUsersMutation,
  useExportAdminUsersQuery,
  useLazyExportAdminUsersQuery,
  useExportAdminUserByIdQuery,
  useLazyExportAdminUserByIdQuery,
} = adminUserApi;
