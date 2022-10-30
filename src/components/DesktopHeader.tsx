import { DotsVertical } from "tabler-icons-react";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import {
  editBoardModalOpened,
  getSelectedBoard,
} from "../features/boards/boardsSlice";
import HeaderWrapper from "./HeaderWrapper";

export default function DesktopHeader() {
  const selectedBoard = useAppSelector(getSelectedBoard);
  const dispatch = useAppDispatch();

  return (
    <HeaderWrapper className="hidden lg:block">
      <div className="flex justify-between items-center flex-1 h-full px-5">
        <h2 className="text-xl font-semibold dark:text-white">
          {selectedBoard?.name}
        </h2>
        <div className="flex items-center">
          <button className="py-2 px-3 mr-2 bg-primary-indigo-active font-medium text-white rounded-full text-sm">
            + Add New Task
          </button>
          <button
            onClick={() => dispatch(editBoardModalOpened({ open: true }))}
          >
            <DotsVertical className="text-gray-400" />
          </button>
        </div>
      </div>
    </HeaderWrapper>
  );
}
