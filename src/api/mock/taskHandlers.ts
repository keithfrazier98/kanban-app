import { nanoid } from "@reduxjs/toolkit";
import { waitFor } from "@testing-library/react";
import { rest } from "msw";
import { ITask, ITaskConstructor } from "../../@types/types";
import { getObjectStore } from "../indexeddb";

import {
  boardTx,
  columnTx,
  dbActionErrorWrapper,
  getTaskStore,
  send405WithBody,
  subtaskTx,
  taskTx,
  waitForDBResponse,
} from "./utils";

const RESPONSE_DELAY = 0;
const TASKS_ENPOINT = "/kbapi/tasks";

/**
 *  Definitions for CRUD opertations on the tasks table.
 */

export const taskHandlers = [
  //handles GET /tasks requests
  rest.get(TASKS_ENPOINT, async (req, res, ctx) => {
    const boardId = req.url.searchParams.get("boardId");
    const taskIndex = getTaskStore().index("by_board");
    const tasksByBoard = await waitForDBResponse(taskIndex.getAll(boardId));
    return res(
      ctx.status(200),
      ctx.delay(RESPONSE_DELAY),
      ctx.json(tasksByBoard)
    );
  }),

  //handles POST /task requests (create single task)
  rest.post(TASKS_ENPOINT, async (req, res, ctx) => {
    const {
      subtasks,
      column: clientCol,
      board: clientBoard,
      ...task
    } = await req.json<ITaskConstructor>();

    const column = await columnTx((columns) => columns.get(clientCol));
    const board = await boardTx((boards) => boards.get(clientBoard));

    try {
      if (!column || !board)
        throw new Error(
          "A column or board could not be found for with the data provided"
        );

      const taskId = nanoid();
      const taskEntity = taskTx((tasks) =>
        tasks.add({ ...task, id: taskId, column, board })
      );

      const subtaskEntities = subtasks.map(async (title) => {
        const subtask = {
          title,
          isCompleted: false,
          task: taskEntity,
        };

        return await subtaskTx((subtasks) =>
          subtasks.add({ subtask, id: nanoid() })
        );
      });

      return res(
        ctx.status(201),
        ctx.body(JSON.stringify({ taskEntity, subtaskEntities }))
      );
    } catch (error) {
      return send405WithBody(
        res,
        ctx,
        error,
        "An error occured when trying to create a new task."
      );
    }
  }),

  // handles PUT /tasks requests (updates a single task)
  rest.put(TASKS_ENPOINT, async (req, res, ctx) => {
    const taskUpdates = await req.json<ITask[]>();

    try {
      if (!taskUpdates) throw new Error("No body found in request.");

      // get needed entities
      const column = columnTx((columns) => columns.get(taskUpdates[0].column));
      const board = boardTx((boards) => boards.get(taskUpdates[0].board));

      if (!column || !board)
        throw new Error("Column or Board could not be determined.");

      const newEntities = taskUpdates.map(
        async ({ id, ...task }) =>
          await taskTx((tasks) => tasks.put({ ...task, board, column }, id))
      );

      return res(ctx.status(200), ctx.json(JSON.stringify(newEntities)));
    } catch (error) {
      return send405WithBody(
        res,
        ctx,
        error,
        "An error occured while updating the tasks. "
      );
    }
  }),

  //handles PATCH /task requests (update single task)
  rest.patch(TASKS_ENPOINT, async (req, res, ctx) => {
    const {
      id,
      column: oldColumn,
      board,
      ...restOfTask
    }: ITask = await req.json();
    return dbActionErrorWrapper(id, res, ctx, async () => {
      const task = await taskTx((tasks) => tasks.get(id));

      let newColumn = task?.column;
      if (restOfTask.status !== oldColumn) {
        const entity = await columnTx((columns) =>
          columns.get(restOfTask.status)
        );
        if (entity) newColumn = entity;
      }

      await taskTx((tasks) => tasks.put({ ...restOfTask, column: newColumn }));
    });
  }),

  //handles DELETE /task reqeusts (single deletion)
  rest.delete(TASKS_ENPOINT + "/:taskId", async (req, res, ctx) => {
    const { taskId } = req.params;

    return await dbActionErrorWrapper(taskId, res, ctx, async () => {
      if (!(typeof taskId === "string"))
        throw new Error("taskId provided is not a string");

      const deletion = await taskTx((tasks) => tasks.delete(taskId));
      if (deletion) throw new Error("Unable to perform a succesful deletion.");

      return res(ctx.status(204));
    });
  }),
];
