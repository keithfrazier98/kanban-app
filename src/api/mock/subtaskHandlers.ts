import { rest } from "msw";
import { ISubtask } from "../../@types/types";
import { getObjectStore } from "../indexeddb";
import { getTaskStore } from "./taskHandlers";
import {
  dbActionErrorWrapper,
  idToString,
  send405WithBody,
  waitForDBResponse,
} from "./utils";
const RESPONSE_DELAY = 0;

export const getSubtaskStore = () => getObjectStore("subtasks", "readwrite");

// /**
//  *  Definitions for CRUD opertations on the subtasks table.
//  */
export const subtaskHandlers = [
  //handles GET /subtask requests
  rest.get("/kbapi/subtasks", async (req, res, ctx) => {
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

    const subtaskStore = getSubtaskStore();
    const subtaskIndex = subtaskStore.index("by_task");

    const subtasks = await waitForDBResponse(subtaskIndex.getAll(taskId));

    return res(ctx.status(200), ctx.delay(RESPONSE_DELAY), ctx.json(subtasks));
  }),

  //handles PATCH /subtasks requests
  rest.patch("/kbapi/subtasks", async (req, res, ctx) => {
    const { id, task, ...rest }: ISubtask = await req.json();

    const subtaskStore = getSubtaskStore();
    const taskStore = getTaskStore();

    return dbActionErrorWrapper(id, res, ctx, async () => {
      const addOrSubtract = rest.isCompleted ? 1 : -1;

      const previousTask = await waitForDBResponse(taskStore.get(task));
      taskStore.put(
        {
          ...previousTask,
          completedSubtasks: previousTask.completedSubtasks + addOrSubtract,
        },
        task
      );

      subtaskStore.put({ ...rest, task, id }, id);
    });
  }),

  //handles DELETE /subtask requests
  rest.delete("/kbapi/subtasks", (req, res, ctx) => {
    let subtaskIdParam = req.url.searchParams.get("subtaskId");
    let taskIdParam = req.url.searchParams.get("taskId");

    //get ids in string form from parameters
    const subtaskId = idToString(subtaskIdParam);
    const taskId = idToString(taskIdParam);

    // get stores for tasks and ids
    const subtaskStore = getSubtaskStore();
    const taskStore = getTaskStore();

    // return update logic wrapped in response handler
    return dbActionErrorWrapper(subtaskId, res, ctx, async () => {
      try {
        const oldTask = await waitForDBResponse(taskStore.get(taskId));
        if (!oldTask)
          throw new Error("A task couldn't be found with supplied taskId.");

        subtaskStore.delete(subtaskId);

        taskStore.put(
          {
            ...oldTask,
            subtasks: oldTask.subtasks.filter(
              (subtask: string) => subtask !== subtaskId
            ),
          },
          subtaskId
        );
      } catch (error) {
        return send405WithBody(
          res,
          ctx,
          error,
          "Aborting subtask deletion: failed to update totalSubtasks in parent task."
        );
      }
    });
  }),
];
