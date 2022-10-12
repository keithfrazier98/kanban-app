import { useContext, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import Column from "../../components/Column";
import {
  boardSelected,
  fetchBoards,
  getSelectedBoard,
  selectAllBoards,
} from "./boardsSlice";

export default function Board() {
  // const { currentBoard } = useContext(Context);

  const boards = useAppSelector(selectAllBoards);
  const selectedBoard = useAppSelector(getSelectedBoard);

  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchBoards());
  }, []);

  useEffect(() => {
    if (!selectedBoard && boards.length > 0) {
      dispatch(boardSelected({ board: boards[0] }));
    }
  }, [boards]);

  return (
    <section className="h-full">
      <h1 className="sr-only">kanban board</h1>
      {selectedBoard?.columns ? (
        <div className="grid grid-rows-1 grid-flow-col w-max h-full px-2">
          {selectedBoard.columns.map((column) => (
            <Column column={column} />
          ))}{" "}
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
