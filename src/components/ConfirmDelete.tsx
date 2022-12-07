import { ModalWBackdrop } from "./ModalWBackdrop";

export default function ConfirmDelete({
  title,
  paragraph,
  onDelete,
  onCancel,
  render,
  testid,
}: {
  title: string;
  paragraph: string | JSX.Element;
  onDelete: () => void;
  onCancel: () => void;
  render: boolean;
  testid?: string;
}) {
  return (
    <ModalWBackdrop render={render} onOutsideClick={onCancel} testid={testid}>
      <span className="ml-2 text-primary-red-active text-sm font-semibold">
        {title}
      </span>
      <p className="ml-2 text-primary-gray-400 text-xs leading-6 font-medium  py-4">
        {paragraph}
      </p>
      <div className="flex font-medium text-xs mb-4 mt-1">
        <button
          data-testid="confirm_delete_button"
          onClick={onDelete}
          className="flex-1 py-2 rounded-full mx-2 text-white bg-primary-red-active hover:bg-primary-red-inactive"
        >
          Delete
        </button>{" "}
        <button
          data-testid="cancel_delete_button"
          onClick={onCancel}
          className="flex-1 py-2 rounded-full mx-2 text-white hover:text-primary-indigo-active bg-primary-indigo-active hover:bg-primary-indigo-inactive"
        >
          Cancel
        </button>
      </div>
    </ModalWBackdrop>
  );
}
