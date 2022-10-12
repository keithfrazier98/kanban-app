import { IBoardSubTask } from "../@types/types";

export function countCompleted(subtasks: IBoardSubTask[]) {
  let count = 0;
  subtasks.forEach((subtask) => {
    if (subtask.isCompleted) count++;
  });

  return count;
}

export function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}
