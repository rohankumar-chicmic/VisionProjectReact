import api from '../../../api';

export interface OrganiserJuryMember {
  id: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  companyName: string;
  domainOfExpertise: string;
}

export interface OrganiserJuryResponse {
  success: boolean;
  message: string;
  data: OrganiserJuryMember[];
  errors: unknown;
  notificationCount: number;
}

export interface CreateOrganiserJuryRequest {
  fullName: string;
  email: string;
  phoneNumber: string;
  companyName: string;
  domainOfExpertise: string;
  password: string;
}

export interface UpdateOrganiserJuryRequest extends CreateOrganiserJuryRequest {
  id: string;
}

export const organiserJuryApi = api.injectEndpoints({
  endpoints: (build) => ({
    getOrganiserJuries: build.query<OrganiserJuryResponse, void>({
      query: () => ({
        url: '/api/v1/organiser/juries',
        method: 'GET',
      }),
      providesTags: ['OrganiserJuries'],
    }),
    createOrganiserJury: build.mutation<
      { success: boolean; message: string },
      CreateOrganiserJuryRequest
    >({
      query: (body) => ({
        url: '/api/v1/organiser/juries',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['OrganiserJuries'],
    }),
    updateOrganiserJury: build.mutation<
      { success: boolean; message: string },
      UpdateOrganiserJuryRequest
    >({
      query: ({ id, ...body }) => ({
        url: `/api/v1/organiser/juries/${id}`,
        method: 'PUT',
        body: {
          id,
          ...body,
        },
      }),
      invalidatesTags: ['OrganiserJuries'],
    }),
    deleteOrganiserJury: build.mutation<
      { success: boolean; message: string },
      string
    >({
      query: (id) => ({
        url: `/api/v1/organiser/juries/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['OrganiserJuries'],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetOrganiserJuriesQuery,
  useCreateOrganiserJuryMutation,
  useUpdateOrganiserJuryMutation,
  useDeleteOrganiserJuryMutation,
} = organiserJuryApi;
