import { useContext } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useAppSelector } from "./app/hooks";
import Dashboard from "./components/Dashboard";
import ViewTask from "./features/tasks/ViewTask";
import { getOpenTask } from "./features/tasks/tasksSlice";

function App() {
  const openTask = useAppSelector(getOpenTask);
  return (
    <div className="w-full h-full overflow-hidden">
      <Router>
        <Routes>
          <Route path="/" element={<Dashboard />} />
        </Routes>
      </Router>
      {openTask ? <ViewTask /> : <></>}
    </div>
  );
}

export default App;
