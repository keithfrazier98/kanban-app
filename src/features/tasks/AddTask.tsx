import { useMemo, useState } from "react";
import { ITaskConstructor } from "../../@types/types";
import { useAppDispatch } from "../../redux/hooks";
import { ModalWBackdrop } from "../../components/ModalWBackdrop";
import useSelectedBoard from "../../hooks/useSelectedBoard";
import useTransitionState from "../../hooks/useTransitionState";
import { useGetColumnsQuery } from "../columns/columnsEndpoints";
import TaskModifier from "./TaskModifier";
import { useCreateTaskMutation } from "./tasksEnpoints";
import { addTaskModalOpened } from "./tasksSlice";

export default function AddTask() {
  const dispatch = useAppDispatch();
  const selectedBoard = useSelectedBoard();
  const { data: columns } = useGetColumnsQuery(selectedBoard?.id);
  const initialCol = useMemo(
    () => columns?.entities[columns.ids[0]],
    [columns]
  );

  // An exception could be thrown here that will show an error on the UI if there is no board or column
  const [task, setTask] = useState<ITaskConstructor>({
    subtasks: ["", ""],
    board: selectedBoard?.id || "",
    column: initialCol?.id || "",
    completedSubtasks: 0,
    description: "",
    title: "",
    id: "",
  });

  const [createTask] = useCreateTaskMutation();
  const [render, unRender] = useTransitionState(() => {
    dispatch(addTaskModalOpened({ open: false }));
  });

  return (
    <ModalWBackdrop
      render={render}
      onOutsideClick={unRender}
      testid="add_task_modal"
    >
      <TaskModifier
        elementTitles={["Add New Task", "Create Task"]}
        task={task}
        setTask={setTask}
        onSubmit={() => createTask(task)}
      />
    </ModalWBackdrop>
  );
}
