import api from '../../api';

export interface DashboardStat {
  label: string;
  value: number;
}

export interface DashboardData {
  totalUsers: number;
  usersGrowthPercentage: number;
  activeGalas: number;
  galasGrowthPercentage: number;
  monthlyRevenue: number;
  revenueGrowthPercentage: number;
  totalApplications: number;
  applicationsGrowthPercentage: number;
  activeGrants: number;
  grantsGrowthPercentage: number;
  monthlyActivePasseports: number;
  monthlyPasseportGrowthPercentage: number;
  yearlyTotalPasseports: number;
  yearlyPasseportGrowthPercentage: number;
  monthlyNewUsers: DashboardStat[];
  monthlyUnsubscriptions: DashboardStat[];
}

export interface DashboardResponse {
  success: boolean;
  message: string;
  data: DashboardData;
  errors: string | null;
  notificationCount: number;
}

export interface FileUploadResponse {
  success: boolean;
  message: string;
  data: string;
}

export const commonApi = api.injectEndpoints({
  endpoints: (build) => ({
    getDashboardData: build.query<DashboardResponse, void>({
      query: () => ({
        url: '/api/v1/admin/dashboard/stats',
        method: 'GET',
      }),
    }),
    uploadFile: build.mutation<FileUploadResponse, FormData>({
      query: (body) => ({
        url: '/api/v1/files/upload',
        method: 'POST',
        body,
      }),
    }),
  }),
  overrideExisting: false,
});

export const { useGetDashboardDataQuery, useUploadFileMutation } = commonApi;
