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
    // columns: manyOf("column"),
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
    totalSubtasks: Number,
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
  columns.forEach(({ name, tasks }, colIndex) => {
    const column = db.column.create({ name, board, index: colIndex });
    const columnTasks: string[] = [];
    tasks.forEach(({ description, subtasks, title }, taskIndex) => {
      const task = db.task.create({
        description,
        status: column.id,
        title,
        column,
        board,
        totalSubtasks: subtasks.length,
        completedSubtasks: 0,
        index: taskIndex,
      });

      columnTasks.push(task.id);

      let completedCount = 0;

      subtasks.forEach(({ isCompleted, title }) => {
        db.subtask.create({ isCompleted, title, task });
        if (isCompleted) {
          completedCount++;
        }
      });

      db.task.update({
        where: { id: { equals: task.id } },
        data: { completedSubtasks: completedCount },
      });
    });

    db.column.update({
      where: { id: { equals: column.id } },
      data: { ...column, tasks: columnTasks },
    });
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
