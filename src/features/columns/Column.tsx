import { createSelector } from "@reduxjs/toolkit";
import { useMemo } from "react";
import { IBoardColumn, IBoardTask, ITaskQuery } from "../../@types/types";
import { useAppSelector } from "../../app/hooks";
import { getSelectedBoard } from "../boards/boardsEndpoints";
import { useGetTasksQuery } from "../tasks/tasksEnpoints";
import Task from "../tasks/Task";

export default function Column({ column }: { column: IBoardColumn }) {
  // const tasks = useAppSelector(selectAllTasks);

  const selectedBoard = useAppSelector(getSelectedBoard);

  const selectTasksForColumn = useMemo(() => {
    const emptyArray: IBoardTask[] = [];

    return createSelector(
      (res: any) => res.data,
      (res: any, columnId: string) => columnId,
      (data: ITaskQuery | undefined, columnId: string) =>
        Object.values(data?.entities || {}).filter(
          (task) => task.column.id === columnId
        ) ?? emptyArray
    );
  }, []);

  const { tasksForColumn } = useGetTasksQuery(selectedBoard?.id, {
    skip: !selectedBoard,
    selectFromResult: (result) => ({
      ...result,
      tasksForColumn: selectTasksForColumn(result, column.id),
    }),
  });

  return (
    <div className="my-6 max-h-full">
      <div className="flex items-center mb-6 text-base text-gray-400 font-bold">
        <div className="rounded-full w-3 h-3 bg-primary-indigo-active"></div>
        <h2 className="mx-2 tracking-widest">{column.name.toUpperCase()}</h2>
        <p> {`( ${tasksForColumn.length} )`}</p>
      </div>
      <div className="overflow-y-scroll no-scrollbar max-h-full pb-12 w-72">
        <div className="grid grid-cols-1 grid-flow-row gap-5">
          {tasksForColumn.map((task: IBoardTask, i: number) => (
            <Task key={`task-${i}`} task={task} />
          ))}
        </div>
      </div>
    </div>
  );
}
