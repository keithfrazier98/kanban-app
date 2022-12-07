import { LayoutBoardSplit } from "tabler-icons-react";
import { useAppDispatch } from "../../redux/hooks";
import { addBoardModalOpened } from "./boardsSlice";

export default function NewBoardBtn() {
  const dispatch = useAppDispatch();
  return (
    <button
      onClick={() => {
        dispatch(addBoardModalOpened({ open: true }));
      }}
      className={`mr-4 text-indigo-500 flex items-center pl-4 py-3 rounded-r-full w-max`}
    >
      <LayoutBoardSplit className="w-5 h-5 mr-4" />+ Create New Board
    </button>
  );
}
