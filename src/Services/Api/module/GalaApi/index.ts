import api from '../../api';

export interface GalaEveningItem {
  id?: string;
  time: string;
  title: string;
  description: string;
}

export interface GalaApplication {
  id: string;
  userId: string;
  applicationId: string;
  status: number;
  totalJuryScore: number | null;
  submittedAt: string;
  companyName: string;
  industry: string;
  motivationStatement: string;
  businessPlanDocumentUrl: string | null;
  videoUrl: string | null;
}

export interface GalaQuestion {
  questionText: string;
  questionType: string;
  order: number;
}

export interface GalaRequirement {
  text: string;
  order: number;
}

export interface GalaJuryCriteria {
  criteriaKey: string;
  name: string;
  description: string;
  scaleType: number;
  category: string;
  isCustom: boolean;
  isActive: boolean;
  type: number;
}

export interface GalaGrantDetail {
  id: string;
  galaEventId: string;
  blockchainGrantId: string;
  name: string;
  description: string;
  category: string;
  prizeAmount: number;
  numberOfPrizes: number;
  applicationDeadline: string;
  durationLeftSeconds: number;
  status: number;
  requireInterview: boolean;
  requireCompanyName: boolean;
  requireIndustrySelection: boolean;
  requireMotivationStatement: boolean;
  requireBusinessPlanDocument: boolean;
  questions: GalaQuestion[];
  additionalRequirements: GalaRequirement[];
  juryCriteria: GalaJuryCriteria[];
  appliedCount: number;
  applications: GalaApplication[];
}

export interface GalaItem {
  id: string;
  name: string;
  about: string;
  coverImageUrl: string;
  status: number;
  eventDate: string;
  eventTime: string;
  venue: string;
  city: string;
  expectedAttendees: number;
  totalPrizePool: number;
  appliedCount: number;
  eveningItems: GalaEveningItem[];
  grants: GalaGrantDetail[];
}

export interface GalaData {
  items: GalaItem[];
  pageNumber: number;
  totalPages: number;
  totalCount: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

export interface GalaResponse {
  success: boolean;
  message: string;
  data: GalaData;
  errors: unknown;
  notificationCount: number;
}

export interface GalaParams {
  searchTerm?: string;
  status?: number;
  sortBy?: string;
  sortOrder?: string;
  pageNumber?: number;
  pageSize?: number;
}

export interface SingleGalaResponse {
  success: boolean;
  message: string;
  data: GalaItem;
  errors: unknown;
  notificationCount: number;
}

export interface CreateGalaRequest {
  name: string;
  about: string;
  coverImageUrl: string;
  status: number;
  eventDate: string;
  eventTime: string;
  venue: string;
  city?: string;
  expectedAttendees: number;
  totalPrizePool: number;
  eveningItems: {
    time: string;
    title: string;
    description?: string;
  }[];
}

export interface UpdateGalaRequest extends CreateGalaRequest {
  id: string;
}

export const galaApi = api.injectEndpoints({
  endpoints: (build) => ({
    getGalas: build.query<GalaResponse, GalaParams>({
      query: (params) => ({
        url: '/api/v1/admin/gala',
        method: 'GET',
        params,
      }),
      providesTags: ['Galas'],
    }),
    getGalaById: build.query<SingleGalaResponse, string>({
      query: (id) => ({
        url: `/api/v1/admin/gala/${id}`,
        method: 'GET',
      }),
      providesTags: (_result, _error, id) => [{ type: 'Galas', id }],
    }),
    createGala: build.mutation<SingleGalaResponse, CreateGalaRequest>({
      query: (body) => ({
        url: '/api/v1/admin/gala',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Galas'],
    }),
    updateGala: build.mutation<SingleGalaResponse, UpdateGalaRequest>({
      query: (body) => ({
        url: '/api/v1/admin/gala',
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['Galas'],
    }),
    publishGala: build.mutation<SingleGalaResponse, string>({
      query: (id) => ({
        url: `/api/v1/admin/gala/${id}/publish`,
        method: 'POST',
      }),
      invalidatesTags: ['Galas'],
    }),
    unpublishGala: build.mutation<SingleGalaResponse, string>({
      query: (id) => ({
        url: `/api/v1/admin/gala/${id}/unpublish`,
        method: 'POST',
      }),
      invalidatesTags: ['Galas'],
    }),
    deleteGala: build.mutation<SingleGalaResponse, string>({
      query: (id) => ({
        url: `/api/v1/admin/gala/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Galas'],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetGalasQuery,
  useGetGalaByIdQuery,
  useCreateGalaMutation,
  useUpdateGalaMutation,
  usePublishGalaMutation,
  useUnpublishGalaMutation,
  useDeleteGalaMutation,
} = galaApi;
