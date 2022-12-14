import { DefaultBodyType, ResponseComposition, RestContext } from "msw";
import { datatypes, TxCallback, TxHelpers } from "src/@types/types";
import { getObjectStore } from "../indexeddb";

const RESPONSE_DELAY = 0;

/**
 * Responds to the request with a 405 code and error message.
 * @param res
 * @param ctx
 * @param error
 * @param message
 * @returns
 */
export function send405WithBody(
  res: ResponseComposition<DefaultBodyType>,
  ctx: RestContext,
  error: any,
  message: string
) {
  return res(
    ctx.status(405),
    ctx.delay(RESPONSE_DELAY),
    ctx.json({
      error,
      message,
    })
  );
}

/**
 * Wraps the supplied dbAction in a try/catch and responds with a 405
 * if an error is caught or the id is falsy.
 * @param id
 * @param res
 * @param ctx
 * @param dbAction
 * @returns
 */
export async function dbActionErrorWrapper(
  id: any,
  res: ResponseComposition<DefaultBodyType>,
  ctx: RestContext,
  dbAction: () => Promise<any>
) {
  if (typeof id !== "string") {
    return send405WithBody(
      res,
      ctx,
      {},
      `Depending on your request, no ID or an invalid ID was found in either 
        the search parameters, request parameters, or the 
        request body.`
    );
  }

  try {
    await dbAction();
  } catch (error) {
    return send405WithBody(
      res,
      ctx,
      error,
      "Failed to perform operation in the DB."
    );
  }
}

export const idToString = (id: any): string =>
  typeof id === "string" ? id : "";

