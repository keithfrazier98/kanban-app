import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { ModalWBackdrop } from "../../components/ModalWBackdrop";
import { selectTaskSlice } from "../tasks/tasksSlice";
import BoardModifier from "./BoardModifier";
import { addBoardModalOpened } from "./boardsSlice";

export default function AddBoard() {
  const dispatch = useAppDispatch();
  const { openAddTaskModal } = useAppSelector(selectTaskSlice);

  return (
    <ModalWBackdrop
      render={openAddTaskModal}
      onOutsideClick={() => {
        dispatch(addBoardModalOpened({ open: false }));
      }}
    >
      <BoardModifier
        titles={["Add Board", "Name", "Columns", "Add New Board"]}
        selectedBoard={{ name: "New Board", id: "newBoard" }}
        type="add"
      />
    </ModalWBackdrop>
  );
}
