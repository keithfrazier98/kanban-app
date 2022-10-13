import {
  createSlice,
  createEntityAdapter,
  createAsyncThunk,
  PayloadAction,
} from "@reduxjs/toolkit";
import { IBoardSubTask, ISubtasksState } from "../../@types/types";
import { client } from "../../api/mock/browser";
import { RootState } from "../../app/store";

export const fetchSubtasksByTaskId = createAsyncThunk(
  "subtasks/fetchSubtasksByTaskId",
  async (taskId: number) => {
    const res = await client.get(`/subtasks?taskId=${taskId}`);
    return res.data.data;
  }
);

const subtasksAdapter = createEntityAdapter<IBoardSubTask>({
  selectId: (subtask) => subtask.id,
});

const initialState = subtasksAdapter.getInitialState<ISubtasksState>({
  ids: [],
  entities: {},
  status: "idle",
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
  extraReducers(builder) {
    builder
      .addCase(fetchSubtasksByTaskId.pending, (state) => {
        state.status = "loading";
      })
      .addCase(
        fetchSubtasksByTaskId.fulfilled,
        (state, action: PayloadAction<IBoardSubTask[]>) => {
          state.status = "succeeded";
          // set boards state using the normalizing adapter
          subtasksAdapter.setAll(state, action.payload);
        }
      )
      .addCase(fetchSubtasksByTaskId.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export const { setAllSubtasks, subtaskUpdated } = subtasksSlice.actions;

export const {
  selectAll: selectAllSubtasks,
  selectById: selectSubtaskById,
  selectIds: selectSubtaskIds,
} = subtasksAdapter.getSelectors<RootState>((state) => state.subtasks);

export default subtasksSlice.reducer;
