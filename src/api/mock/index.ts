import mockData from "./data.json";
import { factory, oneOf, primaryKey } from "@mswjs/data";
import { nanoid } from "@reduxjs/toolkit";
import { setupWorker } from "msw";
import { boardHandlers } from "./boardHandlers";
import { columnHandlers } from "./columnHandlers";
import { taskHandlers } from "./taskHandlers";
import { subtaskHandlers } from "./subtaskHandlers";

const { boards } = mockData;

async function connectToDB() {
  const request = indexedDB.open("kanban");
  console.log(request);

  request.onupgradeneeded = function (this, ev) {
    console.log("OnSuccess Event: ", ev);
    //@ts-ignore
    const db: IDBDatabase = ev?.target?.result;

    const indexHelper = (store: IDBObjectStore) =>
      store.createIndex("by_id", "id", { unique: true });

    const boardStore = db.createObjectStore("boards", { keyPath: "id" });
    const boardIndex = indexHelper(boardStore);

    const columnStore = db.createObjectStore("columns", { keyPath: "id" });
    const columnIndex = indexHelper(columnStore);

    const taskStore = db.createObjectStore("tasks", { keyPath: "id" });
    const taskIndex = indexHelper(taskStore);

    const subtaskStore = db.createObjectStore("subtasks", { keyPath: "id" });
    const subtasksIndex = indexHelper(subtaskStore);

    boards.forEach((board) => {
      const boardKey = boardStore.add({ id: nanoid(), ...board });
      const boardColumns: IDBRequest<IDBValidKey>[] = []
      board.columns.forEach((column) => {
        const columnKey = columnStore.add({id:nanoid(), ...column})
        boardColumns.push(columnKey);
        const columnTasks: string[] = [];

      //   tasks.forEach(({ description, subtasks, title }, taskIndex) => {
      //     const task = db.task.create({
      //       description,
      //       status: column.id,
      //       title,
      //       column,
      //       board,
      //       completedSubtasks: 0,
      //       index: taskIndex,
      //     });

      //     columnTasks.push(task.id);

      //     let completedCount = 0;

      //     const taskSubtasks: string[] = [];
      //     subtasks.forEach(({ isCompleted, title }) => {
      //       const subtask = db.subtask.create({ isCompleted, title, task });
      //       if (isCompleted) {
      //         completedCount++;
      //       }

      //       taskSubtasks.push(subtask.id);
      //     });

      //     db.task.update({
      //       where: { id: { equals: task.id } },
      //       data: { completedSubtasks: completedCount, subtasks: taskSubtasks },
      //     });
      //   });

      //   db.column.update({
      //     where: { id: { equals: column.id } },
      //     data: { ...column, tasks: columnTasks },
      //   });
      // });

      // db.board.update({
      //   where: { id: { equals: board.id } },
      //   data: { ...board, columns: boardColumns },
      });
    });
  };

  // request.onupgradeneeded({oldVersion: 1, newVersion:2});
}

connectToDB();

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
