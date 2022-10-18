import { rest } from "msw";
import { db } from ".";
import { IBoardTask } from "../../@types/types";
import { dbActionErrorWrapper, paramMissing } from "./utils";

const RESPONSE_DELAY = 0;
/**
 *  Definitions for CRUD opertations on the tasks table.
 */
export const taskHandlers = [
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
    const {
      id,
      column: oldColumn,
      board,
      ...rest
    }: IBoardTask = await req.json();
    return dbActionErrorWrapper(id, res, ctx, () => {
      const task = db.task.findFirst({ where: { id: { equals: id } } });

      let newColumn = task?.column;
      if (rest.status !== oldColumn.name) {
        const entity = db.column.findFirst({
          where: { name: { equals: rest.status } },
        });

        if (entity) newColumn = entity;
      }

      db.task.update({
        where: { id: { equals: id } },
        data: { ...rest, column: newColumn },
      });
    });
  }),
];
