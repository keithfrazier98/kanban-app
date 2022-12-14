import { rest } from "msw";
import { IBoardData, IColumnPostBody, TxHelpers } from "../../@types/types";
import { updateColumns } from "../mock/columnHandlers";
import { send405WithBody } from "./utils";
import { nanoid } from "@reduxjs/toolkit";

const RESPONSE_DELAY = 0;

/**
 *  Definitions for CRUD opertations on the boards table.
 */
export const getBoardHandlers = (helpers: TxHelpers) => {
  const { boardTx } = helpers;
  return [
    //handles GET /boards requests
    rest.get("/kbapi/boards", async (_, res, ctx) => {
      const boards = await boardTx((boards) => boards?.getAll());
      return res(ctx.status(200), ctx.delay(RESPONSE_DELAY), ctx.json(boards));
    }),

    //handles POST /boards requests
    rest.post("/kbapi/boards", async (req, res, ctx) => {
      const { newName: name, ...rest }: IColumnPostBody = await req.json();

      try {
        if (!name) throw new Error("newName field is missing in request body.");

        const id = nanoid();
        await boardTx((boards) =>
          boards.add({
            id,
            name,
            columns: [],
          })
        );

        updateColumns({ ...rest, boardId: id, newName: null }, helpers);
        return res(ctx.status(201));
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

      try {
        if (!board) throw new Error("No board data found in request body.");
        const update = await boardTx((boards) => boards.put(board));
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

      try {
        if (!boardId) {
          throw new Error("No ID found in url request parameters.");
        } else if (typeof boardId === "string") {
          // deletion response should be undefined is successful
          const deletion = await boardTx((board) => board.delete(boardId));
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
