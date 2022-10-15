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
    return res.data;
  }
);

const tasksAdapter = createEntityAdapter<IBoardTask>({
  selectId: (task) => task.id,
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
    // selects a task or deselects task when passed null
    taskSelected(state, { payload }: { payload: { taskId: string | null } }) {
      const { taskId } = payload;
      state.openTask = taskId;
    },
    // updates one task
    taskUpdated(
      state,
      { payload: { task: changes } }: { payload: { task: IBoardTask } }
    ) {
      const { id } = changes;
      tasksAdapter.updateOne(state, { id, changes });
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

export const { taskSelected, taskUpdated } = tasksSlice.actions;

export const { selectAll: selectAllTasks, selectById: selectTaskById } =
  tasksAdapter.getSelectors<RootState>((state) => state.tasks);

export const tasksReqStatus = ({ tasks: { status } }: RootState) => status;

export const getOpenTask = (state: RootState) => state.tasks.openTask;

export default tasksSlice.reducer;
