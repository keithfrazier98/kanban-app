import { useCallback, useEffect, useRef, useState } from "react";
import {
  IBoardData,
  IColumnPostBody,
  IColumn,
  IColumnEntities,
} from "../../@types/types";
import {
  useGetColumnsQuery,
  useUpdateColumnsMutation,
} from "../columns/columnsEndpoints";
import { uniqueId } from "lodash";
import ColumnInput from "../columns/ColumnInput";
import { useCreateBoardMutation } from "./boardsEndpoints";
import { classNames } from "../../utils/utils";
import { useAppDispatch } from "src/redux/hooks";
import { editBoardModalOpened } from "./boardsSlice";

export default function BoardModifier({
  titles,
  selectedBoard,
  type,
}: {
  titles: string[];
  selectedBoard: IBoardData | null;
  type: "add" | "edit";
}) {
  const [modalTitle, nameTitle, columnTitle, saveText] = titles;
  const [newColumns, setNewColumns] = useState<IColumnEntities>({});
  const columnsAmt = useRef<number>(0);
  const [boardName, setBoardName] = useState<string>(selectedBoard?.name || "");
  const { data: columns } = useGetColumnsQuery(selectedBoard?.id);
  const [updateColumns] = useUpdateColumnsMutation();
  const [createBoard] = useCreateBoardMutation();
  const dispatch = useAppDispatch();

  const formatNewCol = useCallback(
    (name: string, id: string): IColumn => {
      if (!newColumns)
        throw new Error("newColumns must be defined to create a new column");
      return {
        name,
        id,
        board: "",
        operation: "create",
        tasks: [],
      };
    },
    [newColumns]
  );

  function handleSaveBoard() {
    if (!selectedBoard || !newColumns) return;

    dispatch(editBoardModalOpened({ open: false }));

    const postBody: IColumnPostBody = {
      additions: [],
      deletions: [],
      updates: [],
      boardId: selectedBoard.id,
      newName: null,
    };

    if (selectedBoard.id === "newBoard" || selectedBoard.name !== boardName)
      postBody.newName = boardName;

    Object.values(newColumns).forEach((col) => {
      const { operation, ...dbFields } = col;
      switch (operation) {
        case "create":
          const { id, ...rest } = dbFields;
          postBody.additions.push(rest);
          break;
        case "update":
          postBody.updates.push(dbFields);
          break;
        case "delete":
          postBody.deletions.push(dbFields);
          break;
        case undefined:
          break;
        default:
          throw new Error(
            `Column has an invalid operation type: ${col.operation}`
          );
      }
    });

    type === "edit" ? updateColumns(postBody) : createBoard(postBody);
  }

  function handleAddColumn() {
    if (selectedBoard)
      setNewColumns((prevState) => {
        const randomId = uniqueId("z");
        return {
          ...prevState,
          [randomId]: {
            name: "",
            board: selectedBoard.id,
            id: randomId,
            operation: "create",
            tasks: [],
          },
        };
      });
  }

  useEffect(() => {
    if (selectedBoard?.id === "newBoard") {
      setNewColumns({
        "newCol-1": formatNewCol("Todo", "newCol-1"),
        "newCol-2": formatNewCol("Doing", "newCol-2"),
      });
    } else if (columns && !Number.isNaN(columnsAmt.current)) {
      columnsAmt.current = columns.ids.length;
      setNewColumns(columns.entities);
    }
  }, [selectedBoard?.id]);

  const mappedColumnInputs = (
    <>
      {/**Wrap this in a fragment to avoid TS error */}
      {newColumns ? (
        Object.values(newColumns)?.map((column, index) =>
          column ? (
            <ColumnInput
              column={column}
              setNewColumns={setNewColumns}
              key={`column-input-${index}`}
            />
          ) : (
            <></>
          )
        )
      ) : (
        <></>
      )}
    </>
  );

  return (
    <div className="px-2">
      <h2 className="mb-3 font-semibold dark:text-gray-300">{modalTitle}</h2>
      <label className="mb-2 text-xs font-medium text-gray-500 dark:text-gray-300">
        {nameTitle}
      </label>
      <input
        data-testid="board_name_input"
        className={classNames(
          "w-full text-sm dark:bg-primary-gray-700",
          "dark:border-primary-gray-600 dark:text-gray-300",
          "mb-6 py-2 px-3 border rounded"
        )}
        value={boardName}
        type="text"
        onChange={(e) => {
          setBoardName(e.target.value);
        }}
      />
      <h3 className="text-xs font-medium text-gray-500 dark:text-gray-300">
        {columnTitle}
      </h3>
      {mappedColumnInputs}
      <button
        onClick={handleAddColumn}
        className="w-full py-2 border bg-primary-gray-300 text-primary-indigo-active rounded-full text-xs mb-2"
      >
        + Add New Column
      </button>
      <button
        onClick={handleSaveBoard}
        className="w-full py-2 bg-primary-indigo-active text-white rounded-full text-xs my-2"
      >
        {saveText}
      </button>
    </div>
  );
}
