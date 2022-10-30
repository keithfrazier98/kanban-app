import { IColumnEntities, IColumnPostBody } from "../../@types/types";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { ModalWBackdrop } from "../../components/ModalWBackdrop";
import { useUpdateColumnsMutation } from "../columns/columnsEndpoints";
import BoardModifier from "./BoardModifier";
import { editBoardModalOpened, getSelectedBoard } from "./boardsSlice";


export default function EditBoard() {
  const selectedBoard = useAppSelector(getSelectedBoard);
  const dispatch = useAppDispatch();

  

  const [updateColumns] = useUpdateColumnsMutation();

  function handleSaveBoard(
    newColumns: IColumnEntities,
    boardName: string | null
  ) {
    if (!selectedBoard || !newColumns) return;
    const postBody: IColumnPostBody = {
      additions: [],
      deletions: [],
      updates: [],
      boardId: selectedBoard.id,
      newName: boardName,
    };

    Object.values(newColumns).forEach((col) => {
      switch (col.operation) {
        case "create":
          const { id, ...rest } = col;
          postBody.additions.push(rest);
          break;
        case "update":
          postBody.updates.push(col);
          break;
        case "delete":
          postBody.deletions.push(col);
          break;
        case undefined:
          break;
        default:
          throw new Error(
            `Column has an invalid operation type: ${col.operation}`
          );
      }
    });

    updateColumns(postBody);
  }

  return (
    <ModalWBackdrop
      onOutsideClick={() => {
        dispatch(editBoardModalOpened({ open: false }));
      }}
    >
      <BoardModifier
        titles={["Edit Board", "Board Name", "Board Columns", "Save Changes"]}
        selectedBoard={selectedBoard}
        handleSaveBoard={handleSaveBoard}
      />
    </ModalWBackdrop>
  );
}
