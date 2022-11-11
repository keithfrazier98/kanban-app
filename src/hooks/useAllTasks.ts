import { useAppSelector } from "../app/hooks";
import { getSelectedBoard } from "../features/boards/boardsSlice";
import { useGetTasksQuery } from "../features/tasks/tasksEnpoints";
import useSelectedBoard from "./useSelectedBoard";

export default function useAllTasks() {
  const selectedBoard = useSelectedBoard();

  const { data: tasks } = useGetTasksQuery(selectedBoard?.id, {
    skip: !selectedBoard,
  });

  return tasks;
}
