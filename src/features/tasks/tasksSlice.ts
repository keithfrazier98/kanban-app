import { createSlice } from "@reduxjs/toolkit";
import { ITaskState } from "../../@types/types";
import { RootState } from "../../app/store";

// Setup slice to hold the openTask state
const initialState: ITaskState = { openTask: null };
const tasksSlice = createSlice({
  name: "tasks",
  initialState,
  reducers: {
    // selects a task or deselects task when passed null
    taskSelected(state, { payload }: { payload: { taskId: string | null } }) {
      const { taskId } = payload;
      state.openTask = taskId;
    },
  },
});

export const { taskSelected } = tasksSlice.actions;

export const getOpenTask = (state: RootState) => state.tasks.openTask;

export default tasksSlice.reducer;
