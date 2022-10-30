import { useAppSelector } from "./app/hooks";
import DesktopHeader from "./components/DesktopHeader";
import MobileHeader from "./components/MobileHeader";
import SideBar from "./components/SideBar";
import AddBoard from "./features/boards/AddBoard";
import Board from "./features/boards/Board";
import EditBoard from "./features/boards/EditBoard";
import AddTask from "./features/tasks/AddTask";
import ViewTask from "./features/tasks/ViewTask";

function App() {

  const {
    tasks: { openTask, openAddTaskModal: addTask },
    boards: { addBoardModalOpen: addBoard, editBoardModalOpen: editBoard },
  } = useAppSelector((state) => state);

  return (
    <div className="w-full h-full overflow-hidden">
      <SideBar />
      <div className="flex h-full flex-col md:pl-64 w-full overflow-hidden">
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
    </div>
  );
}

export default App;
