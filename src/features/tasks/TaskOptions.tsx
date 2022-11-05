import { useState } from "react";
import OutsideClickHandler from "react-outside-click-handler";
import { DotsVertical } from "tabler-icons-react";
import { useAppDispatch } from "../../app/hooks";
import { editTaskModalOpened, taskSelected } from "./tasksSlice";

export default function TaskOptions() {
  const [openOptions, setOpenOptions] = useState(false);
  const dispatch = useAppDispatch();

  return (
    <div className="relative">
      <button
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
          <div className="absolute top-full w-40 rounded-md py-2 -translate-x-1/3 translate-y-2 shadow-md bg-white flex flex-col text-left">
            <button
              onClick={() => {
                dispatch(editTaskModalOpened({ open: true }));
              }}
              className="optionsBtnNormal"
            >
              Edit Task
            </button>
            <button className="optionsBtnRed">Delete Task</button>
          </div>
        </OutsideClickHandler>
      ) : (
        <></>
      )}
    </div>
  );
}
