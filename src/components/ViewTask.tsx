import OutsideClickHandler from "react-outside-click-handler";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { getOpenTask, taskSelected } from "../features/tasks/tasksSlice";
import { countCompleted } from "../utils/utils";
import { DimModalBackdrop } from "./DimModalBackdrop";

export default function ViewTask() {
  const openTask = useAppSelector(getOpenTask);
  const dispatch = useAppDispatch();
  if (!openTask) return <></>;

  const { description, status, subtasks, title } = openTask;

  return (
    <DimModalBackdrop>
      <OutsideClickHandler
        onOutsideClick={() => dispatch(taskSelected({ task: null }))}
      >
        <div className="px-4 py-6 bg-white dark:bg-primary-gray-700 rounded-md w-full max-w-sm">
          <h3 className="font-bold mb-6 text-sm md:text-base">{title}</h3>
          <p className="text-sm text-gray-500">{description}</p>
          <p className="text-xs font-bold mt-6 mb-4">
            Subtasks {`(${countCompleted(subtasks)} of ${subtasks.length})`}
          </p>{" "}
          <ul className="grid grid-flow-row gap-2">
            {subtasks.map((subtask) => (
              <li className="px-2 py-3 flex items-center rounded bg-primary-gray-200">
                <label>
                  <span className="sr-only">task completed</span>
                  <input
                    type="checkbox"
                    checked={subtask.isCompleted}
                    className="mr-4"
                  />
                </label>
                <p
                  className={`font-medium text-sm ${
                    subtask.isCompleted ? "line-through text-gray-500" : ""
                  }`}
                >
                  {subtask.title}
                </p>
              </li>
            ))}
          </ul>
          <div></div>
        </div>
      </OutsideClickHandler>
    </DimModalBackdrop>
  );
}
