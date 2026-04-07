import api from '../../api';

export interface JuryMember {
  id: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  companyName: string;
  domainOfExpertise: string;
}

export interface JuryResponse {
  success: boolean;
  message: string;
  data: JuryMember[];
}

export interface SingleJuryResponse {
  success: boolean;
  message: string;
  data: JuryMember;
}

export interface CreateJuryPayload {
  fullName: string;
  email: string;
  phoneNumber: string;
  companyName: string;
  domainOfExpertise: string;
  password?: string;
}

export const JuryApi = api.injectEndpoints({
  endpoints: (build) => ({
    getJuries: build.query<JuryResponse, void>({
      query: () => ({
        url: '/api/v1/organiser/juries',
        method: 'GET',
      }),
      providesTags: ['Jury'],
    }),
    createJury: build.mutation<SingleJuryResponse, CreateJuryPayload>({
      query: (body) => ({
        url: '/api/v1/organiser/juries',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Jury'],
    }),
    updateJury: build.mutation<
      SingleJuryResponse,
      { id: string; body: CreateJuryPayload }
    >({
      query: ({ id, body }) => ({
        url: `/api/v1/organiser/juries/${id}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['Jury'],
    }),
    deleteJury: build.mutation<unknown, string>({
      query: (id) => ({
        url: `/api/v1/organiser/juries/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Jury'],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetJuriesQuery,
  useCreateJuryMutation,
  useUpdateJuryMutation,
  useDeleteJuryMutation,
} = JuryApi;
