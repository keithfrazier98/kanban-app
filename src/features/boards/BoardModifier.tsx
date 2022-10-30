import {
  Dispatch,
  MutableRefObject,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from "react";
import { ArrowBack, ArrowDownLeftCircle, X } from "tabler-icons-react";
import { IBoardData, IColumn, IColumnEntities } from "../../@types/types";
import { useGetColumnsQuery } from "../columns/columnsEndpoints";

function ColumnInput({
  column,
  setNewColumns,
  columnAmt,
}: {
  column: IColumn;
  setNewColumns: Dispatch<SetStateAction<IColumnEntities | undefined>>;
  columnAmt: MutableRefObject<number>;
}) {
  return (
    <div className="relative flex items-center my-3">
      {column.delete ? (
        <div className="absolute h-[1px] bg-primary-red-active -left-1 right-7" />
      ) : (
        <></>
      )}

      <label className="sr-only">Column {column.name} input</label>
      <input
        type="text"
        value={column.name}
        className="flex-1 text-sm border rounded px-3 py-2"
        onChange={(e) => {
          console.log(e.target.value);
          setNewColumns((prevState) => ({
            ...prevState,
            [column.id]: { ...column, name: e.target.value },
          }));
        }}
      />
      <div className="pl-2">
        <button
          className="text-gray-400 w-6 h-6 flex justify-center "
          onClick={() => {
            setNewColumns((prevState) => {
              //update to the columnAmt ref for proper id generation
              columnAmt.current = column.delete
                ? columnAmt.current + 1
                : columnAmt.current - 1;

              return {
                ...prevState,
                [column.id]: { ...column, delete: !column.delete },
              };
            });
          }}
        >
          {column.delete ? <ArrowBack /> : <X />}
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
    columnsAmt: MutableRefObject<number>,
    setNewColumns: Dispatch<SetStateAction<IColumnEntities | undefined>>
  ) => void;
  handleSaveBoard: (
    newColumns: IColumnEntities | undefined,
    boardName: string
  ) => void;
}) {
  const [modalTitle, nameTitle, columnTitle, saveText] = titles;
  const [newColumns, setNewColumns] = useState<IColumnEntities>();
  const columnsAmt = useRef<number>(0);
  const [boardName, setBoardName] = useState<string>(selectedBoard?.name || "");
  const { data: columns, isSuccess } = useGetColumnsQuery(selectedBoard?.id);

  const formatNewCol = (name: string, id: string) => ({
    name,
    id,
    board: {} as any,
    delete: false,
  });

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
              columnAmt={columnsAmt}
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
        onClick={() => handleAddColumn(columnsAmt, setNewColumns)}
        className="w-full py-2 border bg-primary-gray-300 text-primary-indigo-active rounded-full text-xs mb-2"
      >
        + Add New Column
      </button>
      <button
        onClick={() => handleSaveBoard(newColumns, boardName)}
        className="w-full py-2 bg-primary-indigo-active text-white rounded-full text-xs my-2"
      >
        {saveText}
      </button>
    </div>
  );
}
