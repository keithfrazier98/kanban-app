import { useAppDispatch } from "../../redux/hooks";
import { editBoardModalOpened } from "../boards/boardsSlice";

export default function AddNewColumnBtn() {
  const dispatch = useAppDispatch();

  return (
    <div className="pt-[4.5rem] pb-4 h-full">
      <button
        onClick={() => dispatch(editBoardModalOpened({ open: true }))}
        className="h-full w-72 flex items-center justify-center dark:bg-primary-gray-600 dark:opacity-30 bg-primary-gray-300 rounded-md mx-2"
      >
        <p className="text-lg font-semibold text-primary-gray-400">
          + New Column
        </p>
      </button>
    </div>
  );
}
