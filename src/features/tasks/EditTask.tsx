import { useState } from "react";
import { ITask, ITaskConstructor } from "../../@types/types";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { ModalWBackdrop } from "../../components/ModalWBackdrop";
import useSelectedTask from "../../hooks/useSelectedTask";
import useTransitionState from "../../hooks/useTransitionState";
import { useGetSubtasksQuery } from "../subtasks/subtasksEndpoints";
import TaskModifier from "./TaskModifier";
import { useUpdateTaskMutation } from "./tasksEnpoints";
import {
  editTaskModalOpened,
  selectTaskSlice,
  taskSelected,
} from "./tasksSlice";

export default function EditTask() {
  const dispatch = useAppDispatch();

  const { task } = useSelectedTask();
  const [newTask, setNewTask] = useState<ITaskConstructor>(task);

  const [updateTask] = useUpdateTaskMutation();

  const [render, unRender] = useTransitionState(() => {
    dispatch(taskSelected({ taskId: null }));
    dispatch(editTaskModalOpened({ open: false }));
  });
  return (
    <ModalWBackdrop render={render} onOutsideClick={unRender}>
      <TaskModifier
        elementTitles={["Edit Task", "Save Task"]}
        task={newTask}
        setTask={setNewTask}
        onSubmit={() => updateTask(newTask)}
      />
    </ModalWBackdrop>
  );
}
