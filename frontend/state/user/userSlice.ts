import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';

export interface User {
  id: number;
  name: string;
  total_steps: number;
  created_at: Date;
}

interface UserState {
  user: User | null;
  loading: boolean;
}

interface RootState {
  userState: UserState;
}

const initialState: UserState = {
  user: null,
  loading: false,
};

//login
export const loginUser = createAsyncThunk('user/login', async () => {});
//logout
export const logoutUser = createAsyncThunk('user/logout', async () => {});
//update
export const updateUser = createAsyncThunk('user/update', async () => {});
//delete
export const deleteUser = createAsyncThunk('user/delete', async () => {});

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: { setUser: (state, action) => {} },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.fulfilled, (state, action) => {})
      .addCase(logoutUser.fulfilled, (state, action) => {})
      .addCase(updateUser.fulfilled, (state, action) => {})
      .addCase(deleteUser.fulfilled, (state, action) => {});
  },
});

export const { setUser } = userSlice.actions;
export default userSlice.reducer;
