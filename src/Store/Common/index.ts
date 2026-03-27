import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface User {
  username: string;
  email: string;
  isEmailVerified: boolean;
  isProfileCompleted: boolean;
}

interface CommonState {
  token: string | null;
  refreshToken: string | null;
  user: User | null;
}

const initialState: CommonState = {
  token: null,
  refreshToken: null,
  user: null,
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
      }>
    ) => ({
      ...state,
      token: action.payload.token,
      refreshToken: action.payload.refreshToken || state.refreshToken,
      user: action.payload.user || state.user,
    }),
    clearAuthTokenRedux: (state) => ({
      ...state,
      token: null,
      refreshToken: null,
      user: null,
    }),
  },
});

export const { updateAuthTokenRedux, clearAuthTokenRedux } = common.actions;
export default common.reducer;
