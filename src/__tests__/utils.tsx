import { SetupServerApi } from "msw/node";
import { render, RenderResult, waitFor } from "@testing-library/react";
import { connectToIDB } from "src/api/indexeddb";
import { initServiceServer } from "src/api/mock";
import { store } from "../redux/store";
import { Provider } from "react-redux";
import App from "../App";
import { act } from "react-dom/test-utils";
import { indexedDB } from "fake-indexeddb";

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
  server = initServiceServer(database);

  app = render(
    <Provider store={store}>
      <App />
    </Provider>
  );
};

export const closeTest = (app: AppRenderResult, server: SetupServerApi) => {
  app.unmount();
  server.close();
};

export const openEditBoard = async (app: AppRenderResult) => {
  const openEditBoard = app.getByText("Edit Board");
  act(() => openEditBoard.click());
  await waitFor(() => {
    expect(app.getByTestId(/edit_board_modal/)).toBeInTheDocument();
  });
};

export const openBoardOptions = async (app: AppRenderResult) => {
  //get all since mobile and desktop header are mounted at this point
  const boardOptionsBtn = app.getAllByTestId(/board_options_btn/);
  act(() => boardOptionsBtn[0].click());

  await waitFor(() => {
    expect(app.getByTestId(/board_options_modal/)).toBeInTheDocument();
  });
};

export const waitForModalToClose = async (
  app: AppRenderResult,
  testId: string
) => {
  await waitFor(() => {
    expect(app.queryByTestId(testId)).toBeNull();
  });
};
