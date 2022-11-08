import { createSelector } from "@reduxjs/toolkit";
import { useCallback, useEffect, useMemo, useState } from "react";
import { IColumn, ITask, ITaskQuery } from "../../@types/types";
import { useAppSelector } from "../../app/hooks";
import { getSelectedBoard } from "../boards/boardsSlice";
import {
  useGetTasksQuery,
  useUpdateTaskMutation,
} from "../tasks/tasksEnpoints";
import Task from "../tasks/Task";
import { useDrop } from "react-dnd";
import update from "immutability-helper";

export default function Column({ column }: { column: IColumn }) {
  const selectedBoard = useAppSelector(getSelectedBoard);

  const selectTasksForColumn = useMemo(() => {
    return createSelector(
      (res: any) => res.data,
      (res: any, columnId: string) => columnId,
      (data: ITaskQuery | undefined, columnId: string) => {
        const tasks: string[] = [];
        Object.values(data?.entities || {}).forEach((task) => {
          if (task.status === columnId) tasks.push(task.id);
        });

        return tasks;
      }
    );
  }, [selectedBoard?.id]);

  const { data: tasks, tasksForColumn } = useGetTasksQuery(selectedBoard?.id, {
    skip: !selectedBoard,
    selectFromResult: (result) => ({
      ...result,
      tasksForColumn: selectTasksForColumn(result, column.id),
    }),
  });

  const [{ canDrop, isOver }, drop] = useDrop(() => ({
    accept: "TASK",
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  }));

  const [tasksOrder, setTasksOrder] = useState(tasksForColumn);
  const moveTask = useCallback((dragIndex: number, hoverIndex: number) => {
    setTasksOrder((pre) =>
      update(pre, {
        $splice: [
          [dragIndex, 1],
          [hoverIndex, 0, pre[dragIndex]],
        ],
      })
    );
  }, []);

  useEffect(() => {
    if (tasksOrder.length !== tasksForColumn.length) {
      setTasksOrder(tasksForColumn);
    }
  }, [tasksForColumn]);

  return (
    <div className="my-6 max-h-full" id={`column-${column.id}`}>
      <div className="flex items-center mb-6 text-base text-gray-400 font-bold">
        <div className="rounded-full w-3 h-3 bg-primary-indigo-active"></div>
        <h2 className="mx-2 tracking-widest">{column.name.toUpperCase()}</h2>
        <p> {`( ${tasksForColumn.length} )`}</p>
      </div>
      <div className="overflow-y-scroll no-scrollbar max-h-full pb-12 w-72">
        <div
          ref={drop}
          role="column"
          className="grid grid-cols-1 grid-flow-row gap-5"
        >
          {tasksOrder.map((task: string, i: number) => (
            <Task
              moveTask={moveTask}
              key={`task-${task}`}
              task={tasks?.entities[task]}
              index={i}
            />
          ))}
          {tasksForColumn.length === 0 ? <Task placeholder={true} /> : <></>}
        </div>
      </div>
    </div>
  );
}
