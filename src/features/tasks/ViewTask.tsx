import OutsideClickHandler from "react-outside-click-handler";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import {
  getOpenTask,
  taskSelected,
  selectTaskById,
  taskUpdated,
  useGetTasksQuery,
} from "./tasksSlice";

import { ModalWBackdrop } from "../../components/ModalWBackdrop";
import { DotsVertical } from "tabler-icons-react";
import { useEffect, useMemo } from "react";

import Subtask from "../subtasks/Subtask";
import DropdownList from "../../components/DropdownList";
import { useGetColumnsQuery } from "../columns/columnsSlice";
import { getSelectedBoard } from "../boards/boardsSlice";
import { useGetSubtaskQuery } from "../subtasks/subtasksSlice";
import { IBoardSubTask, IBoardTask } from "../../@types/types";
import { createSelector } from "@reduxjs/toolkit";

export default function ViewTask() {
  const openTask = useAppSelector(getOpenTask);
  const selectedBoard = useAppSelector(getSelectedBoard);

  const selectTaskById = useMemo(() => {
    return createSelector(
      (res: any) => res.data,
      (res: any, taskId: string) => taskId,
      (data: IBoardTask[], taskId: string) =>
        data.find((task) => task.id === openTask)
    );
  }, []);

  const { task } = useGetTasksQuery(selectedBoard?.id, {
    selectFromResult: (result: any) => ({
      ...result,
      task: selectTaskById(result, openTask ?? ""),
    }),
  });

  const dispatch = useAppDispatch();

  const { data: subtasks } = useGetSubtaskQuery(openTask);
  const { data: columns } = useGetColumnsQuery(selectedBoard?.id);
  
  const columnNames = columns?.ids ?? [];

  if (!!task) {
    const { description, status, title, completedSubtasks, totalSubtasks } =
      task;

    return (
      <ModalWBackdrop>
        <OutsideClickHandler
          onOutsideClick={() => {
            dispatch(taskSelected({ taskId: null }));
          }}
        >
          <div className="flex justify-between items-center w-full">
            <h3 className="font-bold text-lg md:text-base leading-6">
              {title}
            </h3>
            <div>
              <DotsVertical className="text-gray-400 ml-3" size={28} />
            </div>
          </div>
          <p className="text-sm mt-7 text-gray-500 leading-7">{description}</p>
          <p className="text-xs font-bold mt-6 mb-4 text-gray-500">
            Subtasks {`(${completedSubtasks} of ${totalSubtasks})`}
          </p>{" "}
          <ul className="grid grid-flow-row gap-2">
            {subtasks ? (
              Object.values(subtasks.entities).map((subtask, id) => (
                <Subtask
                  key={`subtask-${id}`}
                  subtask={subtask || ({} as IBoardSubTask)}
                />
              ))
            ) : (
              <></>
            )}
          </ul>
          <DropdownList
            items={columnNames}
            selected={status}
            label={"Current Status"}
            onChange={(status: string) => {
              console.log(status);
              dispatch(taskUpdated({ task: { ...task, status } }));
            }}
          />
        </OutsideClickHandler>
      </ModalWBackdrop>
    );
  }

  return <></>;
}
