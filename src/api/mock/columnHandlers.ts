import { nanoid } from "@reduxjs/toolkit";
import { rest, ResponseComposition, DefaultBodyType, RestContext } from "msw";
import { Columns } from "tabler-icons-react";
import { IBoardData, IColumn, IColumnPostBody } from "../../@types/types";
import { getObjectStore } from "../indexeddb";
import { getBoardsStore } from "./boardHandlers";
import {
  dbActionErrorWrapper,
  idToString,
  paramMissing,
  send405WithBody,
  waitForDBResponse,
} from "./utils";

const RESPONSE_DELAY = 0;

export const getColumnStore = () => getObjectStore("columns", "readwrite");

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

    const boardStore = getBoardsStore();
    const columns = getColumnStore();

    const oldBoard: IBoardData = await waitForDBResponse(
      boardStore.get(boardId)
    );

    if (!oldBoard)
      throw new Error(`No board was found with provided id: ${boardId}`);

    if (newName) {
      boardStore.put({ ...oldBoard, name: newName });
    }

    if (!updates && !additions && !deletions) {
      throw new Error(
        "No additions, updates, or deletions found in the request body."
      );
    }

    let response: any = [];

    const columnOrder = oldBoard.columns;

    updates.forEach((col) => {
      columns.put(col);
    });

    additions.forEach((col) => {
      const id = nanoid();
      columns.add({ ...col, id });
      columnOrder.push(id);
    });

    deletions.forEach((col) => {
      columns.delete(col.id);
      columnOrder.filter((id) => col.id !== id);
    });

    boardStore.put({ ...oldBoard, columns });

    return res(
      ctx.status(201),
      ctx.delay(RESPONSE_DELAY),
      ctx.json({ column: response })
    );
  } catch (error) {
    return send405WithBody(
      res,
      ctx,
      error,
      "An error occured when updating the columns."
    );
  }
}

/**
 *  Definitions for CRUD opertations on the columns table.
 */
export const columnHandlers = [
  //handles GET /columns requests
  rest.get("/kbapi/columns", async (req, res, ctx) => {
    const boardId = req.url.searchParams.get("boardId");
    if (!boardId) {
      return paramMissing(res, ctx, "boardID", "query");
    }

    const columnStore = getColumnStore();
    const columnIndex = columnStore.index("by_board");
    console.log(columnIndex)
    const columnsByBoard: IColumn[] = await waitForDBResponse(
      columnIndex.getAll(boardId)
    );

    return res(
      ctx.status(200),
      ctx.delay(RESPONSE_DELAY),
      ctx.json(columnsByBoard)
    );
  }),
  // //handles POST /columns (adds new column or columns)
  // rest.post("/kbapi/columns", async (req, res, ctx) => {
  //   const { columns } = await req.json<{ columns: IColumnPostBody }>();
  //   return updateColumns(columns, res, ctx);
  // }),
  // // handles DELETE /columns (deletes col by id)
  // rest.delete("/kbapi/columns/:id", async (req, res, ctx) => {
  //   const { id: idParam } = req.params;
  //   const id = idToString(idParam);
  //   return dbActionErrorWrapper(id, res, ctx, () =>
  //     db.column.delete({ where: { id: { equals: id } } })
  //   );
  // }),
  // // handles PATCH /columns (updates single column)
  // rest.patch("/kbapi/columns", async (req, res, ctx) => {
  //   const { id, name }: IColumn = await req.json();
  //   return dbActionErrorWrapper(id, res, ctx, () =>
  //     db.column.update({ where: { id: { equals: id } }, data: { name } })
  //   );
  // }),
];
