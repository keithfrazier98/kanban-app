import { useState } from "react";
import DesktopHeader from "./components/DesktopHeader";
import MobileHeader from "./components/MobileHeader";
import SideBar from "./components/SideBar";
import Board from "./features/boards/Board";
import { classNames } from "./utils/utils";
import ModalDispatch from "./components/ModalDispatch";

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true);


  return (
    <div className="w-full h-full overflow-hidden flex">
      <SideBar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <div
        className={classNames(
          sidebarOpen ? "w-64 mr-[3.09rem]" : "w-0",
          "flex transition-all duration-300 ease-in-out"
        )}
      />
      <div
        className={classNames(
          "flex h-full flex-col w-full overflow-hidden transition-all transform",
          "duration-300"
        )}
      >
        <MobileHeader />
        <DesktopHeader />
        <main
          className={classNames(
            "flex overflow-x-scroll overflow-y-hidden boardTrack h-full",
            "transform transition-all"
          )}
        >
          <Board />
        </main>
      </div>

      <ModalDispatch />
    </div>
  );
}

export default App;
