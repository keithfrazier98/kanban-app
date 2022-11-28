import { nanoid } from "@reduxjs/toolkit";
import { rest } from "msw";
import { ITask, ITaskConstructor } from "../../@types/types";
import { getObjectStore } from "../indexeddb";
import { getBoardsStore } from "./boardHandlers";
import { getColumnStore } from "./columnHandlers";
import { getSubtaskStore } from "./subtaskHandlers";
import {
  dbActionErrorWrapper,
  paramMissing,
  send405WithBody,
  waitForDBResponse,
} from "./utils";

const RESPONSE_DELAY = 0;
const TASKS_ENPOINT = "/kbapi/tasks";

export const getTaskStore = () => getObjectStore("tasks", "readwrite");

// /**
//  *  Definitions for CRUD opertations on the tasks table.
//  */
export const taskHandlers = [
  //   //handles GET /tasks requests
  rest.get(TASKS_ENPOINT, async (req, res, ctx) => {
    const boardId = req.url.searchParams.get("boardId");
    if (!boardId) {
      return paramMissing(res, ctx, "boardID", "query");
    }

    const taskStore = getTaskStore();
    const taskIndex = taskStore.index("by_board");
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

    const columnStore = getColumnStore();
    const taskStore = getTaskStore();
    const subtaskStore = getSubtaskStore();
    const column = await waitForDBResponse(columnStore.get(clientCol));
    const board = await waitForDBResponse(columnStore.get(clientBoard));

    try {
      if (!column || !board)
        throw new Error(
          "A column or board could not be found for with the data provided"
        );

      const taskId = nanoid();
      const taskEntity = taskStore.add({ ...task, id: taskId, column, board });
      const subtaskEntities = subtasks.map((title) => {
        const subtask = {
          title,
          isCompleted: false,
          task: taskEntity,
        };

        return subtaskStore.add({ subtask, id: nanoid() });
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
    const tasks = await req.json<ITask[]>();

    // get needed stores
    const columnStore = getColumnStore();
    const boardStore = getBoardsStore();
    const taskStore = getTaskStore();

    try {
      if (!tasks) throw new Error("No body found in request.");

      // get needed entities
      const column = columnStore.get(tasks[0].column);
      const board = boardStore.get(tasks[0].board);

      if (!column || !board)
        throw new Error("Column or Board could not be determined.");

      const newEntities = tasks.map(
        async ({ id, ...task }) =>
          await waitForDBResponse(taskStore.put({ ...task, board, column }, id))
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
      const taskStore = getTaskStore();
      const columnStore = getColumnStore();

      const task = await waitForDBResponse(taskStore.get(id));

      let newColumn = task?.column;
      if (restOfTask.status !== oldColumn) {
        const entity = await waitForDBResponse(
          columnStore.get(restOfTask.status)
        );
        if (entity) newColumn = entity;
      }

      await waitForDBResponse(
        taskStore.put({ ...restOfTask, column: newColumn })
      );
    });
  }),

  //handles DELETE /task reqeusts (single deletion)
  rest.delete(TASKS_ENPOINT + "/:taskId", async (req, res, ctx) => {
    const { taskId } = req.params;
    const taskStore = getTaskStore();
    try {
      if (!(typeof taskId === "string"))
        throw new Error("taskId provided is not a string");

      const deletion = await waitForDBResponse(taskStore.delete(taskId));
      if (deletion) throw new Error("Unable to perform a succesful deletion.");

      return res(ctx.status(204));
    } catch (error) {
      return send405WithBody(
        res,
        ctx,
        error,
        "An error occcured while trying to delete a task."
      );
    }
  }),
];
