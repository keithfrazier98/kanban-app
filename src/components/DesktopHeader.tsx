import { useAppSelector } from "../app/hooks";
import { getSelectedBoard } from "../features/boards/boardsSlice";
import HeaderWrapper from "./HeaderWrapper";

export default function DesktopHeader() {
  const selectedBoard = useAppSelector(getSelectedBoard);

  return (
    <HeaderWrapper>
      <div className="flex justify-between items-center flex-1">
        <h1 className="text-2xl font-bold">{selectedBoard?.name}</h1>
        <button className="py-2 px-3 bg-primary-indigo-active font-medium text-white">
          + Add New Task
        </button>
      </div>
    </HeaderWrapper>
  );
}
