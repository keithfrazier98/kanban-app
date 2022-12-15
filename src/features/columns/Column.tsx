import { IColumn } from "../../@types/types";
import { useGetTasksQuery } from "../tasks/tasksEnpoints";
import Task from "../tasks/Task";
import { Droppable, Draggable } from "react-beautiful-dnd";
import PortalAwareItem from "../../components/PortalAwareItem";
import useSelectedBoard from "../../hooks/useSelectedBoard";
import { Tallymark3 } from "tabler-icons-react";
import { classNames } from "../../utils/utils";

export default function Column({ column }: { column: IColumn }) {
  const selectedBoard = useSelectedBoard();

  const { data: tasks } = useGetTasksQuery(selectedBoard?.id, {
    skip: !selectedBoard?.id,
  });

  return (
    <div
      className={classNames("my-6 h-full group pb-16 overflow-clip")}
      id={`column-${column.id}`}
      data-testid="column"
    >
      <div className="flex items-center justify-between mb-6 text-base text-gray-400 font-bold">
        <div className="flex items-center">
          <div className="rounded-full w-3 h-3 bg-primary-indigo-active"></div>
          <h2
            className="mx-2 tracking-widest"
            data-testid={`column_title_${column.id}`}
          >
            {column.name.toUpperCase()}
          </h2>
          <p> {`( ${column.tasks.length} )`}</p>
        </div>
        <div className="mr-4 rotate-90">
          <Tallymark3 />
        </div>
      </div>
      <div className="overflow-auto h-full w-72 pr-1">
        <Droppable
          key={column.id}
          droppableId={column.id}
          type="TASK"
          direction="vertical"
        >
          {(provided) => (
            <div
              data-testid={`column_container_${column.id}`}
              className="flex flex-col h-full overflow-y-scroll no-scrollbar"
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
                    <PortalAwareItem provided={provided} snapshot={snapshot}>
                      <Task task={tasks?.entities[taskId]} />
                    </PortalAwareItem>
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
