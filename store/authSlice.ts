import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type AuthState = {
  isAuthenticated: boolean;
  phone?: string;
};

const initialState: AuthState = {
  isAuthenticated: false,
  phone: undefined,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginSuccess(state, action: PayloadAction<{ phone: string }>) {
      state.isAuthenticated = true;
      state.phone = action.payload.phone;
    },
    logout(state) {
      state.isAuthenticated = false;
      state.phone = undefined;
    },
  },
});

export const { loginSuccess, logout } = authSlice.actions;
export default authSlice.reducer;


