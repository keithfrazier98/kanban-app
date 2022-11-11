import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import useSelectedBoard from "../../hooks/useSelectedBoard";
import AddNewColumnBtn from "../columns/AddNewColumnBtn";
import Column from "../columns/Column";
import { useGetColumnsQuery } from "../columns/columnsEndpoints";
import { useGetBoardsQuery } from "./boardsEndpoints";
import { boardSelected, getSelectedBoard } from "./boardsSlice";

export default function Board() {
  const { data: boards } = useGetBoardsQuery(undefined);
  const selectedBoard = useSelectedBoard();

  const { data: columns } = useGetColumnsQuery(selectedBoard?.id, {
    skip: !selectedBoard,
  });

  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!selectedBoard && boards) {
      dispatch(boardSelected({ board: String(boards.ids[0]) || null }));
    }
  }, [boards, columns, selectedBoard]);

  return (
    <section className="h-full">
      <h1 className="sr-only">kanban board</h1>
      {columns ? (
        <div className="grid grid-rows-1 grid-flow-col w-max h-full px-2">
          {columns.ids.map((id: string) => {
            const column = columns.entities[id];
            return column ? (
              <Column key={`column-${column.id}`} column={column} />
            ) : (
              <></>
            );
          })}
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
