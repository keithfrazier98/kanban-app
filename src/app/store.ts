import { Action, configureStore, ThunkAction } from "@reduxjs/toolkit";
import boardsSlice from "../features/boards/boardsSlice";
import tasksSlice from "../features/tasks/tasksSlice";
import subtasksSlice from "../features/subtasks/subtasksSlice";
import { apiSlice } from "../features/api/apiSlice";

export const store = configureStore({
  reducer: {
    boards: boardsSlice,
    tasks: tasksSlice,
    subtasks: subtasksSlice,
    [apiSlice.reducerPath]: apiSlice.reducer,
  },
  middleware: (getDefaultMiddleWare) =>
    getDefaultMiddleWare().concat(apiSlice.middleware),
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
