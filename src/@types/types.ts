import { Dispatch, SetStateAction } from "react";

export interface IBoardSubTask {
  id: number;
  title: string;
  isCompleted: boolean;
}

export interface IBoardTask {
  title: string;
  description: string;
  status: string;
  subtasks: IBoardSubTask[];
}

export interface IBoardColumn {
  name: string;
  tasks: IBoardTask[];
}

export interface IBoardData {
  id: number;
  name: string;
  columns: IBoardColumn[];
}

export interface IBoardState {
  ids: number[];
  entities: IBoardData[];
  error?: string;
  status: "idle" | "succeeded" | "loading" | "failed";
  selectedBoard: IBoardData | null;
}

export interface ITasksState {
  ids: number[];
  entities: IBoardTask[];
  openTask: IBoardTask | null;
}

export interface ISubtasksState {
  ids: number[];
  entities: IBoardSubTask[];
}

// export interface IContext {
//   allBoards?: IBoardData[];
//   setAllBoards: Dispatch<SetStateAction<IBoardData[] | undefined>>;
//   currentBoard?: IBoardData;
//   setCurrentBoard: Dispatch<SetStateAction<IBoardData | undefined>>;
//   toggleTheme: (theme?: "dark" | "light") => void;
//   theme: "dark" | "light";
//   openTask: IBoardTask | null;
//   setOpenTask: Dispatch<SetStateAction<IBoardTask | null>>;
// }
