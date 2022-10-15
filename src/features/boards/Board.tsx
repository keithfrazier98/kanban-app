import { useContext, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import Column from "../columns/Column";
import {
  columnsReqStatus,
  columnsSelected,
  fetchColumnsByBoardId,
  selectAllColumns,
} from "../columns/columnsSlice";
import { fetchTasksByBoardId, tasksReqStatus } from "../tasks/tasksSlice";
import {
  boardRequestStatus,
  boardSelected,
  fetchBoards,
  getSelectedBoard,
  selectAllBoards,
} from "./boardsSlice";

export default function Board() {
  const boards = useAppSelector(selectAllBoards);
  const boardsStatus = useAppSelector(boardRequestStatus);
  const columnsStatus = useAppSelector(columnsReqStatus);
  const columns = useAppSelector(selectAllColumns);
  const tasksStatus = useAppSelector(tasksReqStatus);
  const selectedBoard = useAppSelector(getSelectedBoard);

  const dispatch = useAppDispatch();

  useEffect(() => {
    // make needed requests when opening the app initially
    if (boardsStatus === "idle") {
      dispatch(fetchBoards());
    }

    if (!selectedBoard && boards[0]) {
      dispatch(boardSelected({ board: boards[0] }));
    }

    if (selectedBoard && columnsStatus === "idle") {
      dispatch(fetchColumnsByBoardId(selectedBoard.id));
    }

    if (selectedBoard && tasksStatus === "idle") {
      dispatch(fetchTasksByBoardId(selectedBoard.id));
    }
  }, [boards, columns, selectedBoard]);

  return (
    <section className="h-full">
      <h1 className="sr-only">kanban board</h1>
      {columns ? (
        <div className="grid grid-rows-1 grid-flow-col w-max h-full px-2">
          {columns.map((column, i) =>
            column ? <Column key={`column-${i}`} column={column} /> : <></>
          )}{" "}
        </div>
      ) : (
        <div className="px-12 font-bold text-center">
          <div className="py-6 text-gray-500">
            This board is empty. Create a new column to get started.
          </div>
          <button className="bg-primary-indigo-active text-white px-3 py-3 m-auto rounded-full w-fit mb-24">
            + Add New Column
          </button>
        </div>
      )}
    </section>
  );
}
