import { useContext } from "react";
import { IBoardColumn, IBoardSubTask, IBoardTask } from "../@types/types";
import { useAppDispatch } from "../app/hooks";
import Task from "../features/tasks/Task";
import { openTaskUpdated } from "../features/tasks/tasksSlice";
import { countCompleted } from "../utils/utils";

export default function Column({ column }: { column: IBoardColumn }) {
  return (
    <div className="my-6 max-h-full">
      <div className="flex items-center mb-6 text-base text-gray-400 font-bold">
        <div className="rounded-full w-3 h-3 bg-primary-indigo-active"></div>
        <h2 className="mx-2 tracking-widest">{column.name.toUpperCase()}</h2>
        <p> {`( ${column.tasks.length} )`}</p>
      </div>
      <div className="overflow-y-scroll no-scrollbar max-h-full pb-12 w-72">
        <div className="grid grid-cols-1 grid-flow-row gap-5">
          {column.tasks.map((task: IBoardTask, i) => (
            <Task task={task} id={i} />
          ))}
        </div>
      </div>
    </div>
  );
}
