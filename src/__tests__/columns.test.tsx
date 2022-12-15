import { act, waitFor } from "@testing-library/react";
import { indexedDB } from "fake-indexeddb";
import { SetupServerApi } from "msw/node";
import {
  AppRenderResult,
  closeTest,
  openEditBoard,
  saveChanges,
  setupTest,
  waitForModalToClose,
} from "./utils";

describe("column features work as expected", () => {
  let server: SetupServerApi;
  let database: IDBDatabase;
  let app: AppRenderResult;

  beforeEach(async () => {
    [database, server, app] = await setupTest(indexedDB);
  });

  afterEach(async () => {
    closeTest(app, server);
  });

  test("column name renders correctly", () => {
    // Select a board with known columns
    const platformLaunchBtn = app.getByTestId(
      "board_menu_item_Platform Launch"
    );

    act(() => platformLaunchBtn.click());

    // get all column name elements
    const columns = app.getAllByTestId(/column_name/);
    expect(columns.length).toBe(3);

    // expect a known set of columns to be present
    columns.forEach((col) => {
      const colNameEl = col.getElementsByTagName("h2");
      expect(["TODO", "DOING", "DONE"]).toContain(colNameEl[0].innerHTML);
    });
  });

  test("columns can be deleted", async () => {
    //select all the columns
    const columns = app.getAllByTestId("column");

    // open edit board
    await openEditBoard(app);
    const deleteColBtn = app.getAllByTestId("delete_col_btn");

    // delete a col and save the changes
    act(() => deleteColBtn[0].click());
    saveChanges(app);

    // get the new columns and expect there to be less than before
    const newColumns = app.getAllByTestId("column");
    expect(columns.length).toBeGreaterThan(newColumns.length);
  });

  const getColumnInputs = () => {
    return app.getAllByTestId("column_name_input") as HTMLInputElement[];
  };

  test("columns can be added", async () => {
    // get the existing columns and open edit board
    const columns = app.getAllByTestId("column");
    await openEditBoard(app);

    // add a new column and give it a name
    act(() => app.getByText(/Add New Column/).click());
    const columnInputs = getColumnInputs();
    const newColName = "testing123";
    act(() => (columnInputs[columnInputs.length - 1].value = newColName));

    // save the changes and wait for the modal to close
    saveChanges(app);
    await waitForModalToClose(app, "edit_board_modal");

    // expect there to be less columns
    const newColumns = app.getAllByTestId("column");
    expect(columns.length).toBeLessThan(newColumns.length);

    // expect the new column to be in the document
    const newColumn = app.getByText(newColName);
    expect(newColumn).toBeInTheDocument();
  });

  test("columns can be edited", async () => {
    // open edit board and get the first input
    await openEditBoard(app);
    const column = getColumnInputs()[0];

    // update the name
    let updatedName = "updated name";
    column.value = updatedName;

    // save and wait for the modal to close
    saveChanges(app);
    await waitForModalToClose(app, "edit_board_modal");

    // expect the new name to be in the document
    expect(app.getByText(updatedName)).toBeInTheDocument();
  });

  test("columns can be added in new board modal", async () => {
    // open add board modal
    act(() => app.getByText(/Create New Board/).click());

    await waitFor(() => {
      expect(app.getByText(/Add Board/)).toBeInTheDocument();
    });

    // add two column inputs (there will be 4 total)
    const addColBtn = app.getByText(/Add New Column/);
    act(() => addColBtn.click());
    act(() => addColBtn.click());

    const columnInputs = getColumnInputs();

    const newCol1 = "Done";
    const newCol2 = "Review";
    columnInputs[2].value = newCol1;
    columnInputs[3].value = newCol2;

    // save board and wait for modal to close
    act(() => {
      app.getByText(/Add New Board/).click();
    });

    await waitForModalToClose(app, "add_board_modal");

    // test that the two new columns and the default columns exist
    const columns = app.getAllByTestId("column");
    expect(columns).toHaveLength(4);
    [newCol1, newCol2, "Todo", "Doing"].forEach((name) => {
      expect(app.getByText(name)).toBeInTheDocument();
    });
  });
});
