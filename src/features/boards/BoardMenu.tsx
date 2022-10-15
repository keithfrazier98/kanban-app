import { Fragment, useState } from "react";
import { Menu, Transition } from "@headlessui/react";
import {
  ChevronDown,
  LayoutBoardSplit,
  SunHigh,
  MoonStars,
} from "tabler-icons-react";
import { ReactComponent as MobileLogo } from "../../assets/logo-mobile.svg";
import { classNames } from "../../utils/utils";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import {
  boardSelected,
  getSelectedBoard,
  selectAllBoards,
} from "./boardsSlice";

import { fetchColumnsByBoardId } from "../columns/columnsSlice";
import { fetchTasksByBoardId } from "../tasks/tasksSlice";
import ToggleTheme from "../../components/ToggleTheme";
import BoardListItem from "./BoardListItem";

export default function BoardMenu() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const boards = useAppSelector(selectAllBoards);
  const board = useAppSelector(getSelectedBoard);

  const dispatch = useAppDispatch();

  return (
    <div className="flex items-center xl:hidden">
      <MobileLogo />
      {/* Profile dropdown */}
      <Menu as="div" className="ml-3">
        <div>
          <Menu.Button className="flex max-w-xs items-center rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
            <span className="sr-only">Open board menu</span>
            <span className="font-bold mr-1 text-lg dark:text-white">
              {board?.name}
            </span>
            <ChevronDown className="text-indigo-400 w-4 h-5 mt-1" />
          </Menu.Button>
        </div>
        <Transition
          as={Fragment}
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          <Menu.Items className="absolute flex flex-col z-10 top-full translate-y-5 rounded-lg bg-white dark:bg-primary-gray-600 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
            <span className="m-4 font-medium text-gray-400 min-w-[16rem]">
              All Boards {`(${boards.length})`}
            </span>
            <div>
              {boards.map((item, i) => (
                <Menu.Item key={`board-${i}`}>
                  {({ active }) => (
                    <BoardListItem active={active} item={item} />
                  )}
                </Menu.Item>
              ))}
              <button
                className={`mr-4 text-indigo-500 flex items-center pl-4 py-3 rounded-r-full`}
              >
                <LayoutBoardSplit className="w-5 h-5 mr-4" />+ Create New Board
              </button>
            </div>
            <ToggleTheme />
          </Menu.Items>
        </Transition>
      </Menu>
    </div>
  );
}
