import mockData from "./data.json";
import { factory, oneOf, primaryKey } from "@mswjs/data";
import { nanoid } from "@reduxjs/toolkit";
import { setupWorker } from "msw";
import { boardHandlers } from "./boardHandlers";
import { columnHandlers } from "./columnHandlers";
import { taskHandlers } from "./taskHandlers";
import { subtaskHandlers } from "./subtaskHandlers";

const { boards } = mockData;
type keyArray = IDBValidKey[];

// helper function for creating an index on the unique id field of a store
const indexHelper = (store: IDBObjectStore) =>
  store.createIndex("by_id", "id", { unique: true });

/**
 * Connects to index DB
 */
async function connectToDB() {
  const request = indexedDB.open("kanban");
  let db: IDBDatabase | null = null;

  request.onupgradeneeded = function (this, ev) {
    try {
      console.log("OnSuccess Event: ", ev);
      //@ts-ignore
      db = ev?.target?.result;

      if (!db) throw new Error("Failed to connect to IndexedDB.");
      // create a store & index for each entity in the kanban application
      const boardStore = db.createObjectStore("boards", { keyPath: "id" });
      // const boardIndex = indexHelper(boardStore);

      const columnStore = db.createObjectStore("columns", { keyPath: "id" });
      // const columnIndex = indexHelper(columnStore);

      const taskStore = db.createObjectStore("tasks", { keyPath: "id" });
      // const taskIndex = indexHelper(taskStore);

      const subtaskStore = db.createObjectStore("subtasks", { keyPath: "id" });
      // const subtasksIndex = indexHelper(subtaskStore);

      // add each board from the mock data
      boards.forEach(({ columns, ...board }) => {
        let boardId: IDBValidKey = nanoid();
        const boardKey = boardStore.add({ id: boardId, ...board });
        const boardColumns: keyArray = [];

        // use the onsuccess method from the board key to get access to the board id created
        boardKey.onsuccess = function (this, ev) {
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

            columnKey.onsuccess = function (this, ev) {
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

                taskKey.onsuccess = function (this, ev) {
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

                  key.onerror = (ev) => {
                    console.log("An error occurred:", ev);
                  };
                };
              });

              console.log("Column tasks: ", columnTasks);
              // append the task data to the column
              columnStore.put({
                ...columnProto,
                tasks: columnTasks,
              });
            };
          });
        };

        // append the column data to the board
        boardStore.put({ ...board, id: boardId, columns: boardColumns });
      });
      // return { db, boardStore, columnStore, taskStore, subtaskStore };
    } catch (error) {
      console.log("An error occured when initializing the database: ", error);
    }
  };

  // return { db };
}

export const stores = connectToDB();

//MSWJS Data Model Setup
export const db = factory({
  board: {
    id: primaryKey(nanoid),
    name: String,
    columns: Array,
  },
  column: {
    id: primaryKey(nanoid),
    board: oneOf("board"),
    name: String,
    index: Number,
    tasks: Array,
  },
  task: {
    id: primaryKey(nanoid),
    column: oneOf("column"),
    board: oneOf("board"),
    title: String,
    description: String,
    status: String,
    subtasks: Array,
    completedSubtasks: Number,
    index: Number,
    // subtasks: manyOf("subtask"),
  },
  subtask: {
    id: primaryKey(nanoid),
    task: oneOf("task"),
    title: String,
    isCompleted: Boolean,
  },
});

boards.forEach(({ columns, name }) => {
  const board = db.board.create({ name });
  const boardColumns: string[] = [];

  columns.forEach(({ name, tasks }, colIndex) => {
    const column = db.column.create({ name, board, index: colIndex });
    boardColumns.push(column.id);
    const columnTasks: string[] = [];

    tasks.forEach(({ description, subtasks, title }, taskIndex) => {
      const task = db.task.create({
        description,
        status: column.id,
        title,
        column,
        board,
        completedSubtasks: 0,
        index: taskIndex,
      });

      columnTasks.push(task.id);

      let completedCount = 0;

      const taskSubtasks: string[] = [];
      subtasks.forEach(({ isCompleted, title }) => {
        const subtask = db.subtask.create({ isCompleted, title, task });
        if (isCompleted) {
          completedCount++;
        }

        taskSubtasks.push(subtask.id);
      });

      db.task.update({
        where: { id: { equals: task.id } },
        data: { completedSubtasks: completedCount, subtasks: taskSubtasks },
      });
    });

    db.column.update({
      where: { id: { equals: column.id } },
      data: { ...column, tasks: columnTasks },
    });
  });

  db.board.update({
    where: { id: { equals: board.id } },
    data: { ...board, columns: boardColumns },
  });
});

// MSW REST API handlers
export const handlers = [
  ...boardHandlers,
  ...columnHandlers,
  ...taskHandlers,
  ...subtaskHandlers,
];

// This configures a Service Worker with the given request
export const worker = setupWorker(...handlers);
