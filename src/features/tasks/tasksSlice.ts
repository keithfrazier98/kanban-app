import { createSlice, createEntityAdapter } from "@reduxjs/toolkit";
import { IBoardTask, IBoardState, ITasksState } from "../../@types/types";
import { RootState } from "../../app/store";

const tasksAdapter = createEntityAdapter<IBoardTask>();

const initialState = tasksAdapter.getInitialState<ITasksState>({
  ids: [],
  entities: [],
  openTask: null,
});

const tasksSlice = createSlice({
  name: "tasks",
  initialState,
  reducers: {
    openTaskUpdated(state, action) {
      const { task } = action.payload;
      state.openTask = task;
    },
  },
});

export const { openTaskUpdated } = tasksSlice.actions;

export const getOpenTask = (state: RootState) => state.tasks.openTask;

export default tasksSlice.reducer;
