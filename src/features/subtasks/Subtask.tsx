import { IBoardSubTask } from "../../@types/types";
import { useAppDispatch } from "../../app/hooks";
import { useUpdateSubtaskMutation } from "./subtasksSlice";

export default function Subtask({ subtask }: { subtask: IBoardSubTask }) {
  const [updateSubtask] = useUpdateSubtaskMutation();

  return (
    <li
      key={`subtask-${subtask.id}`}
      className="px-2 py-3 flex items-center rounded bg-primary-gray-200"
    >
      <label>
        <span className="sr-only">task completed</span>
        <input
          type="checkbox"
          checked={subtask.isCompleted}
          className="mr-4"
          onChange={() => {
            updateSubtask({ ...subtask, isCompleted: !subtask.isCompleted });
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
