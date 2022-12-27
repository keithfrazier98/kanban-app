import { Dispatch, SetStateAction, useState } from "react";
import { Eye, EyeOff } from "tabler-icons-react";
import { useAppSelector } from "../redux/hooks";
import { ReactComponent as MobileLogo } from "../assets/logo-mobile.svg";
import BoardMenuItem from "../features/boards/BoardMenuItem";
import { selectAllBoards } from "../features/boards/boardsEndpoints";
import NewBoardBtn from "../features/boards/NewBoardBtn";
import ToggleTheme from "./ToggleTheme";
import { Transition } from "@headlessui/react";
import { classNames } from "../utils/utils";
import useSelectedBoard from "../hooks/useSelectedBoard";
/**
 * Static Sidebar for desktop
 * @returns
 */
export default function Sidebar({
  sidebarOpen,
  setSidebarOpen,
}: {
  sidebarOpen: boolean;
  setSidebarOpen: Dispatch<SetStateAction<boolean>>;
}) {
  const boards = useAppSelector(selectAllBoards);
  const board = useSelectedBoard();

  return (
    <div className="relative">
      <div
        className={`w-full transition-width ease-in-out ${
          sidebarOpen ? "md:w-64" : "w-0"
        }`}
      />
      <Transition
        as={"section"}
        id="sidebarMenu"
        data-testid="sidebar_component"
        show={sidebarOpen}
        enter="transition ease-in-out duration-300 transform"
        enterFrom="-translate-x-full"
        enterTo="translate-x-0"
        leave="transition ease-in-out duration-300 transform"
        leaveFrom="translate-x-0"
        leaveTo="-translate-x-full"
        className={`hidden md:fixed md:w-64 md:flex md:flex-col h-full`}
      >
        {/* Sidebar component, swap this element with another sidebar if you like */}
        <div
          className={classNames(
            "flex flex-grow flex-col h-full overflow-y-auto dark:bg-primary-gray-600",
            "dark:border-primary-gray-500 bg-primary-gray-100 border-r",
            "border-primary-gray-300 pt-5"
          )}
        >
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
                  <BoardMenuItem
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
                data-testid="hide_sidebar"
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
      </Transition>{" "}
      <Transition
        as={"button"}
        show={!sidebarOpen}
        data-testid="show_sidebar"
        onClick={() => {
          setSidebarOpen(!sidebarOpen);
        }}
        enter="transition ease-in-out duration-300 transform"
        enterFrom="-translate-x-full"
        enterTo="translate-x-0"
        leave="transition ease-in-out duration-300 transform"
        leaveFrom="translate-x-0"
        leaveTo="-translate-x-full"
        className={`absolute bottom-8 left-0 rounded-r-full bg-primary-indigo-active p-4 text-white z-20`}
      >
        <Eye />
      </Transition>
    </div>
  );
}
