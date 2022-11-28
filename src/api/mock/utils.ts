import { DefaultBodyType, ResponseComposition, RestContext } from "msw";

const RESPONSE_DELAY = 0;

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

export function paramMissing(
  res: ResponseComposition<DefaultBodyType>,
  ctx: RestContext,
  field: string,
  type: string
) {
  return res(
    ctx.status(405),
    ctx.delay(RESPONSE_DELAY),
    ctx.json({
      message: `No ${field} was found in the ${type} paramaters.`,
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
export function dbActionErrorWrapper(
  id: string,
  res: ResponseComposition<DefaultBodyType>,
  ctx: RestContext,
  dbAction: () => void
) {
  if (!id) {
    return send405WithBody(
      res,
      ctx,
      {},
      `Depending on your request, no ID was found in either 
        the search parameters, request parameters, or the 
        request body.`
    );
  }

  try {
    dbAction();
    return res(ctx.status(204), ctx.delay(RESPONSE_DELAY));
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

export async function waitForDBResponse(request: IDBRequest): Promise<any> {
  return await new Promise((resolve, reject) => {
    setInterval(() => {
      if (request.readyState === "done") {
        resolve(request.result);
      }
    }, 5);
  });
}
