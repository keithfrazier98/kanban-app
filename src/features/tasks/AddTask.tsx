import { useAppDispatch } from "../../app/hooks";
import { ModalWBackdrop } from "../../components/ModalWBackdrop";
import { addTaskModalOpened } from "./tasksSlice";

export default function AddTask() {
  const dispatch = useAppDispatch();
  return (
    <ModalWBackdrop
      onOutsideClick={() => {
        dispatch(addTaskModalOpened({ open: false }));
      }}
    >
      <></>
    </ModalWBackdrop>
  );
}
