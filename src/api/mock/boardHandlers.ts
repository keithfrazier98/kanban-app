import { rest } from "msw";
import { db } from ".";
import { IBoardData } from "../../@types/types";
import { updateColumns } from "./columnHandlers";
import { send405WithBody } from "./utils";

const RESPONSE_DELAY = 0;

/**
 *  Definitions for CRUD opertations on the boards table.
 */
export const boardHandlers = [
  //handles GET /boards requests
  rest.get("/kbapi/boards", (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.delay(RESPONSE_DELAY),
      ctx.json(db.board.getAll())
    );
  }),

  rest.post("/kbapi/boards", async (req, res, ctx) => {
    const { newName: name, ...rest } = await req.json();
    if (!name) {
      send405WithBody(
        res,
        ctx,
        {},
        "newName field is missing in request body."
      );
    }

    const newBoard = db.board.create({ name });

    return updateColumns({ ...rest, boardId: newBoard.id }, res, ctx);
  }),
  rest.put("/kbapi/boards", async (req, res, ctx) => {
    const { board }: { board: IBoardData } = await req.json();
    try {
      if (!board) throw new Error("No board data found in request body.");
      const update = db.board.update({
        where: { id: { equals: board.id } },
        data: board,
      });

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
        send405WithBody(res, ctx, {}, "No ID found in url request parameters.");
      } else if (typeof boardId === "string") {
        db.board.delete({ where: { id: { equals: boardId } } });
        return res(ctx.status(204));
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
