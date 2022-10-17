import { useState } from "react";
import { X } from "tabler-icons-react";
import { useAppSelector } from "../../app/hooks";
import { ModalWBackdrop } from "../../components/ModalWBackdrop";
import { selectAllColumns } from "../columns/columnsSlice";
import { getSelectedBoard } from "./boardsSlice";

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
      <button className="w-6 h-6 text-gray-400" onClick={()=>{}}>
        <X />
      </button>
    </div>
  );
}

export default function EditBoard() {
  const selectedBoard = useAppSelector(getSelectedBoard);
  const [boardName, setBoardName] = useState<string>(selectedBoard?.name || "");
  const columns = useAppSelector(selectAllColumns);

  return (
    <ModalWBackdrop>
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
      <>
        {columns?.map(({ name }, index) => (
          <ColumnInput name={name} key={`column-input-${index}`} />
        ))}
      </>
    </ModalWBackdrop>
  );
}
