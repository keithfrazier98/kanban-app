import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { ModalWBackdrop } from "../../components/ModalWBackdrop";
import { useDeleteBoardMutation, useGetBoardsQuery } from "./boardsEndpoints";
import {
  boardSelected,
  deleteBoardModalOpened,
  getSelectedBoard,
} from "./boardsSlice";

export default function DeleteBoard() {
  const selectedBoard = useAppSelector(getSelectedBoard);
  const { data: boards } = useGetBoardsQuery(undefined);
  const dispatch = useAppDispatch();
  const [deleteBoard] = useDeleteBoardMutation();

  const closeModal = () => {
    dispatch(deleteBoardModalOpened({ open: false }));
  };

  return (
    <ModalWBackdrop onOutsideClick={closeModal}>
      <span className="ml-2 text-primary-red-active text-sm font-semibold">
        {" "}
        Delete this board?{" "}
      </span>
      <p className="ml-2 text-primary-gray-400 text-xs leading-6 font-medium  py-4">
        Are you sure you want to delete the '{selectedBoard?.name}' board? This
        action will remove all columns and tasks and cannot be reversed.
      </p>
      <div className="flex font-medium text-xs mb-4 mt-1">
        <button
          onClick={() => {
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
          }}
          className="flex-1 py-2 rounded-full mx-2 text-white bg-primary-red-active hover:bg-primary-red-inactive"
        >
          Delete
        </button>{" "}
        <button
          onClick={closeModal}
          className="flex-1 py-2 rounded-full mx-2 text-white hover:text-primary-indigo-active bg-primary-indigo-active hover:bg-primary-indigo-inactive"
        >
          Cancel
        </button>
      </div>
    </ModalWBackdrop>
  );
}
