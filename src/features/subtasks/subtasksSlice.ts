import { createSlice, createEntityAdapter } from "@reduxjs/toolkit";
import { IBoardSubTask, ISubtasksState } from "../../@types/types";
import { RootState } from "../../app/store";

const subtasksAdapter = createEntityAdapter<IBoardSubTask>({
  selectId: (subtask) => subtask.id,
});

const initialState = subtasksAdapter.getInitialState<ISubtasksState>({
  ids: [],
  entities: [],
});

const subtasksSlice = createSlice({
  name: "subtask",
  initialState,
  reducers: {
    subtaskUpdated(
      state,
      action: { payload: { subtask: IBoardSubTask; id: number } }
    ) {
      const { subtask: changes, id } = action.payload;
      console.log(action.payload);
      subtasksAdapter.updateOne(state, { id, changes });
    },
    setAllSubtasks(state, action) {
      subtasksAdapter.setAll(state, action.payload);
    },
  },
});

export const { setAllSubtasks, subtaskUpdated } = subtasksSlice.actions;

export const {
  selectAll: selectAllSubtasks,
  selectById: selectSubtaskById,
  selectIds: selectSubtaskIds,
} = subtasksAdapter.getSelectors<RootState>((state) => state.subtasks);

export default subtasksSlice.reducer;
