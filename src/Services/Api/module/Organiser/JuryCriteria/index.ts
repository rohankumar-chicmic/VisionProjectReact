import api from '../../../api';

export interface OrganiserJuryCriteria {
  id: string;
  name: string;
  description: string;
  category: string;
  isActive?: boolean;
}

export interface OrganiserJuryCriteriaResponse {
  success: boolean;
  message: string;
  data: OrganiserJuryCriteria[];
  errors: unknown;
  notificationCount: number;
}

export interface OrganiserJuryCriteriaDetailResponse {
  success: boolean;
  message: string;
  data: OrganiserJuryCriteria;
  errors: unknown;
  notificationCount: number;
}

export interface CreateJuryCriteriaRequest {
  name: string;
  description: string;
  category: string;
}

export interface UpdateJuryCriteriaRequest extends CreateJuryCriteriaRequest {
  id: string;
}

export const organiserJuryCriteriaApi = api.injectEndpoints({
  endpoints: (build) => ({
    getOrganiserJuryCriteria: build.query<OrganiserJuryCriteriaResponse, void>({
      query: () => ({
        url: '/api/v1/organiser/jury-criteria',
        method: 'GET',
      }),
      providesTags: ['OrganiserJuryCriteria'],
    }),
    getOrganiserJuryCriteriaById: build.query<
      OrganiserJuryCriteriaDetailResponse,
      string
    >({
      query: (id) => ({
        url: `/api/v1/organiser/jury-criteria/${id}`,
        method: 'GET',
      }),
      providesTags: (_result, _error, id) => [
        { type: 'OrganiserJuryCriteria', id },
      ],
    }),
    createOrganiserJuryCriteria: build.mutation<
      { success: boolean; message: string; data: OrganiserJuryCriteria },
      CreateJuryCriteriaRequest
    >({
      query: (body) => ({
        url: '/api/v1/organiser/jury-criteria',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['OrganiserJuryCriteria'],
    }),
    updateOrganiserJuryCriteria: build.mutation<
      { success: boolean; message: string },
      UpdateJuryCriteriaRequest
    >({
      query: ({ id, ...body }) => ({
        url: `/api/v1/organiser/jury-criteria/${id}`,
        method: 'PUT',
        body: {
          id,
          ...body,
        },
      }),
      invalidatesTags: (_result, _error, { id }) => [
        'OrganiserJuryCriteria',
        { type: 'OrganiserJuryCriteria', id },
      ],
    }),
    deleteOrganiserJuryCriteria: build.mutation<
      { success: boolean; message: string },
      string
    >({
      query: (id) => ({
        url: `/api/v1/organiser/jury-criteria/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['OrganiserJuryCriteria'],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetOrganiserJuryCriteriaQuery,
  useGetOrganiserJuryCriteriaByIdQuery,
  useCreateOrganiserJuryCriteriaMutation,
  useUpdateOrganiserJuryCriteriaMutation,
  useDeleteOrganiserJuryCriteriaMutation,
} = organiserJuryCriteriaApi;
