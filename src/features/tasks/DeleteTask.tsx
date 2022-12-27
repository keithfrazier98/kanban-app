import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import ConfirmDelete from "../../components/ConfirmDelete";
import useSelectedTask from "../../hooks/useSelectedTask";
import useTransitionState from "../../hooks/useTransitionState";
import { useDeleteTaskMutation } from "./tasksEnpoints";
import {
  deleteTaskModalOpened,
  selectTaskSlice,
  taskSelected,
} from "./tasksSlice";

export default function DeleteTask() {
  const { task } = useSelectedTask();
  const [deleteTask] = useDeleteTaskMutation();
  const dispatch = useAppDispatch();

  const onCancel = () => {
    dispatch(taskSelected({ taskId: null }));
    dispatch(deleteTaskModalOpened({ open: false }));
  };

  const { openDeleteTaskModal, openTask } = useAppSelector(selectTaskSlice);
  const [_, unRender] = useTransitionState(onCancel);
  return (
    <ConfirmDelete
      render={!!(openDeleteTaskModal && openTask)}
      title="Delete this task?"
      onCancel={unRender}
      onDelete={() => {
        unRender();
        deleteTask(task.id);
      }}
      testid="delete_task_modal"
      paragraph={
        <>
          Are you sure you want to delete the "{task?.title}" task and its
          subtasks? This action can not be reversed.
        </>
      }
    />
  );
}
