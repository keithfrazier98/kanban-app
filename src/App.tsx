import { useState } from "react";
import { useAppSelector } from "./app/hooks";
import DesktopHeader from "./components/DesktopHeader";
import MobileHeader from "./components/MobileHeader";
import SideBar from "./components/SideBar";
import AddBoard from "./features/boards/AddBoard";
import Board from "./features/boards/Board";
import { deleteBoardModalOpened } from "./features/boards/boardsSlice";
import DeleteBoard from "./features/boards/DeleteBoard";
import EditBoard from "./features/boards/EditBoard";
import AddTask from "./features/tasks/AddTask";
import ViewTask from "./features/tasks/ViewTask";
import { classNames } from "./utils/utils";

function App() {
  const {
    tasks: { openTask, openAddTaskModal: addTask },
    boards: {
      addBoardModalOpen: addBoard,
      editBoardModalOpen: editBoard,
      deleteBoardModalOpen: deleteBoard,
    },
  } = useAppSelector((state) => state);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="w-full h-full overflow-hidden">
      <SideBar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <div
        className={classNames(
          sidebarOpen ? "md:pl-64" : "",
          `flex h-full flex-col w-full overflow-hidden`
        )}
      >
        <MobileHeader />
        <DesktopHeader />
        <main className="overflow-x-scroll overflow-y-hidden no-scrollbar h-full">
          <Board />
        </main>
      </div>
      {openTask ? <ViewTask /> : <></>}
      {editBoard ? <EditBoard /> : <></>}
      {addBoard ? <AddBoard /> : <></>}
      {addTask ? <AddTask /> : <></>}
      {deleteBoard ? <DeleteBoard /> : <></>}
    </div>
  );
}

export default App;
