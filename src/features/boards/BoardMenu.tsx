import { Fragment, useState } from "react";
import { Menu, Transition } from "@headlessui/react";
import { ChevronDown } from "tabler-icons-react";
import { ReactComponent as MobileLogo } from "../../assets/logo-mobile.svg";
import { useAppSelector } from "../../app/hooks";
import {
  boardSelected,
  getSelectedBoard,
  selectAllBoards,
} from "./boardsSlice";

import ToggleTheme from "../../components/ToggleTheme";
import BoardListItem from "./BoardListItem";
import NewBoardBtn from "./NewBoardBtn";

export default function BoardMenu() {
  const boards = useAppSelector(selectAllBoards);
  const board = useAppSelector(getSelectedBoard);

  return (
    <div className="flex items-center">
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
              <NewBoardBtn />
            </div>
            <ToggleTheme />
          </Menu.Items>
        </Transition>
      </Menu>
    </div>
  );
}
