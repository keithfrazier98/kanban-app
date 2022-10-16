import { DefaultBodyType, ResponseComposition, rest, RestContext } from "msw";
import mockData from "./data.json";
import { factory, oneOf, manyOf, primaryKey } from "@mswjs/data";
import { nanoid } from "@reduxjs/toolkit";
import { Entity } from "@mswjs/data/lib/glossary";
import { IBoardColumn } from "../../@types/types";

const RESPONSE_DELAY = 0;

//MSWJS Data Model Setup
const db = factory({
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
        totalSubtasks: subtasks.length,
        completedSubtasks: 0,
      });

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
  });
});

function send405WithBody(
  res: ResponseComposition<DefaultBodyType>,
  ctx: RestContext,
  error: any,
  message: string
) {
  return res(
    ctx.status(405),
    ctx.delay(RESPONSE_DELAY),
    ctx.json({
      error,
      message,
    })
  );
}

function paramMissing(
  res: ResponseComposition<DefaultBodyType>,
  ctx: RestContext,
  field: string,
  type: string
) {
  return res(
    ctx.status(405),
    ctx.delay(RESPONSE_DELAY),
    ctx.json({
      message: `No ${field} was found in the ${type} paramaters.`,
    })
  );
}

// MSW REST API handlers

export const handlers = [
  //handles GET /boards requests
  rest.get("/boards", (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.delay(RESPONSE_DELAY),
      ctx.json(db.board.getAll())
    );
  }),

  //handles GET /columns requests
  rest.get("/columns", (req, res, ctx) => {
    const boardId = req.url.searchParams.get("boardId");
    if (!boardId) {
      return paramMissing(res, ctx, "boardID", "query");
    }
    return res(
      ctx.status(200),
      ctx.delay(RESPONSE_DELAY),
      ctx.json(
        db.column.findMany({
          where: { board: { id: { equals: boardId } } },
        })
      )
    );
  }),

  //handles POST /columns (adds new column)
  rest.post("/columns", async (req, res, ctx) => {
    const { column } = await req.json<{ column: IBoardColumn }>();
    if (!column) {
      return res(
        ctx.status(405),
        ctx.delay(RESPONSE_DELAY),
        ctx.json({ error: "Missing column data in json body." })
      );
    }
    const entity = db.column.create(column);
    return res(
      ctx.status(201),
      ctx.delay(RESPONSE_DELAY),
      ctx.json({ column: entity })
    );
  }),

  // handles DELETE /columns (deletes col by id)
  rest.delete("/columns/:id", async (req, res, ctx) => {
    const { id } = req.params;

    if (!id) {
      return paramMissing(res, ctx, "ID", "url");
    } else if (typeof id === "string") {
      try {
        db.column.delete({ where: { id: { equals: id } } });
        return res(ctx.status(204), ctx.delay(RESPONSE_DELAY));
      } catch (error) {
        return send405WithBody(
          res,
          ctx,
          error,
          "Failed to delete entity from the DB. Check the ID."
        );
      }
    } else {
      return send405WithBody(res, ctx, null, "Invalid ID in URL parameters");
    }
  }),

  //handles GET /tasks requests
  rest.get("/tasks", (req, res, ctx) => {
    const boardId = req.url.searchParams.get("boardId");
    if (!boardId) {
      return paramMissing(res, ctx, "boardID", "query");
    }
    return res(
      ctx.status(200),
      ctx.delay(RESPONSE_DELAY),
      ctx.json(
        db.task.findMany({
          where: { board: { id: { equals: boardId } } },
        })
      )
    );
  }),

  //handles GET /subtask requests
  rest.get("/subtasks", (req, res, ctx) => {
    const taskId = req.url.searchParams.get("taskId");
    if (!taskId) {
      return res(
        ctx.status(405),
        ctx.delay(RESPONSE_DELAY),
        ctx.json({
          message: "No boardId was found in the query paramaters.",
        })
      );
    }
    return res(
      ctx.status(200),
      ctx.delay(RESPONSE_DELAY),
      ctx.json(
        db.subtask.findMany({
          where: { task: { id: { equals: taskId } } },
        })
      )
    );
  }),
];
