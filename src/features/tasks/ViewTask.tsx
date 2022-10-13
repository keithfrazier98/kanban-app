import OutsideClickHandler from "react-outside-click-handler";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { getOpenTask, openTaskUpdated, selectTaskById } from "./tasksSlice";
import { countCompleted } from "../../utils/utils";
import { DimModalBackdrop } from "../../components/DimModalBackdrop";
import { DotsVertical } from "tabler-icons-react";
import { useEffect } from "react";
import {
  fetchSubtasksByTaskId,
  selectAllSubtasks,
  setAllSubtasks,
} from "../subtasks/subtasksSlice";
import Subtask from "../subtasks/Subtask";
import DropdownList from "../../components/DropdownList";
import { IBoardTask } from "../../@types/types";

export default function ViewTask() {
  const openTask = useAppSelector(getOpenTask);
  const task = useAppSelector((state) => selectTaskById(state, openTask || ""));

  const dispatch = useAppDispatch();

  const subtasks = useAppSelector(selectAllSubtasks);
  const columnNames = useAppSelector((state) => state.columns.ids);

  useEffect(() => {
    if (!!openTask && !!!subtasks.length) {
      dispatch(fetchSubtasksByTaskId(openTask));
    }
  }, [openTask]);

  if (!!task) {
    const { description, status, title, subtasksCompleted, totalSubtasks } =
      task;

      
    return (
      <DimModalBackdrop>
        <OutsideClickHandler
          onOutsideClick={() => {
            dispatch(openTaskUpdated({ taskId: null }));
            dispatch(setAllSubtasks([]));
          }}
        >
          <section className="px-4 py-6 bg-white dark:bg-primary-gray-700 rounded-md max-w-sm min-w-[22rem]">
            <div className="flex justify-between items-center w-full">
              <h3 className="font-bold text-lg md:text-base leading-6">
                {title}
              </h3>
              <div>
                <DotsVertical className="text-gray-400 ml-3" size={28} />
              </div>
            </div>
            <p className="text-sm mt-7 text-gray-500 leading-7">
              {description}
            </p>
            <p className="text-xs font-bold mt-6 mb-4 text-gray-500">
              Subtasks {`(${subtasksCompleted} of ${totalSubtasks})`}
            </p>{" "}
            <ul className="grid grid-flow-row gap-2">
              {subtasks.map((subtask, id) => (
                <Subtask key={`subtask-${id}`} subtask={subtask} />
              ))}
            </ul>
            <DropdownList
              items={columnNames}
              selected={status}
              label={"Current Status"}
              onChange={(status: string) => {
                console.log(status);
                // dispatch(openTaskUpdated({ task: { ...openTask, status } }));
              }}
            />
          </section>
        </OutsideClickHandler>
      </DimModalBackdrop>
    );
  }

  return <></>;
}
