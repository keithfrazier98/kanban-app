import { useState } from "react";
import OutsideClickHandler from "react-outside-click-handler";

export function ModalWBackdrop({
  children,
  onOutsideClick,
}: {
  children: JSX.Element | JSX.Element[];
  onOutsideClick: () => void;
}) {
  return (
    <div className="absolute z-10 top-0 left-0 right-0 bottom-0 bg-black bg-opacity-40 max-w-full flex items-center justify-center px-4 py-12">
      <section className="px-4 py-6 bg-white dark:bg-primary-gray-600 rounded-md sm:max-w-[26rem] min-w-full sm:min-w-[26rem] max-h-full">
        <OutsideClickHandler onOutsideClick={onOutsideClick}>
          {children}
        </OutsideClickHandler>
      </section>
    </div>
  );
}
