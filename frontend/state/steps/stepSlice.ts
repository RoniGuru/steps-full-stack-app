import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';

export interface Step {
  id: number;
  steps: number;
  step_date: Date;
  user_id: number;
}

interface StepState {
  step: Step[];
  loading: boolean;
}

interface RootState {
  userState: StepState;
}

const initialState: StepState = {
  step: [],
  loading: false,
};

//login
export const addStep = createAsyncThunk('user/login', async () => {});
//logout
export const updateStep = createAsyncThunk('user/logout', async () => {});
//update
export const deleteStep = createAsyncThunk('user/update', async () => {});

const stepSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(addStep.fulfilled, (state, action) => {})
      .addCase(updateStep.fulfilled, (state, action) => {})
      .addCase(deleteStep.fulfilled, (state, action) => {});
  },
});

export default stepSlice.reducer;
