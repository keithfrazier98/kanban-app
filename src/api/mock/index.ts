import { setupWorker, RestHandler, MockedRequest, DefaultBodyType } from "msw";
import { boardHandlers } from "./boardHandlers";
// import { columnHandlers } from "./columnHandlers";
// import { taskHandlers } from "./taskHandlers";
// import { subtaskHandlers } from "./subtaskHandlers";

// MSW REST API handlers
export const handlerConstructor = () => [
  ...boardHandlers,
  // ...columnHandlers,
  // ...taskHandlers,
  // ...subtaskHandlers,
];

// This configures a Service Worker with the given request
export const getWorker = (
  handlers: RestHandler<MockedRequest<DefaultBodyType>>[]
) => setupWorker(...handlers);
