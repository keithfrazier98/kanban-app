import mockData from "../data.json";
import { nanoid } from "@reduxjs/toolkit";
import { datatypes } from "../../@types/types";

const { boards } = mockData;
type keyArray = IDBValidKey[];
let database: IDBDatabase;

// helper function for creating an index on the unique id field of a store
const idIndexHelper = (store: IDBObjectStore) =>
  store.createIndex("by_id", "id", { unique: true });

export const setupIDBMockData = (event: Event) => {
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
                status: columnId,
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

export function connectToIDB(callback: () => void, fakeIDB?: IDBFactory) {
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
}
export function getObjectStore(
  storeName: datatypes,
  mode: "readwrite" | "readonly"
) {
  if (!database) throw new Error("No connection to DB has been established.");

  const tx = database.transaction(storeName, mode);
  const store = tx.objectStore(storeName);

  return store;
}
