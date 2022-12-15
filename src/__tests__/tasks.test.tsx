export {};

describe("task features should work as expected", () => {
  //before each test test up MSW and IDB and switch to the Roadmap baord
  test("tasks status can be changed", () => {
    // open view task
    // get tasks in the "Next" column
    // change status of a task from now to next
    // check the amount of tasks in the next column has changed
  });

  test("tasks can be added", () => {
    // open edit column modal
    // add a task to the now columns
    // save the task and wait for modal to close
    // check the new task is in the document
  });
  test("tasks can be deleted", () => {
    // open the edit column modal
    // delete a task
    // save and close the
    // check that that task is no longer in the document
  });
  test("tasks can be added to a new column (with add task button)", () => {
    // create a new column
    // open the add task modal
    // add a new task and set its status to the new column
    // check that the new column has a task in it
  });
});
