import { useAppSelector } from "../app/hooks";
import { getSelectedBoard } from "../features/boards/boardsSlice";
import { useGetTasksQuery } from "../features/tasks/tasksEnpoints";

export default function useAllTasks() {
  const selectedBoard = useAppSelector(getSelectedBoard);

  const { data: tasks } = useGetTasksQuery(selectedBoard?.id, {
    skip: !selectedBoard,
  });

  return tasks;
}
