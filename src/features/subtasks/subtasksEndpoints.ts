import { createEntityAdapter } from "@reduxjs/toolkit";

import { ISubtask, ISubtaskQuery } from "../../@types/types";
import { apiSlice } from "../api/apiSlice";
import { extendedTasksApi, tasksAdapter } from "../tasks/tasksEnpoints";

const subtasksAdapter = createEntityAdapter<ISubtask>({
  selectId: (subtask) => subtask.id,
});

const initialState = subtasksAdapter.getInitialState<ISubtaskQuery>({
  ids: [],
  entities: {},
  status: "idle",
});

const extendedSubtaskApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getSubtasks: builder.query({
      query: (taskId: string | null) => `/subtasks?taskId=${taskId}`,
      transformResponse: (response: ISubtask[]) => {
        return subtasksAdapter.setAll(initialState, response);
      },
      // TODO: add id specific tags
      // ...result.map(({ id }) => ({ type: 'Post', id })),
      providesTags: ["Subtask"],
    }),
    updateSubtask: builder.mutation({
      query: (subtask: ISubtask) => ({
        url: `/subtasks`,
        method: "PATCH",
        body: subtask,
      }),
      invalidatesTags: ["Subtask"],
      async onQueryStarted(subtask, { dispatch, queryFulfilled }) {
        // these vars are used to determine if the completed field was changed
        let wasComplete = false;
        let isNowComplete = false;
        let addOrSubtract = 0;

        // dispatch an action to (optimistically) update the subtask on the UI
        const patchSubtask = dispatch(
          extendedSubtaskApi.util.updateQueryData(
            "getSubtasks",
            subtask.task,
            (draft) => {
              // store whether the task was already completed
              const oldSubtask = draft.entities[subtask.id];
              if (oldSubtask.isCompleted) {
                wasComplete = true;
              }

              // store whether the was is now complete
              if (subtask.isCompleted) {
                isNowComplete = true;
              }

              subtasksAdapter.updateOne(draft, {
                id: subtask.task,
                changes: subtask,
              });
            }
          )
        );

        // determine if the task needs to be optimistically updated
        if (!wasComplete && isNowComplete) {
          addOrSubtract = 1;
        } else if (wasComplete && !isNowComplete) {
          addOrSubtract = -1;
        }
        //TODO: Fix optimistic update on subtask 
        // let patchTask;
        // if (addOrSubtract !== 0) {
        //   patchTask = dispatch(
        //     extendedTasksApi.util.updateQueryData(
        //       "getTasks",
        //       subtask.task.board.id,
        //       (draft) => {
        //         const oldTask = subtask.task;

        //         tasksAdapter.updateOne(draft, {
        //           id: subtask.task.id,
        //           changes: {
        //             ...subtask.task,
        //             completedSubtasks:
        //               oldTask.completedSubtasks + addOrSubtract,
        //           },
        //         });
        //       }
        //     )
        //   );
        // }

        // try {
        //   await queryFulfilled;
        // } catch (error) {
        //   //undo any uptimistic updates that were made (regardless the error)
        //   patchSubtask.undo();
        //   patchTask?.undo();
        // }
      },
    }),
    deleteSubtask: builder.mutation({
      query: ({
        subtaskId,
        taskId,
      }: {
        subtaskId: string;
        taskId: string;
      }) => ({
        url: `/subtasks?subtaskId=${subtaskId}&taskId=${taskId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Subtask", "Task"],
    }),
  }),
});

export const { useGetSubtasksQuery, useUpdateSubtaskMutation } =
  extendedSubtaskApi;
