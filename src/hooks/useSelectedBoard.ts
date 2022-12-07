import { useAppSelector } from "../redux/hooks";
import { selectBoardById } from "../features/boards/boardsEndpoints";
import { getSelectedBoard } from "../features/boards/boardsSlice";

export default function useSelectedBoard() {
  const selectedBoard = useAppSelector(getSelectedBoard);
  const board = useAppSelector((state) =>
    selectBoardById(state, selectedBoard || "")
  );

  return board;
}
