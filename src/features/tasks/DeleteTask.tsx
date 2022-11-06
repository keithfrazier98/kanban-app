import { useAppDispatch } from "../../app/hooks";
import ConfirmDelete from "../../components/ConfirmDelete";
import useSelectedTask from "../../hooks/useSelectedTask";
import { useDeleteTaskMutation } from "./tasksEnpoints";
import { deleteTaskModalOpened, editTaskModalOpened, taskSelected } from "./tasksSlice";

export default function DeleteTask() {
  const task = useSelectedTask();
  const [deleteTask] = useDeleteTaskMutation();
  const dispatch = useAppDispatch();
  const onCancel = () => {
    dispatch(taskSelected({ taskId: null }));
    dispatch(deleteTaskModalOpened({ open: false }));
  };

  return (
    <ConfirmDelete
      title="Delete this task?"
      onCancel={onCancel}
      onDelete={() => deleteTask(task.id)}
      paragraph={
        <>
          Are you sure you want to delete the "{task.title}" task and its
          subtasks? This action can not be reversed.
        </>
      }
    />
  );
}
