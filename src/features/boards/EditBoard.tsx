import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { ModalWBackdrop } from "../../components/ModalWBackdrop";
import useTransitionState from "../../hooks/useTransitionState";
import { selectTaskSlice } from "../tasks/tasksSlice";
import BoardModifier from "./BoardModifier";
import { editBoardModalOpened, getSelectedBoard } from "./boardsSlice";

export default function EditBoard() {
  const selectedBoard = useAppSelector(getSelectedBoard);
  const dispatch = useAppDispatch();

  const [render, unRender] = useTransitionState(() =>
    dispatch(editBoardModalOpened({ open: false }))
  );

  return (
    <ModalWBackdrop render={render} onOutsideClick={unRender}>
      <BoardModifier
        titles={["Edit Board", "Board Name", "Board Columns", "Save Changes"]}
        selectedBoard={selectedBoard}
        type="edit"
      />
    </ModalWBackdrop>
  );
}
