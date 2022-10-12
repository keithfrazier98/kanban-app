import { useContext } from "react";
import { IBoardColumn, IBoardSubTask, IBoardTask } from "../@types/types";
import { useAppDispatch } from "../app/hooks";
import { taskSelected } from "../features/tasks/tasksSlice";
import { countCompleted } from "../utils/utils";

export default function Column({ column }: { column: IBoardColumn }) {
  const dispatch = useAppDispatch();

  return (
    <div className="my-6 max-h-full">
      <div className="flex items-center mb-6 text-base text-gray-400 font-bold">
        <div className="rounded-full w-3 h-3 bg-primary-indigo-active"></div>
        <h2 className="mx-2 tracking-widest">{column.name.toUpperCase()}</h2>
        <p> {`( ${column.tasks.length} )`}</p>
      </div>
      <div className="overflow-y-scroll no-scrollbar max-h-full pb-12 w-72">
        <div className="grid grid-cols-1 grid-flow-row gap-5">
          {column.tasks.map((task: IBoardTask) => (
            <button
              className="w-full px-2 text-left"
              onClick={() => dispatch(taskSelected({ task }))}
            >
              <div className="flex px-4 py-6 flex-col dark:bg-primary-gray-700 bg-white rounded-md shadow-lg">
                <p className="font-bold text-sm dark:text-white">
                  {task.title}
                </p>
                <p className="text-gray-500 text-xs mt-1  ">
                  {countCompleted(task.subtasks)} of {task.subtasks.length}{" "}
                  subtasks
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
