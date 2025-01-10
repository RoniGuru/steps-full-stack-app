import { configureStore } from '@reduxjs/toolkit';
import UserReducer from './user/userSlice';
import StepReducer from './steps/stepSlice';

export const store = configureStore({
  reducer: { userState: UserReducer, stepState: StepReducer },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
