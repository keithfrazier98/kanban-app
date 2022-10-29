import {
  Dispatch,
  MutableRefObject,
  SetStateAction,
  useRef,
  useState,
} from "react";
import { X } from "tabler-icons-react";
import { IBoardData, IColumn, IColumnEntities } from "../../@types/types";
import { useDeleteColumnMutation } from "../columns/columnsEndpoints";

function ColumnInput({
  column,
  setNewColumns,
  columnAmt,
}: {
  column: IColumn;
  setNewColumns: Dispatch<SetStateAction<IColumnEntities | undefined>>;
  columnAmt: MutableRefObject<number | null>;
}) {
  const [deleteColumn] = useDeleteColumnMutation();
  return (
    <div className="flex items-center my-3">
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
              let newState: IColumnEntities = {};

              //decrement the columnAmt ref for proper id generation
              columnAmt.current =
                columnAmt.current === null ? null : columnAmt.current - 1;

              // avoid using the "delete" keyword to avoid browser deoptimization
              if (prevState) {
                //filter keys and remove this col, return new state
                const prevStateKeys = Object.keys(prevState);
                const newKeys = prevStateKeys.filter(
                  (key) => key !== column.id
                );

                newKeys.forEach((key) => {
                  newState[key] = prevState[key];
                });
              }

              // delete column in the in the DB
              deleteColumn(column.id);
              return newState;
            });
          }}
        >
          <X />
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
  handleAddColumn: () => void;
  handleSaveBoard: () => void;
}) {
  const [modalTitle, nameTitle, columnTitle, saveText] = titles;
  const [newColumns, setNewColumns] = useState<IColumnEntities>();
  const columnsAmt = useRef<null | number>(null);
  const [boardName, setBoardName] = useState<string>(selectedBoard?.name || "");

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
