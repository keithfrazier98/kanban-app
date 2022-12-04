import { useAppDispatch } from "../../redux/hooks";
import ConfirmDelete from "../../components/ConfirmDelete";
import useSelectedBoard from "../../hooks/useSelectedBoard";
import useTransitionState from "../../hooks/useTransitionState";
import { useDeleteBoardMutation, useGetBoardsQuery } from "./boardsEndpoints";
import { boardSelected, deleteBoardModalOpened } from "./boardsSlice";

export default function DeleteBoard() {
  const selectedBoard = useSelectedBoard();
  const { data: boards } = useGetBoardsQuery(undefined);
  const dispatch = useAppDispatch();
  const [deleteBoard] = useDeleteBoardMutation();

  const closeModal = () => {
    dispatch(deleteBoardModalOpened({ open: false }));
  };

  const onDelete = () => {
    if (!selectedBoard) return;
    dispatch(
      boardSelected({
        board:
          String(boards?.ids.find((id) => id !== selectedBoard.id)) || null,
      })
    );
    deleteBoard(selectedBoard.id);
    unRender();
  };

  const [render, unRender] = useTransitionState(closeModal);

  return (
    <ConfirmDelete
      render={render}
      title={"Delete this board?"}
      onCancel={unRender}
      onDelete={onDelete}
      testid="delete_board_modal"
      paragraph={
        <>
          Are you sure you want to delete the '{selectedBoard?.name}' board?
          This action will remove all columns and tasks and cannot be reversed.
        </>
      }
    />
  );
}
