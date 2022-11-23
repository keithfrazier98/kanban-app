import mockData from "./data.json";
import { factory, oneOf, manyOf, primaryKey } from "@mswjs/data";
import { nanoid } from "@reduxjs/toolkit";
import { setupWorker } from "msw";
import { boardHandlers } from "./boardHandlers";
import { columnHandlers } from "./columnHandlers";
import { taskHandlers } from "./taskHandlers";
import { subtaskHandlers } from "./subtaskHandlers";

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

const { boards } = mockData;

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


export const idb = window.indexedDB