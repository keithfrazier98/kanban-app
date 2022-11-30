import { setupWorker, RestHandler, MockedRequest, DefaultBodyType } from "msw";
import { setupServer } from "msw/node";
import { boardHandlers } from "./boardHandlers";
import { columnHandlers } from "./columnHandlers";
import { taskHandlers } from "./taskHandlers";
import { subtaskHandlers } from "./subtaskHandlers";

// MSW REST API handlers
export const handlerConstructor = () => [
  ...boardHandlers,
  ...columnHandlers,
  ...taskHandlers,
  ...subtaskHandlers,
];

/**
 * Setup service server for Node Env (to be used in tests)
 * @returns service server with it already listening
 */
export const initServiceServer = () => {
  const handlers = handlerConstructor();

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
