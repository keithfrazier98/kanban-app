import { waitFor, act } from "@testing-library/react";
import { indexedDB } from "fake-indexeddb";
import { SetupServerApi } from "msw/node";
import {
  AppRenderResult,
  closeTest,
  setupTest,
  waitForAllByText,
} from "./utils";

export const openViewTask = async (app: AppRenderResult) => {
  await app.findAllByText(/Roadmap/);
  const tasks = await app.findAllByTestId(/open_task_btn/);

  act(() => {
    console.log("Total tasks on board", tasks.length);
    tasks[0].click();
  });

  expect(await app.findByTestId("view_task_modal")).toBeInTheDocument();
};

describe("subtask features work as expected", () => {
  let server: SetupServerApi;
  let database: IDBDatabase;
  let app: AppRenderResult;

  beforeEach(async () => {
    [database, server, app] = await setupTest(indexedDB);
    await Promise.resolve((res: any) => {
      setTimeout(() => {
        res();
      }, 2000);
    });
  });

  afterEach(async () => {
    closeTest(app, server);
  });

  test("subtasks can be marked as complete and incomplete", async () => {
    await waitForAllByText(app, /Roadmap/);
    // Select a board with known tasks
    const platformLaunchBtn = app.getByTestId(
      "board_menu_item_Platform Launch"
    );

    act(() => platformLaunchBtn.click());

    await openViewTask(app);
    const subtask = await app.findByTestId(/subtask_checkbox/);
    console.log(subtask.dataset);
  });

  // test("subtasks can be deleted", () => {});
  // test("subtasks can be reordered", () => {});
  // test("subtasks can be created on existing task", () => {});
  // test("subtasks can be created on a new task", () => {});
  // test("subtasks titles can be changed", () => {});
});
