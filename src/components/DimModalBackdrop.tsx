import { PropsWithChildren } from "react";

export function DimModalBackdrop({
  children,
}: {
  children: JSX.Element | JSX.Element[];
}) {
  return (
    <div className="absolute z-10 top-0 left-0 right-0 -bottom-24 bg-black bg-opacity-40 flex items-center justify-center px-4">
      {children}
    </div>
  );
}
