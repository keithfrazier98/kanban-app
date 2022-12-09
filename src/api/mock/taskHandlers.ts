import { nanoid } from "@reduxjs/toolkit";
import { rest } from "msw";
import { ITask, ITaskConstructor, TxHelpers } from "../../@types/types";
import { getTaskStore, waitForDBResponse } from "../indexeddb";

const RESPONSE_DELAY = 0;
const TASKS_ENPOINT = "/kbapi/tasks";

/**
 *  Definitions for CRUD opertations on the tasks table.
 */

export const taskHandlers = (helpers: TxHelpers) => {
  const { taskTx, columnTx, boardTx, subtaskTx } = helpers;
  return [
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

      //create task entity
      const taskEntity = await taskTx((tasks) =>
        tasks.add({ ...task, subtasks, id: nanoid() })
      );

      //create subtask entities
      const subtaskEntities: string[] = [];
      for (let title of subtasks) {
        const subtask = {
          title,
          isCompleted: false,
          task: taskEntity,
        };

        const subtaskEntity = await subtaskTx((subtasks) =>
          subtasks.add({ ...subtask, id: nanoid() })
        );

        subtaskEntities.push(subtaskEntity);
      }

      // add the task entity to the taskOrder in the column entity
      const column = await columnTx((columns) => columns.get(task.column));
      console.log(column);
      const taskOrder = column.tasks.slice();

      taskOrder.push(taskEntity);

      await columnTx((columns) => columns.put({ ...column, tasks: taskOrder }));

      return res(
        ctx.status(201),
        ctx.body(JSON.stringify({ taskEntity, subtaskEntities }))
      );
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
};
