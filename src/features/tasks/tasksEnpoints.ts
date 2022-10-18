import {
  createSlice,
  createEntityAdapter,
  EntityState,
} from "@reduxjs/toolkit";
import { IBoardTask, ITaskQuery, ITaskState } from "../../@types/types";
// import { client } from "../../api/mock/client";
import { RootState } from "../../app/store";
import { apiSlice } from "../api/apiSlice";

// Use an adapther for the task data to be used in the extendedTasksApi
export const tasksAdapter = createEntityAdapter<IBoardTask>({
  selectId: (task) => task.id,
});

const intitialTasksQueryState = tasksAdapter.getInitialState<ITaskQuery>({
  ids: [],
  entities: {},
  status: "idle",
});

// Extend the apiSlice with the task queries and mutations
export const extendedTasksApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getTasks: builder.query({
      query: (boardId: string | undefined) => `/tasks?boardId=${boardId}`,
      transformResponse: (response: IBoardTask[]) => {
        return tasksAdapter.setAll(intitialTasksQueryState, response);
      },
      providesTags: ["Task"],
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


