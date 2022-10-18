import { useState } from "react";
import OutsideClickHandler from "react-outside-click-handler";
import { X } from "tabler-icons-react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { ModalWBackdrop } from "../../components/ModalWBackdrop";
import { useGetColumnsQuery } from "../columns/columnsEndpoints";
import { editBoardModalOpened, getSelectedBoard } from "./boardsSlice";

function ColumnInput({ name }: { name: string }) {
  const [input, setInput] = useState<string>(name);

  return (
    <div className="flex items-center">
      <label className="sr-only">Column {name} input</label>
      <input
        type="text"
        value={input}
        className="flex-1 border rounded-sm"
        onChange={(e) => {
          setInput(e.target.value);
        }}
      />
      <button className="w-6 h-6 text-gray-400" onClick={() => {}}>
        <X />
      </button>
    </div>
  );
}

export default function EditBoard() {
  const selectedBoard = useAppSelector(getSelectedBoard);
  const dispatch = useAppDispatch();
  const [boardName, setBoardName] = useState<string>(selectedBoard?.name || "");
  const { data: columns } = useGetColumnsQuery(selectedBoard?.id);

  return (
    <ModalWBackdrop
      onOutsideClick={() => {
        dispatch(editBoardModalOpened({ open: false }));
      }}
    >
      <h2 className="mb-6">Edit Board</h2>
      <label className="mb-2">Board Name</label>
      <input
        className="w-full mb-6 border rounded-sm"
        value={boardName}
        type="text"
        onChange={(e) => {
          setBoardName(e.target.value);
        }}
      />

      {/**Wrap this in a fragment to avoid TS error */}
      <>
        {columns?.entities ? (
          Object.values(columns.entities)?.map((column, index) => (
            <ColumnInput
              name={column?.name || ""}
              key={`column-input-${index}`}
            />
          ))
        ) : (
          <></>
        )}
      </>
    </ModalWBackdrop>
  );
}
