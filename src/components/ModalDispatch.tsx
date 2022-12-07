import { useAppSelector } from "../redux/hooks";
import AddBoard from "../features/boards/AddBoard";
import DeleteBoard from "../features/boards/DeleteBoard";
import EditBoard from "../features/boards/EditBoard";
import AddTask from "../features/tasks/AddTask";
import DeleteTask from "../features/tasks/DeleteTask";
import EditTask from "../features/tasks/EditTask";
import ViewTask from "../features/tasks/ViewTask";

export default function ModalDispatch() {
  const {
    tasks: {
      openTask,
      openAddTaskModal: addTask,
      openEditTaskModal: editTask,
      openDeleteTaskModal: deleteTask,
    },
    boards: {
      addBoardModalOpen: addBoard,
      editBoardModalOpen: editBoard,
      deleteBoardModalOpen: deleteBoard,
    },
  } = useAppSelector((state) => state);

  return (
    <>
      {" "}
      {/* Board Modals */}
      {editBoard ? <EditBoard /> : <></>}
      {addBoard ? <AddBoard /> : <></>}
      {deleteBoard ? <DeleteBoard /> : <></>}
      {/* Task Modals */}
      {openTask && !editTask && !deleteTask ? <ViewTask /> : <></>}
      {deleteTask && openTask ? <DeleteTask /> : <></>}
      {editTask && openTask ? <EditTask /> : <></>}
      {addTask ? <AddTask /> : <></>}
    </>
  );
}
