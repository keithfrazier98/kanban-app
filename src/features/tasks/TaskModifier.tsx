import { Dispatch, SetStateAction, useMemo } from "react";
import { X } from "tabler-icons-react";
import { ITaskConstructor } from "../../@types/types";
import { useAppSelector } from "../../app/hooks";
import DropdownList from "../../components/DropdownList";
import useColumnNames from "../../hooks/useColumnNames";
import { getSelectedBoard } from "../boards/boardsSlice";
import { useGetColumnsQuery } from "../columns/columnsEndpoints";

export default function TaskModifier({
  task,
  setTask,
  elementTitles,
  onSubmit,
}: {
  task: ITaskConstructor;
  setTask: Dispatch<SetStateAction<ITaskConstructor>>;
  elementTitles: string[];
  onSubmit: () => void;
}) {
  const { subtasks, title, description, status } = task;
  const [modalTitle, saveTitle] = elementTitles;

  const { columnNames, columns } = useColumnNames();

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
          onSubmit();
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

        <fieldset className="flex flex-col mt-6  max-h-36 overflow-y-scroll">
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
                    setTask((pre) => {
                      return {
                        ...pre,
                        subtasks: newSubtasks,
                        totalSubtasks: pre.totalSubtasks - 1,
                      };
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
            setTask((pre) => {
              return {
                ...pre,
                subtasks: [...subtasks, ""],
                totalSubtasks: pre.totalSubtasks + 1,
              };
            });
          }}
        >
          + Add New Subtask
        </button>

        <DropdownList
          label="Status"
          onChange={(status) => {
            setTask((pre) => ({
              ...pre,
              status,
            }));
          }}
          items={columnNames}
          selected={columns?.entities[status].name || ""}
        />

        <button type="submit" className="fullBtnPrimary">
          {saveTitle}
        </button>
      </form>
    </>
  );
}
