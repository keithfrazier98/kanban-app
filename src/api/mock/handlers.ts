import { rest } from "msw";
import mockData from "./data.json";
import { factory, oneOf, manyOf, primaryKey } from "@mswjs/data";
import { nanoid } from "@reduxjs/toolkit";

// MSW REST API handlers

export const handlers = [
  //handles GET /boards requests
  rest.get("/boards", (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        data: mockData.boards,
      })
    );
  }),

  //handles GET /columns requests
  rest.get("/columns", (req, res, ctx) => {
    const id = req.url.searchParams.get("boardId");
    return res(
      ctx.status(200),
      ctx.json({
        data: mockData.columns.filter(
          (column) => column.boardId.toString() === id
        ),
      })
    );
  }),

  //handles GET /tasks requests
  rest.get("/tasks", (req, res, ctx) => {
    const id = req.url.searchParams.get("boardId");
    return res(
      ctx.status(200),
      ctx.json({
        data: mockData.tasks.filter((task) => task.boardId.toString() === id),
      })
    );
  }),

  //handles GET /tasks requests
  rest.get("/subtasks", (req, res, ctx) => {
    const id = req.url.searchParams.get("taskId");
    return res(
      ctx.status(200),
      ctx.json({
        data: mockData.subtasks.filter(
          (subtask) => subtask.taskId.toString() === id
        ),
      })
    );
  }),
];

//MSWJS Data Model Setup
export const dp = factory({
  board: {
    id: primaryKey(nanoid),
    name: String,
    columns: manyOf("column"),
  },
  columns: {
    id: primaryKey(nanoid),
    boardId: oneOf("board"),
    name: String,
    tasks: manyOf("task"),
  },
  task: {
    id: primaryKey(nanoid),
    boardId: oneOf("board"),
    columnId: oneOf("column"),
    title: String,
    description: String,
    status: String,
    totalSubtasks: Number,
    completedSubtasks: Number,
    subtasks: manyOf("subtask"),
  },
  subtask: {
    id: primaryKey(nanoid),
    taskId: oneOf("task"),
    title: String,
    isCompleted: Boolean,
  },
});

const mockDataMap = {};
