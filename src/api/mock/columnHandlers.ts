import { rest } from "msw";
import { db } from ".";
import { IBoardColumn } from "../../@types/types";
import { dbActionErrorWrapper, idToString, paramMissing } from "./utils";

const RESPONSE_DELAY = 0;
/**
 *  Definitions for CRUD opertations on the columns table.
 */
export const columnHandlers = [
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
