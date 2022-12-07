import { createSelector } from "@reduxjs/toolkit";
import { useMemo } from "react";
import { IBoardData, ITask, ITaskQuery } from "../@types/types";
import { useAppSelector } from "../redux/hooks";
import { useGetTasksQuery } from "../features/tasks/tasksEnpoints";
import { getOpenTask } from "../features/tasks/tasksSlice";
import useSelectedBoard from "./useSelectedBoard";

export default function useSelectedTask() {
  const selectedBoard = useSelectedBoard();
  const openTask = useAppSelector(getOpenTask);

  const selectTaskById = useMemo(() => {
    return createSelector(
      (res: any) => res.data,
      (res: any, taskId: string) => taskId,
      (data: ITaskQuery, taskId: string) => data?.entities[taskId]
    );
  }, []);

  const { task } = useGetTasksQuery(selectedBoard?.id, {
    selectFromResult: (result: any) => ({
      ...result,
      task: selectTaskById(result, openTask ?? ""),
    }),
  });

  return { task: task || {}, selectedBoard } as { task: ITask; selectedBoard: IBoardData };
}
