import api from '../../../api';

export interface AnnouncementItem {
  id: string;
  title: string;
  message: string;
  isPublished: boolean;
  scheduledAt: string;
  targetAudience: number;
  sendPush: boolean;
  createdAt: string;
}

export interface AnnouncementResponse {
  success: boolean;
  message: string;
  data: AnnouncementItem[];
  errors: unknown;
  notificationCount: number;
}

export interface CreateAnnouncementRequest {
  title: string;
  message: string;
  publishNow: boolean;
  scheduledAt: string;
  targetAudience: number;
  sendPush: boolean;
}

export interface UpdateAnnouncementRequest {
  id: string;
  title: string;
  message: string;
  isPublished: boolean;
  scheduledAt: string;
  targetAudience: number;
  sendPush: boolean;
}

export const adminAnnouncementApi = api.injectEndpoints({
  endpoints: (build) => ({
    getAnnouncements: build.query<AnnouncementResponse, void>({
      query: () => ({
        url: '/api/v1/admin/announcements',
        method: 'GET',
      }),
      providesTags: ['Announcements'],
    }),
    createAnnouncement: build.mutation<unknown, CreateAnnouncementRequest>({
      query: (body) => ({
        url: '/api/v1/admin/announcements',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Announcements'],
    }),
    updateAnnouncement: build.mutation<unknown, UpdateAnnouncementRequest>({
      query: ({ id, ...body }) => ({
        url: `/api/v1/admin/announcements/${id}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['Announcements'],
    }),
    deleteAnnouncement: build.mutation<unknown, string>({
      query: (id) => ({
        url: `/api/v1/admin/announcements/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Announcements'],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetAnnouncementsQuery,
  useCreateAnnouncementMutation,
  useUpdateAnnouncementMutation,
  useDeleteAnnouncementMutation,
} = adminAnnouncementApi;
