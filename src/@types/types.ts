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
  board: IBoardData;
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
  selectedBoard: IBoardData | null;
  editBoardModalOpen: boolean;
}

export interface IBoardQuery {
  ids: number[];
  entities: { [id: string]: IBoardData };
  error?: string;
  status: requestStatus;
}

export interface IColumnEntities {
  [id: string]: IBoardColumn;
}

//All column data will be held in the apiSlice, no need for IColumnState
export interface IColumnQuery {
  ids: string[];
  entities: IColumnEntities;
  error?: string;
  status: requestStatus;
}

export interface ITaskState {
  openTask: string | null;
}

export interface ITaskQuery {
  ids: string[];
  entities: { [id: string]: IBoardTask };
  error?: string;
  status: requestStatus;
}
//All subtask data will be held in the apiSlice, no need for ISubtaskState
export interface ISubtaskQuery {
  ids: number[];
  entities: { [id: string]: IBoardSubTask };
  error?: string;
  status: requestStatus;
}
