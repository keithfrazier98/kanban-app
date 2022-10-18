import { rest } from "msw";
import { db } from ".";

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
  ];