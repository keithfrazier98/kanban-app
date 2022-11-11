import { IColumn } from "../../@types/types";
import { useAppSelector } from "../../app/hooks";
import { getSelectedBoard } from "../boards/boardsSlice";
import { useGetTasksQuery } from "../tasks/tasksEnpoints";
import Task from "../tasks/Task";
import { Droppable, Draggable } from "react-beautiful-dnd";
import PortalAwareItem from "../../components/PortalAwareItem";
import useSelectedBoard from "../../hooks/useSelectedBoard";

export default function Column({ column }: { column: IColumn }) {
  const selectedBoard = useSelectedBoard();

  const { data: tasks } = useGetTasksQuery(selectedBoard?.id, {
    skip: !selectedBoard,
  });

  return (
    <div className="my-6 h-full group pb-16" id={`column-${column.id}`}>
      <div className="flex items-center mb-6 text-base text-gray-400 font-bold">
        <div className="rounded-full w-3 h-3 bg-primary-indigo-active"></div>
        <h2 className="mx-2 tracking-widest">{column.name.toUpperCase()}</h2>
        <p> {`( ${column.tasks.length} )`}</p>
      </div>
      <div className="overflow-y-scroll h-full tasksTrack pb-12 w-72 pr-1">
        <Droppable key={column.id} droppableId={column.id}>
          {(provided) => (
            <div
              className="flex flex-col h-full"
              ref={provided.innerRef}
              {...provided.droppableProps}
            >
              {column.tasks.map((taskId: string, i: number) => (
                <Draggable
                  key={`task-${taskId}`}
                  draggableId={taskId}
                  index={i}
                >
                  {/** A portal is needed to render the drag preview correctly, see thread below. */}
                  {/**https://stackoverflow.com/questions/54982182/react-beautiful-dnd-drag-out-of-position-problem */}
                  {(provided, snapshot) => (
                    <PortalAwareItem
                      provided={provided}
                      snapshot={snapshot}
                      task={tasks?.entities[taskId]}
                    />
                  )}
                </Draggable>
              ))}
              {column.tasks.length === 0 ? <Task placeholder={true} /> : <></>}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </div>
    </div>
  );
}
