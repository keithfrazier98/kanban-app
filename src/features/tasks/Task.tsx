import { useRef } from "react";
import { Identifier } from "dnd-core";
import { useDrag, useDrop, XYCoord } from "react-dnd";
import { ITask } from "../../@types/types";
import { useAppDispatch } from "../../app/hooks";
import { classNames } from "../../utils/utils";
import { addTaskModalOpened, taskSelected } from "./tasksSlice";
import { usePreview } from "react-dnd-preview";

export interface ITaskDnDItem {
  id: string;
  index: number;
  type: string;
}

export default function Task({
  task,
  index,
  moveTask,
  placeholder = false,
}: {
  task?: ITask;
  index?: number;
  moveTask?: (dragIndex: number, hoverIndex: number) => void;
  placeholder?: boolean;
}) {
  const dispatch = useAppDispatch();

  const [{ isDragging }, drag] = useDrag(() => ({
    type: "TASK",
    item: { id: task?.id, index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  const ref = useRef<HTMLDivElement>(null);

  const [{ handlerId }, drop] = useDrop<
    ITaskDnDItem,
    void,
    { handlerId: Identifier | null }
  >({
    accept: "TASK",
    collect(monitor) {
      return {
        handlerId: monitor.getHandlerId(),
      };
    },
    hover(item: ITaskDnDItem, monitor) {
      if (!ref.current) {
        return;
      }
      if (!moveTask || index === undefined) return;
      const dragIndex = item.index;
      const hoverIndex = index;

      // Don't replace items with themselves
      if (dragIndex === hoverIndex) {
        return;
      }

      // Determine rectangle on screen
      const hoverBoundingRect = ref.current?.getBoundingClientRect();

      // Get vertical middle
      const hoverMiddleY =
        (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;

      // Determine mouse position
      const clientOffset = monitor.getClientOffset();

      // Get pixels to the top
      const hoverClientY = (clientOffset as XYCoord).y - hoverBoundingRect.top;

      // Only perform the move when the mouse has crossed half of the items height
      // When dragging downwards, only move when the cursor is below 50%
      // When dragging upwards, only move when the cursor is above 50%

      // Dragging downwards
      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return;
      }

      // Dragging upwards
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return;
      }

      // Time to actually perform the action
      moveTask(dragIndex, hoverIndex);

      // Note: we're mutating the monitor item here!
      // Generally it's better to avoid mutations,
      // but it's good here for the sake of performance
      // to avoid expensive index searches.
      item.index = hoverIndex;
    },
  });


  drag(drop(ref));
  return (
    <button
      ref={ref as any}
      data-handler-id={handlerId}
      key={`task-${task?.id}`}
      className={classNames(
        "w-full px-2 text-left",
        isDragging ? "opacity-0" : ""
      )}
      onClick={() => {
        placeholder
          ? dispatch(addTaskModalOpened({ open: true }))
          : dispatch(taskSelected({ taskId: task?.id || "" }));
      }}
    >
      <div className="flex px-4 py-6 flex-col dark:bg-primary-gray-600 bg-white rounded-md shadow-lg">
        {placeholder ? (
          <div className="flex justify-center">
            {" "}
            <p className="text-sm font-medium text-gray-400">
              + Create New Task
            </p>
          </div>
        ) : (
          <>
            <p className="font-bold text-sm dark:text-white">{task?.title}</p>
            <p className="text-gray-500 text-xs mt-1  ">
              {task?.completedSubtasks} of {task?.totalSubtasks} subtasks
            </p>
          </>
        )}
      </div>
    </button>
  );
}
