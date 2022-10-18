import { createSlice, createEntityAdapter } from "@reduxjs/toolkit";

import { IBoardSubTask, ISubtaskQuery } from "../../@types/types";
import { RootState } from "../../app/store";
import { apiSlice } from "../api/apiSlice";

const subtasksAdapter = createEntityAdapter<IBoardSubTask>({
  selectId: (subtask) => subtask.id,
});

const initialState = subtasksAdapter.getInitialState<ISubtaskQuery>({
  ids: [],
  entities: {},
  status: "idle",
});

const extendedSubtaskApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getSubtask: builder.query({
      query: (taskId: string | null) => `/subtasks?taskId=${taskId}`,
      transformResponse: (response: IBoardSubTask[]) => {
        return subtasksAdapter.setAll(initialState, response);
      },
      // TODO: add id specific tags
      // ...result.map(({ id }) => ({ type: 'Post', id })),
      providesTags: ["Subtask"],
    }),
    updateSubtask: builder.mutation({
      query: (subtask: IBoardSubTask) => ({
        url: `/subtasks`,
        method: "PATCH",
        body: subtask,
      }),
      invalidatesTags: ["Subtask"],
      onQueryStarted(subtask, { dispatch }) {
        dispatch(
          extendedSubtaskApi.util.updateQueryData(
            "getSubtask",
            subtask.task.id,
            (draft) => {
              subtasksAdapter.updateOne(draft, {
                id: subtask.task.id,
                changes: subtask,
              });
            }
          )
        );
      },
    }),
  }),
});

export const { useGetSubtaskQuery, useUpdateSubtaskMutation } =
  extendedSubtaskApi;

