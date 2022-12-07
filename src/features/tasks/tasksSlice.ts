import { createSlice } from "@reduxjs/toolkit";
import { ITaskState } from "../../@types/types";
import { RootState } from "../../redux/store";
import { openModalFunction } from "../../utils/utils";

// Setup slice to hold the openTask state
const initialState: ITaskState = {
  openTask: null,
  openAddTaskModal: false,
  openEditTaskModal: false,
  openDeleteTaskModal: false,
};

const tasksSlice = createSlice({
  name: "tasks",
  initialState,
  reducers: {
    // selects a task or deselects task when passed null
    taskSelected(state, { payload }: { payload: { taskId: string | null } }) {
      const { taskId } = payload;
      state.openTask = taskId;
    },

    addTaskModalOpened: openModalFunction("openAddTaskModal"),
    editTaskModalOpened: openModalFunction("openEditTaskModal"),
    deleteTaskModalOpened: openModalFunction("openDeleteTaskModal"),
  },
});

export const {
  taskSelected,
  addTaskModalOpened,
  editTaskModalOpened,
  deleteTaskModalOpened,
} = tasksSlice.actions;

export const getOpenTask = (state: RootState) => state.tasks.openTask;
export const selectTaskSlice = (state: RootState) => state.tasks;

export default tasksSlice.reducer;
