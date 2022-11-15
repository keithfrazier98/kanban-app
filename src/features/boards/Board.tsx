import { useEffect } from "react";
import { DragDropContext, DropResult } from "react-beautiful-dnd";
import { IBoardPostBody, IColumn } from "../../@types/types";
import { useAppDispatch } from "../../app/hooks";
import useAllTasks from "../../hooks/useAllTasks";
import useColumnNames from "../../hooks/useColumnNames";
import useSelectedBoard from "../../hooks/useSelectedBoard";
import AddNewColumnBtn from "../columns/AddNewColumnBtn";
import Column from "../columns/Column";
import { useUpdateColumnsMutation } from "../columns/columnsEndpoints";
import { useGetBoardsQuery } from "./boardsEndpoints";
import { boardSelected } from "./boardsSlice";

export default function Board() {
  const { data: boards } = useGetBoardsQuery(undefined);
  const selectedBoard = useSelectedBoard();

  const dispatch = useAppDispatch();

  const [updateColumns] = useUpdateColumnsMutation();
  const { columns } = useColumnNames();

  useEffect(() => {
    if (!selectedBoard && boards) {
      dispatch(boardSelected({ board: String(boards.ids[0]) || null }));
    }
  }, [boards, columns, selectedBoard]);

  const taskData = useAllTasks();

  //handler for drag event, updates columns task attribute in the DB
  const onDragEnd = (result: DropResult): IBoardPostBody | undefined => {
    if (!taskData || !columns) return;
    const { source, destination, draggableId } = result;
    if (!destination) return;

    const column = columns.entities[destination.droppableId];
    const taskList = column.tasks.slice();
    const updates: IColumn[] = [];

    if (source.droppableId === destination.droppableId) {
      //reorder array
      taskList.splice(source.index, 1);
      taskList.splice(destination.index, 0, draggableId);
    } else {
      //remove from old col and add to new
      const prev = columns.entities[source.droppableId];
      const prevList = prev.tasks.slice();

      prevList.splice(source.index, 1);
      taskList.splice(destination.index, 0, draggableId);

      updates.push({ ...prev, tasks: prevList });
    }

    updates.push({ ...column, tasks: taskList });

    return {
      additions: [],
      boardId: column.board.id,
      deletions: [],
      newName: null,
      updates,
    };
  };

  return (
    <DragDropContext
      onDragEnd={(result) => {
        const body = onDragEnd(result);
        if (body) updateColumns(body);
      }}
    >
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
    </DragDropContext>
  );
}
