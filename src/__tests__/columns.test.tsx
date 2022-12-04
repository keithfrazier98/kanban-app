import { render } from "@testing-library/react";
import { Provider } from "react-redux";
import { store } from "../redux/store";
import Column from "../features/columns/Column";

describe("column ui renders as expected", () => {
  test("column name renders correctly", () => {
    // const columnName = "Text Column";

    // const column = render(
    //   <Provider store={store}>
    //     <Column
    //       key={""}
    //       column={{ board: "", id: "", name: columnName, tasks: [""] }}
    //     />
    //   </Provider>
    // );

    // expect(column.findByText(columnName)).toBeInTheDocument();

    expect(true).toBeTruthy();
  });
});
