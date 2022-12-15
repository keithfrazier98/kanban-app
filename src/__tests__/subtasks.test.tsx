import { waitFor, act, fireEvent } from "@testing-library/react";
import { indexedDB } from "fake-indexeddb";
import { SetupServerApi } from "msw/node";
import {
  AppRenderResult,
  closeTest,
  openEditTaskModal,
  openViewTask,
  setupTest,
  waitForAllByText,
  regexSelectors,
  waitForModalToClose,
} from "./utils";

const {
  subtaskCheckbox,
  subtaskIsChecked,
  deleteSubtask,
  subtaskItem,
  subtaskInputs,
  addTaskModal,
  addNewSubtask,
  addNewTask,
  saveTask: saveTaskSelector,
  editTaskModal,
} = regexSelectors;

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
    await waitForAllByText(app, /Roadmap/);
    // Select a board with known tasks
    const platformLaunchBtn = app.getByTestId(
      "board_menu_item_Platform Launch"
    );

    act(() => platformLaunchBtn.click());
  });

  afterEach(async () => {
    closeTest(app, server);
  });

  test("subtasks can be marked as complete and incomplete", async () => {
    // open viewTaskModal on the first task and wait for content to load
    await openViewTask(app);
    await app.findAllByText("Sign up page");

    const getTestId = (subtask: HTMLElement) =>
      subtask.getAttribute("data-testid");

    // get all the subtasks and their ids
    const subtasks = await app.findAllByTestId(subtaskCheckbox);
    // const allIds = subtasks.map((subtask) => {
    //   const testid = getTestId(subtask);
    //   const subtaskId = testid?.match(/subtask_checkbox_(.*)/);
    //   if (subtaskId) return subtaskId[1];
    // });

    // get all the checked subtasks and their ids
    const checkedSubtasks = await app.findAllByTestId(subtaskIsChecked);
    const checkedIds = checkedSubtasks.map((subtask) => {
      const testid = getTestId(subtask);
      const subtaskId = testid?.match(/subtask_is_checked_(.*)/);
      if (subtaskId) return subtaskId[1];
    });

    let uncheckedId: string;
    const uncheckedSubtask = subtasks.find((subtask) => {
      const testid = getTestId(subtask);
      const subtaskId = testid?.match(/subtask_checkbox_(.*)/);
      if (subtaskId && !checkedIds.includes(subtaskId[1])) {
        uncheckedId = subtaskId[1];
        return subtaskId[1];
      }
    });

    act(() => {
      uncheckedSubtask?.click();
    });

    const getAllCheckedTasks = async () =>
      await app.findAllByTestId(subtaskIsChecked);

    const getUpdatedUneckedTask = async () =>
      await app.findByTestId(`subtask_is_checked_${uncheckedId}`);

    waitFor(async () => {
      expect(await getAllCheckedTasks()).toBeGreaterThan(
        checkedSubtasks.length
      );
    });

    expect(await getUpdatedUneckedTask()).toBeInTheDocument();

    act(() => {
      uncheckedSubtask?.click();
    });

    waitFor(async () => {
      expect(await getAllCheckedTasks()).toEqual(checkedSubtasks.length);
    });

    expect(await getUpdatedUneckedTask()).toBeNull();
  });

  test("subtasks can be deleted", async () => {
    //open edit task modal
    await openEditTaskModal(app);

    // select all of the subtask delete buttons and click the first one
    const deleteBtns = await app.findAllByTestId(deleteSubtask);
    act(() => {
      deleteBtns[0].click();
    });

    // expect there to be one less delete button than before
    const remainingBtns = await app.findAllByTestId(deleteSubtask);
    expect(remainingBtns.length).toEqual(deleteBtns.length - 1);

    // save the task (effecitvely closing the modal)
    const saveTask = await app.findByText(saveTaskSelector);
    act(() => {
      saveTask.click();
    });

    // wait for and expect the modal to unmount
    waitFor(() => {
      expect(app.getByTestId("edit_task_modal")).toBeNull();
    });

    //open task and check if the subtasks saved
    await openViewTask(app);
    const subtasks = await app.findAllByTestId(subtaskItem);
    expect(subtasks.length).toEqual(remainingBtns.length);
  });

  test("subtasks can be reordered", () => {
    // open edit task modal
    // drag a subtask below another
    // save the task (close modal)
    // reopen modal and check the other was saved
  });

  test("subtasks can be created on existing task", async () => {
    // open edit task
    await openEditTaskModal(app);

    // add a new subtask
    const addNewSubtaskBtn = await app.findByText(addNewSubtask);
    act(() => {
      addNewSubtaskBtn.click();
    });

    // get the subtask input added and enter a value
    const subtaskInputsArr = (await app.findAllByTestId(
      subtaskInputs
    )) as HTMLInputElement[];

    const newSubtaskValue = "New Subtask Test";
    const newSubtask = subtaskInputsArr.find((el) => !el.value);
    expect(newSubtask).toBeInTheDocument();
    act(() => {
      if (!newSubtask) return;
      fireEvent.change(newSubtask, { target: { value: newSubtaskValue } });
    });

    // save the changes and wait for modal to close
    const saveBtn = await app.findByText(saveTaskSelector);
    act(() => {
      saveBtn.click();
    });

    await waitFor(() => {
      expect(app.getByTestId(editTaskModal)).toBeNull();
    });

    // reopen the edit task modal and expect the new task to be there
    await openViewTask(app);
    expect(await app.findByText(newSubtaskValue)).toBeInTheDocument();
  });

  test("subtasks can be created on a new task", async () => {
    // open add task modal
    const addTaskBtn = await app.findByText(addNewTask);
    act(() => {
      addTaskBtn.click();
    });

    expect(await app.findByTestId(addTaskModal)).toBeInTheDocument();

    // add a title to the new task
    const newTaskTitle = "New Task";
    act(async () => {
      const titleInput = await app.findByText(/Take coffee break/);
      fireEvent.change(titleInput, { target: { value: newTaskTitle } });
    });

    //add one more subtask to the default two
    const addSubtaskBtn = await app.findByText(addNewSubtask);
    act(() => {
      addSubtaskBtn.click();
    });

    waitFor(() => {
      expect(app.getAllByTestId(subtaskInputs)).toHaveLength(3);
    });

    // enter a title into each subtask
    const titles = Array.from(Array(3).keys()).map(
      (key) => `subtask #${key + 1}`
    );
    const subtaskInputsArr = await app.findAllByTestId(subtaskInputs);
    for (let i = 0; i < subtaskInputsArr.length; i++) {
      act(() => {
        fireEvent.change(subtaskInputsArr[i], {
          target: { value: titles[i] },
        });
      });
    }

    // save the task and wait for modal to close
    act(() => {
      app.getByText(saveTaskSelector).click();
    });

    await waitForModalToClose(app, editTaskModal);

    // open the task and check the task was saved properly
  });

  test("subtasks titles can be changed", () => {
    // open edit task modal 
    // change the title of a subtask 
    // save and wait for modal to close 
    // get task by title to check it was saved properly 
  });
});
