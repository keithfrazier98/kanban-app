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
import DeleteTask from "./features/tasks/DeleteTask";
import EditTask from "./features/tasks/EditTask";
import ViewTask from "./features/tasks/ViewTask";
import { classNames } from "./utils/utils";
import { DragDropContext, DropResult } from "react-beautiful-dnd";
import {
  useGetTasksQuery,
  useUpdateTaskMutation,
  useUpdateTasksMutation,
} from "./features/tasks/tasksEnpoints";
import useAllTasks from "./hooks/useAllTasks";
import {
  useGetColumnsQuery,
  useUpdateColumnsMutation,
} from "./features/columns/columnsEndpoints";
import useColumnNames from "./hooks/useColumnNames";
import { IBoardPostBody, IColumn, ITask } from "./@types/types";

function App() {
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
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const [updateColumns] = useUpdateColumnsMutation();
  const taskData = useAllTasks();
  const { columns } = useColumnNames();

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
    <DragDropContext
      onDragEnd={(result, provided) => {
        const body = onDragEnd(result);
        if (body) updateColumns(body);
      }}
    >
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

        {/* Board Modals */}
        {editBoard ? <EditBoard /> : <></>}
        {addBoard ? <AddBoard /> : <></>}
        {deleteBoard ? <DeleteBoard /> : <></>}

        {/* Task Modals */}
        {openTask && !editTask && !deleteTask ? <ViewTask /> : <></>}
        {deleteTask && openTask ? <DeleteTask /> : <></>}
        {editTask && openTask ? <EditTask /> : <></>}
        {addTask ? <AddTask /> : <></>}
      </div>
    </DragDropContext>
  );
}

export default App;
