import { useState } from "react";
import OutsideClickHandler from "react-outside-click-handler";
import { DotsVertical } from "tabler-icons-react";
import { useAppDispatch } from "../../app/hooks";
import { useDeleteBoardMutation } from "./boardsEndpoints";
import { deleteBoardModalOpened, editBoardModalOpened } from "./boardsSlice";

export default function BoardOptions() {
  const dispatch = useAppDispatch();
  const [openOptions, setOpenOptions] = useState(false);

  return (
    <OutsideClickHandler
      onOutsideClick={() => {
        setOpenOptions(false);
      }}
    >
      <div className="relative flex items-center h-full">
        <button onClick={() => setOpenOptions(true)}>
          <DotsVertical className="text-gray-400" />
        </button>
        {openOptions ? (
          <div className="px-4 py-6 absolute top-full flex -right-full -translate-x-4 rounded-md shadow-lg min-w-[12rem] items-start flex-col w-max text-xs bg-white">
            <button
              className="text-primary-gray-400 mb-4"
              onClick={() => {
                setOpenOptions(false);
                dispatch(editBoardModalOpened({ open: true }));
              }}
            >
              Edit Board
            </button>{" "}
            <button
              className="text-primary-red-active"
              onClick={() => {
                setOpenOptions(false);
                dispatch(deleteBoardModalOpened({ open: true }));
              }}
            >
              Delete Board
            </button>
          </div>
        ) : (
          <></>
        )}
      </div>
    </OutsideClickHandler>
  );
}
