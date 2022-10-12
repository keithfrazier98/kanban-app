import { useContext } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Context } from "./components/Context";
import Dashboard from "./components/Dashboard";
import ViewTask from "./components/ViewTask";

function App() {
  const { openTask } = useContext(Context);
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Dashboard />} />
        </Routes>
      </Router>
      {openTask ? <ViewTask /> : <></>}
    </>
  );
}

export default App;
