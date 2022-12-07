import { act } from "@testing-library/react";
import { SetupServerApi } from "msw/node";
import { AppRenderResult, closeTest, setupTest } from "./utils";

describe("column ui renders as expected", () => {
  let server: SetupServerApi;
  let database: IDBDatabase;
  let app: AppRenderResult;

  beforeEach(async () => {
    await setupTest(database, server, app);
  });

  afterEach(async () => {
    closeTest(app, server);
  });

  test("column name renders correctly", () => {
    const platformLaunchBtn = app.getByTestId(
      "board_menu_item_Platform Launch"
    );

    act(() => platformLaunchBtn.click());

    const columns = app.getAllByTestId(/column_name/);
    expect(columns.length).toBe(3);

    columns.forEach((col) => {
      const colNameEl = col.getElementsByTagName("h2");
      expect(["TODO", "DOING", "DONE"]).toContain(colNameEl[0].innerHTML);
    });
  });
});
