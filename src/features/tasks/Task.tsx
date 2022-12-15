import { ITask } from "../../@types/types";
import { useAppDispatch } from "../../redux/hooks";
import { classNames } from "../../utils/utils";
import { addTaskModalOpened, taskSelected } from "./tasksSlice";
import { Dots } from "tabler-icons-react";

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
      className={classNames(
        placeholder ? "" : "hover:cursor-grab",
        "w-full px-2 text-left mb-5"
      )}
      onClick={() => {
        if (placeholder) dispatch(addTaskModalOpened({ open: true }));
      }}
    >
      {/** Use the task div as the ref (instead of button) so the preview doesn't show padding. */}
      <div className="flex px-4 py-6 flex-col dark:bg-primary-gray-600 bg-white rounded-md shadow-lg">
        {placeholder ? (
          <div id="task_placeholder" className="flex justify-center">
            {" "}
            <p className="text-sm font-medium text-gray-400">
              + Create New Task
            </p>
          </div>
        ) : (
          <>
            <div className="flex justify-between items-start">
              <p
                className="font-bold text-sm dark:text-white"
                data-testid={`task_title_${task?.id}`}
              >
                {task?.title}
              </p>
              <button
                data-testid={`open_task_btn_${task?.id}`}
                onClick={() => {
                  dispatch(taskSelected({ taskId: task?.id || "" }));
                }}
                className={classNames(
                  "hover:text-primary-indigo-active text-primary-gray-400"
                )}
              >
                <Dots />
              </button>
            </div>
            <p className="text-gray-500 text-xs mt-1  ">
              {task?.completedSubtasks} of {task?.subtasks.length} subtasks
            </p>
          </>
        )}
      </div>
    </div>
  );
}
