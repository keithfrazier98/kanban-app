import { useContext, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import Column from "../../components/Column";
import { Context } from "../../components/Context";
import { fetchBoards } from "./boardsSlice";

export default function Board() {
  // const { currentBoard } = useContext(Context);

  const boards = useAppSelector((state) => state.boards.entities);

  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(fetchBoards());
  }, []);

  if (boards[0]) {
  }

  return (
    <section className="h-full">
      <h1 className="sr-only">kanban board</h1>
      {/* {currentBoard?.columns ? (
        <div className="grid grid-rows-1 grid-flow-col w-max h-full px-2">
          {currentBoard.columns.map((column) => (
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
      )} */}
    </section>
  );
}
