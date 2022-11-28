import { rest } from "msw";
// import { db } from ".";
import { ISubtask } from "../../@types/types";
import { getObjectStore } from "../indexeddb";
import {
  dbActionErrorWrapper,
  idToString,
  send405WithBody,
  waitForDBResponse,
} from "./utils";
const RESPONSE_DELAY = 0;

const getSubtaskStore = () => getObjectStore("subtasks", "readwrite");

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

  //   //handles PATCH /subtasks requests
  //   rest.patch("/kbapi/subtasks", async (req, res, ctx) => {
  //     const { id, task, ...rest }: ISubtask = await req.json();
  //     return dbActionErrorWrapper(id, res, ctx, () => {
  //       const addOrSubtract = rest.isCompleted ? 1 : -1;

  //       db.task.update({
  //         where: { id: { equals: task.id } },
  //         data: { completedSubtasks: task.completedSubtasks + addOrSubtract },
  //       });

  //       db.subtask.update({
  //         where: { id: { equals: id } },
  //         data: { ...rest },
  //       });
  //     });
  //   }),

  //   //handles DELETE /subtask requests
  //   rest.delete("/kbapi/subtasks", async (req, res, ctx) => {
  //     let subtaskIdParam = req.url.searchParams.get("subtaskId");
  //     let taskIdParam = req.url.searchParams.get("taskId");

  //     const subtaskId = idToString(subtaskIdParam);
  //     const taskId = idToString(taskIdParam);
  //     return dbActionErrorWrapper(subtaskId, res, ctx, () => {
  //       const oldTask = db.task.findFirst({ where: { id: { equals: taskId } } });
  //       db.subtask.delete({ where: { id: { equals: subtaskId } } });

  //       try {
  //         if (!oldTask) throw "A task couldn't be found with supplied taskId.";
  //         db.task.update({
  //           where: { id: { equals: taskId } },
  //           data: {
  //             subtasks: oldTask.subtasks.filter(
  //               (subtask) => subtask !== subtaskId
  //             ),
  //           },
  //         });
  //       } catch (error) {
  //         return send405WithBody(
  //           res,
  //           ctx,
  //           error,
  //           "Aborting subtask deletion: failed to update totalSubtasks in parent task."
  //         );
  //       }
  //     });
  //   }),
];
