import { Dispatch, SetStateAction, useMemo, useState } from "react";
import { X } from "tabler-icons-react";
import { ITaskConstructor } from "../../@types/types";
import {  useAppSelector } from "../../app/hooks";
import DropdownList from "../../components/DropdownList";
import { getSelectedBoard } from "../boards/boardsSlice";
import { useGetColumnsQuery } from "../columns/columnsEndpoints";

export default function TaskModifier({
  task,
  setTask,
  modalTitle,
}: {
  task: ITaskConstructor;
  setTask: Dispatch<SetStateAction<ITaskConstructor>>;
  modalTitle: string;
}) {
  const { subtasks, title, description } = task;

  const selectedBoard = useAppSelector(getSelectedBoard);
  const { data: columns } = useGetColumnsQuery(selectedBoard?.id);

  const columnNames = useMemo(() => {
    if (columns?.entities) {
      return Object.values(columns?.entities).map((col) => col?.name || "");
    } else {
      return [];
    }
  }, [columns]);

  const [status, setStatus] = useState(
    columns?.entities[columns.ids[0]].name || ""
  );

  const subPlaceholders = ["e.g. Make Coffee", "e.g. Drink cofee & smile"];
  const descPlaceholder =
    "e.g. It's always good to take a break. This 15 minute break will recharge the batteries a little. ";

  function eventHandlerFor(key: string) {
    return (e: any) => {
      setTask((pre) => {
        return {
          ...pre,
          [key]: e.target.value,
        };
      });
    };
  }

  return (
    <>
      <h2 className="ml-2 font-semibold tracking-tight mb-3 dark:text-primary-gray-400">
        {modalTitle}
      </h2>

      <form
        className="flex flex-col mx-2"
        onSubmit={(e) => {
          e.preventDefault();
        }}
      >
        <label htmlFor="title" className="modalSubtitle">
          Title
        </label>
        <input
          type="text"
          name="title"
          placeholder="e.g. Take coffee break"
          className="modalInput"
          value={title}
          onChange={eventHandlerFor("title")}
        />

        <label htmlFor="description" className="modalSubtitle mt-6">
          Description
        </label>
        <textarea
          name="description"
          rows={5}
          className="modalInput"
          placeholder={descPlaceholder}
          value={description}
          onChange={eventHandlerFor("description")}
        />

        <fieldset className="flex flex-col mt-6">
          <legend className="modalSubtitle">Subtasks</legend>
          {subtasks.map((subtask, index) => {
            const i = index > 0 ? 1 : 0;
            return (
              <div className="flex items-center">
                <input
                  placeholder={subPlaceholders[i]}
                  value={subtask}
                  className="modalInput my-1 flex-grow"
                  onChange={(e) => {
                    const onChange = eventHandlerFor("subtasks");
                    const newSubtasks = subtasks.slice();
                    newSubtasks.splice(index, 1, e.target.value);
                    onChange({ target: { value: newSubtasks } });
                  }}
                />
                <button
                  className="w-6 h-6 text-gray-500 ml-2"
                  onClick={() => {
                    const newSubtasks = subtasks.slice();
                    newSubtasks.splice(index, 1);
                    eventHandlerFor("subtasks")({
                      target: { value: newSubtasks },
                    });
                  }}
                >
                  <X />
                </button>
              </div>
            );
          })}
        </fieldset>
        <button
          className="fullBtnSecondary"
          onClick={() => {
            eventHandlerFor("subtasks")({
              target: { value: [...subtasks, ""] },
            });
          }}
        >
          + Add New Subtask
        </button>

        <DropdownList
          label="Status"
          onChange={(status) => {
            setStatus(status);
          }}
          items={columnNames}
          selected={status}
        />

        <button type="submit" className="fullBtnPrimary">
          Create Task
        </button>
      </form>
    </>
  );
}
