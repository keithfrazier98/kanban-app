import { SetupServerApi } from "msw/node";
import { render, RenderResult } from "@testing-library/react";
import { connectToIDB } from "src/api/indexeddb";
import { initServiceServer } from "src/api/mock";
import { store } from "../redux/store";
import { Provider } from "react-redux";
import App from "../App";

export type AppRenderResult = RenderResult<
  typeof import("/Users/keith/development/kanban-project/kanban-app/node_modules/@testing-library/dom/types/queries"),
  HTMLElement,
  HTMLElement
>;

export const setupTest = async (
  database: IDBDatabase,
  server: SetupServerApi,
  app: AppRenderResult
) => {
  database = await connectToIDB(() => {}, indexedDB);
  server = initServiceServer();

  app = render(
    <Provider  store={store}>
      <App />
    </Provider>
  );
};

export const closeTest = (app: AppRenderResult, server: SetupServerApi) => {
  app.unmount();
  server.close();
};
