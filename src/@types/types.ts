export type datatypes = "boards" | "columns" | "tasks" | "subtasks";
export interface ISubtask {
  id: string;
  title: string;
  isCompleted: boolean;
  task: ITask;
}

export interface ITask {
  id: string;
  title: string;
  description: string;
  column: IColumn;
  board: IBoardData;
  status: string;
  totalSubtasks: number;
  completedSubtasks: number;
}

export interface IColumnConstructor {
  name: string;
  id?: string;
}

export type opTypes = "delete" | "update" | "create" | undefined;
export interface IColumn {
  id: string;
  name: string;
  board: IBoardData;
  index: number;
  operation?: opTypes;
}

export interface IBoardData {
  id: string;
  name: string;
}

export type requestStatus = "idle" | "succeeded" | "loading" | "failed";

export interface IBoardState {
  selectedBoard: IBoardData | null;
  addBoardModalOpen: boolean;
  editBoardModalOpen: boolean;
}

export interface IBoardQuery {
  ids: number[];
  entities: { [id: string]: IBoardData };
  error?: string;
  status: requestStatus;
}

export interface IColumnEntities {
  [id: string]: IColumn;
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
  openAddTaskModal: boolean;
}

export interface ITaskQuery {
  ids: string[];
  entities: { [id: string]: ITask };
  error?: string;
  status: requestStatus;
}
//All subtask data will be held in the apiSlice, no need for ISubtaskState
export interface ISubtaskQuery {
  ids: number[];
  entities: { [id: string]: ISubtask };
  error?: string;
  status: requestStatus;
}

export interface IBoardPostBody {
  additions: IColumnConstructor[];
  deletions: IColumn[];
  updates: IColumn[];
  boardId: string;
  newName: null | string;
}
