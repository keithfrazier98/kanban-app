import { IBoardSubTask } from "../../@types/types";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { selectAllSubtasks, subtaskUpdated } from "./subtasksSlice";

export default function Subtask({
  subtask,
  id,
}: {
  subtask: IBoardSubTask;
  id: number;
}) {
  const dispatch = useAppDispatch();
  const subtasks = useAppSelector(selectAllSubtasks);
  return (
    <li
      key={`subtask-${id}`}
      className="px-2 py-3 flex items-center rounded bg-primary-gray-200"
    >
      <label>
        <span className="sr-only">task completed</span>
        <input
          type="checkbox"
          checked={subtask.isCompleted}
          className="mr-4"
          onChange={() => {
            dispatch(
              subtaskUpdated({
                id,
                subtask: {
                  ...subtask,
                  isCompleted: !subtask.isCompleted,
                },
              })
            );
          }}
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
  );
}
