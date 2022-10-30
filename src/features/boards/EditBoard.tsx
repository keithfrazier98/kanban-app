import {
  Dispatch,
  MutableRefObject,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from "react";
import { X } from "tabler-icons-react";
import {
  IColumn,
  IColumnConstructor,
  IColumnEntities,
  IColumnPostBody,
} from "../../@types/types";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { ModalWBackdrop } from "../../components/ModalWBackdrop";
import { useUpdateColumnsMutation } from "../columns/columnsEndpoints";
import BoardModifier from "./BoardModifier";
import { editBoardModalOpened, getSelectedBoard } from "./boardsSlice";

export default function EditBoard() {
  const selectedBoard = useAppSelector(getSelectedBoard);
  const dispatch = useAppDispatch();

  const newColPrefix = "newCol";
  function handleAddColumn(
    columnsAmt: MutableRefObject<number>,
    setNewColumns: Dispatch<SetStateAction<IColumnEntities | undefined>>
  ) {
    //increment columnsAmt for proper id generation
    columnsAmt.current = columnsAmt.current + 1;

    if (selectedBoard)
      setNewColumns((prevState) => {
        // use a naming convention for the backend to generate new ids
        // (if its this convention => create new id)
        const newId = `${newColPrefix}-${columnsAmt.current}`;
        return {
          ...prevState,
          [newId]: {
            name: "",
            board: selectedBoard,
            id: newId,
            delete: false
          },
        };
      });
  }

  const [updateColumns] = useUpdateColumnsMutation();

  function handleSaveBoard(
    newColumns: IColumnEntities | undefined,
    boardName: string
  ) {
    if (!selectedBoard || !newColumns) return;
    const postBody: IColumnPostBody = {
      additions: [],
      deletions: [],
      updates: [],
      boardId: selectedBoard.id,
    };

    Object.values(newColumns).forEach((col) => {
      const id = col.id.split("-");
      if (id.includes(newColPrefix)) {
        const { id, ...rest } = col;
        postBody.additions.push(rest);
      } else if (col.delete) {
        postBody.deletions.push(col);
      } else {
        postBody.updates.push(col);
      }
    });

    console.log(postBody);

    updateColumns(postBody);

    if (selectedBoard?.name !== boardName) {
    }
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
        handleAddColumn={handleAddColumn}
        handleSaveBoard={handleSaveBoard}
      />
    </ModalWBackdrop>
  );
}
