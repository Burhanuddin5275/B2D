import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type AuthState = {
  isAuthenticated: boolean;
  phone?: string;
   token?: string;
};

const initialState: AuthState = {
  isAuthenticated: false,
  phone: undefined,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginSuccess(state, action: PayloadAction<{ phone: string; token: string }>) {
      state.isAuthenticated = true;
      state.phone = action.payload.phone;
    state.token = action.payload.token;
    },
    logout(state) {
      state.isAuthenticated = false;
      state.phone = undefined;
      state.token = undefined;
    },
  },
});

export const { loginSuccess, logout } = authSlice.actions;
export default authSlice.reducer;


