import { Check, Tallymark3 } from "tabler-icons-react";
import { ISubtask } from "../../@types/types";
import { classNames } from "../../utils/utils";
import { useUpdateSubtaskMutation } from "./subtasksEndpoints";

export default function Subtask({ subtask }: { subtask: ISubtask }) {
  const [updateSubtask] = useUpdateSubtaskMutation();

  const toggleTask = () => {
    updateSubtask({ ...subtask, isCompleted: !subtask?.isCompleted });
  };

  return (
    <li
      data-testid={`subtask_list_item_${subtask?.id}`}
      key={`subtask-${subtask?.id}`}
      className={classNames(
        subtask?.isCompleted
          ? ""
          : "dark:bg-opacity-50 dark:bg-primary-indigo-active",
        "px-2 py-3 rounded hover:bg-opacity-50 hover:cursor-grab",
        "hover:bg-primary-indigo-inactive bg-primary-gray-200",
        "dark:bg-primary-gray-700 dark:hover:text-white",
        "hover:cursor-grab flex justify-between items-center mb-2"
      )}
    >
      <div className="flex items-center">
        <label>
          <span className="sr-only">task completed</span>
          <div className="relative flex items-center hover:cursor-pointer">
            <input
              type="checkbox"
              data-testid={`subtask_checkbox_${subtask?.id}`}
              checked={subtask?.isCompleted}
              className={classNames(
                subtask?.isCompleted
                  ? "bg-primary-indigo-active"
                  : "bg-white dark:bg-primary-gray-600",
                "appearance-none w-4 h-4 border rounded-sm ",
                "dark:border-gray-600 hover:cursor-pointer"
              )}
              onChange={toggleTask}
            />
            {subtask?.isCompleted ? (
              <div
                data-testid={`subtask_is_checked_${subtask?.id}`}
                className={classNames(
                  "absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 hover:cursor-pointer"
                )}
              >
                <Check color="white" size={18} />
              </div>
            ) : (
              <></>
            )}
          </div>
        </label>
        <p
          className={`font-medium text-sm ml-4 ${
            subtask?.isCompleted
              ? "line-through text-gray-500"
              : "dark:text-white"
          }`}
        >
          {subtask?.title}
        </p>
      </div>
      <div className="text-primary-gray-400 rotate-90">
        <Tallymark3 />
      </div>
    </li>
  );
}
