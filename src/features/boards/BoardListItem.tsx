import { useDispatch } from "react-redux";
import { LayoutBoardSplit } from "tabler-icons-react";
import { IBoardData } from "../../@types/types";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { fetchColumnsByBoardId } from "../columns/columnsSlice";
import { fetchTasksByBoardId } from "../tasks/tasksSlice";
import {
  boardSelected,
  getSelectedBoard,
} from "./boardsSlice";

export default function BoardListItem({
  item,
  active,
}: {
  item: IBoardData;
  active: boolean;
}) {
  const dispatch = useAppDispatch();
  const board = useAppSelector(getSelectedBoard);
  return (
    <div className="pr-5">
      <button
        onClick={() => {
          dispatch(boardSelected({ board: item }));
          dispatch(fetchColumnsByBoardId(item?.id));
          dispatch(fetchTasksByBoardId(item.id));
        }}
        className={`w-full flex items-center pl-4 py-3 rounded-r-full ${
          active || board?.id === item.id
            ? "bg-primary-indigo-active text-white"
            : " text-gray-400 "
        }`}
      >
        <LayoutBoardSplit className="w-5 h-5 mr-4" />
        {item.name}
      </button>
    </div>
  );
}
