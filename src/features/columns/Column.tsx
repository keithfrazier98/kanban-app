import { useState } from "react";
import { IColumn } from "../../@types/types";
import { useAppSelector } from "../../app/hooks";
import { getSelectedBoard } from "../boards/boardsSlice";
import { useGetTasksQuery } from "../tasks/tasksEnpoints";
import Task from "../tasks/Task";
import { Droppable, Draggable } from "react-beautiful-dnd";

export default function Column({ column }: { column: IColumn }) {
  const selectedBoard = useAppSelector(getSelectedBoard);

  const { data: tasks } = useGetTasksQuery(selectedBoard?.id, {
    skip: !selectedBoard,
  });

  const [taskList, setTaskList] = useState(column.tasks);

  return (
    <div className="my-6 h-full" id={`column-${column.id}`}>
      <div className="flex items-center mb-6 text-base text-gray-400 font-bold">
        <div className="rounded-full w-3 h-3 bg-primary-indigo-active"></div>
        <h2 className="mx-2 tracking-widest">{column.name.toUpperCase()}</h2>
        <p> {`( ${column.tasks.length} )`}</p>
      </div>
      <div className="overflow-y-scroll no-scrollbar h-full pb-12 w-72">
        <Droppable key={column.id} droppableId={column.id}>
          {(provided, snapshot) => (
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
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                    >
                      <Task task={tasks?.entities[taskId]} />
                    </div>
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
