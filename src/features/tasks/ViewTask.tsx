import OutsideClickHandler from "react-outside-click-handler";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { getOpenTask, openTaskUpdated } from "./tasksSlice";
import { countCompleted } from "../../utils/utils";
import { DimModalBackdrop } from "../../components/DimModalBackdrop";
import { DotsVertical } from "tabler-icons-react";
import { useEffect, useState } from "react";
import { taskCancelled } from "@reduxjs/toolkit/dist/listenerMiddleware/exceptions";
import {
  selectAllSubtasks,
  setAllSubtasks,
  subtaskUpdated,
} from "../subtasks/subtasksSlice";
import Subtask from "../subtasks/Subtask";

export default function ViewTask() {
  const openTask = useAppSelector(getOpenTask);
  const dispatch = useAppDispatch();

  const empty = { description: "", status: "", subtasks: [], title: "" };
  const { description, status, subtasks: subs, title } = openTask || empty;

  const subtasks = useAppSelector(selectAllSubtasks);

  useEffect(() => {
    if (!!openTask && !!!subtasks.length) {
      console.log(subs);

      dispatch(setAllSubtasks(subs));
    }
  }, [openTask]);

  return !openTask ? (
    <></>
  ) : (
    <DimModalBackdrop>
      <OutsideClickHandler
        onOutsideClick={() => {
          dispatch(openTaskUpdated({ task: null }));
          dispatch(setAllSubtasks([]));
        }}
      >
        <section className="px-4 py-6 bg-white dark:bg-primary-gray-700 rounded-md w-full max-w-sm">
          <div className="flex items-center">
            <h3 className="font-bold text-lg md:text-base leading-6">
              {title}
            </h3>
            <div>
              <DotsVertical className="text-gray-400 ml-3" size={28} />
            </div>
          </div>
          <p className="text-sm mt-7 text-gray-500 leading-7">{description}</p>
          <p className="text-xs font-bold mt-6 mb-4 text-gray-500">
            Subtasks {`(${countCompleted(subtasks)} of ${subtasks.length})`}
          </p>{" "}
          <ul className="grid grid-flow-row gap-2">
            {subtasks.map((subtask, id) => (
              <Subtask id={id} subtask={subtask} />
            ))}
          </ul>
          <div></div>
        </section>
      </OutsideClickHandler>
    </DimModalBackdrop>
  );
}
