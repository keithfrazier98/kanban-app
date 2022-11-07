import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { ModalWBackdrop } from "../../components/ModalWBackdrop";
import BoardModifier from "./BoardModifier";
import { editBoardModalOpened, getSelectedBoard } from "./boardsSlice";

export default function EditBoard() {
  const selectedBoard = useAppSelector(getSelectedBoard);
  const dispatch = useAppDispatch();

  return (
    <ModalWBackdrop
      onOutsideClick={() => {
        dispatch(editBoardModalOpened({ open: false }));
      }}
    >
      <BoardModifier
        titles={["Edit Board", "Board Name", "Board Columns", "Save Changes"]}
        selectedBoard={selectedBoard}
        type="edit"
      />
    </ModalWBackdrop>
  );
}
