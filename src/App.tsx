import { useState } from "react";
import DesktopHeader from "./components/DesktopHeader";
import MobileHeader from "./components/MobileHeader";
import Sidebar from "./components/Sidebar";
import Board from "./features/boards/Board";
import { classNames } from "./utils/utils";
import ModalDispatch from "./components/ModalDispatch";

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="w-full h-full overflow-hidden flex">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      
      <div
        className={classNames(
          "flex h-full flex-col w-full overflow-hidden transition-all transform",
          "duration-300"
        )}
      >
        <MobileHeader />
        <DesktopHeader />

        <Board />
      </div>

      <ModalDispatch />
    </div>
  );
}

export default App;
