import { useAppDispatch } from "../../app/hooks";
import { ModalWBackdrop } from "../../components/ModalWBackdrop";
import { addBoardModalOpened } from "./boardsSlice";

export default function AddBoard() {
  const dispatch = useAppDispatch();

  return (
    <ModalWBackdrop
      onOutsideClick={() => {
        dispatch(addBoardModalOpened({ open: false }));
      }}
    >

    </ModalWBackdrop>
  );
}
