import { DropResult } from "react-beautiful-dnd";
import { IColumn, IColumnPostBody } from "../@types/types";
import useAllTasks from "./useAllTasks";
import useColumnNames from "./useColumnNames";

export default function useMoveTask() {
  const taskData = useAllTasks();
  const { columns } = useColumnNames();

  const moveTask = (
    result:
      | DropResult
      | {
          source: { index: number; droppableId: string };
          destination: { index: number; droppableId: string };
          draggableId: string;
        }
  ): IColumnPostBody | undefined => {
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
      boardId: column.board,
      deletions: [],
      newName: null,
      updates,
    };
  };

  return { moveTask };
}
