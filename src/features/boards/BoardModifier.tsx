import {
  ChangeEvent,
  Dispatch,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from "react";
import { ArrowBack, X } from "tabler-icons-react";
import {
  IBoardData,
  IColumn,
  IColumnEntities,
  opTypes,
} from "../../@types/types";
import { useAppSelector } from "../../app/hooks";
import { useGetColumnsQuery } from "../columns/columnsEndpoints";
import { getSelectedBoard } from "./boardsSlice";

function ColumnInput({
  column,
  setNewColumns,
}: {
  column: IColumn;
  setNewColumns: Dispatch<SetStateAction<IColumnEntities>>;
}) {
  const selectedBoard = useAppSelector(getSelectedBoard);
  const { data: columns } = useGetColumnsQuery(selectedBoard?.id);

  const getOpType = (val: string): opTypes => {
    if (!columns?.entities[column.id]) {
      return "create";
    }
    if (columns?.entities[column.id].name !== val) {
      return "update";
    } else {
      return undefined;
    }
  };

  const handleDelBtn = () => {
    setNewColumns((prevState) => {
      const { operation } = column;

      switch (operation) {
        case "delete":
          let operation: opTypes = getOpType(column.name);

          return {
            ...prevState,
            [column.id]: {
              ...column,
              operation,
            },
          };
        case "create":
          const keys = Object.keys(prevState || {});
          const newKeys = keys.filter((key) => key !== column.id);
          const newState: IColumnEntities = {};

          newKeys.forEach((key) => {
            newState[key] = prevState[key];
          });

          return newState;
        default:
          return {
            ...prevState,
            [column.id]: {
              ...column,
              operation: "delete",
            },
          };
      }
    });
  };

  const handleType = (e: ChangeEvent<HTMLInputElement>) => {
    const newVal = e.target.value;

    const operation = getOpType(newVal);

    setNewColumns((prevState) => ({
      ...prevState,
      [column.id]: {
        ...column,
        name: newVal,
        operation,
      },
    }));
  };

  return (
    <div className="relative flex items-center my-3">
      {column.operation === "delete" ? (
        <div className="absolute h-[1px] bg-primary-red-active -left-1 right-7" />
      ) : (
        <></>
      )}

      <label className="sr-only">Column {column.name} input</label>
      <input
        type="text"
        value={column.name}
        className="flex-1 text-sm border rounded px-3 py-2"
        onChange={handleType}
      />
      <div className="pl-2">
        <button
          className="text-gray-400 w-6 h-6 flex justify-center "
          onClick={handleDelBtn}
        >
          {column.operation === "delete" ? <ArrowBack /> : <X />}
        </button>
      </div>
    </div>
  );
}

export default function BoardModifier({
  titles,
  selectedBoard,
  handleAddColumn,
  handleSaveBoard,
}: {
  titles: string[];
  selectedBoard: IBoardData | null;
  handleAddColumn: (
    setNewColumns: Dispatch<SetStateAction<IColumnEntities>>
  ) => void;
  handleSaveBoard: (
    newColumns: IColumnEntities,
    boardName: string | null
  ) => void;
}) {
  const [modalTitle, nameTitle, columnTitle, saveText] = titles;
  const [newColumns, setNewColumns] = useState<IColumnEntities>({});
  const columnsAmt = useRef<number>(0);
  const [boardName, setBoardName] = useState<string>(selectedBoard?.name || "");
  const { data: columns, isSuccess } = useGetColumnsQuery(selectedBoard?.id);

  const formatNewCol = (name: string, id: string): IColumn => {
    if (!newColumns)
      throw new Error("newColumns must be defined to create a new column");
    return {
      name,
      id,
      board: {} as any,
      index: Object.keys(newColumns).length,
    };
  };

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
  }, [columns]);

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
      <h2 className="mb-3 font-semibold">{modalTitle}</h2>
      <label className="mb-2 text-xs font-medium text-gray-500">
        {nameTitle}
      </label>
      <input
        className="w-full text-sm  mb-6 py-2 px-3 border rounded"
        value={boardName}
        type="text"
        onChange={(e) => {
          setBoardName(e.target.value);
        }}
      />
      <h3 className="text-xs font-medium text-gray-500">{columnTitle}</h3>
      {mappedColumnInputs}
      <button
        onClick={() => handleAddColumn(setNewColumns)}
        className="w-full py-2 border bg-primary-gray-300 text-primary-indigo-active rounded-full text-xs mb-2"
      >
        + Add New Column
      </button>
      <button
        onClick={() =>
          handleSaveBoard(
            newColumns,
            selectedBoard?.name === boardName ? null : boardName
          )
        }
        className="w-full py-2 bg-primary-indigo-active text-white rounded-full text-xs my-2"
      >
        {saveText}
      </button>
    </div>
  );
}
