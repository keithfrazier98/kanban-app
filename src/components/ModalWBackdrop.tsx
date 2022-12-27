import { Transition } from "@headlessui/react";
import OutsideClickHandler from "react-outside-click-handler";
import { classNames } from "src/utils/utils";

export function ModalWBackdrop({
  render,
  children,
  onOutsideClick,
  testid,
}: {
  render: boolean;
  children: JSX.Element | JSX.Element[];
  onOutsideClick: () => void;
  testid?: string;
}) {
  return (
    <Transition
      show={render}
      enter="transition-opacity duration-75"
      enterFrom="opacity-0"
      enterTo="opacity-100"
      leave="transition-opacity duration-150"
      leaveFrom="opacity-100"
      leaveTo="opacity-0"
      data-testid={testid}
    >
      <div
        className={classNames(
          "absolute z-10 top-0 left-0 right-0 bottom-0",
          "bg-black bg-opacity-40 max-w-full flex items-center",
          "justify-center px-4 py-12"
        )}
      >
        <section
          className={classNames(
            "px-4 py-6 bg-white dark:bg-primary-gray-600",
            "rounded-md sm:max-w-[26rem] min-w-full sm:min-w-[26rem] max-h-full",
            "overflow-y-scroll no-scrollbar"
          )}
        >
          <OutsideClickHandler onOutsideClick={onOutsideClick}>
            {children}
          </OutsideClickHandler>
        </section>
      </div>{" "}
    </Transition>
  );
}
