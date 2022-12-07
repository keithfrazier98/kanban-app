import { useState } from "react";
import OutsideClickHandler from "react-outside-click-handler";
import { DotsVertical } from "tabler-icons-react";
import { useAppDispatch } from "../../redux/hooks";
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
        <button
          data-testid="board_options_btn"
          onClick={() => setOpenOptions(true)}
        >
          <DotsVertical className="text-gray-400" />
        </button>
        {openOptions ? (
          <div
            data-testid="board_options_modal"
            className="py-2 absolute top-full flex -right-full translate-y-3 -translate-x-4 rounded-md shadow-md min-w-[12rem] items-start flex-col w-max text-xs bg-white"
          >
            <button
              className="optionsBtnNormal"
              onClick={() => {
                setOpenOptions(false);
                dispatch(editBoardModalOpened({ open: true }));
              }}
            >
              Edit Board
            </button>{" "}
            <button
              className="optionsBtnRed"
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
