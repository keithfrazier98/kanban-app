import { Action, configureStore, ThunkAction } from "@reduxjs/toolkit";
import boardsSlice from "../features/boards/boardsSlice";
import tasksSlice from "../features/tasks/tasksSlice";
import columnsSlice from "../features/columns/columnsSlice";
import subtasksSlice from "../features/subtasks/subtasksSlice";

export const store = configureStore({
  reducer: {
    boards: boardsSlice,
    columns: columnsSlice,
    tasks: tasksSlice,
    subtasks: subtasksSlice
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
