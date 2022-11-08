import { createEntityAdapter } from "@reduxjs/toolkit";
import {
  ITask,
  ITaskConstructor,
  ITaskEntities,
  ITaskQuery,
} from "../../@types/types";
import { apiSlice } from "../api/apiSlice";

// Use an adapter for the task data to be used in the extendedTasksApi
export const tasksAdapter = createEntityAdapter<ITask>({
  selectId: (task) => task.id,
  sortComparer: (a, b) => b.index - a.index,
});

const intitialTasksQueryState = tasksAdapter.getInitialState<ITaskQuery>({
  ids: [],
  entities: {},
  status: "idle",
});

//TODO: Optimistic updates
//TODO: Invalidate with IDs
// Extend the apiSlice with the task queries and mutations
export const extendedTasksApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getTasks: builder.query({
      query: (boardId: string | undefined) => `/tasks?boardId=${boardId}`,
      transformResponse: (response: ITask[]) => {
        return tasksAdapter.setAll(intitialTasksQueryState, response);
      },
      providesTags: ["Task"],
    }),
    createTask: builder.mutation({
      query: (task: ITaskConstructor) => ({
        url: "/tasks",
        method: "POST",
        body: task,
      }),
      invalidatesTags: ["Task"],
    }),
    updateTasks: builder.mutation({
      query: (tasks: ITaskEntities) => ({
        url: "/tasks",
        method: "PUT",
        body: tasks,
      }),
      invalidatesTags: ["Task"],
    }),
    updateTask: builder.mutation({
      query: (task: ITask) => ({
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
    deleteTask: builder.mutation({
      query: (taskId: string) => ({
        url: `/tasks/${taskId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Task"],
    }),
  }),
});

export const {
  useGetTasksQuery,
  useUpdateTaskMutation,
  useCreateTaskMutation,
  useDeleteTaskMutation,
} = extendedTasksApi;
