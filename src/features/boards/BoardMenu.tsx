import { Fragment, useContext, useState } from "react";
import { Menu, Transition } from "@headlessui/react";
import {
  ChevronDown,
  LayoutBoardSplit,
  SunHigh,
  MoonStars,
} from "tabler-icons-react";
import { ReactComponent as MobileLogo } from "../../assets/logo-mobile.svg";
import data from "../../data.json";
import { classNames } from "../../utils/utils";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import {
  boardSelected,
  getSelectedBoard,
  selectAllBoards,
  selectBoardById,
} from "./boardsSlice";
import { useSelector } from "react-redux";
import { openTaskUpdated } from "../tasks/tasksSlice";

export default function BoardMenu() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const boards = useAppSelector(selectAllBoards);
  const board = useAppSelector(getSelectedBoard);

  const dispatch = useAppDispatch();
  function toggleTheme(theme?: "dark" | "light") {
    const htmlElement = document.querySelector("html");
    if (theme === "light" || htmlElement?.classList.contains("dark")) {
      htmlElement?.classList.remove("dark");
      // setTheme("light");
      localStorage.setItem("theme", "light");
    } else {
      htmlElement?.classList.add("dark");
      // setTheme("dark");
      localStorage.setItem("theme", "dark");
    }
  }

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
                    <div className="pr-5">
                      <button
                        onClick={() => dispatch(boardSelected({ board: item }))}
                        className={`w-full flex items-center pl-4 py-3 rounded-r-full ${
                          active || board?.id === item.id
                            ? "bg-primary-indigo-active text-white"
                            : " text-gray-400 "
                        }`}
                      >
                        <LayoutBoardSplit className="w-5 h-5 mr-4" />
                        {item.name}
                      </button>
                    </div>
                  )}
                </Menu.Item>
              ))}
              <button
                className={`mr-4 text-indigo-500 flex items-center pl-4 py-3 rounded-r-full`}
              >
                <LayoutBoardSplit className="w-5 h-5 mr-4" />+ Create New Board
              </button>
            </div>
            <div className="w-full p-4">
              <div className="bg-primary-gray-200 dark:bg-primary-gray-700 p-3 rounded flex justify-center items-center">
                <SunHigh className="w-5 h-5 text-gray-500" />
                <button
                  onClick={() => {
                    toggleTheme();
                  }}
                  className="w-12 h-6 mx-4 p-1 rounded-full bg-primary-indigo-active"
                >
                  <div
                    className={classNames(
                      "dark:translate-x-full dark:justify-end",
                      "translate-x-0 justify-start",
                      "w-1/2 h-full transition-transform flex"
                    )}
                  >
                    <div className="rounded-full bg-white w-4 h-4" />
                  </div>
                </button>
                <MoonStars className="w-5 h-5 text-gray-500" />
              </div>
            </div>
          </Menu.Items>
        </Transition>
      </Menu>
    </div>
  );
}
