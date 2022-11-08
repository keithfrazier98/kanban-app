import { useMemo, useState } from "react";
import { IBoardData, IColumn, ITaskConstructor } from "../../@types/types";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { ModalWBackdrop } from "../../components/ModalWBackdrop";
import { getSelectedBoard } from "../boards/boardsSlice";
import { useGetColumnsQuery } from "../columns/columnsEndpoints";
import TaskModifier from "./TaskModifier";
import { useCreateTaskMutation, useGetTasksQuery } from "./tasksEnpoints";
import { addTaskModalOpened } from "./tasksSlice";

export default function AddTask() {
  const dispatch = useAppDispatch();
  const selectedBoard = useAppSelector(getSelectedBoard);
  const { data: columns } = useGetColumnsQuery(selectedBoard?.id);
  const { data: tasks } = useGetTasksQuery(selectedBoard?.id);
  const initialCol = useMemo(
    () => columns?.entities[columns.ids[0]],
    [columns]
  );

  // An exception could be thrown here that will show an error on the UI if there is no board or column
  const [task, setTask] = useState<ITaskConstructor>({
    subtasks: ["", ""],
    status: initialCol?.name || "",
    board: selectedBoard || ({} as IBoardData),
    column: initialCol || ({} as IColumn),
    completedSubtasks: 0,
    totalSubtasks: 2,
    description: "",
    title: "",
    id: "",
    index: tasks?.ids.length || 0,
  });

  const [createTask] = useCreateTaskMutation();

  return (
    <ModalWBackdrop
      onOutsideClick={() => {
        dispatch(addTaskModalOpened({ open: false }));
      }}
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
