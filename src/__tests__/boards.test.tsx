import {
  fireEvent,
  getByText,
  render,
  RenderResult,
  waitFor,
} from "@testing-library/react";
import { text } from "node:stream/consumers";
import { Provider } from "react-redux";
import App from "../App";
import { store } from "../app/store";

describe("Common board flows work as expected", () => {
  let app: RenderResult<
    typeof import("/Users/keith/development/kanban-project/kanban-app/node_modules/@testing-library/dom/types/queries"),
    HTMLElement,
    HTMLElement
  >;

  const getSidebar = () => app.getByTestId(/sidebar_component/);

  beforeEach(() => {
    app = render(
      <Provider store={store}>
        <App />
      </Provider>
    );
  });

  afterEach(() => {
    app.unmount();
  });

  test("app loads kanban board, header, and sidebar", () => {
    expect(app.getByTestId(/board_component/)).toBeInTheDocument();
    expect(getSidebar()).toBeInTheDocument();
    expect(app.getByTestId(/desktop_header/)).toBeInTheDocument();
    expect(app.getByTestId(/mobile_header/)).toBeInTheDocument();
  });

  test("sidebar can be opened and closed", async () => {
    // sidebar initializes as open
    const sidebar = getSidebar();
    expect(sidebar).toBeInTheDocument();

    const hideSidebar = app.getByTestId(/hide_sidebar/);
    expect(hideSidebar).toBeInTheDocument();

    hideSidebar.click();

    //wait for sidebar to unmount after hidden
    await waitFor(() => {
      expect(sidebar).not.toBeInTheDocument();
    });

    const showSidebar = app.getByTestId(/show_sidebar/);
    expect(showSidebar).toBeInTheDocument();

    showSidebar.click();

    //wait for show button to unmount after clicked
    await waitFor(() => {
      expect(showSidebar).not.toBeInTheDocument();
    });
  });

  const openBoardOptions = async () => {
    //get all since mobile and desktop header are mounted at this point
    const boardOptionsBtn = app.getAllByTestId(/board_options_btn/);
    boardOptionsBtn[0].click();

    await waitFor(() => {
      expect(app.getByTestId(/board_options_modal/)).toBeInTheDocument();
    });
  };

  test("board options modal can be opened", async () => {
    await openBoardOptions();
  });

  test("edit board can be opened via board options modal", async () => {
    await openBoardOptions();

    const openEditBoard = app.getByText("Edit Board");
    openEditBoard.click();

    await waitFor(() => {
      expect(app.getByTestId(/edit_board_modal/)).toBeInTheDocument();
    });
  });

  test("delete board can be opened via board options modal", async () => {
    await openBoardOptions();

    const openDeleteBoard = app.getByText("Delete Board");
    openDeleteBoard.click();

    await waitFor(() => {
      expect(app.getByTestId(/delete_board_modal/)).toBeInTheDocument();
    });
  });
});
