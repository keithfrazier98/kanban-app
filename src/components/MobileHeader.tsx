import { Plus } from "tabler-icons-react";
import { useAppDispatch } from "../redux/hooks";
import MobileBoardMenu from "../features/boards/MobileBoardMenu";
import BoardOptions from "../features/boards/BoardOptions";
import { addTaskModalOpened } from "../features/tasks/tasksSlice";
import { classNames } from "../utils/utils";
import HeaderWrapper from "./HeaderWrapper";

export default function MobileHeader() {
  const dispatch = useAppDispatch();
  return (
    <HeaderWrapper className="block md:hidden">
      <div
        data-testid="mobile_header"
        className="flex flex-1 justify-between pl-4 items-center"
      >
        <MobileBoardMenu />
        <div className="flex items-center">
          <button
            type="button"
            className={classNames(
              "rounded-full p-1 text-gray-400 hover:text-gray-500",
              "focus:outline-none focus:ring-2 focus:ring-indigo-500",
              "focus:ring-offset-2"
            )}
            onClick={() => {
              dispatch(addTaskModalOpened({ open: true }));
            }}
          >
            <span className="sr-only">View notifications</span>
            <div className="flex items-center">
              <div className="px-3 py-1 rounded-full bg-primary-indigo-active">
                <Plus className="h-5 w-5 text-white" aria-hidden="true" />
              </div>
            </div>
          </button>
          <BoardOptions />
        </div>
      </div>
    </HeaderWrapper>
  );
}
