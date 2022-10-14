import { DefaultBodyType, ResponseComposition, rest, RestContext } from "msw";
import mockData from "./data.json";
import { factory, oneOf, manyOf, primaryKey } from "@mswjs/data";
import { nanoid } from "@reduxjs/toolkit";

//MSWJS Data Model Setup
export const db = factory({
  board: {
    id: primaryKey(nanoid),
    name: String,
    columns: manyOf("column"),
  },
  column: {
    id: primaryKey(nanoid),
    board: oneOf("board"),
    name: String,
    tasks: manyOf("task"),
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
    subtasks: manyOf("subtask"),
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
  columns.forEach(({ name, tasks }) => {
    const column = db.column.create({ name, board });
    tasks.forEach(({ description, status, subtasks, title }) => {
      const task = db.task.create({
        description,
        status,
        title,
        column,
        board,
      });
      subtasks.forEach(({ isCompleted, title }) => {
        db.subtask.create({ isCompleted, title, task });
      });
    });
  });
});

function queryParamMissing(
  res: ResponseComposition<DefaultBodyType>,
  ctx: RestContext,
  field: string
) {
  return res(
    ctx.status(405),
    ctx.json({
      message: `No ${field} was found in the query paramaters.`,
    })
  );
}

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
    const boardId = req.url.searchParams.get("boardId");
    if (!boardId) {
      return queryParamMissing(res, ctx, "boardID");
    }
    return res(
      ctx.status(200),
      ctx.json({
        data: db.column.findMany({
          where: { board: { id: { equals: boardId } } },
        }),
      })
    );
  }),

  //handles GET /tasks requests
  rest.get("/tasks", (req, res, ctx) => {
    const boardId = req.url.searchParams.get("boardId");
    if (!boardId) {
      return queryParamMissing(res, ctx, "boardID");
    }
    return res(
      ctx.status(200),
      ctx.json({
        data: db.task.findMany({
          where: { board: { id: { equals: boardId } } },
        }),
      })
    );
  }),

  //handles GET /subtask requests
  rest.get("/subtasks", (req, res, ctx) => {
    const taskId = req.url.searchParams.get("taskId");
    if (!taskId) {
      return res(
        ctx.status(405),
        ctx.json({
          message: "No boardId was found in the query paramaters.",
        })
      );
    }
    return res(
      ctx.status(200),
      ctx.json({
        data: db.subtask.findMany({
          where: { task: { id: { equals: taskId } } },
        }),
      })
    );
  }),
];
