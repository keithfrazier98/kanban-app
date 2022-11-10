import { useState } from "react";
import { ITask, ITaskConstructor } from "../../@types/types";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { ModalWBackdrop } from "../../components/ModalWBackdrop";
import useSelectedTask from "../../hooks/useSelectedTask";
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

  const task = useSelectedTask();
  const { data: subtasks } = useGetSubtasksQuery(task?.id);
  const [newTask, setNewTask] = useState<ITaskConstructor>({
    ...task,
    subtasks: Object.values(subtasks?.entities || [""]).map(
      (task) => task?.title
    ),
  });

  const [updateTask] = useUpdateTaskMutation();

  const { openEditTaskModal, openTask } = useAppSelector(selectTaskSlice);
  return (
    <ModalWBackdrop
      render={!!(openEditTaskModal && openTask)}
      onOutsideClick={() => {
        dispatch(taskSelected({ taskId: null }));
        dispatch(editTaskModalOpened({ open: false }));
      }}
    >
      <TaskModifier
        elementTitles={["Edit Task", "Save Task"]}
        task={newTask}
        setTask={setNewTask}
        onSubmit={() => updateTask(newTask)}
      />
    </ModalWBackdrop>
  );
}
