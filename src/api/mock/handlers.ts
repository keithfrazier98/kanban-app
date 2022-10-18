import { DefaultBodyType, ResponseComposition, rest, RestContext } from "msw";
import mockData from "./data.json";
import { factory, oneOf, manyOf, primaryKey } from "@mswjs/data";
import { nanoid } from "@reduxjs/toolkit";
import { IBoardColumn, IBoardSubTask, IBoardTask } from "../../@types/types";

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

/**
 * Wraps the supplied adAction in a try/catch and responds with a 405
 * if an error is caught or the id is falsy.
 * @param id
 * @param res
 * @param ctx
 * @param dbAction
 * @returns
 */
function dbActionErrorWrapper(
  id: string,
  res: ResponseComposition<DefaultBodyType>,
  ctx: RestContext,
  dbAction: () => void
) {
  if (!id) {
    return send405WithBody(
      res,
      ctx,
      {},
      `Depending on your request, no ID was found in either 
      the search parameters, request parameters, or the 
      request body.`
    );
  }

  try {
    dbAction();
    return res(ctx.status(204), ctx.delay(RESPONSE_DELAY));
  } catch (error) {
    return send405WithBody(
      res,
      ctx,
      error,
      "Failed to perform operation in the DB."
    );
  }
}

const idToString = (id: any): string => (typeof id === "string" ? id : "");

/**
 *  Definitions for CRUD opertations on the boards table.
 */
const boardHandlers = [
  //handles GET /boards requests
  rest.get("/kbapi/boards", (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.delay(RESPONSE_DELAY),
      ctx.json(db.board.getAll())
    );
  }),
];

/**
 *  Definitions for CRUD opertations on the columns table.
 */
const columnHandlers = [
  //handles GET /columns requests
  rest.get("/kbapi/columns", (req, res, ctx) => {
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
  rest.post("/kbapi/columns", async (req, res, ctx) => {
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
  rest.delete("/kbapi/columns/:id", async (req, res, ctx) => {
    const { id: idParam } = req.params;
    const id = idToString(idParam);
    return dbActionErrorWrapper(id, res, ctx, () =>
      db.column.delete({ where: { id: { equals: id } } })
    );
  }),

  // handles PATCH /columns (updates single column)
  rest.patch("/kbapi/columns", async (req, res, ctx) => {
    const { id, name }: IBoardColumn = await req.json();
    return dbActionErrorWrapper(id, res, ctx, () =>
      db.column.update({ where: { id: { equals: id } }, data: { name } })
    );
  }),
];

/**
 *  Definitions for CRUD opertations on the tasks table.
 */
const taskHandlers = [
  //handles GET /tasks requests
  rest.get("/kbapi/tasks", (req, res, ctx) => {
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

  //handles PATCH /task requests (update single task)
  rest.patch("/kbapi/tasks", async (req, res, ctx) => {
    const { id, column, board, ...rest }: IBoardTask = await req.json();
    return dbActionErrorWrapper(id, res, ctx, () =>
      db.task.update({
        where: { id: { equals: id } },
        data: { ...rest },
      })
    );
  }),
];

/**
 *  Definitions for CRUD opertations on the subtasks table.
 */
const subtaskHandlers = [
  //handles GET /subtask requests
  rest.get("/kbapi/subtasks", (req, res, ctx) => {
    const taskId = req.url.searchParams.get("taskId");
    if (!taskId) {
      return res(
        ctx.status(405),
        ctx.delay(RESPONSE_DELAY),
        ctx.json({
          message: "No taskId was found in the query paramaters.",
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

  //handles PATCH /subtasks requests
  rest.patch("/kbapi/subtasks", async (req, res, ctx) => {
    const { id, task, ...rest }: IBoardSubTask = await req.json();
    return dbActionErrorWrapper(id, res, ctx, () => {
      const addOrSubtract = rest.isCompleted ? 1 : -1;

      db.task.update({
        where: { id: { equals: task.id } },
        data: { completedSubtasks: task.completedSubtasks + addOrSubtract },
      });

      db.subtask.update({
        where: { id: { equals: id } },
        data: { ...rest },
      });
    });
  }),

  //handles DELETE /subtask requests
  rest.delete("/kbapi/subtasks", async (req, res, ctx) => {
    let subtaskIdParam = req.url.searchParams.get("subtaskId");
    let taskIdParam = req.url.searchParams.get("taskId");

    const subtaskId = idToString(subtaskIdParam);
    const taskId = idToString(taskIdParam);
    return dbActionErrorWrapper(subtaskId, res, ctx, () => {
      const oldTask = db.task.findFirst({ where: { id: { equals: taskId } } });

      try {
        if (!oldTask)
          throw "An old task couldn't be found with supplied taskId.";
        db.task.update({
          where: { id: { equals: taskId } },
          data: { totalSubtasks: oldTask?.totalSubtasks - 1 },
        });
      } catch (error) {
        return send405WithBody(
          res,
          ctx,
          error,
          "Aborting subtask deletion: failed to update totalSubtasks in parent task."
        );
      }

      db.subtask.delete({ where: { id: { equals: subtaskId } } });
    });
  }),
];

// MSW REST API handlers
export const handlers = [
  ...boardHandlers,
  ...columnHandlers,
  ...taskHandlers,
  ...subtaskHandlers,
];
