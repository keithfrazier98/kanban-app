import { useAppDispatch, useAppSelector } from "../app/hooks";
import {
  useDeleteBoardMutation,
  useGetBoardsQuery,
} from "../features/boards/boardsEndpoints";
import {
  boardSelected,
  deleteBoardModalOpened,
  getSelectedBoard,
} from "../features/boards/boardsSlice";
import { ModalWBackdrop } from "./ModalWBackdrop";

export default function ConfirmDelete({
  title,
  paragraph,
  onDelete,
  onCancel,
}: {
  title: string;
  paragraph: string | JSX.Element;
  onDelete: () => void;
  onCancel: () => void;
}) {
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
        {title}
      </span>
      <p className="ml-2 text-primary-gray-400 text-xs leading-6 font-medium  py-4">
        {paragraph}
      </p>
      <div className="flex font-medium text-xs mb-4 mt-1">
        <button
          onClick={onDelete}
          className="flex-1 py-2 rounded-full mx-2 text-white bg-primary-red-active hover:bg-primary-red-inactive"
        >
          Delete
        </button>{" "}
        <button
          onClick={onCancel}
          className="flex-1 py-2 rounded-full mx-2 text-white hover:text-primary-indigo-active bg-primary-indigo-active hover:bg-primary-indigo-inactive"
        >
          Cancel
        </button>
      </div>
    </ModalWBackdrop>
  );
}
