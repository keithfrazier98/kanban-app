import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { useUpdateTaskMutation } from "./tasksEnpoints";
import { getOpenTask, selectTaskSlice, taskSelected } from "./tasksSlice";
import { ModalWBackdrop } from "../../components/ModalWBackdrop";
import { useMemo } from "react";
import Subtask from "../subtasks/Subtask";
import DropdownList from "../../components/DropdownList";
import { useGetColumnsQuery } from "../columns/columnsEndpoints";
import { getSelectedBoard } from "../boards/boardsSlice";
import { useGetSubtasksQuery } from "../subtasks/subtasksEndpoints";
import { ISubtask } from "../../@types/types";
import TaskOptions from "./TaskOptions";
import useSelectedTask from "../../hooks/useSelectedTask";
import useColumnNames from "../../hooks/useColumnNames";
import useTransitionState from "../../hooks/useTransitionState";

export default function ViewTask() {
  const { openEditTaskModal: editTask, openDeleteTaskModal: deleteTask } =
    useAppSelector(selectTaskSlice);

  const openTask = useAppSelector(getOpenTask);

  const task = useSelectedTask();

  const [updateTask] = useUpdateTaskMutation();

  const dispatch = useAppDispatch();

  const [render, unRender] = useTransitionState(() => {
    dispatch(taskSelected({ taskId: null }));
  });

  const { data: subtasks } = useGetSubtasksQuery(openTask);

  const { columnNames, columns } = useColumnNames();
  if (!!task) {
    const { description, status, title, completedSubtasks, totalSubtasks } =
      task;

    return (
      <ModalWBackdrop render={render} onOutsideClick={unRender}>
        <div className="flex justify-between items-center w-full">
          <h3 className="font-bold text-lg md:text-base leading-6 dark:text-white">
            {title}
          </h3>
          <TaskOptions />
        </div>
        <p className="text-sm mt-7 text-gray-500 leading-6">{description}</p>
        <p className="text-xs font-bold mt-6 mb-4 text-gray-500 dark:text-white">
          Subtasks {`(${completedSubtasks} of ${totalSubtasks})`}
        </p>
        <ul className="grid grid-flow-row gap-2">
          {subtasks ? (
            Object.values(subtasks.entities).map((subtask, id) => (
              <Subtask
                key={`subtask-${id}`}
                subtask={subtask || ({} as ISubtask)}
              />
            ))
          ) : (
            <></>
          )}
        </ul>
        <DropdownList
          items={columnNames}
          selected={columns?.entities[status].name || ""}
          label={"Current Status"}
          onChange={(status: string) => {
            updateTask({ ...task, status });
          }}
        />
      </ModalWBackdrop>
    );
  }

  return <></>;
}
