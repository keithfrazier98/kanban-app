import { useContext, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import AddNewColumnBtn from "../columns/AddNewColumnBtn";
import Column from "../columns/Column";
import { useGetColumnsQuery } from "../columns/columnsSlice";
import { useGetTasksQuery } from "../tasks/tasksSlice";
// import { fetchTasksByBoardId, tasksReqStatus } from "../tasks/tasksSlice";
import {
  boardSelected,
  getSelectedBoard,
  useGetBoardsQuery,
} from "./boardsSlice";

export default function Board() {
  const { data: boards } = useGetBoardsQuery(undefined);
  const selectedBoard = useAppSelector(getSelectedBoard);

  const { data: columns } = useGetColumnsQuery(selectedBoard?.id, {
    skip: !selectedBoard,
  });

  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!selectedBoard && boards) {
      dispatch(boardSelected({ board: boards.entities[boards.ids[0]] }));
    }
  }, [boards, columns, selectedBoard]);

  return (
    <section className="h-full">
      <h1 className="sr-only">kanban board</h1>
      {columns ? (
        <div className="grid grid-rows-1 grid-flow-col w-max h-full px-2">
          {Object.values(columns.entities).map((column, i) =>
            column ? <Column key={`column-${i}`} column={column} /> : <></>
          )}{" "}
          <AddNewColumnBtn />
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
