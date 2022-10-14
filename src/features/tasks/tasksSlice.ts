import {
  createSlice,
  createEntityAdapter,
  createAsyncThunk,
  PayloadAction,
} from "@reduxjs/toolkit";
import { IBoardTask, ITasksState } from "../../@types/types";
import { client } from "../../api/mock/client";
import { RootState } from "../../app/store";

export const fetchTasksByBoardId = createAsyncThunk(
  "tasks/fetchTasksByBoardId",
  async (boardId: string) => {
    const res = await client.get(`/tasks?boardId=${boardId}`);
    return res.data.data;
  }
);

const tasksAdapter = createEntityAdapter<IBoardTask>({
  selectId: (task) => task.title,
});

const initialState = tasksAdapter.getInitialState<ITasksState>({
  ids: [],
  entities: {},
  openTask: null,
  status: "idle",
});

const tasksSlice = createSlice({
  name: "tasks",
  initialState,
  reducers: {
    openTaskUpdated(state, action: { payload: { taskId: string | null } }) {
      const { taskId } = action.payload;
      state.openTask = taskId;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(fetchTasksByBoardId.pending, (state) => {
        state.status = "loading";
      })
      .addCase(
        fetchTasksByBoardId.fulfilled,
        (state, action: PayloadAction<IBoardTask[]>) => {
          state.status = "succeeded";
          // set boards state using the normalizing adapter
          tasksAdapter.setAll(state, action.payload);
        }
      )
      .addCase(fetchTasksByBoardId.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export const { openTaskUpdated } = tasksSlice.actions;

export const { selectAll: selectAllTasks, selectById: selectTaskById } =
  tasksAdapter.getSelectors<RootState>((state) => state.tasks);

export const tasksReqStatus = ({ tasks: { status } }: RootState) => status;

export const getOpenTask = (state: RootState) => state.tasks.openTask;

export default tasksSlice.reducer;
