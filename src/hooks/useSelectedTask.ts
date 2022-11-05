import { createSelector } from "@reduxjs/toolkit";
import { useMemo } from "react";
import { ITaskQuery } from "../@types/types";
import { useAppSelector } from "../app/hooks";
import { getSelectedBoard } from "../features/boards/boardsSlice";
import { useGetTasksQuery } from "../features/tasks/tasksEnpoints";
import { getOpenTask } from "../features/tasks/tasksSlice";

export default function useSelectedTask() {
  const selectedBoard = useAppSelector(getSelectedBoard);
  const openTask = useAppSelector(getOpenTask);

  const selectTaskById = useMemo(() => {
    return createSelector(
      (res: any) => res.data,
      (res: any, taskId: string) => taskId,
      (data: ITaskQuery, taskId: string) => data.entities[taskId]
    );
  }, []);

  const { task } = useGetTasksQuery(selectedBoard?.id, {
    selectFromResult: (result: any) => ({
      ...result,
      task: selectTaskById(result, openTask ?? ""),
    }),
  });

  return task;
}
