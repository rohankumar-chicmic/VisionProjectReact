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

const baseQuery: BaseQueryFn = fetchBaseQuery({
  baseUrl: API_BASE_URL,
  prepareHeaders: async (headers: Headers, { getState }) => {
    const { token } = (getState() as RootState).common;
    if (token) {
      headers.append('authorization', `${token}`);
    }
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
    const { refreshToken } = (api.getState() as RootState).common;

    if (refreshToken) {
      // try to get a new token
      const refreshResult = (await baseQuery(
        {
          url: '/api/v1/admin/auth/refresh',
          method: 'POST',
          body: { refreshToken },
        },
        api,
        extraOptions
      )) as { data?: { data: { accessToken: string; refreshToken: string } } };

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
});

export default api;
