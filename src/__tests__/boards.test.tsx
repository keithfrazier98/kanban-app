import { act, render, waitFor } from "@testing-library/react";
import { Provider } from "react-redux";
import { connectToIDB } from "../api/indexeddb";
import { initServiceServer } from "../api/mock";
import App from "../App";
import { store } from "../redux/store";
import { indexedDB } from "fake-indexeddb";
import { SetupServerApi } from "msw/node";
import {
  AppRenderResult,
  closeTest,
  openBoardOptions,
  openEditBoard,
  setupTest,
  waitForModalToClose,
} from "./utils";

describe("board ui renders as expected", () => {
  let server: SetupServerApi;
  let database: IDBDatabase;
  let app: AppRenderResult;

  const waitForAllByText = async (regexText: RegExp) => {
    await waitFor(() => {
      expect(app.getAllByText(regexText)).toBeDefined();
    });
  };

  const getSidebar = () => app.getByTestId(/sidebar_component/);

  beforeEach(async () => {
    await setupTest(database, server, app);
  });

  afterEach(async () => {
    closeTest(app, server);
  });

  test("app loads kanban board, header, and sidebar", async () => {
    expect(app.getByTestId(/board_component/)).toBeInTheDocument();
    expect(getSidebar()).toBeInTheDocument();
    expect(app.getByTestId(/desktop_header/)).toBeInTheDocument();
    expect(app.getByTestId(/mobile_header/)).toBeInTheDocument();
  });

  test("app loads board names from IDB into the sidebar", async () => {
    await waitForAllByText(/Roadmap/);
    const boardMenuItems = app.getAllByTestId(/board_menu_item/);
    expect(boardMenuItems).toHaveLength(3);
  });

  test("sidebar can be opened and closed", async () => {
    // sidebar initializes as open
    const sidebar = getSidebar();
    expect(sidebar).toBeInTheDocument();

    const hideSidebar = app.getByTestId(/hide_sidebar/);
    expect(hideSidebar).toBeInTheDocument();

    act(() => hideSidebar.click());

    //wait for sidebar to unmount after hidden
    await waitFor(() => {
      expect(sidebar).not.toBeInTheDocument();
    });

    const showSidebar = app.getByTestId(/show_sidebar/);
    expect(showSidebar).toBeInTheDocument();

    act(() => showSidebar.click());

    //wait for show button to unmount after clicked
    await waitFor(() => {
      expect(showSidebar).not.toBeInTheDocument();
    });
  });

  test("board options modal can be opened", async () => {
    await openBoardOptions(app);
  });

  test("edit board can be opened and closed", async () => {
    await openBoardOptions(app);
    await openEditBoard(app);

    act(()=> app.getByText("Save Changes").click())
    await waitForModalToClose(app, "edit_board_modal")
  });

  const selectDeleteBoardModal = () => app.queryByTestId(/delete_board_modal/);

  const openDeleteBoard = async () => {
    const openDeleteBoard = app.getByText("Delete Board");
    act(() => openDeleteBoard.click());

    await waitFor(() => {
      expect(selectDeleteBoardModal()).toBeInTheDocument();
    });
  };

  test("delete board can be opened via board options modal", async () => {
    await openBoardOptions(app);
    await openDeleteBoard();
  });

  test("delete board modal can be opened and closed via the cancel button", async () => {
    await openBoardOptions(app);
    await openDeleteBoard();
    const cancelButton = app.getByTestId("cancel_delete_button");

    act(() => cancelButton.click());

    await waitFor(() => expect(selectDeleteBoardModal()).toBeNull());
  });

  const getBoardItem = (boardName: string) =>
    app.queryByTestId(`board_menu_item_${boardName}`);

  const getSelectedBoard = () => {
    const header = app.getByTestId("selected_board_header");
    const boardName = header.innerHTML;
    return [getBoardItem(boardName), boardName];
  };

  test("boards can be deleted from the delete board modal", async () => {
    const [selectedBoardItem, boardName] = getSelectedBoard();
    expect(selectedBoardItem).toBeInTheDocument();

    await openBoardOptions(app);
    await openDeleteBoard();

    const deleteBtn = app.getByTestId("confirm_delete_button");
    act(() => deleteBtn.click());

    await waitFor(() =>
      expect(app.queryByTestId(`board_menu_item_${boardName}`)).toBeNull()
    );
  });

  test("board changes when clicking a new board in the side bar", async () => {
    const [_init, initialBoard] = getSelectedBoard();
    const allBoards = app.getAllByTestId(/board_menu_item/);
    const unselectedBoardItem = allBoards.find(
      (el) => el.innerHTML !== initialBoard
    );

    const unselectedName = unselectedBoardItem?.innerHTML;

    expect(unselectedBoardItem).toBeInTheDocument();
    console.log(allBoards[0].innerHTML);
    expect(unselectedName).not.toEqual(initialBoard);

    act(() => unselectedBoardItem?.click());

    await waitFor(() => {
      const selectedBoard = app.getByTestId(/selected_board_header/);
      console.log(unselectedName);
      expect(selectedBoard.innerHTML).toEqual(unselectedName);
    });
  });

  test("board name changes when updated in the edit board modal", async () => {
    await openBoardOptions(app);
    await openEditBoard(app);

    const editNameInput = app.getByTestId(/board_name_input/);
    const newName = "testing123";
    act(() => {
      editNameInput.innerHTML = newName;
    });

    await waitFor(() => editNameInput.innerHTML === newName);

    act(() => {
      app.getByText(/Save Changes/).click();
    });

    await waitFor(() => {
      expect(app.getByTestId(/selected_board_header/).innerHTML).toEqual(
        newName
      );
    });
  });
});
