import { setupWorker } from "msw";
import { setupServer } from "msw/node";
import { getBoardHandlers } from "./boardHandlers";
import { columnHandlers } from "./columnHandlers";
import { taskHandlers } from "./taskHandlers";
import { subtaskHandlers } from "./subtaskHandlers";
import { getTxHelpers } from "../indexeddb";

// MSW REST API handlers
export const handlerConstructor = (mockDB?: IDBDatabase) => {
  const helpers = getTxHelpers(mockDB);

  return [
    ...getBoardHandlers(helpers),
    ...columnHandlers(helpers),
    ...taskHandlers(helpers),
    ...subtaskHandlers(helpers),
  ];
};

/**
 * Setup service server for Node Env (to be used in tests)
 * @returns service server with it already listening
 */
export const initServiceServer = (mockDB?: IDBDatabase) => {
  const handlers = handlerConstructor(mockDB);

  const server = setupServer(...handlers);
  server.listen({ onUnhandledRequest: "bypass" });
  return server;
};

/**
 *
 * Setup service worker to intercept requests
 * @returns worker handle for worker already started
 */
export const initServiceWorkers = () => {
  const handlers = handlerConstructor();

  const worker = setupWorker(...handlers);
  worker.start({ onUnhandledRequest: "bypass" });
  return worker;
};
