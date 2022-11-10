import { useState } from "react";
import DesktopHeader from "./components/DesktopHeader";
import MobileHeader from "./components/MobileHeader";
import SideBar from "./components/SideBar";
import Board from "./features/boards/Board";
import { classNames } from "./utils/utils";
import { DragDropContext, DropResult } from "react-beautiful-dnd";

import useAllTasks from "./hooks/useAllTasks";
import { useUpdateColumnsMutation } from "./features/columns/columnsEndpoints";
import useColumnNames from "./hooks/useColumnNames";
import { IBoardPostBody, IColumn } from "./@types/types";
import EditBoard from "./features/boards/EditBoard";
import AddBoard from "./features/boards/AddBoard";
import DeleteBoard from "./features/boards/DeleteBoard";
import DeleteTask from "./features/tasks/DeleteTask";
import ViewTask from "./features/tasks/ViewTask";
import EditTask from "./features/tasks/EditTask";
import AddTask from "./features/tasks/AddTask";

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [updateColumns] = useUpdateColumnsMutation();
  const { columns } = useColumnNames();

  const taskData = useAllTasks();

  //handler for drag event, updates columns task attribute in the DB
  const onDragEnd = (result: DropResult): IBoardPostBody | undefined => {
    if (!taskData || !columns) return;
    const { source, destination, draggableId } = result;
    if (!destination) return;

    const column = columns.entities[destination.droppableId];
    const taskList = column.tasks.slice();
    const updates: IColumn[] = [];

    if (source.droppableId === destination.droppableId) {
      //reorder array
      taskList.splice(source.index, 1);
      taskList.splice(destination.index, 0, draggableId);
    } else {
      //remove from old col and add to new
      const prev = columns.entities[source.droppableId];
      const prevList = prev.tasks.slice();

      prevList.splice(source.index, 1);
      taskList.splice(destination.index, 0, draggableId);

      updates.push({ ...prev, tasks: prevList });
    }

    updates.push({ ...column, tasks: taskList });

    return {
      additions: [],
      boardId: column.board.id,
      deletions: [],
      newName: null,
      updates,
    };
  };

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
            "flex overflow-x-scroll overflow-y-hidden no-scrollbar h-full",
            "transform transition-all"
          )}
        >
          <DragDropContext
            onDragEnd={(result, provided) => {
              const body = onDragEnd(result);
              if (body) updateColumns(body);
            }}
          >
            <Board />
          </DragDropContext>
        </main>
      </div>

      {/* Board Modals */}
      <EditBoard />
      <AddBoard />
      <DeleteBoard />

      {/* Task Modals */}
      <ViewTask />
      <DeleteTask />
      <EditTask />
      <AddTask />
    </div>
  );
}

export default App;
