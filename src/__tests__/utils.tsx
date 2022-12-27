import { SetupServerApi } from "msw/node";
import { render, RenderResult, waitFor } from "@testing-library/react";
import { connectToIDB } from "src/api/indexeddb";
import { initServiceServer } from "src/api/mock";
import { store } from "../redux/store";
import { Provider } from "react-redux";
import App from "../App";
import { act } from "react-dom/test-utils";

export type AppRenderResult = RenderResult<
  typeof import("/Users/keith/development/kanban-project/kanban-app/node_modules/@testing-library/dom/types/queries"),
  HTMLElement,
  HTMLElement
>;

export const setupTest = async (
  DBFactory: IDBFactory
): Promise<[IDBDatabase, SetupServerApi, AppRenderResult]> => {
  const dbInstance = await connectToIDB(() => {}, DBFactory);
  let server = initServiceServer(dbInstance);
  let app = render(
    <Provider store={store}>
      <App />
    </Provider>
  );

  return [dbInstance, server, app];
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

export const saveChanges = (app: AppRenderResult) => {
  act(() => app.getByText("Save Changes").click());
};

export const waitForAllByText = async (
  app: AppRenderResult,
  regexText: RegExp
) => {
  await waitFor(() => {
    expect(app.getAllByText(regexText)).toBeDefined();
  });
};

export const openEditTaskModal = async (app: AppRenderResult) => {
  await openViewTask(app);
  const taskOptionsBtn = await app.findByTestId("task_options_btn");
  act(() => {
    taskOptionsBtn.click();
  });

  expect(await app.findByTestId("task_options_menu")).toBeInTheDocument();

  // open edit task modal
  const openEditTaskBtn = await app.findByText("Edit Task");
  act(() => {
    openEditTaskBtn.click();
  });

  expect(await app.findByTestId("edit_task_modal")).toBeInTheDocument();
};

/**
 * This function specifically opens the first task in the Platform Launch 
 * board so that board has to be opened. 
 * @param app 
 */
export const openViewTask = async (app: AppRenderResult) => {
  await app.findByText("Build UI for onboarding flow");
  const openTaskBtns = await app.findAllByTestId(/open_task_btn/);

  act(() => {
    console.log(
      "Total tasks on board: ",
      openTaskBtns.length,
      "\nTask 1: ",
      openTaskBtns[0].getAttributeNames(),
      "\n"
    );
    const attNames = openTaskBtns[0].getAttributeNames();
    console.log(openTaskBtns[0].getAttribute(attNames[0]));
    openTaskBtns[0].click();
  });

  expect(
    await app.findByTestId(regexSelectors.viewTaskModal)
  ).toBeInTheDocument();
};

export const regexSelectors = {
  subtaskCheckbox: /subtask_checkbox/,
  subtaskIsChecked: /subtask_is_checked/,
  checkedSubtasks: /subtask_is_checked_(.*)/,
  deleteSubtask: /delete_subtask/,
  subtaskItem: /subtask_list_item/,
  subtaskInputs: /subtask_input/,
  addTaskModal: /add_task_modal/,
  addNewSubtask: /Add New Subtask/,
  addNewTask: /Add New Task/,
  saveTask: "Save Task",
  editTaskModal: "edit_task_modal",
  viewTaskModal: "view_task_modal",
  createNewTaskBtnTxt: "Create Task"
};

export const getIdFromTaskTitle = async (
  app: AppRenderResult,
  title: string
) => {
  const taskTitle = await app.findByText(title);
  const match = taskTitle.innerText.match(/task_title_(.*)/);
  if (match) return match[1];
};

export const getIdFromColumnTitle = async (
  app: AppRenderResult,
  title: string
) => {
  const columnTitle = await app.findByText(title);
  const match = columnTitle.innerText.match(/column_title_(.*)/);
  if (match) return match[1];
};
