/* eslint-disable import/no-cycle */
import {
  createApi,
  fetchBaseQuery,
  BaseQueryFn,
  BaseQueryApi,
  FetchArgs,
} from '@reduxjs/toolkit/query/react';
import type { RootState } from '../../Store';
import { API_BASE_URL } from './Constants';
import { ResponseOptions } from './api.d';
import { updateAuthTokenRedux, clearAuthTokenRedux } from '../../Store/Common';
import { AuthResponse } from './module/Auth';

const baseQuery: BaseQueryFn = fetchBaseQuery({
  baseUrl: API_BASE_URL,
  prepareHeaders: async (headers: Headers, { getState }) => {
    const { token } = (getState() as RootState).common;
    if (token) {
      headers.append('authorization', `Bearer ${token}`);
    }
    headers.set('ngrok-skip-browser-warning', 'true');
    return headers;
  },
});

const baseQueryWithInterceptor = async (
  args: string | FetchArgs,
  api: BaseQueryApi,
  extraOptions: object
) => {
  let result = await baseQuery(args, api, extraOptions);

  if ((result as ResponseOptions).error?.status === 401) {
    const { refreshToken, role } = (api.getState() as RootState).common;

    if (refreshToken) {
      // Pick the correct refresh endpoint based on the logged-in role
      let refreshUrl = '/api/v1/admin/auth/refresh';
      if (role === 'organiser') {
        refreshUrl = '/api/v1/organiser/auth/refresh';
      } else if (role === 'jury') {
        refreshUrl = '/api/v1/jury/auth/refresh';
      }

      // try to get a new token
      const refreshResult = (await baseQuery(
        {
          url: refreshUrl,
          method: 'POST',
          body: { refreshToken },
        },
        api,
        extraOptions
      )) as { data: AuthResponse };

      if (refreshResult.data) {
        // store the new token
        api.dispatch(
          updateAuthTokenRedux({
            token: refreshResult.data.data.accessToken,
            refreshToken: refreshResult.data.data.refreshToken,
          })
        );
        // retry the initial query
        result = await baseQuery(args, api, extraOptions);
      } else {
        api.dispatch(clearAuthTokenRedux());
      }
    } else {
      api.dispatch(clearAuthTokenRedux());
    }
  }

  return result;
};

const api = createApi({
  baseQuery: baseQueryWithInterceptor,
  endpoints: () => ({}),
  tagTypes: [
    'Galas',

    'Grants',

    'Admins',

    'Notifications',

    'Announcements',
    'Jury',
    'JuryDashboard',
    'OrganiserGalas',
    'OrganiserGrants',
    'OrganiserJuries',
    'OrganiserApplications',
    'JuryApplications',
    'ApplicationReview',
    'OrganiserProfile',
    'AdminProfile',
    'AdminSettings',
    'OrganiserJuryCriteria',
  ],
});

export default api;
