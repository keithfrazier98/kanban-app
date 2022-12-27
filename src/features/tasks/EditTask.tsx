import { useState } from "react";
import { ITaskConstructor } from "../../@types/types";
import { useAppDispatch } from "../../redux/hooks";
import { ModalWBackdrop } from "../../components/ModalWBackdrop";
import useSelectedTask from "../../hooks/useSelectedTask";
import useTransitionState from "../../hooks/useTransitionState";
import TaskModifier from "./TaskModifier";
import { useUpdateTaskMutation } from "./tasksEnpoints";
import { editTaskModalOpened, taskSelected } from "./tasksSlice";

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
    <ModalWBackdrop
      render={render}
      onOutsideClick={unRender}
      testid="edit_task_modal"
    >
      <TaskModifier
        elementTitles={["Edit Task", "Save Task"]}
        task={newTask}
        setTask={setNewTask}
        onSubmit={() => {
          updateTask(newTask);
          unRender();
        }}
      />
    </ModalWBackdrop>
  );
}
