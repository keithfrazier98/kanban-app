import { useState } from "react";
import { Eye, EyeCheck, EyeglassOff, EyeOff } from "tabler-icons-react";
import { useAppSelector } from "../app/hooks";
import { ReactComponent as MobileLogo } from "../assets/logo-mobile.svg";
import BoardListItem from "../features/boards/BoardListItem";
import {
  getSelectedBoard,
  selectAllBoards,
} from "../features/boards/boardsSlice";
import NewBoardBtn from "../features/boards/NewBoardBtn";
import ToggleTheme from "./ToggleTheme";
/**
 * Static Sidebar for desktop
 * @returns
 */
export default function SideBar() {
  const boards = useAppSelector(selectAllBoards);
  const board = useAppSelector(getSelectedBoard);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  return (
    <>
      <div
        className={`  ${
          sidebarOpen
            ? "hidden md:fixed md:inset-y-0 md:flex md:w-64 md:flex-col"
            : "hidden"
        }`}
      >
        {/* Sidebar component, swap this element with another sidebar if you like */}
        <div className="flex flex-grow flex-col overflow-y-auto dark:bg-primary-gray-600 dark:border-primary-gray-500 bg-primary-gray-100 border-r border-primary-gray-300 pt-5">
          <div className="flex flex-shrink-0 items-center px-4 mb-8 dark:text-white">
            <MobileLogo />
            <h1 className="font-bold text-2xl ml-2">kanban</h1>
          </div>
          <div className="mt-5 flex flex-1 flex-col justify-between">
            <div>
              <h2 className="tracking-[.2em] mb-4 font-semibold text-xs text-gray-400 ml-6">
                ALL BOARDS {`(${boards.length})`}
              </h2>
              <ul>
                {boards.map((boardItem, i) => (
                  <BoardListItem
                    active={board?.id === boardItem.id}
                    item={boardItem}
                    key={"board-" + i}
                  />
                ))}
              </ul>
              <NewBoardBtn />
            </div>

            <div className="mb-12">
              <ToggleTheme />
              <button
                onClick={() => {
                  setSidebarOpen(!sidebarOpen);
                }}
                className="flex px-4 text-sm text-gray-400"
              >
                <EyeOff /> <span className="ml-2">Hide Sidebar</span>
              </button>
            </div>
          </div>
        </div>
      </div>
      <button
        onClick={() => {
          setSidebarOpen(!sidebarOpen);
        }}
        className={`absolute bottom-8 left-0 rounded-r-full bg-primary-indigo-active p-4 text-white ${
          sidebarOpen ? "hidden" : "block"
        }`}
      >
        <Eye />
      </button>
    </>
  );
}
