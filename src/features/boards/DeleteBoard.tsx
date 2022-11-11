import { useAppDispatch, useAppSelector } from "../../app/hooks";
import ConfirmDelete from "../../components/ConfirmDelete";
import useTransitionState from "../../hooks/useTransitionState";
import { useDeleteBoardMutation, useGetBoardsQuery } from "./boardsEndpoints";
import {
  boardSelected,
  deleteBoardModalOpened,
  getSelectedBoard,
} from "./boardsSlice";

export default function DeleteBoard() {
  const { deleteBoardModalOpen } = useAppSelector((state) => state.boards);

  const selectedBoard = useAppSelector(getSelectedBoard);
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
          Object.values(boards?.entities || {}).find(
            (board) => board?.id !== selectedBoard.id
          ) || null,
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
      paragraph={
        <>
          Are you sure you want to delete the '{selectedBoard?.name}' board?
          This action will remove all columns and tasks and cannot be reversed.
        </>
      }
    />
  );
}
