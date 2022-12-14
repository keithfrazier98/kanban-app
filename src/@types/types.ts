export type datatypes = "boards" | "columns" | "tasks" | "subtasks";
export interface ISubtask {
  id: string;
  title: string;
  isCompleted: boolean;
  task: string;
}

export interface ITask {
  id: string;
  title: string;
  description: string;
  column: string;
  board: string;
  subtasks: string[];
  completedSubtasks: number;
}

export interface IColumnConstructor {
  name: string;
  id?: string;
}

export type ITaskConstructor = Omit<ITask, "id"> & {
  id: string;
  subtasks: string[];
};

export type opTypes = "delete" | "update" | "create" | undefined;
export interface IColumn {
  id: string;
  name: string;
  board: string;
  operation?: opTypes;
  tasks: string[];
}

export interface IBoardData {
  id: string;
  name: string;
  columns: string[];
}

export type requestStatus = "idle" | "succeeded" | "loading" | "failed";

export interface IBoardState {
  selectedBoard: string | null;
  addBoardModalOpen: boolean;
  editBoardModalOpen: boolean;
  deleteBoardModalOpen: boolean;
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
  openEditTaskModal: boolean;
  openDeleteTaskModal: boolean;
}

export interface ITaskEntities {
  [id: string]: ITask;
}
export interface ITaskQuery {
  ids: string[];
  entities: ITaskEntities;
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

export interface IColumnPostBody {
  additions: IColumnConstructor[];
  deletions: IColumn[];
  updates: IColumn[];
  boardId: string;
  columnOrder?: string[];
  newName: null | string;
}

export type TxCallback = (transaction: IDBObjectStore) => any;

export interface TxHelpers {
  columnTx(cb: TxCallback): Promise<any>;
  boardTx(cb: TxCallback): Promise<any>;
  subtaskTx(cb: TxCallback): Promise<any>;
  taskTx(cb: TxCallback): Promise<any>;
}
