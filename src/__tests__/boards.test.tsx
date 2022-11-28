import { fireEvent, getByText, render, waitFor } from "@testing-library/react";
import { Provider } from "react-redux";
import App from "../App";
import { store } from "../app/store";

const renderApp = () =>
  render(
    <Provider store={store}>
      <App />
    </Provider>
  );

const getSidebar = (app: any) => app.getByTestId(/sidebar_component/);

test("app loads kanban board, header, and sidebar", () => {
  const app = renderApp();
  expect(app.getByTestId(/board_component/)).toBeInTheDocument();
  expect(getSidebar(app)).toBeInTheDocument();
  expect(app.getByTestId(/desktop_header/)).toBeInTheDocument();
  expect(app.getByTestId(/mobile_header/)).toBeInTheDocument();
});

test("sidebar can be opened and closed", async () => {
  const app = renderApp();

  // sidebar initializes as open
  const sidebar = getSidebar(app);
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
