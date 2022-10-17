import { LayoutBoardSplit } from "tabler-icons-react";

export default function NewBoardBtn() {
  return (
    <button
      className={`mr-4 text-indigo-500 flex items-center pl-4 py-3 rounded-r-full`}
    >
      <LayoutBoardSplit className="w-5 h-5 mr-4" />+ Create New Board
    </button>
  );
}
