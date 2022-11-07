import { Check } from "tabler-icons-react";
import { ISubtask } from "../../@types/types";
import { useAppDispatch } from "../../app/hooks";
import { classNames } from "../../utils/utils";
import { useUpdateSubtaskMutation } from "./subtasksEndpoints";

export default function Subtask({ subtask }: { subtask: ISubtask }) {
  const [updateSubtask] = useUpdateSubtaskMutation();

  const toggleTask = () => {
    updateSubtask({ ...subtask, isCompleted: !subtask.isCompleted });
  };

  return (
    <li
      key={`subtask-${subtask.id}`}
      onClick={toggleTask}
      className="px-2 py-3 flex items-center rounded hover:bg-opacity-50 hover:bg-primary-indigo-inactive bg-primary-gray-200"
    >
      <label>
        <span className="sr-only">task completed</span>
        <div className="relative">
          <input
            type="checkbox"
            checked={subtask.isCompleted}
            className={classNames(
              subtask.isCompleted ? "bg-primary-indigo-active" : "bg-white",
              "appearance-none w-4 h-4 border rounded-sm "
            )}
            onChange={toggleTask}
          />
          {subtask.isCompleted ? (
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
              <Check color="white" size={18} />
            </div>
          ) : (
            <></>
          )}
        </div>
      </label>
      <p
        className={`font-medium text-sm ml-4 ${
          subtask.isCompleted ? "line-through text-gray-500" : ""
        }`}
      >
        {subtask.title}
      </p>
    </li>
  );
}
