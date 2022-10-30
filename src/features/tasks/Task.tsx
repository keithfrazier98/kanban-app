import { ITask } from "../../@types/types";
import { useAppDispatch } from "../../app/hooks";
import { addTaskModalOpened, taskSelected } from "./tasksSlice";

export default function Task({
  task,
  placeholder = false,
}: {
  task: ITask;
  placeholder?: boolean;
}) {
  const dispatch = useAppDispatch();

  return (
    <button
      key={`task-${task.id}`}
      className="w-full px-2 text-left"
      onClick={() => {
        placeholder
          ? dispatch(addTaskModalOpened({ open: true }))
          : dispatch(taskSelected({ taskId: task.id }));
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
            <p className="font-bold text-sm dark:text-white">{task.title}</p>
            <p className="text-gray-500 text-xs mt-1  ">
              {task.completedSubtasks} of {task.totalSubtasks} subtasks
            </p>
          </>
        )}
      </div>
    </button>
  );
}
