import { nanoid } from "@reduxjs/toolkit";
import { rest } from "msw";
import { ITask, ITaskConstructor } from "../../@types/types";

import {
  boardTx,
  columnTx,
  getTaskStore,
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
    const { subtasks, ...task } = await req.json<ITaskConstructor>();

    const taskEntity = await taskTx((tasks) =>
      tasks.add({ ...task, id: nanoid() })
    );

    // const subtaskEntities = subtasks.forEach((title) => {
    //   const subtask = {
    //     title,
    //     isCompleted: false,
    //     task: taskEntity,
    //   };

    //   subtaskTx((subtasks) => subtasks.add({ ...subtask, id: nanoid() }));
    // });

    return res(ctx.status(201), ctx.body(JSON.stringify({ taskEntity })));
  }),

  // handles PUT /tasks requests (updates a single task)
  rest.put(TASKS_ENPOINT, async (req, res, ctx) => {
    const taskUpdates = await req.json<ITask[]>();

    // get needed entities
    const column = columnTx((columns) => columns.get(taskUpdates[0].column));
    const board = boardTx((boards) => boards.get(taskUpdates[0].board));

    const newEntities = taskUpdates.map(
      async ({ id, ...task }) =>
        await taskTx((tasks) => tasks.put({ ...task, board, column }, id))
    );

    return res(ctx.status(200), ctx.json(JSON.stringify(newEntities)));
  }),

  //handles PATCH /task requests (update single task)
  rest.patch(TASKS_ENPOINT, async (req, res, ctx) => {
    const newTask = await req.json();
    await taskTx((tasks) => tasks.put(newTask));
    res(ctx.status(204));
  }),

  //handles DELETE /task reqeusts (single deletion)
  rest.delete(TASKS_ENPOINT + "/:taskId", async (req, res, ctx) => {
    const { taskId } = req.params;

    if (typeof taskId === "string") {
      await taskTx((tasks) => tasks.delete(taskId));
    }

    return res(ctx.status(204));
  }),
];
