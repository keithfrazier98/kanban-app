import { useMemo, useState } from "react";
import { X } from "tabler-icons-react";
import { ITaskConstructor } from "../../@types/types";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import DropdownList from "../../components/DropdownList";
import { ModalWBackdrop } from "../../components/ModalWBackdrop";
import { getSelectedBoard } from "../boards/boardsSlice";
import { useGetColumnsQuery } from "../columns/columnsEndpoints";
import TaskModifier from "./TaskModifier";
import { addTaskModalOpened } from "./tasksSlice";

export default function AddTask() {
  const dispatch = useAppDispatch();
  const selectedBoard = useAppSelector(getSelectedBoard);
  const { data: columns } = useGetColumnsQuery(selectedBoard?.id);
  const [task, setTask] = useState<ITaskConstructor>({
    subtasks: ["", ""],
    title: "",
    description: "",
    id: "",
    status: columns?.entities[columns.ids[0]].name || "",
  });


  return (
    <ModalWBackdrop
      onOutsideClick={() => {
        dispatch(addTaskModalOpened({ open: false }));
      }}
    >
      <TaskModifier modalTitle="Add New Task" task={task} setTask={setTask} />
    </ModalWBackdrop>
  );
}
