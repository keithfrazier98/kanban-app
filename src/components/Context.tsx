import { createContext, PropsWithChildren, useEffect, useState } from "react";
import { IBoardData, IBoardTask, IContext } from "../@types/types";
import data from "../data.json";

export function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

export const Context = createContext({} as IContext);

export default function Provider(props: PropsWithChildren<any>) {
  const [theme, setTheme] = useState<"dark" | "light">("light");
  const [currentBoard, setCurrentBoard] = useState<IBoardData>();
  const [allBoards, setAllBoards] = useState<IBoardData[]>();
  const [openTask, setOpenTask] = useState<IBoardTask | null>(null);

  useEffect(() => {
    if (!allBoards) {
      setAllBoards(data.boards);
    }

    if (!currentBoard) {
      setCurrentBoard(data.boards[0]);
    }
  });

  function toggleTheme(theme?: "dark" | "light") {
    const htmlElement = document.querySelector("html");
    if (theme === "light" || htmlElement?.classList.contains("dark")) {
      htmlElement?.classList.remove("dark");
      setTheme("light");
      localStorage.setItem("theme", "light");
    } else {
      htmlElement?.classList.add("dark");
      setTheme("dark");
      localStorage.setItem("theme", "dark");
    }
  }

  return (
    <Context.Provider
      value={{
        theme,
        toggleTheme,
        currentBoard,
        setCurrentBoard,
        allBoards,
        setAllBoards,
        openTask,
        setOpenTask,
      }}
    >
      {props.children}
    </Context.Provider>
  );
}
