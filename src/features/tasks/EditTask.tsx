import { useState } from "react";
import { ITaskConstructor } from "../../@types/types";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { ModalWBackdrop } from "../../components/ModalWBackdrop";
import useSelectedTask from "../../hooks/useSelectedTask";
import { useGetSubtasksQuery } from "../subtasks/subtasksEndpoints";
import TaskModifier from "./TaskModifier";
import { editTaskModalOpened, getOpenTask, taskSelected } from "./tasksSlice";

export default function EditTask() {
  const dispatch = useAppDispatch();

  const task = useSelectedTask();
  const { data: subtasks } = useGetSubtasksQuery(task.id);
  const [newTask, setNewTask] = useState<ITaskConstructor>({
    ...task,
    subtasks: Object.values(subtasks?.entities || []).map(
      (task) => task?.title
    ),
  });

  return (
    <ModalWBackdrop
      onOutsideClick={() => {
        dispatch(taskSelected({ taskId: null }));
        dispatch(editTaskModalOpened({ open: false }));
      }}
    >
      <TaskModifier
        elementTitles={["Edit Task", "Save Task"]}
        task={newTask}
        setTask={setNewTask}
        onSubmit={() => {}}
      />
    </ModalWBackdrop>
  );
}
