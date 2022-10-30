import { useAppDispatch } from "../../app/hooks";
import { ModalWBackdrop } from "../../components/ModalWBackdrop";
import BoardModifier from "./BoardModifier";
import { addBoardModalOpened } from "./boardsSlice";

export default function AddBoard() {
  const dispatch = useAppDispatch();

  return (
    <ModalWBackdrop
      onOutsideClick={() => {
        dispatch(addBoardModalOpened({ open: false }));
      }}
    >
      <BoardModifier
        titles={["Add Board", "Name", "Columns", "Add New Board"]}
        selectedBoard={{ name: "New Board", id: "newBoard" }}
        handleAddColumn={() => {}}
        handleSaveBoard={() => {}}
      />
    </ModalWBackdrop>
  );
}
