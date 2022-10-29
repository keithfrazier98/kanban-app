import {
  Dispatch,
  MutableRefObject,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from "react";
import { X } from "tabler-icons-react";
import { IColumn, IColumnEntities, IColumnPostBody } from "../../@types/types";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { ModalWBackdrop } from "../../components/ModalWBackdrop";
import {
  useDeleteColumnMutation,
  useGetColumnsQuery,
  useUpdateColumnsMutation,
} from "../columns/columnsEndpoints";
import BoardModifier from "./BoardModifier";
import { editBoardModalOpened, getSelectedBoard } from "./boardsSlice";

export default function EditBoard() {
  const selectedBoard = useAppSelector(getSelectedBoard);
  const dispatch = useAppDispatch();
  const [boardName, setBoardName] = useState<string>(selectedBoard?.name || "");
  const { data: columns } = useGetColumnsQuery(selectedBoard?.id);

  const [newColumns, setNewColumns] = useState<IColumnEntities>();
  const columnsAmt = useRef<null | number>(null);

  useEffect(() => {
    if (columns && !Number.isNaN(columnsAmt.current)) {
      columnsAmt.current = columns.ids.length;
      setNewColumns(columns.entities);
    }
  }, [columns]);

  const newColPrefix = "newCol";
  function handleAddColumn() {
    //increment columnsAmt for proper id generation
    columnsAmt.current =
      columnsAmt.current === null ? 1 : columnsAmt.current + 1;

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
          },
        };
      });
  }

  const [updateColumns] = useUpdateColumnsMutation();

  function handleSaveBoard() {
    if (!selectedBoard || !newColumns) return;
    const postBody: IColumnPostBody = {
      additions: [],
      updates: [],
      boardId: selectedBoard.id,
    };

    Object.values(newColumns).forEach((col) => {
      const id = col.id.split("-");
      if (id.includes(newColPrefix)) {
        const { id, ...rest } = col;
        postBody.additions.push(rest);
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
        titles={["Edit Board", "Board Name", "BoardColumns", "Save Changes"]}
        selectedBoard={selectedBoard}
        handleAddColumn={handleAddColumn}
        handleSaveBoard={handleSaveBoard}
      />
    </ModalWBackdrop>
  );
}
