import { LayoutBoardSplit } from "tabler-icons-react";
import { IBoardData } from "../../@types/types";
import { useAppDispatch } from "../../redux/hooks";
import useSelectedBoard from "../../hooks/useSelectedBoard";
import { boardSelected } from "./boardsSlice";

export default function BoardMenuItem({
  item,
  active,
}: {
  item: IBoardData;
  active: boolean;
}) {
  const dispatch = useAppDispatch();
  const board = useSelectedBoard();
  return (
    <div className="pr-5">
      <button
        data-testid={`board_menu_item_${item.name}`}
        onClick={() => {
          dispatch(boardSelected({ board: item.id }));
        }}
        className={`w-full flex items-center pl-4 py-3 rounded-r-full ${
          active || board?.id === item.id
            ? "bg-primary-indigo-active text-white"
            : " text-gray-400 "
        }`}
      >
        <LayoutBoardSplit className="w-5 h-5 mr-4" />
        <span>{item.name}</span>
      </button>
    </div>
  );
}
