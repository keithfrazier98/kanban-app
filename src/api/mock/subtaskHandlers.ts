import { rest } from "msw";
import { ISubtask, TxHelpers } from "../../@types/types";
import { dbActionErrorWrapper, idToString } from "./utils";

const RESPONSE_DELAY = 0;

// /**
//  *  Definitions for CRUD opertations on the subtasks table.
//  */
export const subtaskHandlers = (helpers: TxHelpers) => {
  const { subtaskTx, taskTx } = helpers;
  return [
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

      const subtasks = await subtaskTx((subtasks) => {
        const index = subtasks.index("by_task");
        return index.getAll(taskId);
      });

      return res(
        ctx.status(200),
        ctx.delay(RESPONSE_DELAY),
        ctx.json(subtasks)
      );
    }),

    //handles PATCH /subtasks requests
    rest.patch("/kbapi/subtasks", async (req, res, ctx) => {
      const { id, task, ...rest }: ISubtask = await req.json();

      const addOrSubtract = rest.isCompleted ? 1 : -1;

      const previousTask = await taskTx((tasks) => tasks.get(task));

      await taskTx((tasks) =>
        tasks.put({
          ...previousTask,
          completedSubtasks: previousTask.completedSubtasks + addOrSubtract,
        })
      );

      await subtaskTx((subtasks) => subtasks.put({ ...rest, task, id }));
      return res(ctx.status(204));
    }),

    //handles DELETE /subtask requests
    rest.delete("/kbapi/subtasks", (req, res, ctx) => {
      let subtaskIdParam = req.url.searchParams.get("subtaskId");
      let taskIdParam = req.url.searchParams.get("taskId");

      //get ids in string form from parameters
      const subtaskId = idToString(subtaskIdParam);
      const taskId = idToString(taskIdParam);

      // return update logic wrapped in response handler
      return dbActionErrorWrapper(subtaskId, res, ctx, async () => {
        const oldTask = await taskTx((tasks) => tasks.get(taskId));
        if (!oldTask)
          throw new Error("A task couldn't be found with supplied taskId.");

        // delete the subtask
        await subtaskTx((subtasks) => subtasks.delete(subtaskId));

        // filter the deleted subtasks out of the subtask order array
        await taskTx((tasks) =>
          tasks.put({
            ...oldTask,
            subtasks: oldTask.subtasks.filter(
              (subtask: string) => subtask !== subtaskId
            ),
          })
        );
      });
    }),
  ];
};
