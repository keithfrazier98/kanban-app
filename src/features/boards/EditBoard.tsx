import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { X } from "tabler-icons-react";
import { IBoardColumn, IColumnEntities } from "../../@types/types";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { ModalWBackdrop } from "../../components/ModalWBackdrop";
import { useGetColumnsQuery } from "../columns/columnsEndpoints";
import { editBoardModalOpened, getSelectedBoard } from "./boardsSlice";

function ColumnInput({
  column,
  setNewColumns,
}: {
  column: IBoardColumn;
  setNewColumns: Dispatch<SetStateAction<IColumnEntities | undefined>>;
}) {
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
          onClick={() => {}}
        >
          <X />
        </button>
      </div>
    </div>
  );
}

export default function EditBoard() {
  const selectedBoard = useAppSelector(getSelectedBoard);
  const dispatch = useAppDispatch();
  const [boardName, setBoardName] = useState<string>(selectedBoard?.name || "");
  const { data: columns } = useGetColumnsQuery(selectedBoard?.id);

  const [newColumns, setNewColumns] = useState<IColumnEntities>();

  useEffect(() => {
    if (columns) {
      setNewColumns(columns.entities);
    }
  }, [columns]);

  return (
    <ModalWBackdrop
      onOutsideClick={() => {
        dispatch(editBoardModalOpened({ open: false }));
      }}
    >
      <div className="px-2">
        <h2 className="mb-3 font-semibold">Edit Board</h2>
        <label className="mb-2 text-xs font-medium text-gray-500">
          Board Name
        </label>
        <input
          className="w-full text-sm  mb-6 py-2 px-3 border rounded"
          value={boardName}
          type="text"
          onChange={(e) => {
            setBoardName(e.target.value);
          }}
        />
        <h3 className="text-xs font-medium text-gray-500">Board Columns</h3>
        {/**Wrap this in a fragment to avoid TS error */}
        <>
          {newColumns?  (
            Object.values(newColumns)?.map((column, index) => (
              <ColumnInput
                column={column as IBoardColumn}
                setNewColumns={setNewColumns}
                key={`column-input-${index}`}
              />
            ))
          ) : (
            <></>
          )}
        </>{" "}
        <button className="w-full py-2 border bg-primary-gray-300 text-primary-indigo-active rounded-full text-xs mb-2">
          + Add New Column
        </button>
        <button className="w-full py-2 bg-primary-indigo-active text-white rounded-full text-xs my-2">
          Save Changes
        </button>
      </div>
    </ModalWBackdrop>
  );
}
