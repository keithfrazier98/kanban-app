import { ITask } from "../../@types/types";
import { useAppDispatch } from "../../app/hooks";
import { classNames } from "../../utils/utils";
import { addTaskModalOpened, taskSelected } from "./tasksSlice";
import { Droppable, Draggable } from "react-beautiful-dnd";
import { Dots, DotsCircleHorizontal, Pencil } from "tabler-icons-react";

export interface ITaskDnDItem {
  id: string;
  index: number;
  type: string;
}

export default function Task({
  task,
  placeholder = false,
}: {
  task?: ITask;
  placeholder?: boolean;
}) {
  const dispatch = useAppDispatch();

  return (
    <div
      key={`task-${task?.id}`}
      className={classNames("w-full px-2 text-left mb-5")}
    >
      {/** Use the task div as the ref (instead of button) so the preview doesn't show padding. */}
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
            <div className="flex justify-between items-start">
              <p className="font-bold text-sm dark:text-white">{task?.title}</p>
              <button
                onClick={() => {
                  placeholder
                    ? dispatch(addTaskModalOpened({ open: true }))
                    : dispatch(taskSelected({ taskId: task?.id || "" }));
                }}
                className={classNames(
                  "hover:text-primary-indigo-inactive text-primary-gray-300"
                )}
              >
                <Dots />
              </button>
            </div>
            <p className="text-gray-500 text-xs mt-1  ">
              {task?.completedSubtasks} of {task?.totalSubtasks} subtasks
            </p>
          </>
        )}
      </div>
    </div>
  );
}
