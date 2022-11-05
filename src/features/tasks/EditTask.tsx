import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { ModalWBackdrop } from "../../components/ModalWBackdrop";
import useSelectedTask from "../../hooks/useSelectedTask";
import { editTaskModalOpened, getOpenTask, taskSelected } from "./tasksSlice";

export default function EditTask() {
  const dispatch = useAppDispatch();

  const task = useSelectedTask();


  return (
    <ModalWBackdrop
      onOutsideClick={() => {
        dispatch(taskSelected({ taskId: null }));
        dispatch(editTaskModalOpened({ open: false }));
      }}
    >
      <>{task.title}</>
    </ModalWBackdrop>
  );
}
