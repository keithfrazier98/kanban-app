import { rest } from "msw";
import { db } from ".";
import {
  IColumn,
  IColumnConstructor,
  IColumnPostBody,
} from "../../@types/types";
import {
  dbActionErrorWrapper,
  idToString,
  paramMissing,
  send405WithBody,
} from "./utils";

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

  //handles POST /columns (adds new column or columns)
  rest.post("/kbapi/columns", async (req, res, ctx) => {
    const {
      columns: { additions, updates, boardId },
    } = await req.json<{ columns: IColumnPostBody }>();

    const board = db.board.findFirst({
      where: { id: { equals: boardId } },
    });

    if (!board)
      return send405WithBody(
        res,
        ctx,
        {},
        `No board was found with provided id: ${boardId}`
      );

    if (!updates && !additions) {
      return res(
        ctx.status(405),
        ctx.delay(RESPONSE_DELAY),
        ctx.json({
          error: "No additions or updates found in the request body.",
        })
      );
    }

    let response: any = [];

    try {
      updates.forEach((col) => {
        const { board: old, ...rest } = col;
        db.column.update({
          where: { id: { equals: col.id } },
          data: { ...rest, board },
        });
      });

      additions.forEach((col) => {
        response.push(db.column.create({ ...col, board }));
      });

      return res(
        ctx.status(201),
        ctx.delay(RESPONSE_DELAY),
        ctx.json({ column: response })
      );
    } catch (error) {
      return send405WithBody(res, ctx, error, "");
    }
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
    const { id, name }: IColumn = await req.json();
    return dbActionErrorWrapper(id, res, ctx, () =>
      db.column.update({ where: { id: { equals: id } }, data: { name } })
    );
  }),
];
