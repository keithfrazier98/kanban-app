import { IBoardTask } from "../../@types/types";
import { useAppDispatch } from "../../app/hooks";
import { countCompleted } from "../../utils/utils";
import { openTaskUpdated } from "./tasksSlice";

export default function Task({ task, id }: { task: IBoardTask; id: number }) {
  const dispatch = useAppDispatch();

  return (
    <button
      key={`task-${id}`}
      className="w-full px-2 text-left"
      onClick={() => dispatch(openTaskUpdated({ task }))}
    >
      <div className="flex px-4 py-6 flex-col dark:bg-primary-gray-700 bg-white rounded-md shadow-lg">
        <p className="font-bold text-sm dark:text-white">{task.title}</p>
        <p className="text-gray-500 text-xs mt-1  ">
          {countCompleted(task.subtasks)} of {task.subtasks.length} subtasks
        </p>
      </div>
    </button>
  );
}