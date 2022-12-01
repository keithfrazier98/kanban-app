import { rest } from "msw";
import { IBoardData, IColumnPostBody } from "../../@types/types";
import { updateColumns } from "../mock/columnHandlers";
import { send405WithBody, waitForDBResponse } from "./utils";
import { getObjectStore } from "../indexeddb";
import { nanoid } from "@reduxjs/toolkit";

const RESPONSE_DELAY = 0;

export const getBoardsStore = (mockDB?: IDBDatabase) =>
  getObjectStore("boards", "readwrite", mockDB);

/**
 *  Definitions for CRUD opertations on the boards table.
 */
export const getBoardHandlers = (mockDB?: IDBDatabase) => {
  return [
    //handles GET /boards requests
    rest.get("/kbapi/boards", async (_, res, ctx) => {
      const boardStore = getBoardsStore(mockDB);
      const boardsRequest = boardStore?.getAll();
      const boards: IBoardData[] = await waitForDBResponse(boardsRequest);
      console.log(boards)
      return res(ctx.status(200), ctx.delay(RESPONSE_DELAY), ctx.json(boards));
    }),

    //handles POST /boards requests
    rest.post("/kbapi/boards", async (req, res, ctx) => {
      const { newName: name, ...rest }: IColumnPostBody = await req.json();

      try {
        if (!name) throw new Error("newName field is missing in request body.");
        const boardStore = getBoardsStore(mockDB);

        const id = nanoid();
        boardStore.add({ id, name });

        return updateColumns({ ...rest, boardId: id, newName: name }, res, ctx);
      } catch (error) {
        return send405WithBody(
          res,
          ctx,
          {},
          "An error occured when trying to create a new board."
        );
      }
    }),
    rest.put("/kbapi/boards", async (req, res, ctx) => {
      const { board }: { board: IBoardData } = await req.json();
      const boardStore = getBoardsStore();

      try {
        if (!board) throw new Error("No board data found in request body.");
        const update = boardStore.put(board, board.id);

        if (update) {
          return res(ctx.status(204));
        } else {
          throw new Error(
            "No response from DB, the entity may or may not have been updated."
          );
        }

        // return res(ctx.status(204));
      } catch (error) {
        return send405WithBody(
          res,
          ctx,
          error,
          "An error occurred when trying to update a board entity."
        );
      }
    }),

    rest.delete("/kbapi/boards/:boardId", async (req, res, ctx) => {
      const { boardId } = req.params;
      const boardStore = getBoardsStore(mockDB);
      try {
        if (!boardId) {
          send405WithBody(
            res,
            ctx,
            {},
            "No ID found in url request parameters."
          );
        } else if (typeof boardId === "string") {
          // deletion response should be undefined is successful
          const deletion = await waitForDBResponse(boardStore.delete(boardId));
          if (!deletion) return res(ctx.status(204));
        } else {
          throw new Error("Invalid board ID in url request parameters. ");
        }
      } catch (error) {
        send405WithBody(
          res,
          ctx,
          error,
          "An error occured when trying to delete the board entity. "
        );
      }
    }),
  ];
};
