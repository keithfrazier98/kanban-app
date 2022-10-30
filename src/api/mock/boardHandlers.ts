import { rest } from "msw";
import { db } from ".";
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

    updateColumns({ ...rest, boardId: newBoard.id }, res, ctx);
  }),
];
