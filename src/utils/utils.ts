import { ISubtask } from "../@types/types";
import { RootState } from "../app/store";

export function countCompleted(subtasks: ISubtask[]) {
  let count = 0;
  subtasks.forEach((subtask) => {
    if (subtask.isCompleted) count++;
  });

  return count;
}

export function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

export function openModalFunction(stateName: string) {
  return (state: any, { payload }: { payload: { open: boolean } }) => {
    const { open } = payload;
    state[stateName] = open;
  };
}
