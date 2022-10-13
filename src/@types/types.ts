import { Dispatch, SetStateAction } from "react";

export interface IBoardSubTask {
  id: number;
  title: string;
  isCompleted: boolean;
}

export interface IBoardTask {
  title: string;
  description: string;
  columnId: number;
  status: string;
  subtasks: IBoardSubTask[];
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

export interface IBoardState {
  ids: number[];
  entities: { [id: string]: IBoardData };
  error?: string;
  status: "idle" | "succeeded" | "loading" | "failed";
  selectedBoard: IBoardData | null;
}

export interface IColumnState {
  ids: string[];
  entities: { [id: string]: IBoardColumn };
}

export interface ITasksState {
  ids: number[];
  entities: { [id: string]: IBoardTask };
  openTask: IBoardTask | null;
}

export interface ISubtasksState {
  ids: number[];
  entities: { [id: string]: IBoardSubTask };
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
