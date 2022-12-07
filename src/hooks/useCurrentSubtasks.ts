import { useGetSubtasksQuery } from "../features/subtasks/subtasksEndpoints";
import useSelectedTask from "./useSelectedTask";

export default function useCurrentSubtasks() {
  const { task } = useSelectedTask();
  const { data: subtasks } = useGetSubtasksQuery(task.id);
  return subtasks;
}
