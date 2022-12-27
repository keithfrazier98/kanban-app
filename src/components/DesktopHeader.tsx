import { useAppDispatch } from "../redux/hooks";
import BoardOptions from "../features/boards/BoardOptions";
import HeaderWrapper from "./HeaderWrapper";
import { addTaskModalOpened } from "../features/tasks/tasksSlice";
import useSelectedBoard from "../hooks/useSelectedBoard";

export default function DesktopHeader() {
  const board = useSelectedBoard();
  const dispatch = useAppDispatch();
  return (
    <HeaderWrapper className="hidden md:block">
      <div
        data-testid="desktop_header"
        className="flex justify-between items-center flex-1 h-full px-5"
      >
        <h2
          data-testid="selected_board_header"
          className="text-xl font-semibold dark:text-white"
        >
          {board?.name}
        </h2>
        <div className="flex items-center">
          <button
            onClick={() => {
              dispatch(addTaskModalOpened({ open: true }));
            }}
            className="py-2 px-3 mr-2 bg-primary-indigo-active hover:bg-primary-indigo-inactive font-medium text-white rounded-full text-sm"
          >
            + Add New Task
          </button>
          <BoardOptions />
        </div>
      </div>
    </HeaderWrapper>
  );
}
