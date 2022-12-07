import { nanoid } from "@reduxjs/toolkit";
import { rest, ResponseComposition, DefaultBodyType, RestContext } from "msw";
import { IBoardData, IColumn, IColumnPostBody } from "../../@types/types";
import {
  boardTx,
  columnTx,
  getColumnStore,
  idToString,
  send405WithBody,
  waitForDBResponse,
} from "./utils";

const RESPONSE_DELAY = 0;

export async function updateColumns(req: IColumnPostBody) {
  const {
    additions = [],
    updates = [],
    deletions = [],
    boardId,
    newName,
  } = req;

  const oldBoard: IBoardData = await boardTx((boards) => boards.get(boardId));

  let response: any = [];

  const columnOrder = oldBoard.columns;

  updates.forEach((col) => {
    columnTx((columns) => columns.put(col));
  });

  additions.forEach((col) => {
    const id = nanoid();
    columnTx((columns) => columns.add({ ...col, id, board: boardId }));
    columnOrder.push(id);
  });

  deletions.forEach((col) => {
    columnTx((columns) => columns.delete(col.id));
    columnOrder.filter((id) => col.id !== id);
  });

  boardTx((boards) =>
    boards.put({
      ...oldBoard,
      columns: columnOrder,
      name: newName || oldBoard.name,
    })
  );

  return { column: response };
}

/**
 *  Definitions for CRUD opertations on the columns table.
 */
export const columnHandlers = [
  //handles GET /columns requests
  rest.get("/kbapi/columns", async (req, res, ctx) => {
    const boardId = req.url.searchParams.get("boardId");
    if (!boardId) {
      return send405WithBody(res, ctx, {}, "Invalid boardId");
    }

    const columnIndex = getColumnStore().index("by_board");
    const columnsByBoard: IColumn[] = await waitForDBResponse(
      columnIndex.getAll(boardId)
    );

    return res(
      ctx.status(200),
      ctx.delay(RESPONSE_DELAY),
      ctx.json(columnsByBoard)
    );
  }),

  //handles POST /columns (adds new column or columns)
  rest.post("/kbapi/columns", async (req, res, ctx) => {
    const { columns } = await req.json<{ columns: IColumnPostBody }>();
    const response = await updateColumns(columns);
    return res(ctx.status(200), ctx.json(response), ctx.delay(RESPONSE_DELAY));
  }),

  // handles DELETE /columns (deletes col by id)
  rest.delete("/kbapi/columns/:id", async (req, res, ctx) => {
    const { id: idParam } = req.params;
    const id = idToString(idParam);
    const deletion = columnTx((columns) => columns.delete(id));
    if (!deletion) return res(ctx.status(204));
  }),

  // handles PATCH /columns (updates single column)
  rest.patch("/kbapi/columns", async (req, res, ctx) => {
    const column: IColumn = await req.json();

    try {
      const update = columnTx((columns) => columns.put(column));
      if (!update) throw new Error("Couldn't update the column.");

      return res(ctx.status(204));
    } catch (error) {
      send405WithBody(
        res,
        ctx,
        error,
        "An exception was caught while trying to update a column: "
      );
    }
  }),
];
