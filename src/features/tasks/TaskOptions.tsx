import { useState } from "react";
import OutsideClickHandler from "react-outside-click-handler";
import { DotsVertical } from "tabler-icons-react";
import { useAppDispatch } from "../../redux/hooks";
import { classNames } from "../../utils/utils";
import { deleteTaskModalOpened, editTaskModalOpened } from "./tasksSlice";

export default function TaskOptions() {
  const [openOptions, setOpenOptions] = useState(false);
  const dispatch = useAppDispatch();

  return (
    <div className="relative" data-testid="task_options_menu">
      <button
        data-testid="task_options_btn"
        onClick={() => {
          setOpenOptions(true);
        }}
      >
        <DotsVertical className="text-gray-400 ml-3" size={28} />
      </button>

      {openOptions ? (
        <OutsideClickHandler
          onOutsideClick={() => {
            setOpenOptions(false);
          }}
        >
          <div
            className={classNames(
              "absolute top-full w-40 rounded-md py-2",
              "translate-y-2 shadow-md bg-white flex flex-col text-left",
              "dark:bg-primary-gray-700 z-20 right-0"
            )}
          >
            <button
              className="optionsBtnNormal"
              onClick={() => {
                dispatch(editTaskModalOpened({ open: true }));
              }}
            >
              Edit Task
            </button>
            <button
              className="optionsBtnRed"
              onClick={() => {
                setOpenOptions(false);
                dispatch(deleteTaskModalOpened({ open: true }));
              }}
            >
              Delete Task
            </button>
          </div>
        </OutsideClickHandler>
      ) : (
        <></>
      )}
    </div>
  );
}
