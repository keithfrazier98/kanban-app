import {
  createSlice,
  createEntityAdapter,
  createAsyncThunk,
  PayloadAction,
} from "@reduxjs/toolkit";
import { IBoardTask, ITasksState } from "../../@types/types";
// import { client } from "../../api/mock/client";
import { RootState } from "../../app/store";
import { apiSlice } from "../api/apiSlice";

const tasksAdapter = createEntityAdapter<IBoardTask>({
  selectId: (task) => task.id,
});

const initialState = tasksAdapter.getInitialState<ITasksState>({
  ids: [],
  entities: {},
  openTask: null,
  status: "idle",
});

const extendedTasksApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getTasks: builder.query({
      query: (boardId: string | undefined) => `/tasks?boardId=${boardId}`,
      providesTags:["Task"]
    }),
    updateTask: builder.mutation({
      query: (task: IBoardTask) => ({
        url: `/tasks`,
        method: "PATCH",
        body: task,
      }),
      invalidatesTags: ["Task"], // needs task id
      async onQueryStarted(task, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          extendedTasksApi.util.updateQueryData(
            "getTasks",
            task.board.id,
            (draft) => {
              tasksAdapter.updateOne(draft, { id: task.id, changes: task });
            }
          )
        );

        try {
          await queryFulfilled;
        } catch (error) {
          patchResult.undo();
        }
      },
    }),
  }),
});

export const { useGetTasksQuery, useUpdateTaskMutation } = extendedTasksApi;

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

export const { selectAll: selectAllTasks, selectById: selectTaskById } =
  tasksAdapter.getSelectors<RootState>((state) => state.tasks);

export const tasksReqStatus = ({ tasks: { status } }: RootState) => status;

export const getOpenTask = (state: RootState) => state.tasks.openTask;

export default tasksSlice.reducer;
