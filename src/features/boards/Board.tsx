import { useEffect, useState } from "react";
import {
  DragDropContext,
  Draggable,
  Droppable,
  DropResult,
} from "react-beautiful-dnd";
import { IBoardData } from "../../@types/types";
import { useAppDispatch } from "../../redux/hooks";
import PortalAwareItem from "../../components/PortalAwareItem";
import useColumnNames from "../../hooks/useColumnNames";
import useMoveTask from "../../hooks/useMoveTask";
import useSelectedBoard from "../../hooks/useSelectedBoard";
import { classNames } from "../../utils/utils";
import AddNewColumnBtn from "../columns/AddNewColumnBtn";
import Column from "../columns/Column";
import { useUpdateColumnsMutation } from "../columns/columnsEndpoints";
import {
  extendedBoardsApi,
  useGetBoardsQuery,
  useUpdateBoardMutation,
} from "./boardsEndpoints";
import { boardSelected } from "./boardsSlice";

export default function Board() {
  const [updateBoard] = useUpdateBoardMutation();
  const [pollInterval, setPollInterval] = useState(500);
  const { data: boards } = useGetBoardsQuery(undefined, {
    pollingInterval: pollInterval,
  });
  const selectedBoard = useSelectedBoard();

  const dispatch = useAppDispatch();

  const [updateColumns] = useUpdateColumnsMutation();
  const { columns } = useColumnNames();

  useEffect(() => {
    const returningUser = localStorage.getItem("returningUser");

    if (!returningUser && boards) {
      const sampleBoard = Object.values(boards.entities).find(
        (board) => board?.name === "Platform Launch"
      );

      if (sampleBoard) dispatch(boardSelected({ board: sampleBoard.id }));
      localStorage.setItem("returningUser", "true");
    } else if (!selectedBoard && boards) {
      dispatch(boardSelected({ board: String(boards.ids[0]) || null }));
    }

    if (boards) {
      setPollInterval(0);
    }
  }, [boards, columns, selectedBoard, dispatch]);

  const { moveTask } = useMoveTask();

  const moveColumn = (result: DropResult): IBoardData | undefined => {
    if (!selectedBoard || !columns) return;
    const { source, destination, draggableId } = result;
    if (!destination) return;
    const colList = selectedBoard.columns.slice();

    colList.splice(source.index, 1);
    colList.splice(destination?.index, 0, draggableId);

    return { ...selectedBoard, columns: colList };
  };

  //handler for drag event, updates columns or tasks in the DB
  const onDragEnd = (result: DropResult) => {
    switch (result.type) {
      case "TASK":
        const columnUpdate = moveTask(result);
        if (columnUpdate) return updateColumns(columnUpdate);
        break;
      case "COLUMN":
        const boardUpdate = moveColumn(result);
        if (boardUpdate) return updateBoard(boardUpdate);
        return;
      default:
        throw new Error("Invalid result type in DropBody");
    }
    moveTask(result);
  };

  return (
    <main
      data-testid="board_component"
      className={classNames(
        "flex overflow-hidden h-full",
        "transform transition-all"
      )}
    >
      <DragDropContext
        onDragEnd={(result) => {
          onDragEnd(result);
        }}
      >
        <section className="h-full overflow-x-scroll overflow-y-hidden">
          <h1 className="sr-only">kanban board</h1>
          {columns ? (
            <Droppable
              droppableId="columns-droppable"
              key={"columns-droppable"}
              type="COLUMN"
              direction="horizontal"
            >
              {(provided, snapshot) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className={classNames(
                    "grid grid-rows-1 grid-flow-col w-max h-full px-2"
                  )}
                >
                  {selectedBoard?.columns.map((id: string, index) => {
                    const column = columns.entities[id];
                    return column ? (
                      <Draggable
                        draggableId={column.id}
                        key={"draggable-" + column.id}
                        index={index}
                      >
                        {(provided, snapshot) => (
                          <PortalAwareItem
                            provided={provided}
                            snapshot={snapshot}
                          >
                            <Column
                              key={`column-${column.id}`}
                              column={column}
                            />
                          </PortalAwareItem>
                        )}
                      </Draggable>
                    ) : (
                      <></>
                    );
                  })}
                  {/** keeps droppable area the same size while column is dragging */}
                  {snapshot.isUsingPlaceholder ? (
                    <div className="w-72" />
                  ) : (
                    <></>
                  )}
                  <AddNewColumnBtn />
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
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
    </main>
  );
}
