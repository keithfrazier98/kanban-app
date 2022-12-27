import mockData from "../data.json";
import { nanoid } from "@reduxjs/toolkit";
import { datatypes, TxCallback, TxHelpers } from "../../@types/types";

const boards  = mockData.boards.reverse();
type keyArray = IDBValidKey[];
let database: IDBDatabase;

// helper function for creating an index on the unique id field of a store
const idIndexHelper = (store: IDBObjectStore) =>
  store.createIndex("by_id", "id", { unique: true });

export const setupIDBMockData = (event: Event) => {
  console.log("Initializing IDB with mock data.");
  try {
    //@ts-ignore
    let database = event?.target?.result;

    if (!database) throw new Error("Failed to connect to IndexedDB.");
    // create a store & index for each entity in the kanban application
    const boardStore = database.createObjectStore("boards", { keyPath: "id" });

    const columnStore = database.createObjectStore("columns", {
      keyPath: "id",
    });
    columnStore.createIndex("by_board", "board");

    const taskStore = database.createObjectStore("tasks", { keyPath: "id" });
    taskStore.createIndex("by_board", "board");

    const subtaskStore = database.createObjectStore("subtasks", {
      keyPath: "id",
    });
    subtaskStore.createIndex("by_task", "task");

    //create an index with the id attribute of each store
    [boardStore, columnStore, taskStore, subtaskStore].forEach((store) => {
      idIndexHelper(store);
    });

    // add each board from the mock data
    boards.forEach(({ columns, ...board }) => {
      let boardId: IDBValidKey = nanoid();
      const boardProto = { id: boardId, ...board };
      const boardKey = boardStore.add(boardProto);

      // use the onsuccess method from the board key to get access to the board id created
      boardKey.onsuccess = function () {
        const boardColumns: keyArray = [];
        // add each column from the board
        columns.forEach(({ tasks, ...column }) => {
          let columnId: IDBValidKey = nanoid();
          boardColumns.push(columnId);

          const columnProto = {
            id: columnId,
            board: boardId,
            ...column,
          };
          const columnKey = columnStore.add(columnProto);

          columnKey.onsuccess = function () {
            const columnTasks: keyArray = [];

            // add each task from the column
            tasks.forEach(({ subtasks, status, ...task }) => {
              let taskId: IDBValidKey = nanoid();
              columnTasks.push(taskId);

              const taskProto = {
                id: taskId,
                column: columnId,
                board: boardId,
                completedSubtasks: 0,
                ...task,
              };
              const taskKey = taskStore.add(taskProto);

              taskKey.onsuccess = function () {
                let completedCount = 0;
                const taskSubtasks: keyArray = [];

                // add each subtask for the task
                subtasks.forEach(({ isCompleted, title }) => {
                  let subtaskId: IDBValidKey = nanoid();
                  taskSubtasks.push(subtaskId);

                  const subtaskKey = subtaskStore.add({
                    id: subtaskId,
                    isCompleted,
                    title,
                    task: taskId,
                  });

                  subtaskKey.onsuccess = function () {
                    if (isCompleted) {
                      completedCount++;
                    }
                  };
                });

                // append the subtask data to the task
                const key = taskStore.put({
                  ...taskProto,
                  completedSubtasks: completedCount,
                  subtasks: taskSubtasks,
                });

                // key.onerror = (event) => {
                //   console.log("An error occurred:", event);
                // };
              };
            });

            // append the task data to the column
            columnStore.put({
              ...columnProto,
              tasks: columnTasks,
            });
          };
        });
        // append the column data to the board
        boardStore.put({ ...boardProto, columns: boardColumns });
      };
    });
  } catch (error) {
    console.log("An error occsured when initializing the database: ", error);
  }
};

/**
 * Connects to index DB.
 */

export function connectToIDB(
  callback: () => void,
  fakeIDB?: IDBFactory
): Promise<IDBDatabase> {
  const dbConnectRequest = fakeIDB
    ? fakeIDB?.open("kanban")
    : indexedDB?.open("kanban");

  if (!dbConnectRequest)
    throw new Error("Couldn't find an indexedDB to connect to");

  dbConnectRequest.onerror = function (this, event) {
    throw new Error("Failed to connect to IndexedDB");
  };

  dbConnectRequest.onsuccess = function (event) {
    if (!fakeIDB) console.log("Succesfully connected to IndexedDB");
    database = (event.target as IDBOpenDBRequest).result;
    callback();
  };

  dbConnectRequest.onupgradeneeded = function (this, event) {
    //@ts-ignore
    setupIDBMockData(event);
  };

  return waitForDBResponse(dbConnectRequest);
}

export function getObjectStore(
  storeName: datatypes,
  mode: "readwrite" | "readonly",
  mockDB?: IDBDatabase
) {
  if (!database && !mockDB)
    throw new Error("No connection to DB has been established.");
  if (mockDB) database = mockDB;
  const tx = database.transaction(storeName, mode);
  const store = tx.objectStore(storeName);

  return store;
}

export async function waitForDBResponse(request: IDBRequest): Promise<any> {
  return await new Promise((resolve, reject) => {
    const interval = setInterval(() => {
      if (request.readyState === "done") {
        clearInterval(interval);
        resolve(request.result);
      }
    }, 5);
  });
}

export async function executeDbTx(
  store: datatypes,
  cb: TxCallback,
  mockDB?: IDBDatabase
) {
  let transaction;

  switch (store) {
    case "boards":
      transaction = getBoardsStore(mockDB);
      break;
    case "columns":
      transaction = getColumnStore(mockDB);
      break;
    case "subtasks":
      transaction = getSubtaskStore(mockDB);
      break;
    default:
      transaction = getTaskStore(mockDB);
      break;
  }

  return await waitForDBResponse(cb(transaction));
}

/**
 * Returns helper functions with mockDB enclosed if provided.
 * If a DB is not provided, the browser IDB will be the fallback.
 * @param mockDB - provide a fake IDB for tests
 * @returns
 */
export function getTxHelpers(mockDB?: IDBDatabase): TxHelpers {
  return {
    async columnTx(cb: TxCallback) {
      return await executeDbTx("columns", cb, mockDB);
    },
    async boardTx(cb: TxCallback) {
      return await executeDbTx("boards", cb, mockDB);
    },
    async subtaskTx(cb: TxCallback) {
      return await executeDbTx("subtasks", cb, mockDB);
    },
    async taskTx(cb: TxCallback) {
      return await executeDbTx("tasks", cb, mockDB);
    },
  };
}

export function getBoardsStore(mockDB?: IDBDatabase) {
  return getObjectStore("boards", "readwrite", mockDB);
}

export function getColumnStore(mockDB?: IDBDatabase) {
  return getObjectStore("columns", "readwrite", mockDB);
}

export function getSubtaskStore(mockDB?: IDBDatabase) {
  return getObjectStore("subtasks", "readwrite", mockDB);
}

export function getTaskStore(mockDB?: IDBDatabase) {
  return getObjectStore("tasks", "readwrite", mockDB);
}
