import { Dispatch, SetStateAction } from "react";
import { X } from "tabler-icons-react";
import { ITaskConstructor } from "../../@types/types";
import DropdownList from "../../components/DropdownList";
import useColumnNames from "../../hooks/useColumnNames";
import useCurrentSubtasks from "../../hooks/useCurrentSubtasks";

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
  const { subtasks, title, description, column } = task;
  const [modalTitle, saveTitle] = elementTitles;

  const { columnNames, columns } = useColumnNames();
  const subtaskData = useCurrentSubtasks();

  const subPlaceholders = ["e.g. Make Coffee", "e.g. Drink cofee & smile"];
  const descPlaceholder =
    "e.g. It's always good to take a break. This 15 minute break will recharge the batteries a little. ";

  /**https://stackoverflow.com/questions/74331905/how-can-i-properly-type-the-event-parameter-in-an-onchange-handler-that-i-want-t */

  /**
   * Generic event handler that can be used for any element.
   * @param key
   * @returns
   */
  function eventHandlerFor<K extends keyof ITaskConstructor>(key: K) {
    return (e: { target: { value: ITaskConstructor[K] } }) => {
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
      <h2 className="ml-2 font-semibold tracking-tight mb-3 dark:text-white">
        {modalTitle}
      </h2>

      <form
        className="flex flex-col mx-2 mt-4"
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit();
        }}
      >
        <label htmlFor="title" className="modalSubtitle">
          Title
        </label>
        <input
          data-testid={`task_title_input`}
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

        <fieldset className="flex flex-col mt-6 max-h-36">
          <legend className="modalSubtitle">Subtasks</legend>
          <ul className="overflow-y-scroll subtasksTrack">
            {subtasks.map((subtask, index) => {
              const i = index > 0 ? 1 : 0;
              return (
                <li
                  key={`subtask-input-${index}`}
                  className="flex items-center"
                >
                  <input
                    data-testid={`subtask_input_${subtask}`}
                    placeholder={subPlaceholders[i]}
                    value={subtaskData?.entities[subtask]?.title || ""}
                    className="modalInput my-1 flex-grow"
                    onChange={(e) => {
                      const onChange = eventHandlerFor("subtasks");
                      const newSubtasks = subtasks.slice();
                      newSubtasks.splice(index, 1, e.target.value);
                      onChange({ target: { value: newSubtasks } });
                    }}
                  />
                  <button
                    data-testid={`delete_subtask_${subtask}`}
                    className="w-6 h-6 text-gray-500 ml-2"
                    onClick={() => {
                      const newSubtasks = subtasks.slice();
                      newSubtasks.splice(index, 1);
                      setTask((pre) => {
                        return {
                          ...pre,
                          subtasks: newSubtasks,
                        };
                      });
                    }}
                  >
                    <X />
                  </button>
                </li>
              );
            })}
          </ul>
        </fieldset>
        <button
          className="fullBtnSecondary"
          onClick={() => {
            setTask((pre) => {
              return {
                ...pre,
                subtasks: [...subtasks, ""],
              };
            });
          }}
        >
          + Add New Subtask
        </button>

        <DropdownList
          label="Status"
          onChange={(column) => {
            setTask((pre) => ({
              ...pre,
              column,
            }));
          }}
          items={columnNames}
          selected={
            columns?.entities[column]?.name ||
            columns?.entities[columns?.ids[0]].name ||
            ""
          }
        />

        <button type="submit" className="fullBtnPrimary">
          {saveTitle}
        </button>
      </form>
    </>
  );
}
