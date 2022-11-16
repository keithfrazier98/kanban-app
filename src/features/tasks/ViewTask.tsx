import { useAppDispatch } from "../../app/hooks";
import { useUpdateTaskMutation } from "./tasksEnpoints";
import { taskSelected } from "./tasksSlice";
import { ModalWBackdrop } from "../../components/ModalWBackdrop";
import Subtask from "../subtasks/Subtask";
import DropdownList from "../../components/DropdownList";
import { useGetSubtasksQuery } from "../subtasks/subtasksEndpoints";
import TaskOptions from "./TaskOptions";
import useSelectedTask from "../../hooks/useSelectedTask";
import useColumnNames from "../../hooks/useColumnNames";
import useTransitionState from "../../hooks/useTransitionState";
import { Draggable, Droppable, DragDropContext } from "react-beautiful-dnd";
import PortalAwareItem from "../../components/PortalAwareItem";

export default function ViewTask() {
  const task = useSelectedTask();

  const [updateTask] = useUpdateTaskMutation();

  const dispatch = useAppDispatch();

  const [render, unRender] = useTransitionState(() => {
    dispatch(taskSelected({ taskId: null }));
  });

  const { data: subtasks } = useGetSubtasksQuery(task.id);
  const { columnNames, columns } = useColumnNames();

  if (!!task) {
    const {
      description,
      status,
      title,
      completedSubtasks,
      subtasks: subtaskList,
    } = task;

    return (
      <DragDropContext
        onDragEnd={(result) => {
          const { destination, source, draggableId } = result;
          if (!destination) return;
          const subtaskUpdate = subtaskList.slice();
          subtaskUpdate.splice(source.index, 1);
          subtaskUpdate.splice(destination.index, 0, draggableId);
          
          console.log(result, subtaskUpdate)
          updateTask({ ...task, subtasks: subtaskUpdate });
        }}
      >
        <ModalWBackdrop render={render} onOutsideClick={unRender}>
          <div className="flex justify-between items-center w-full">
            <h3 className="font-bold text-lg md:text-base leading-6 dark:text-white">
              {title}
            </h3>
            <TaskOptions />
          </div>
          <p className="text-sm mt-7 text-gray-500 leading-6">{description}</p>
          <p className="text-xs font-bold mt-6 mb-4 text-gray-500 dark:text-white">
            Subtasks {`(${completedSubtasks} of ${subtaskList.length})`}
          </p>
          <Droppable droppableId="subtasks">
            {(provided) => (
              <ul
                className="flex flex-col"
                ref={provided.innerRef}
                {...provided.droppableProps}
              >
                {subtasks ? (
                  subtaskList.map((taskId, index) => (
                    <Draggable
                      draggableId={`${taskId}`}
                      index={index}
                      key={`subtask-${taskId}`}
                    >
                      {(provided, snapshot) => (
                        <PortalAwareItem
                          provided={provided}
                          snapshot={snapshot}
                        >
                          <Subtask subtask={subtasks.entities[taskId]} />
                        </PortalAwareItem>
                      )}
                    </Draggable>
                  ))
                ) : (
                  <></>
                )}{" "}
                {provided.placeholder}
              </ul>
            )}
          </Droppable>
          <DropdownList
            items={columnNames}
            selected={columns?.entities[status].name || ""}
            label={"Current Status"}
            onChange={(status: string) => {
              updateTask({ ...task, status });
            }}
          />
        </ModalWBackdrop>
      </DragDropContext>
    );
  }

  return <></>;
}
