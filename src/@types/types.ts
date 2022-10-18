export type datatypes = "boards" | "columns" | "tasks" | "subtasks";
export interface IBoardSubTask {
  id: string;
  title: string;
  isCompleted: boolean;
  task: IBoardTask;
}

export interface IBoardTask {
  id: string;
  title: string;
  description: string;
  column: IBoardColumn;
  status: string;
  totalSubtasks: number;
  completedSubtasks: number;
}

export interface IBoardColumn {
  id: string;
  name: string;
  boardId: string;
}

export interface IBoardData {
  id: string;
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
  openTask: string | null;
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
