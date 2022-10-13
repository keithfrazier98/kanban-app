import { Dispatch, SetStateAction } from "react";

export interface IBoardSubTask {
  id: number;
  title: string;
  isCompleted: boolean;
}

export interface IBoardTask {
  id: number;
  title: string;
  description: string;
  columnId: number;
  status: string;
  totalSubtasks: number;
  subtasksCompleted: number;
}

export interface IBoardColumn {
  id: number;
  name: string;
  boardId: number;
}

export interface IBoardData {
  id: number;
  name: string;
}

export type requestStatus = "idle" | "succeeded" | "loading" | "failed";

export interface IBoardState {
  ids: number[];
  entities: { [id: string]: IBoardData };
  error?: string;
  status: requestStatus;
  selectedBoard: IBoardData | null;
}

export interface IColumnState {
  ids: string[];
  entities: { [id: string]: IBoardColumn };
  error?: string;
  status: requestStatus;
}

export interface ITasksState {
  ids: number[];
  entities: { [id: string]: IBoardTask };
  openTask: number | null;
  error?: string;
  status: requestStatus;
}

export interface ISubtasksState {
  ids: number[];
  entities: { [id: string]: IBoardSubTask };
  error?: string;
  status: requestStatus;
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
