import { act, waitFor } from "@testing-library/react";
import { SetupServerApi } from "msw/lib/node";
import {
  AppRenderResult,
  closeTest,
  getIdFromColumnTitle,
  getIdFromTaskTitle,
  setupTest,
  waitForAllByText,
  regexSelectors,
  openViewTask,
} from "./utils";

const { addNewTask, createNewTaskBtnTxt } = regexSelectors;

describe("task features should work as expected", () => {
  let server: SetupServerApi;
  let database: IDBDatabase;
  let app: AppRenderResult;

  beforeEach(async () => {
    //before each test test up MSW and IDB and switch to the Roadmap baord
    [database, server, app] = await setupTest(indexedDB);
    await waitForAllByText(app, /Roadmap/);
    const platformLaunchBtn = app.getByTestId("board_menu_item_Roadmap");

    act(() => platformLaunchBtn.click());
  });

  afterEach(async () => {
    closeTest(app, server);
  });

  const getColumnContainer = (id: string | undefined) =>
    app.findByTestId(`column_container_${id}`);

  const assertColumnChildren = async (col: string, childAmount: number) => {
    const colId = await getIdFromColumnTitle(app, col);
    const colContainer = await getColumnContainer(colId);
    expect(colContainer.childNodes.length).toEqual(childAmount);
    return colContainer;
  };

  const assertPlaceholder = (colContainer: HTMLElement, expected: boolean) => {
    const placeholder = colContainer.querySelector("#task_placeholder");
    if (expected) expect(placeholder).toBeInTheDocument();
    else expect(placeholder).not.toBeInTheDocument();
  };

  test("tasks status can be changed", async () => {
    // assert there is 1 child in an empty column
    const colContainerNext = await assertColumnChildren("NEXT", 1);

    // expect a the placeholder to be the child node of an empty column
    assertPlaceholder(colContainerNext, true);

    // expect the "now" column to have two child nodes (two tasks)
    await assertColumnChildren("NOW", 2);

    // open view task
    const taskId = await getIdFromTaskTitle(app, "Launch version one");

    act(() => {
      app.getByTestId(`open_task_btn_${taskId}`).click();
    });

    expect(await app.findByTestId("view_task_modal")).toBeInTheDocument();

    // change status of a task from now to next
    act(async () => {
      (await app.findByTestId("task_status_dropdown")).click();
      (await app.findByTestId(`status-Next`)).click();
    });

    // assert that there is now only 1 child in the now column
    await assertColumnChildren("NOW", 1);

    // check the amount of tasks in the next column has changed
    const newNextCol = await assertColumnChildren("NEXT", 1);
    assertPlaceholder(newNextCol, false);
  });

  test("tasks can be added", async () => {
    await assertColumnChildren("NOW", 2);

    // open add task modal
    const addTaskBtn = await app.findByText(addNewTask);
    act(() => {
      addTaskBtn.click();
    });

    // add tasks to the now column
    const createTaskBtn = await app.findByText(createNewTaskBtnTxt);
    act(() => {
      Array(10).forEach(() => {
        createTaskBtn.click();
      });
    });

    // check the new task is in the document
    await assertColumnChildren("NOW", 12);
  });

  test("tasks can be deleted", async () => {
    // Select a board with known tasks
    const platformLaunchBtn = app.getByTestId(
      "board_menu_item_Platform Launch"
    );

    act(() => {
      platformLaunchBtn.click();
    });

    // open the view task modal
    await openViewTask(app);

    // open task options
    const taskOptions = await app.findByTestId("task_options_btn");
    act(() => {
      taskOptions.click();
    });

    // open delete task modal
    const deleteTaskBtn = await app.findByText("Delete Task");
    act(() => {
      deleteTaskBtn.click();
    });

    // delete task and wait for modal to close
    await waitFor(() => {
      expect(app.getByTestId("delete_task_modal")).not.toBeInTheDocument();
    });

    // check that that task is no longer in the document
    await waitFor(() => {
      expect(
        app.getByText("Build UI for onboarding flow")
      ).not.toBeInTheDocument();
    });
  });
  
  test("tasks can be added to a new column (with add task button)", () => {
    // create a new column
    // open the add task modal
    // add a new task and set its status to the new column
    // check that the new column has a task in it
  });
});
