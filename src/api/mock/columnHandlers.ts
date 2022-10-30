import { rest, ResponseComposition, DefaultBodyType, RestContext } from "msw";
import { db } from ".";
import { IColumn, IColumnPostBody } from "../../@types/types";
import {
  dbActionErrorWrapper,
  idToString,
  paramMissing,
  send405WithBody,
} from "./utils";

const RESPONSE_DELAY = 0;

export async function updateColumns(
  req: IColumnPostBody,
  res: ResponseComposition<DefaultBodyType>,
  ctx: RestContext
) {
  try {
    const {
      additions = [],
      updates = [],
      deletions = [],
      boardId,
      newName,
    } = req;

    if (newName) {
      db.board.update({
        where: { id: { equals: boardId } },
        data: { name: newName },
      });
    }

    const board = db.board.findFirst({
      where: { id: { equals: boardId } },
    });


    if (!updates && !additions && !deletions) {
      return res(
        ctx.status(405),
        ctx.delay(RESPONSE_DELAY),
        ctx.json({
          error:
            "No additions, updates, or deletions found in the request body.",
        })
      );
    }

    if (!board)
      return send405WithBody(
        res,
        ctx,
        {},
        `No board was found with provided id: ${boardId}`
      );

    let response: any = [];

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

    deletions.forEach((col) => {
      response.push(db.column.delete({ where: { id: { equals: col.id } } }));
    });

    return res(
      ctx.status(201),
      ctx.delay(RESPONSE_DELAY),
      ctx.json({ column: response })
    );
  } catch (error) {
    return send405WithBody(res, ctx, error, "");
  }
}

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
    const { columns } = await req.json<{ columns: IColumnPostBody }>();
    return updateColumns(columns, res, ctx);
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
