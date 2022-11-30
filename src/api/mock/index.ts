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

// This configures a Service Worker with the given request
export const getWorker = (
  handlers: RestHandler<MockedRequest<DefaultBodyType>>[]
) => setupWorker(...handlers);

export const getServer = (
  handlers: RestHandler<MockedRequest<DefaultBodyType>>[]
) => setupServer(...handlers);

export const initializeServiceWorkers = (test: boolean = false) => {
  const handlers = handlerConstructor();
  if (test) {
    const server = getServer(handlers);
    server.listen({ onUnhandledRequest: "bypass" });
  } else {
    const worker = getWorker(handlers);
    worker.start({ onUnhandledRequest: "bypass" });
  }
};
