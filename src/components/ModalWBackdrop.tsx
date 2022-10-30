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
    <div className="absolute z-10 top-0 left-0 right-0 -bottom-24 bg-black bg-opacity-40 flex items-center justify-center px-4">
      <section className="px-4 py-6 bg-white dark:bg-primary-gray-700 rounded-md max-w-sm min-w-[22rem]">
        <OutsideClickHandler onOutsideClick={onOutsideClick}>
          {children}
        </OutsideClickHandler>
      </section>
    </div>
  );
}
