import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface User {
  username: string;
  email: string;
  isEmailVerified: boolean;
  isProfileCompleted: boolean;
  role?: string | number | null;
  [key: string]: unknown;
}

interface CommonState {
  token: string | null;
  refreshToken: string | null;
  user: User | null;
  role: string | null;
}

const initialState: CommonState = {
  token: null,
  refreshToken: null,
  user: null,
  role: null,
};

const common = createSlice({
  name: 'common',
  initialState,
  reducers: {
    updateAuthTokenRedux: (
      state,
      action: PayloadAction<{
        token: string | null;
        refreshToken?: string | null;
        user?: User | null;
        role?: string | null;
      }>
    ) => ({
      ...state,
      token: action.payload.token,
      refreshToken: action.payload.refreshToken || state.refreshToken,
      user: action.payload.user || state.user,
      role: action.payload.role ?? state.role,
    }),
    clearAuthTokenRedux: (state) => ({
      ...state,
      token: null,
      refreshToken: null,
      user: null,
      role: null,
    }),
  },
});

export const { updateAuthTokenRedux, clearAuthTokenRedux } = common.actions;
export default common.reducer;
