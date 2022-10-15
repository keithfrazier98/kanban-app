import { useAppSelector } from "./app/hooks";
import MobileNavBar from "./components/MobileNavBar";
import SideBar from "./components/SideBar";
import Board from "./features/boards/Board";
import { getOpenTask } from "./features/tasks/tasksSlice";
import ViewTask from "./features/tasks/ViewTask";


function App() {
  const openTask = useAppSelector(getOpenTask);
  return (
    <div className="w-full h-full overflow-hidden">
      <SideBar />
      <div className="flex h-full flex-col md:pl-64 w-full overflow-hidden">
        <MobileNavBar />
        <main className="overflow-x-scroll overflow-y-hidden no-scrollbar h-full">
          <Board />
        </main>
      </div>
      {openTask ? <ViewTask /> : <></>}
    </div>
  );
}

export default App;
