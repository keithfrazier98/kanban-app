import { DefaultBodyType, ResponseComposition, RestContext } from "msw";
import { datatypes } from "src/@types/types";
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

export async function waitForDBResponse(request: IDBRequest): Promise<any> {
  return await new Promise((resolve, reject) => {
    const interval = setInterval(() => {
      if (request.readyState === "done") {
        clearInterval(interval);
        resolve(request.result);
      }
    }, 5);
  });
}

export async function executeDbTx(store: datatypes, cb: TxCallback) {
  let transaction;

  switch (store) {
    case "boards":
      transaction = getBoardsStore();
      break;
    case "columns":
      transaction = getColumnStore();
      break;
    case "subtasks":
      transaction = getSubtaskStore();
      break;
    default:
      transaction = getTaskStore();
      break;
  }

  return await waitForDBResponse(cb(transaction));
}

type TxCallback = (transaction: IDBObjectStore) => any;

export async function columnTx(cb: TxCallback) {
  return await executeDbTx("columns", cb);
}

export async function boardTx(cb: TxCallback) {
  return await executeDbTx("boards", cb);
}

export async function subtaskTx(cb: TxCallback) {
  return await executeDbTx("subtasks", cb);
}

export async function taskTx(cb: TxCallback) {
  return await executeDbTx("tasks", cb);
}

export function getBoardsStore(mockDB?: IDBDatabase) {
  return getObjectStore("boards", "readwrite", mockDB);
}

export function getColumnStore(mockDB?: IDBDatabase) {
  return getObjectStore("columns", "readwrite", mockDB);
}

export function getSubtaskStore(mockDB?: IDBDatabase) {
  return getObjectStore("subtasks", "readwrite", mockDB);
}

export function getTaskStore(mockDB?: IDBDatabase) {
  return getObjectStore("tasks", "readwrite", mockDB);
}
