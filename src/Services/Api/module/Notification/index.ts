import api from '../../api';

export interface ChannelConfig {
  email: boolean;
  sms: boolean;
  inApp: boolean;
}

export interface ContentItem {
  title: string;
  body: string;
}

export interface ContentConfig {
  email: ContentItem;
  sms: { body: string };
  inApp: ContentItem;
}

export type TriggerCategory =
  | 'APPLICATIONS'
  | 'INTERVIEWS'
  | 'SUBSCRIPTIONS'
  | 'GALA_EVENTS';

export interface TriggerEvent {
  id: string;
  title: string;
  description: string;
  category: TriggerCategory;
  icon?: string;
}

export interface NotificationAutomation {
  id: string;
  name: string;
  triggerEventId: string;
  triggerEventName: string;
  galaScope: 'All' | 'Specific';
  galaId?: string;
  channels: ChannelConfig;
  content: ContentConfig;
  status: 'Active' | 'Draft' | 'Inactive';
  createdAt?: string;
  updatedAt?: string;
}

export interface NotificationSummary {
  emailActive: number;
  smsActive: number;
  inAppActive: number;
  totalEvents: number;
}

export interface NotificationResponse {
  success: boolean;
  data: {
    items: NotificationAutomation[];
    totalCount: number;
    summary: NotificationSummary;
  };
}

export const notificationApi = api.injectEndpoints({
  endpoints: (build) => ({
    getNotificationAutomations: build.query<
      NotificationResponse,
      { search?: string; category?: string }
    >({
      query: (params) => ({
        url: '/api/v1/admin/notifications/automations',
        method: 'GET',
        params,
      }),
      providesTags: ['Notifications'],
    }),
    createNotificationAutomation: build.mutation<
      unknown,
      Partial<NotificationAutomation>
    >({
      query: (body) => ({
        url: '/api/v1/admin/notifications/automations',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Notifications'],
    }),
    updateNotificationAutomation: build.mutation<
      unknown,
      { id: string; body: Partial<NotificationAutomation> }
    >({
      query: ({ id, body }) => ({
        url: `/api/v1/admin/notifications/automations/${id}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['Notifications'],
    }),
    deleteNotificationAutomation: build.mutation<unknown, string>({
      query: (id) => ({
        url: `/api/v1/admin/notifications/automations/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Notifications'],
    }),
    getTriggerEvents: build.query<
      { success: boolean; data: TriggerEvent[] },
      void
    >({
      query: () => ({
        url: '/api/v1/admin/notifications/triggers',
        method: 'GET',
      }),
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetNotificationAutomationsQuery,
  useCreateNotificationAutomationMutation,
  useUpdateNotificationAutomationMutation,
  useDeleteNotificationAutomationMutation,
  useGetTriggerEventsQuery,
} = notificationApi;
